<template>
  <el-dialog title="执行器"
             :visible.sync="dialogFormVisible"
             :close-on-click-modal="false"
             center
             @open="handleOpen">
    <el-form ref="dataForm"
             :rules="rules"
             :model="formData"
             label-position="top"
             label-width="100px"
             width="50%">
      <el-form-item label="AppName"
                    prop="appname">
        <el-input v-model="formData.appname"
                  placeholder="请输入AppName" />
      </el-form-item>
      <el-form-item label="名称"
                    prop="title">
        <el-input v-model="formData.title"
                  placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="注册方式"
                    prop="addressType">
        <el-radio-group v-model="formData.addressType">
          <el-radio :label="0">自动注册</el-radio>
          <el-radio :label="1">手动录入</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="机器地址"
                    prop="addressList">
        <el-input v-model="formData.addressList"
                  type="textarea"
                  placeholder="请输入执行器地址列表，多地址逗号分隔" />
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary"
                 @click="dialogStatus==='create'?handleCreateData():handleUpdateData()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { postJobgroupSave, postJobgroupUpdate } from '@/api/job'

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
      dialogPvVisible: false,
      dialogStatus: 'create',
      roles: [],
      rules: {
        appname: [{ required: true, message: 'AppName不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        addressType: [{ required: true, message: '注册方式不能为空', trigger: 'blur' }],
        addressList: [{ required: true, message: '机器地址不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleOpen () {
    },
    handleCreateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          postJobgroupSave(this.formData).then(() => {
            this.dialogFormVisible = false
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.$parent.getJobGroupList()
          })
        }
      })
    },
    handleUpdateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDataData = Object.assign({}, this.formData)
          postJobgroupUpdate(formDataData).then(() => {
            this.dialogFormVisible = false
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.$parent.getJobGroupList()
          })
        }
      })
    }
  }
}
</script>
