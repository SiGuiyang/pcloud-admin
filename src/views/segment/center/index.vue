<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.description"
                clearable
                placeholder="号段说明"
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
      <el-table-column label="号段"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.bizTag }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="号段说明"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="maxId"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.maxId }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="step"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.step }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作人"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间"
                       width="220"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="220"
                       fixed="right"
                       class-name="small-padding fixed-width"
                       align="center">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="small"
                     icon="el-icon-edit"
                     @click="handleModify(scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>listQuery.pageSize"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getSegmentList" />
    <i-form ref="dataForm"
            :form-data="formData" />
  </div>
</template>

<script>
import { postSegment } from '@/api/segment'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'

export default {
  name: 'UserManage',
  components: { Pagination, IForm },
  directives: { waves, permission },
  data () {
    return {
      list: null,
      total: 0,
      listLoading: true,
      loading: false,
      listQuery: {
        page: 1,
        pageSize: 10,
        description: undefined
      },
      formData: {}
    }
  },
  // 初始化
  created () {
    this.getSegmentList()
  },
  methods: {
    // 列表
    getSegmentList () {
      this.listLoading = true
      postSegment(this.listQuery).then(response => {
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
      this.getSegmentList()
    },
    // 创建
    handleCreate () {
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.passwordVisiable = true
      _this.dialogFormVisible = true
      this.formData = {}
    },
    // 编辑弹框
    handleModify (row) {
      this.formData = Object.assign({}, row)
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.passwordVisiable = false
      _this.dialogFormVisible = true
    }
  }
}
</script>
