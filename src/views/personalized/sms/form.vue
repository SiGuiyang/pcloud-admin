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
      <el-form-item label="短信名称"
                    prop="name">
        <el-input v-model="formData.name"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="短信编码"
                    prop="code">
        <el-input v-model="formData.code"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="短信内容"
                    prop="description">
        <el-input v-model="formData.description"
                  type="textarea"
                  placeholder="请设置" />
        <el-tag v-for="tag in tagOption"
                :key="tag.value"
                @click="handleTag(tag)">{{ tag.name }}</el-tag>
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button icon="el-icon-circle-close"
                 @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary"
                 icon="el-icon-circle-check"
                 @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { postSmsCreate, putSmsModify } from '@/api/sms'
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
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      rules: {
        name: [{ required: true, message: '短信名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '短信编码不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '短信内容不能为空', trigger: 'blur' }]
      },
      tagOption: [{ name: '手机号码', value: '${phone}' }]
    }
  },
  methods: {
    handleOpen () {
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleTag (val) {
      if (this.formData.description) {
        this.formData.description = this.formData.description + val.value
      } else {
        this.formData.description = '' + val.value
      }
    },
    // 创建
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.formData.gmtCreatedName = this.$store.state.user.username
          this.formData.gmtModifiedName = this.$store.state.user.username
          postSmsCreate(this.formData).then(() => {
            this.dialogFormVisible = false
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.$parent.getSmsList()
          })
        }
      })
    },
    // 更新
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.formData)
          tempData.gmtModifiedName = this.$store.state.user.username
          putSmsModify(tempData).then(() => {
            this.dialogFormVisible = false
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.$parent.getSmsList()
          })
        }
      })
    }
  }
}
</script>
