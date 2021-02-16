<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.phone"
                clearable
                placeholder="手机号码"
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
      <el-button :loading="downloadLoading"
                 class="filter-item"
                 style="margin-left: 10px;"
                 type="success"
                 icon="el-icon-document"
                 @click="handleTransfer">
        调岗
      </el-button>
      <el-button :loading="downloadLoading"
                 class="filter-item"
                 style="margin-left: 10px;"
                 type="warning"
                 icon="el-icon-download"
                 @click="handleExport">
        导出
      </el-button>
    </div>
    <el-table v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row
              @row-click="tableSelectRows"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55">
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-avatar :size="60"
                     src="https://empty"
                     @error="errorHandler">
            <img :src="scope.row.avatar" />
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="手机号码"
                       width="200"
                       align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="拥有角色"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ getRoles(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | statusFilter">
            {{ scope.row.state ? '禁用' : '启用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Online状态"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.online | statusFilter">
            {{ scope.row.online ? '下线' : '在线' }}
          </el-tag>
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
          <el-button v-if="scope.row.state"
                     type="success"
                     size="small"
                     icon="el-icon-circle-check"
                     @click="handleStatus(scope.row, false)">
            启用
          </el-button>
          <el-button v-else
                     type="danger"
                     size="small"
                     icon="el-icon-circle-close"
                     @click="handleStatus(scope.row, true)">
            禁用
          </el-button>
          <el-button v-if="!scope.row.online && scope.row.phone !== phone"
                     type="warning"
                     size="small"
                     icon="el-icon-circle-check"
                     @click="handleOffline(scope.row.id)">
            强踢
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>listQuery.pageSize"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getUserList" />
    <i-form ref="dataForm"
            :form-data="formData" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { postUserList, putModify, postUserOffline } from '@/api/sysuser'
import { commonDownload } from '@/utils/download'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'

export default {
  name: 'UserManage',
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
      list: null,
      downloadLoading: false,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        phone: undefined
      },
      tableSelectData: {},
      multipleSelection: [],
      formData: {
        avatar: undefined,
        deleteStatus: false,
        id: undefined,
        password: undefined,
        phone: undefined,
        roleIds: [],
        sysName: undefined,
        username: undefined
      }
    }
  },
  computed: {
    ...mapGetters([
      'phone'
    ])
  },
  // 初始化
  created () {
    this.getUserList()
  },
  methods: {
    // 选中某一行
    tableSelectRows (row, event, column) {
      this.tableSelectData = row
    },
    // 多选中行
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    errorHandler () {
      return true
    },
    // 列表
    getUserList () {
      this.listLoading = true
      postUserList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.list.forEach(k => {
          this.roleIds = JSON.parse(k.roleIds)
        })
        setTimeout(() => {
          this.listLoading = false
        }, 3 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 拥有的角色
    getRoles (row) {
      let content = ''
      if (row.roles !== null) {
        for (let i = 0; i < row.roles.length; i++) {
          content += row.roles[i].name + '|'
        }
      }
      return content
    },
    // 查询列表
    handleFilter () {
      this.listQuery.page = 1
      this.getUserList()
    },
    // 创建
    handleCreate () {
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.passwordVisiable = true
      _this.dialogFormVisible = true
      this.formData = {}
    },
    // 调岗
    handleTransfer () {
      if (this.multipleSelection.length > 0) {

        if (this.multipleSelection.length > 1) {
          this.$message.error('只能选择一条记录')
          return
        }
        this.$message.warning('暂未实现')
      } else {
        this.$message.error('请至少选择一条记录')
      }
    },
    // 编辑弹框
    handleModify (row) {
      this.formData = Object.assign({}, row)
      if (row.roles) {
        this.formData.roleIds = row.roles.map(item => item.id)
      }
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.passwordVisiable = false
      _this.dialogFormVisible = true
    },
    // 更新状态
    handleStatus (row, state) {
      putModify({ id: row.id, state: state }).then(() => {
        this.$message({
          message: '更新成功',
          type: 'success'
        })
        this.getUserList()
      })
    },
    // 导出
    handleExport () {
      if (this.multipleSelection.length > 0) {
        const param = {
          fileName: '用户信息.xlsx',
          ids: this.multipleSelection.map(item => item.id),
          type: 'excel'
        }
        this.downloadLoading = true
        commonDownload('/admin/system/user/download', param)
        this.downloadLoading = false
      } else {
        this.$message.error('请至少选择一条记录')
      }
    },
    // 强踢下线
    handleOffline (id) {
      postUserOffline(id).then(() => {
        this.$message({
          message: '下线成功',
          type: 'success'
        })
        this.getUserList()
      })
    }
  }
}
</script>
