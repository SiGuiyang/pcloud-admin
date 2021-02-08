<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name"
                clearable
                placeholder="角色名称"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter" />
      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter">搜索
      </el-button>
      <el-button class="filter-item"
                 style="margin-left: 10px;"
                 type="primary"
                 icon="el-icon-edit"
                 @click="handleCreate">新增
      </el-button>
      <el-button :loading="refreshLoading"
                 class="filter-item"
                 style="margin-left: 10px;"
                 type="warning"
                 icon="el-icon-refresh"
                 @click="handleRefresh">
        刷新
      </el-button>
    </div>

    <el-table :key="tableKey"
              v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row>
      <el-table-column label="角色名称"
                       align="left">
        <template slot-scope="scope">
          <span class="link-type"
                @click="handleUpdate(scope.row)">{{ scope.row.title }}</span>
          <el-tag>{{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="角色编码"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtModifiedDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtModifiedName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       class-name="small-padding fixed-width"
                       fixed="right"
                       width="260"
                       align="center">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="small"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button type="danger"
                     size="small"
                     icon="el-icon-delete"
                     :disabled="scope.row.roleCode === 'ROLE_SUPER_ADMIN'"
                     @click="handleDelete(scope.row.id)">删除
          </el-button>
          <el-button :disabled="scope.row.roleCode === 'ROLE_SUPER_ADMIN' || scope.row.roleCode === 'ROLE_ADMIN'"
                     type="warning"
                     size="small"
                     icon="el-icon-view"
                     @click="handleGrant(scope.row)">授权
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>listQuery.pageSize"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getRoleList" />
    <i-form ref="dataForm"
            :form-data="formData" />

    <i-permission ref="permissionForm" />
  </div>
</template>

<script>
import { fetchRoleList, getRoleRefresh, deleteRole } from '@/api/role'
import waves from '@/directive/waves'
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'
import IPermission from './permission'

export default {
  components: { Pagination, IForm, IPermission },
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
        roleName: undefined
      },
      showReviewer: false,
      formData: {
        id: undefined,
        roleName: undefined,
        deleteStatus: false
      },
      permissions: [], // 系统所有权限
      hadPermission: []
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    getRoleList () {
      this.listLoading = true
      fetchRoleList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getRoleList()
    },
    handleCreate () {
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
      _this.roleCodeDisabled = false
      this.formData = {}
    },
    // 刷新缓存
    handleRefresh () {
      this.refreshLoading = true
      getRoleRefresh().then(() => {
        setTimeout(() => {
          this.refreshLoading = false
          this.$message({
            message: '刷新缓存成功',
            type: 'success'
          })
        }, 1.5 * 1000)
      }).catch(() => {
        this.refreshLoading = false
      })
    },
    handleUpdate (row) {
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
      _this.roleCodeDisabled = true
    },
    handleDelete (id) {
      deleteRole({ id: id }).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getRoleList()
      })
    },
    handleGrant (row) {
      const _this = this.$refs['permissionForm']
      _this.dialogFormVisible = true
      _this.selectedRoleId = row.id
    }

  }
}
</script>
