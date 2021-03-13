<template>
  <el-dialog title="存储列表"
             :visible.sync="dialogFormVisible"
             :close-on-click-modal="false"
             width="80%"
             center
             @open="handleOpen">
    <el-container>
      <el-aside v-loading="bucketLoading"
                width="200px">
        <h3>存储桶</h3>
        <el-radio-group v-model="listQuery.bucketName">
          <el-radio v-for="item in list"
                    :key="item.name"
                    :label="item.name"
                    style="width:180px"
                    @change="handleChange">{{ item.name }}</el-radio>
        </el-radio-group>
      </el-aside>
      <el-main>
        <el-table v-loading="listLoading"
                  :data="fileList"
                  stripe
                  fit
                  highlight-current-row
                  style="width: 100%"
                  @cell-click="handleCellClick">
          <el-table-column label="文件名"
                           width="220"
                           align="left">
            <template slot-scope="scope">
              <i v-if="!scope.row.file"
                 class="el-icon-folder-opened"></i>
              <span :class="{cursor: !scope.row.file}"> {{ scope.row.key }}</span>
            </template>
          </el-table-column>
          <el-table-column label="大小"
                           width="220"
                           align="center">
            <template slot-scope="scope">
              <el-tag> {{ scope.row.size ? scope.row.size: '/' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="存储类型"
                           width="220"
                           align="center">
            <template slot-scope="scope">
              <el-tag> {{ scope.row.storageClass ? scope.row.storageClass : '/' }}</el-tag>
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
      </el-main>
    </el-container>

  </el-dialog>
</template>

<script>
import { getBucket, postObjects } from '@/api/oss'
export default {
  name: 'Form',
  data () {
    return {
      dialogFormVisible: false,
      listLoading: false,
      bucketLoading: false,
      list: null,
      fileList: null,
      listQuery: {
        maxKey: 1000,
        ossType: undefined,
        bucketName: undefined,
        prefix: undefined,
        marker: undefined
      }
    }
  },
  methods: {
    handleOpen () {
      this.bucketLoading = true
      this.$nextTick(() => {
        // 初始化进来文件列表为空
        this.fileList = null
        getBucket({ ossType: this.listQuery.ossType }).then(response => {
          this.list = response.data
          this.bucketLoading = false
        })
      })
    },
    onSuccess (e) {
      this.$message.success('复制成功')
    },
    onError (e) {
      this.$message.error('抱歉，复制失败！')

    },
    // 切换存储桶
    handleChange (val) {
      this.listQuery.prefix = undefined
      this.listQuery.marker = undefined
      this.handlerFilter()
    },
    // 根据存储桶查看列表
    handlerFilter () {
      this.listLoading = true
      postObjects(this.listQuery).then(response => {
        this.fileList = response.data
        this.listLoading = false
      })
    },
    handleCellClick (row, column, cell, event) {
      if (column.label === '文件名') {
        this.listLoading = true
        this.listQuery.prefix = row.key
        this.listQuery.marker = undefined
        this.handlerFilter()
      }
    }
  }
}
</script>

<style scoped>
.cursor {
  cursor: pointer;
}
</style>
