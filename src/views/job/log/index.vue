<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.jobGroup"
                 placeholder="执行器"
                 class="filter-item"
                 @change="changeJobGroup">
        <el-option v-for="jobGroup in jobGroupOptions"
                   :key="jobGroup.id"
                   :label="jobGroup.appname"
                   :value="jobGroup.id" />
      </el-select>
      <el-select v-model="listQuery.jobId"
                 placeholder="任务"
                 class="filter-item">
        <el-option v-for="job in jobOptions"
                   :key="job.id"
                   :label="job.jobDesc"
                   :value="job.id" />
      </el-select>
      <el-select v-model="listQuery.logStatus"
                 placeholder="状态"
                 clearable
                 class="filter-item">
        <el-option v-for="status in statusOptions"
                   :key="status.value"
                   :label="status.name"
                   :value="status.value" />
      </el-select>
      <el-date-picker v-model="listQuery.filterTime"
                      :default-time="['00:00:00', '23:59:59']"
                      type="datetimerange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      class="filter-item">
      </el-date-picker>
      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves
                 class="filter-item"
                 type="danger"
                 icon="el-icon-delete"
                 @click="handleClear">
        清理
      </el-button>
    </div>
    <el-table v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row>

      <el-table-column label="任务ID"
                       align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调度时间"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.triggerTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调度结果"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.triggerCode | triggerCodeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调度备注"
                       class-name="status-col"
                       align="center">
        <template slot-scope="scope">
          <el-tooltip class="item"
                      effect="dark"
                      placement="top-start">
            <div slot="content"
                 v-phtml="scope.row.triggerMsg">
            </div>
            <el-button type="text">查看</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="执行时间"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.handleTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行结果"
                       align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.handleCode"
                  :type="scope.row.handleCode | handleCodeTagFilter">
            {{ scope.row.handleCode | handleCodeFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="执行备注"
                       align="center">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.handleMsg"
                      effect="dark"
                      placement="top-start">
            <div slot="content"
                 v-phtml="scope.row.handleMsg">
            </div>
            <el-button type="text">查看</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>listQuery.pageSize"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getLogList" />
    <i-form ref="dataForm" />
  </div>
</template>

<script>
import { postJoblogPageList, postJobgroupFindAll, getJobsByGroup } from '@/api/job'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import phtml from '@/directive/html'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'

export default {
  name: 'JobLog',
  components: { Pagination, IForm },
  directives: { waves, permission, phtml },
  filters: {
    statusFilter (status) {
      const statusMap = {
        false: 'success',
        true: 'danger'
      }
      return statusMap[status]
    },
    triggerCodeFilter (triggerCode) {
      const triggerCodeMap = {
        200: '成功',
        500: '失败'
      }
      return triggerCodeMap[triggerCode]
    },
    handleCodeFilter (handleCode) {
      const handleCodeMap = {
        200: '成功',
        500: '失败',
        502: '失败(超时)'
      }
      return handleCodeMap[handleCode]
    },
    handleCodeTagFilter (handleCode) {
      const handleCodeMap = {
        200: 'success',
        500: 'danger',
        502: 'danger'
      }
      return handleCodeMap[handleCode]
    }

  },
  data () {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        jobGroup: 0,
        jobId: 0,
        logStatus: -1,
        filterTime: undefined
      },
      jobGroupOptions: [{ id: 0, appname: '全部' }],
      jobOptions: [{ id: 0, jobDesc: '全部' }],
      statusOptions: [
        { value: -1, name: '全部' },
        { value: 1, name: '成功' },
        { value: 2, name: '失败' },
        { value: 3, name: '进行中' }
      ]
    }
  },
  created () {
    // 是否是手动跳转
    const params = this.$route.query
    if (params.jobGroup) {
      this.listQuery = {
        page: 1,
        pageSize: 10,
        jobGroup: params.jobGroup,
        jobId: params.jobId,
        logStatus: -1,
        // 当天开始时间-当天结束时间
        filterTime: [new Date(new Date(new Date().toLocaleDateString()).getTime()), new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)]
      }
      // 跳转页面初始化任务
      this.changeJobGroup(params.jobGroup)
    }
    // 初始化加载数据
    this.getLogList()
    this.$nextTick(() => {
      postJobgroupFindAll().then(response => {
        response.data.forEach(element => {
          this.jobGroupOptions.push({ id: element.id, appname: element.appname })

        })
      })
    })
  },
  methods: {
    // 列表
    getLogList () {
      this.listLoading = true
      postJoblogPageList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        setTimeout(() => {
          this.listLoading = false
        }, 3 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 执行器切换
    changeJobGroup (val) {
      // 切换后清空
      this.jobOptions = [{ id: 0, jobDesc: '全部' }]
      getJobsByGroup({ jobGroup: val }).then(response => {
        response.data.forEach(element => {
          this.jobOptions.push({ id: element.id, jobDesc: element.jobDesc })
        })
      })
    },
    // 查询列表
    handleFilter () {
      this.listQuery.page = 1
      this.getLogList()
    },
    // 清理日志弹框
    handleClear (row) {
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      _this.dialogFormVisible = true
    }
  }
}
</script>
