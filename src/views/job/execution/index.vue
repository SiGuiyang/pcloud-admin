<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.appname"
                clearable
                placeholder="AppName"
                style="width: 200px;"
                class="filter-item" />
      <el-input v-model="listQuery.title"
                clearable
                placeholder="名称"
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
      <el-table-column label="appName"
                       align="left">
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.appname }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="名称"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册方式	"
                       align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.addressType | addressTypeTagFilter">
            {{ scope.row.addressType | addressTypeFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="OnLine 机器地址	"
                       class-name="status-col"
                       align="center">
        <template slot-scope="scope">
          <el-popover placement="right"
                      width="400"
                      trigger="click">
            <el-table :data="scope.row.registryList">
              <el-table-column width="300"
                               property="address"
                               label="机器地址">
                <template slot-scope="scopes">
                  <span>{{ scopes.row }}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-button slot="reference"
                       type="text">查看 {{ getAddressLength(scope.row.registryList) }}</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="180"
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
          <el-button type="danger"
                     size="small"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>listQuery.pageSize"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getJobGroupList" />
    <i-form ref="dataForm"
            :form-data="formData" />
  </div>
</template>

<script>
import { postJobgroupPageList, postJobGroupDelete } from '@/api/job'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'

export default {
  name: 'JobGroup',
  components: { Pagination, IForm },
  directives: { waves, permission },
  filters: {
    statusFilter (status) {
      const statusMap = {
        false: 'success',
        true: 'danger'
      }
      return statusMap[status]
    },
    addressTypeFilter (addressType) {
      const addressTypeMap = {
        0: '自动注册',
        1: '手动录入'
      }
      return addressTypeMap[addressType]
    },
    addressTypeTagFilter (addressType) {
      const addressTypeMap = {
        0: 'success',
        1: 'warning'
      }
      return addressTypeMap[addressType]
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
        appname: undefined,
        title: undefined
      },
      tableSelectData: {},
      multipleSelection: [],
      statusOptions: ['published', 'draft', 'deleted'],
      formData: {}
    }
  },
  created () {
    this.getJobGroupList()
  },
  methods: {
    getJobGroupList () {
      this.listLoading = true
      postJobgroupPageList(this.listQuery).then(response => {
        setTimeout(() => {
          this.list = response.data
          this.total = response.total
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter () { // 查询列表
      this.listQuery.page = 1
      this.getJobGroupList()
    },
    getAddressLength (address) {
      if (address) {
        return '(' + address.length + ')'
      }
      return ''
    },
    handleCreate () { // 创建
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
      this.formData = {}
    },
    handleModify (row) { // 编辑弹框
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
    },
    handleDelete (id) {
      this.listLoading = true
      postJobGroupDelete({ id: id }).then(() => {
        this.listLoading = false
        this.getJobGroupList()
        this.$message.success('删除成功')
      }).catch(() => {
        this.listLoading = false
      })
    }
  }
}
</script>
