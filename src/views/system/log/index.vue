<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name"
                placeholder="角色名称"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter" />
      <el-date-picker v-model="listQuery.visitDate"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="访问时间"
                      class="filter-item">
      </el-date-picker>
      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter">搜索
      </el-button>
    </div>

    <el-table :key="tableKey"
              v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row>
      <el-table-column label="访问人"
                       align="left">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="访问地址"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访问IP地址"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.clientIp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访问源平台"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.os }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访问浏览器"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.browser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访问时间"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtModifiedDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       prop="operation"
                       width="220"
                       align="center"
                       fixed="right">
        <template slot-scope="scope">
          <el-button size="small"
                     type="primary"
                     icon="el-icon-view"
                     @click="handleView(scope.row)">查看请求参数
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>listQuery.pageSize"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getLogList" />
    <i-form ref="dataForm"
            :json-value="jsonValue" />
  </div>
</template>

<script>
import { fetchLogList } from '@/api/log'
import waves from '@/directive/waves'
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'
export default {
  components: { Pagination, IForm },
  directives: { waves, permission },
  filters: {
    statusFilter (status) {
      const statusMap = {
        false: 'success',
        true: 'danger'
      }
      return statusMap[status]
    }
  },
  data () {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      // 刷新缓存loading
      refreshLoading: false,
      listQuery: {
        page: 1,
        pageSize: 10,
        name: undefined,
        visitDate: undefined
      },
      jsonValue: ''
    }
  },
  created () {
    this.getLogList()
  },
  methods: {
    getLogList () {
      this.listLoading = true
      fetchLogList(this.listQuery).then(response => {
        setTimeout(() => {
          this.list = response.data
          this.total = response.total
          this.listLoading = false
        }, 3 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      if (this.listQuery.visitDate === undefined ||
        this.listQuery.visitDate === '' ||
        this.listQuery.visitDate === null) {
        this.$message.error('搜索访问时间不能为空')
        return
      }
      this.getLogList()
    },
    handleView (row) {
      const _this = this.$refs['dataForm']
      this.jsonValue = row.params
      _this.dialogFormVisible = true
    }
  }
}
</script>
