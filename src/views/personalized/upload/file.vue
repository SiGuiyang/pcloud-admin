<template>
  <el-dialog title="文件列表"
             :visible.sync="dialogFormVisible"
             :close-on-click-modal="false"
             width="60%"
             center
             append-to-body
             @open="handleOpen">
    <el-table v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row
              style="width: 100%">
      <el-table-column label="文件名"
                       align="left">
        <template slot-scope="scope">
          <span> {{ scope.row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column label="大小"
                       align="center">
        <template slot-scope="scope">
          <el-tag> {{ scope.row.size }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="存储类型"
                       align="center">
        <template slot-scope="scope">
          <el-tag> {{ scope.row.storageClass }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="修改时间"
                       width="220"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.lastModified | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="220"
                       align="center">
        <template slot-scope="scope">
          <el-button v-clipboard:copy="scope.row.url"
                     v-clipboard:success="onSuccess"
                     v-clipboard:error="onError"
                     size="small"
                     type="primary"
                     icon="el-icon-document-copy">复制
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { postObjects } from '@/api/oss'
export default {
  name: 'Form',
  data () {
    return {
      dialogFormVisible: false,
      listLoading: false,
      list: null,
      listQuery: {
        maxKey: 1000,
        ossType: undefined,
        bucketName: undefined
      }
    }
  },
  methods: {
    handleOpen () {
      this.listLoading = true
      this.$nextTick(() => {
        this.handlerFilter()
      })
    },
    handlerFilter () {
      postObjects(this.listQuery).then(response => {
        this.list = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 3 * 1000)
      })
    },
    onSuccess (e) {
      this.$message.success('复制成功')
    },
    onError (e) {
      this.$message.error('抱歉，复制失败！')

    }
  }
}
</script>
