<template>
  <el-dialog :title="textMap[dialogStatus]"
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
        <el-col :span="12">
          <el-form-item label="号段"
                        prop="bizTag">
            <el-input v-model="formData.bizTag"
                      placeholder="请设置" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="号段说明"
                        prop="description">
            <el-input v-model="formData.description"
                      placeholder="请设置" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="maxId"
                        prop="maxId">
            <el-input-number v-model="formData.maxId"
                             placeholder="请设置"
                             style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="step"
                        prop="step">
            <el-input-number v-model="formData.step"
                             placeholder="请设置"
                             style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="负责人"
                        prop="author">
            <el-input v-model="formData.author"
                      placeholder="请设置" />
          </el-form-item>
        </el-col>
      </el-row>
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
import { postSegmentCreate, putSegmentModify } from '@/api/segment'

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
      dialogStatus: 'create',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        bizTag: [{ required: true, message: '号段不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '号段说明不能为空', trigger: 'blur' }],
        maxId: [{ required: true, message: 'maxId不能为空', trigger: 'blur' }],
        step: [{ required: true, message: 'step不能为空', trigger: 'blur' }],
        author: [{ required: true, message: '负责人不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 创建
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.confirmLoading = true
          postSegmentCreate(this.formData).then(() => {
            this.dialogFormVisible = false
            this.confirmLoading = false
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.$parent.getSegmentList()
          })
        }
      })
    },
    // 更新
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.confirmLoading = true
          const formDataData = Object.assign({}, this.formData)
          putSegmentModify(formDataData).then(() => {
            this.dialogFormVisible = false
            this.confirmLoading = false
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.$parent.getSegmentList()
          })
        }
      })
    }
  }
}
</script>
