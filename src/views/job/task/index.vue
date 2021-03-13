<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.jobGroup"
                 placeholder="执行器"
                 class="filter-item">
        <el-option v-for="jobGroup in jobGroupOptions"
                   :key="jobGroup.id"
                   :label="jobGroup.appname"
                   :value="jobGroup.id" />
      </el-select>
      <el-select v-model="listQuery.triggerStatus"
                 placeholder="状态"
                 clearable
                 class="filter-item">
        <el-option v-for="status in triggerStatusOptions"
                   :key="status.value"
                   :label="status.name"
                   :value="status.value" />
      </el-select>
      <el-input v-model="listQuery.name"
                clearable
                placeholder="请输入任务描述"
                style="width: 200px;"
                class="filter-item" />
      <el-input v-model="listQuery.jobDesc"
                clearable
                placeholder="请输入JobHandler"
                style="width: 200px;"
                class="filter-item" />
      <el-input v-model="listQuery.author"
                clearable
                placeholder="请输入负责人"
                style="width: 200px;"
                class="filter-item" />

      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item"
                 style="margin-left: 10px;"
                 type="primary"
                 icon="el-icon-edit"
                 @click="handleCreate">
        新增
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
      <el-table-column label="任务描述"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.jobDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运行模式"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.glueType }}:{{ scope.row.executorHandler }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Cron表达式"
                       align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.jobCron }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="负责人"
                       class-name="status-col"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态"
                       class-name="status-col"
                       align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.triggerStatus === 1 ? 'success': 'danger'">
            <span>{{ scope.row.triggerStatus | triggerStatusFilter }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="180"
                       fixed="right"
                       class-name="small-padding fixed-width"
                       align="center">
        <template slot-scope="scope">
          <el-dropdown split-button
                       type="primary"
                       @command="handleClick">
            操作
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{command: 'once', row: scope.row}">执行一次</el-dropdown-item>
              <el-dropdown-item :command="{command: 'log', row: scope.row}">查看日志</el-dropdown-item>
              <el-dropdown-item :command="{command: 'register', row: scope.row}">注册节点</el-dropdown-item>
              <el-dropdown-item :command="{command: 'next', row: scope.row}">下次执行时间</el-dropdown-item>
              <template v-if="scope.row.triggerStatus === 0">
                <el-dropdown-item :command="{command: 'start', row: scope.row}"
                                  divided>启动</el-dropdown-item>
              </template>
              <template v-else>
                <el-dropdown-item :command="{command: 'stop', row: scope.row}"
                                  divided>停止</el-dropdown-item>
              </template>
              <el-dropdown-item :command="{command: 'edit', row: scope.row}">编辑</el-dropdown-item>
              <el-dropdown-item :command="{command: 'delete', row: scope.row}">删除</el-dropdown-item>
              <el-dropdown-item :command="{command: 'copy', row: scope.row}">复制</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>listQuery.pageSize"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getTaskList" />
    <i-form ref="dataForm"
            :form-data="formData" />
    <register-node-form ref="registerNodeForm" />
    <once-form ref="onceForm"
               :form-data="onceFormData" />
    <next-trigger-time-form ref="nextTriggerTimeForm" />
  </div>
</template>

<script>
import { postJobList, postJobgroupLoadById, postJobgroupFindAll, postjobinfoNextTriggerTime, postJobStart, postJobStop, postJobRemove } from '@/api/job'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'
import onceForm from './onceForm'
import registerNodeForm from './registerNodeForm'
import nextTriggerTimeForm from './nextTriggerTimeForm'

export default {
  name: 'Task',
  components: { Pagination, IForm, onceForm, registerNodeForm, nextTriggerTimeForm },
  directives: { waves, permission },
  filters: {
    triggerStatusFilter (status) {
      const statusMap = {
        0: 'stop',
        1: 'running'
      }
      return statusMap[status]
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
        triggerStatus: -1,
        author: undefined
      },
      // 执行器
      jobGroupOptions: [{ id: 0, appname: '全部' }],
      // 运行状态
      triggerStatusOptions: [
        { name: '全部', value: -1 },
        { name: '启动', value: 1 },
        { name: '停止', value: 0 }
      ],
      statusOptions: ['published', 'draft', 'deleted'],
      formData: {},
      onceFormData: {}
    }
  },
  created () {
    this.getTaskList()
    this.$nextTick(() => {
      postJobgroupFindAll().then(response => {
        response.data.forEach(element => {
          this.jobGroupOptions.push({ id: element.id, appname: element.appname })
        })
      })
    })
  },
  methods: {
    getTaskList () {
      this.listLoading = true
      postJobList(this.listQuery).then(response => {
        setTimeout(() => {
          this.list = response.data
          this.total = response.total
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 查询列表
    handleFilter () {
      this.listQuery.page = 1
      this.getTaskList()
    },
    // 创建
    handleCreate () {
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
      this.formData = {}
    },
    // 菜单
    handleClick (data) {
      const command = data.command
      const row = data.row
      switch (command) {
        // 运行一次
        case 'once':
          this.onceFormData = Object.assign({}, row) // copy obj
          this.$refs['onceForm'].dialogFormVisible = true
          break
        // 查看日志
        case 'log':
          this.$router.push({
            path: '/job/log',
            query: {
              jobGroup: row.jobGroup,
              jobId: row.id
            }
          })
          break
        // 注册节点
        case 'register':
          postJobgroupLoadById({ id: row.id }).then(response => {
            const _this = this.$refs['registerNodeForm']
            _this.dialogFormVisible = true
            _this.list = response.content.registryList
          })
          break
        // 下次执行时间
        case 'next':
          postjobinfoNextTriggerTime({ cron: row.jobCron }).then(response => {
            const _this = this.$refs['nextTriggerTimeForm']
            _this.dialogFormVisible = true
            _this.list = response.content
          })
          break
        // 启动
        case 'start':
          this.$confirm('确认启动？', '系统提示', {
            type: 'warning',
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            postJobStart({ id: row.id }).then(() => {
              this.$message.success('启动成功')
              this.getTaskList()
            })
          }).catch(action => {
            this.$message.success('取消启动')
          })
          break
        // 停止
        case 'stop':
          this.$confirm('确认停止？', '系统提示', {
            type: 'warning',
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            postJobStop({ id: row.id }).then(() => {
              this.$message.success('停止成功')
              this.getTaskList()
            })
          }).catch(action => {
            this.$message.success('取消停止')
          })
          break
        // 编辑
        case 'edit':
          this.formData = Object.assign({}, row) // copy obj
          this.$refs['dataForm'].dialogStatus = 'update'
          this.$refs['dataForm'].dialogFormVisible = true
          break
        // 删除
        case 'delete':
          this.$confirm('确认删除？', '系统提示', {
            type: 'warning',
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            postJobRemove({ id: row.id }).then(() => {
              this.$message.success('删除成功')
              this.getTaskList()
            })
          }).catch(action => {
            this.$message.success('取消删除')
          })
          break
        // 复制
        case 'copy':
          this.formData = Object.assign({}, row)
          this.formData.id = undefined
          this.$refs['dataForm'].dialogStatus = 'create'
          this.$refs['dataForm'].dialogFormVisible = true
          break
      }
    },
    // 编辑弹框
    handleModify (row) {

    }
  }
}
</script>
