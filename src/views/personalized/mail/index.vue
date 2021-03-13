<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name"
                clearable
                placeholder="名称"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.phone"
                clearable
                placeholder="收信人账号"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.state"
                 clearable
                 placeholder="状态"
                 style="width: 200px;"
                 class="filter-item">
        <el-option :value="false"
                   label="未读" />
        <el-option :value="true"
                   label="已读" />
      </el-select>
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
      <el-table-column label="头像"
                       align="left">
        <template slot-scope="scope">
          <el-avatar :size="60"
                     src="https://empty"
                     @error="errorHandler">
            <img :src="scope.row.avatar" />
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="收信人"
                       align="center">
        <template slot-scope="scope">
          <el-tag> {{ scope.row.username }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="名称"
                       align="center">
        <template slot-scope="scope">
          <el-tag> {{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态"
                       align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | stateTagFilter">{{ scope.row.state | stateFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="内容"
                       align="center">
        <template slot-scope="scope">
          <span> {{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="220"
                       align="center"
                       fixed="right">
        <template slot-scope="scope">
          <el-button type="danger"
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
                @pagination="getMailList" />
    <i-form ref="dataForm"
            :form-data="formData" />
  </div>
</template>

<script>
import { postMail, deleteMail } from '@/api/mail'

import IForm from './form'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive
export default {
  directives: { waves },
  components: { Pagination, IForm },
  filters: {
    stateFilter (state) {
      const stateMap = {
        false: '未读',
        true: '已读'
      }
      return stateMap[state]
    },
    stateTagFilter (state) {
      const stateMap = {
        false: 'danger',
        true: 'success'
      }
      return stateMap[state]
    }
  },
  data () {
    return {
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        pageSize: 10,
        name: undefined,
        phone: undefined,
        state: undefined
      },
      formData: {}
    }
  },
  created () {
    this.getMailList()
  },
  methods: {
    handleFilter () {
      this.listQuery.page = 1
      this.getMailList()
    },
    getMailList () {
      this.listLoading = true
      postMail(this.listQuery).then(response => {
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
        deleteMail({ id: row.id }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getMailList()
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
