<template>
  <el-dialog title="站内信"
             :visible.sync="dialogFormVisible"
             :close-on-click-modal="false"
             width="80%"
             center
             @open="handleOpen">
    <div class="filter-container">
      <el-input v-model="listQuery.name"
                clearable
                placeholder="名称"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.sendPhone"
                clearable
                placeholder="发信人账号"
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
            <img :src="scope.row.sendAvatar" />
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="发信人"
                       align="center">
        <template slot-scope="scope">
          <el-tag> {{ scope.row.sendUsername }}</el-tag>
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
          <el-button type="primary"
                     icon="el-icon-view"
                     @click="handleDetail(scope.row)">处理
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>listQuery.pageSize"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getMailList" />
  </el-dialog>
</template>

<script>

import { postMail, postMailDetail } from '@/api/mail'

import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'MailForm',
  directives: { waves },
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
  components: { Pagination },
  data () {
    return {
      dialogFormVisible: false,
      listLoading: false,
      list: undefined,
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 10,
        name: undefined,
        phone: undefined,
        state: undefined
      }
    }
  },
  methods: {
    handleOpen () {
      this.$nextTick(() => {
        this.getMailList()
      })
    },
    // 检索
    handleFilter () {
      this.listQuery.page = 1
      this.getMailList()
    },
    errorHandler () {
      return true
    },
    // 站内信列表
    getMailList () {
      this.listLoading = true
      postMail(this.listQuery).then(response => {
        setTimeout(() => {
          this.list = response.data
          this.total = response.total
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleDetail (row) {
      row.state = true
      postMailDetail({ id: row.id }).then(() => {
        this.$message.success('已处理')
      })
    }
  }
}
</script>
