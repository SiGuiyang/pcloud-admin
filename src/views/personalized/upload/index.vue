<template>
  <div class="app-container">
    <el-table v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row
              style="width: 100%">
      <el-table-column label="云上传名称"
                       prop="name"
                       align="left">
        <template slot-scope="scope">
          <el-tag> {{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="云上传类型"
                       prop="type"
                       align="left">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type | typeTagFilter"> {{ scope.row.type | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="更新时间"
                       width="220"
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
                       prop="operation"
                       width="220"
                       align="center"
                       fixed="right">
        <template slot-scope="scope">
          <el-button size="small"
                     type="primary"
                     icon="el-icon-view"
                     @click="handleDetail(scope.row.type)">查看明细
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <i-form ref="dataForm"
            :form-data="formData" />
  </div>
</template>

<script>
import IForm from './form'
import waves from '@/directive/waves' // Waves directive
export default {
  directives: { waves },
  components: { IForm },
  filters: {
    typeFilter (type) {
      const typeMap = {
        'ALIYUN': '阿里云OSS',
        'TENCENT': '腾讯云COS',
        'QINIU': '七牛云OSS'
      }
      return typeMap[type]
    },
    typeTagFilter (type) {
      const typeMap = {
        'ALIYUN': 'primary',
        'TENCENT': 'success',
        'QINIU': 'warning'
      }
      return typeMap[type]
    }
  },
  data () {
    return {
      list: [],
      total: 0,
      listLoading: false,
      formData: {}
    }
  },
  created () {
    this.list = [
      {
        id: 1,
        name: '阿里云OSS',
        type: 'ALIYUN',
        gmtModifiedDate: new Date(),
        gmtModifiedName: 'admin'
      },
      {
        id: 2,
        name: '腾讯云COS',
        type: 'TENCENT',
        gmtModifiedDate: new Date(),
        gmtModifiedName: 'admin'
      },
      {
        id: 3,
        name: '七牛云OSS',
        type: 'QINIU',
        gmtModifiedDate: new Date(),
        gmtModifiedName: 'admin'
      }
    ]
  },
  methods: {
    handleDetail (type) {
      if (type === 'QINIU') {
        this.$message.error('暂不支持此服务查询')
        return
      }
      const _this = this.$refs['dataForm']
      _this.ossType = type
      _this.dialogFormVisible = true
    }
  }
}
</script>
