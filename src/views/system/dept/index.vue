<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name"
                clearable
                placeholder="部门名称"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter" />
      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter">搜索
      </el-button>
      <el-button v-waves
                 class="filter-item"
                 style="margin-left: 10px;"
                 type="primary"
                 icon="el-icon-edit"
                 @click="handleCreate">创建
      </el-button>
      <el-button v-waves
                 class="filter-item"
                 style="margin-left: 10px;"
                 type="warning"
                 icon="el-icon-view"
                 @click="handleOrg">部门视图
      </el-button>
    </div>
    <el-table v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row
              style="width: 100%">
      <el-table-column label="部门名称"
                       prop="name"
                       align="left">
        <template slot-scope="scope">
          <el-tag> {{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="上级部门"
                       prop="parentName"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.parentName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门经理"
                       prop="manager"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.managerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间"
                       width="220"
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
                       prop="operation"
                       width="220"
                       align="center"
                       fixed="right">
        <template slot-scope="scope">
          <el-button size="small"
                     type="primary"
                     icon="el-icon-edit"
                     @click="handleModify(scope.row)">编辑
          </el-button>
          <el-button size="small"
                     type="danger"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>listQuery.pageSize"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getDeptList" />
    <org ref="dataOrg" />
    <i-form ref="dataForm"
            :form-data="formData" />
  </div>
</template>

<script>
import { postDeptPage, deleteDept } from '@/api/dept'
import IForm from './form'
import Org from './org'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination


export default {
  directives: { waves },
  components: { Pagination, IForm, Org },
  data () {
    return {
      list: [],
      total: 0,
      listLoading: false,
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
    this.getDeptList()
  },
  methods: {
    // 检索
    handleFilter () {
      this.listQuery.page = 1
      this.getDeptList()
    },
    // 部门列表
    getDeptList () {
      this.listLoading = true
      postDeptPage(this.listQuery).then(response => {
        setTimeout(() => {
          this.list = response.data
          this.total = response.total
          this.listLoading = false
        }, 3 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 创建
    handleCreate () {
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
      this.formData = {}
    },
    // 部门视图
    handleOrg () {
      const _this = this.$refs['dataOrg']
      _this.dialogFormVisible = true
    },
    // 编辑
    handleModify (row) {
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
    },
    // 删除
    handleDelete (row) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDept({ id: row.id }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getDeptList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
