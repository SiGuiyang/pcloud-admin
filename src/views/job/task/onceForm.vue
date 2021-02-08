<template>
  <el-dialog title="执行一次"
             :visible.sync="dialogFormVisible"
             :close-on-click-modal="false"
             center>
    <el-form ref="dataForm"
             :model="formData"
             label-position="top"
             label-width="100px"
             width="50%">
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="任务参数"
                        prop="executorParam">
            <el-input v-model="formData.executorParam"
                      type="textarea"
                      placeholder="请输入任务参数" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="机器地址"
                        prop="addressList">
            <el-input v-model="formData.addressList"
                      type="textarea"
                      placeholder="请输入执行器地址列表，多地址逗号分隔" />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary"
                 @click="handleSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { postTriggerJob } from '@/api/job'
export default {
  name: 'OnceForm',
  props: {
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      dialogFormVisible: false
    }
  },
  methods: {
    handleSubmit () {
      const tempData = Object.assign({}, this.formData)
      postTriggerJob({ id: tempData.id, executorParam: tempData.executorParam, addressList: tempData.addressList }).then(() => {
        this.dialogFormVisible = false
        this.$message.success('执行成功')
        this.$parent.getTaskList()
      })
    }
  }
}
</script>
