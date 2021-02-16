<template>
  <el-dialog title="存储桶列表"
             :visible.sync="dialogFormVisible"
             :close-on-click-modal="false"
             width="60%"
             center
             @open="handleOpen">
    <el-table v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row
              style="width: 100%">
      <el-table-column label="存储桶名称"
                       prop="name"
                       align="left">
        <template slot-scope="scope">
          <el-tag @click="handleBucket(scope.row)"> {{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="访问"
                       prop="type"
                       align="center">
        <template slot-scope="scope">
          <el-tag> {{ scope.row.ownerName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="所属地域"
                       prop="type"
                       align="center">
        <template slot-scope="scope">
          <el-tag> {{ scope.row.location }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="创建时间"
                       width="220"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.creationDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <i-file ref="fileForm" />
  </el-dialog>
</template>

<script>
import { getBucket } from '@/api/oss'
import IFile from './file'
export default {
  name: 'Form',
  components: { IFile },
  data () {
    return {
      dialogFormVisible: false,
      listLoading: false,
      list: null,
      ossType: undefined
    }
  },
  methods: {
    handleOpen () {
      this.listLoading = true
      this.$nextTick(() => {
        getBucket({ ossType: this.ossType }).then(response => {
          this.list = response.data
          setTimeout(() => {
            this.listLoading = false
          }, 3 * 1000)
        })
      })
    },
    handleBucket (row) {
      const _this = this.$refs['fileForm']
      _this.dialogFormVisible = true
      _this.listQuery.ossType = this.ossType
      _this.listQuery.bucketName = row.name
    }
  }
}
</script>
