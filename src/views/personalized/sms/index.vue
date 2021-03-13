<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name"
                clearable
                placeholder="短信名称"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.code"
                clearable
                placeholder="短信编码"
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
    </div>
    <el-table v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row
              style="width: 100%">
      <el-table-column label="短信名称"
                       prop="name"
                       align="left">
        <template slot-scope="scope">
          <el-tag> {{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="短信编码"
                       prop="code"
                       align="center">
        <template slot-scope="scope">
          <el-tag> {{ scope.row.code }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="短信内容"
                       prop="description"
                       align="center">
        <template slot-scope="scope">
          <el-tag> {{ scope.row.description }}</el-tag>
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
                @pagination="getSmsList" />
    <i-form ref="dataForm"
            :form-data="formData" />
  </div>
</template>

<script>
import { postSmsPage, deleteSms } from '@/api/sms'
import IForm from './form'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive
export default {
  directives: { waves },
  components: { Pagination, IForm },
  data () {
    return {
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        pageSize: 10,
        name: undefined,
        code: undefined
      },
      formData: {}
    }
  },
  created () {
    this.getSmsList()
  },
  methods: {
    handleFilter () {
      this.listQuery.page = 1
      this.getSmsList()
    },
    getSmsList () {
      this.listLoading = true
      postSmsPage(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCreate () {
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
      this.formData = {}
    },
    handleModify (row) {
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
    },
    handleDelete (row) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSms({ id: row.id }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getSmsList()
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
