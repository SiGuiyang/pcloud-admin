<template>
  <el-dialog title="应用权限"
             :visible.sync="dialogFormVisible"
             :close-on-click-modal="false"
             width="80%"
             center
             @open="handleOpen">
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
        <el-button v-waves
                   v-loading="confirmLoading"
                   class="filter-item"
                   type="success"
                   icon="el-icon-check"
                   @click="handleGrant">授权
        </el-button>
        <el-button v-waves
                   :loading="refreshLoading"
                   class="filter-item"
                   type="warning"
                   icon="el-icon-refresh"
                   @click="handleRefresh">刷新
        </el-button>
      </div>

      <el-table ref="multipleTable"
                v-loading="listLoading"
                :data="list"
                lazy
                stripe
                fit
                highlight-current-row
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
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
      </el-table>
      <pagination v-show="total>listQuery.pageSize"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.pageSize"
                  @pagination="postResource" />
    </div>
  </el-dialog>
</template>

<script>
import { postOpenPermission, postOpenGrant, getOpenRefresh } from '@/api/open'
import waves from '@/directive/waves'
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  components: { Pagination },
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
      dialogFormVisible: false,
      confirmLoading: false,
      // 刷新缓存loading
      refreshLoading: false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        accountId: undefined,
        name: undefined
      },
      multipleSelection: []
    }
  },
  methods: {
    handleOpen () {
      this.$nextTick(() => {
        this.postResource()
      })
    },
    // 选中
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 分页列表
    postResource () {
      this.listLoading = true
      postOpenPermission(this.listQuery).then(response => {
        this.list = response.data
        if (this.list) {
          this.list.forEach(row => {
            if (row.permission) {
              console.log(row.permission)
              console.log(row)
              this.$refs.multipleTable.toggleRowSelection(row)
            }
          })
        }
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
    // 角色授权
    handleGrant () {
      postOpenGrant({ accountId: this.listQuery.accountId, resourceIds: this.multipleSelection.map(item => item.id) }).then(() => {
        this.confirmLoading = false
        this.$message({
          message: '授权成功',
          type: 'success'
        })
        this.$parent.getAccountList()
      }).catch(() => {
        this.confirmLoading = false
      })
    },
    handleRefresh (data) {
      this.refreshLoading = true
      getOpenRefresh(this.listQuery).then(() => {
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
    }
  }
}
</script>
