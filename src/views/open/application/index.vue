<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name"
                clearable
                placeholder="应用名称"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter" />
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
      <el-table-column label="应用名称"
                       align="left">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态"
                       align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusTagFilter">{{ scope.row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="secureId"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.secureId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtModifiedName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间"
                       width="220"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtModifiedDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="300"
                       fixed="right"
                       class-name="small-padding fixed-width"
                       align="center">
        <template slot-scope="scope">
          <el-dropdown split-button
                       szie="small"
                       type="primary"
                       @command="handleClick">
            操作
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{command: 'VIEW', status: 1, id: scope.row.id}">查看私钥</el-dropdown-item>
              <el-dropdown-item :command="{command: 'GRANT', status: 1, id: scope.row.id}"
                                divided>应用授权</el-dropdown-item>
              <template v-if="scope.row.status === 0">
                <el-dropdown-item :command="{command: 'FORBIDDEN', status: 1, id: scope.row.id}"
                                  divided>禁用</el-dropdown-item>
                <el-dropdown-item :command="{command: 'FROZEN', status: 2, id: scope.row.id}">冻结</el-dropdown-item>
              </template>
              <template v-else-if="scope.row.status === 1">
                <el-dropdown-item :command="{command: 'NORMAL', status: 0, id: scope.row.id}"
                                  divided>正常</el-dropdown-item>
                <el-dropdown-item :command="{command: 'FROZEN', status: 2, id: scope.row.id}">冻结</el-dropdown-item>
              </template>
              <template v-else>
                <el-dropdown-item :command="{command: 'NORMAL', status: 0, id: scope.row.id}"
                                  divided>正常</el-dropdown-item>
                <el-dropdown-item :command="{command: 'FORBIDDEN', status: 1, id: scope.row.id}">禁用</el-dropdown-item>
              </template>
              <el-dropdown-item :command="{command: 'DELETE', status: 1, id: scope.row.id}"
                                divided>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>listQuery.pageSize"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getAccountList" />
    <i-form ref="dataForm"
            :form-data="formData" />

    <i-permission ref="permissionForm"
                  :form-data="formData" />
  </div>
</template>

<script>
import { postOpenPage, getAccountView, putAccountStatus, deleteAccount } from '@/api/open'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'
import IPermission from './permission'


export default {
  name: 'Application',
  components: { Pagination, IForm, IPermission },
  directives: { waves, permission },
  filters: {
    statusTagFilter (status) {
      const statusMap = {
        0: 'success',
        1: 'danger',
        2: 'warning'
      }
      return statusMap[status]
    },
    statusFilter (status) {
      const statusMap = {
        0: '正常',
        1: '禁用',
        2: '冻结'
      }
      return statusMap[status]
    }
  },
  data () {
    return {
      list: null,
      total: 0,
      listLoading: true,
      loading: false,
      listQuery: {
        page: 1,
        pageSize: 10,
        name: undefined
      },
      formData: {}
    }
  },
  // 初始化
  created () {
    this.getAccountList()
  },
  methods: {
    // 列表
    getAccountList () {
      this.listLoading = true
      postOpenPage(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 查询列表
    handleFilter () {
      this.listQuery.page = 1
      this.getAccountList()
    },
    handleClick (data) {

      const command = data.command
      switch (command) {
        // 查看密钥
        case 'VIEW':
          getAccountView({ id: data.id }).then(response => {
            this.$alert(response.data, '密钥', {
              confirmButtonText: '确定'
            })
          })
          break
        case 'GRANT':
          this.handleGrant(data)
          break
        // 删除
        case 'DELETE':
          deleteAccount({ id: data.id }).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getAccountList()
          })
          break
        default:
          putAccountStatus({ id: data.id, status: data.status }).then(() => {
            this.$message.success('状态更新成功')
            this.getAccountList()
          })
      }

    },

    handleGrant (data) {
      const _this = this.$refs['permissionForm']
      _this.dialogFormVisible = true
      _this.listQuery.accountId = data.id
    },
    // 创建
    handleCreate () {
      const _this = this.$refs['dataForm']
      _this.dialogFormVisible = true
      this.formData = {}
    }
  }
}
</script>
