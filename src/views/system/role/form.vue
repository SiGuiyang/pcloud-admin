<template>
  <el-dialog :title="textMap[dialogStatus]"
             :visible.sync="dialogFormVisible"
             :close-on-click-modal="false"
             width="80%"
             center
             @open="handleOpen">
    <el-form ref="dataForm"
             :rules="rules"
             :model="formData"
             label-position="top"
             label-width="100px"
             width="50%">
      <el-form-item label="角色名称"
                    prop="name">
        <el-input v-model="formData.name"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="角色编码"
                    prop="roleCode">
        <el-input v-model="formData.roleCode"
                  :disabled="roleCodeDisabled"
                  placeholder="请设置" />
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button icon="el-icon-circle-close"
                 @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary"
                 :loading="confirmLoading"
                 icon="el-icon-circle-check"
                 @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addRole, modifyRole } from '@/api/role'

export default {
  name: 'Form',
  props: {
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      dialogFormVisible: false,
      roleCodeDisabled: false,
      confirmLoading: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        roleCode: [{ required: true, message: '角色编码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 弹框初始化
    handleOpen () {
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 创建
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.confirmLoading = true
          this.formData.gmtCreatedName = this.$store.state.user.username
          this.formData.gmtModifiedName = this.$store.state.user.username
          addRole(this.formData).then(() => {
            this.dialogFormVisible = false
            this.confirmLoading = false
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.$parent.getRoleList()
          }).catch(() => {
            this.confirmLoading = false
          })
        }
      })
    },
    // 更新
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.confirmLoading = true
          const tempData = Object.assign({}, this.formData)
          tempData.gmtModifiedName = this.$store.state.user.username
          modifyRole(tempData).then(() => {
            this.dialogFormVisible = false
            this.confirmLoading = false
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.$parent.getRoleList()
          }).catch(() => {
            this.confirmLoading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
