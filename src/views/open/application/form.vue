<template>
  <el-dialog title="新增"
             :visible.sync="dialogFormVisible"
             :close-on-click-modal="false"
             width="80%"
             center>
    <el-form ref="dataForm"
             :rules="rules"
             :model="formData"
             label-position="top"
             label-width="100px"
             width="50%">
      <el-row :gutter="24">
        <el-form-item label="应用名称"
                      prop="name">
          <el-input v-model="formData.name"
                    placeholder="请设置" />
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button icon="el-icon-circle-close"
                 @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary"
                 :loading="confirmLoading"
                 icon="el-icon-circle-check"
                 @click="createData()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { postAccountCreate } from '@/api/open'

export default {
  name: 'Form',
  props: {
    formData: {
      type: Object,
      default: () => ({
        sysName: '',
        username: ''
      })
    }
  },
  data () {
    return {
      dialogFormVisible: false,
      confirmLoading: false,
      rules: {
        name: [{ required: true, message: '应用名称不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 创建
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.confirmLoading = true
          this.formData.gmtCreatedName = this.$store.state.user.username
          this.formData.gmtModifiedName = this.$store.state.user.username
          postAccountCreate(this.formData).then(() => {
            this.dialogFormVisible = false
            this.confirmLoading = false
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.$parent.getAccountList()
          }).catch(() => {
            this.confirmLoading = false
          })
        }
      })
    }
  }
}
</script>
