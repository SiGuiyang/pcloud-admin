<template>
  <el-dialog title="日志清理"
             :visible.sync="dialogFormVisible"
             :close-on-click-modal="false"
             center
             @open="handleOpen">
    <el-form ref="dataForm"
             :model="formData"
             label-position="top"
             label-width="100px"
             width="50%">
      <el-form-item label="执行器"
                    prop="jobGroup">
        <el-select v-model="formData.jobGroup"
                   placeholder="执行器"
                   clearable
                   style="width: 100%"
                   @change="changeJobGroup">
          <el-option v-for="jobGroup in jobGroupOptions"
                     :key="jobGroup.id"
                     :label="jobGroup.appname"
                     :value="jobGroup.id" />
        </el-select>

      </el-form-item>
      <el-form-item label="任务"
                    prop="jobId">
        <el-select v-model="formData.jobId"
                   placeholder="任务"
                   clearable
                   style="width: 100%">
          <el-option v-for="task in taskOptions"
                     :key="task.id"
                     :label="task.jobDesc"
                     :value="task.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="清理方式"
                    prop="type">
        <el-select v-model="formData.type"
                   placeholder="清理方式"
                   clearable
                   style="width: 100%">
          <el-option v-for="type in typeOptions"
                     :key="type.id"
                     :label="type.name"
                     :value="type.id" />
        </el-select>
      </el-form-item>
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
import { postJobgroupFindAll, getJobsByGroup, postJoblogClearLog } from '@/api/job'

export default {
  name: 'Form',
  data () {
    return {
      dialogFormVisible: false,
      formData: {},
      // 执行器
      jobGroupOptions: [],
      // 任务
      taskOptions: [],
      // 清理方式
      typeOptions: [
        { id: 1, name: '清理一个月之前日志数据' },
        { id: 2, name: '清理三个月之前日志数据' },
        { id: 3, name: '清理六个月之前日志数据' },
        { id: 4, name: '清理一年之前日志数据' },
        { id: 5, name: '清理一千条以前日志数据' },
        { id: 6, name: '清理一万条以前日志数据' },
        { id: 7, name: '清理三万条以前日志数据' },
        { id: 8, name: '清理十万条以前日志数据' },
        { id: 9, name: '清理所有日志数据' }
      ]
    }
  },
  methods: {
    handleOpen () {
      postJobgroupFindAll().then(response => { // 获取角色列表
        this.jobGroupOptions = response.data
      })
    },
    // 执行器切换
    changeJobGroup (val) {
      // 切换后清空
      this.taskOptions = []
      getJobsByGroup({ jobGroup: val }).then(response => {
        this.taskOptions = response.data
      })
    },
    handleSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          postJoblogClearLog(this.formData).then(() => {
            this.dialogFormVisible = false
            this.$message({
              message: '日志清理成功',
              type: 'success'
            })
            this.$parent.getLogList()
          })
        }
      })
    }
  }
}
</script>
