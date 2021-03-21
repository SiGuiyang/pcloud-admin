<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name"
                placeholder="资源名称"
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
    </div>

    <el-table v-loading="listLoading"
              :data="list"
              lazy
              stripe
              fit
              highlight-current-row>
      <el-table-column label="资源名称"
                       align="left">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="访问资源"
                       align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.resourceUrl }}</el-tag>
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
                       width="220"
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
                     @click="handleDelete(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>listQuery.pageSize"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="postResource" />
    <i-form ref="dataForm"
            :form-data="formData" />
  </div>
</template>

<script>
import { postOpenResourcePage, deleteOpenResource } from '@/api/open'
import waves from '@/directive/waves'
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'

export default {
  components: { Pagination, IForm },
  directives: { waves, permission },
  filters: {
    bizTypeFilter (status) {
      const statusMap = {
        0: 'success',
        1: 'danger'
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
        parentId: 0, // 默认查询父级
        name: undefined
      },
      showReviewer: false,
      formData: {
        id: undefined,
        name: undefined
      }
    }
  },
  created () {
    this.postResource()
  },
  methods: {
    // 分页列表
    postResource () {
      this.listLoading = true
      postOpenResourcePage(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 检索
    handleFilter () {
      this.listQuery.page = 1
      this.postResource()
    },
    // 创建
    handleCreate () {
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
      _this.roleCodeDisabled = false
      this.formData = {}
    },
    // 更新
    handleUpdate (row) {
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
      _this.roleCodeDisabled = true
    },
    // 删除
    handleDelete (id) {
      deleteOpenResource({ id: id }).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.postResource()
      })
    }
  }
}
</script>
