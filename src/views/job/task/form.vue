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
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="执行器"
                        prop="jobGroup">
            <el-select v-model="formData.jobGroup"
                       placeholder="请设置"
                       style="width: 100%">
              <el-option v-for="jobGroup in jobGroupOptions"
                         :key="jobGroup.id"
                         :label="jobGroup.appname"
                         :value="jobGroup.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务描述"
                        prop="jobDesc">
            <el-input v-model="formData.jobDesc"
                      placeholder="请输入任务描述" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="路由策略"
                        prop="executorRouteStrategy">
            <el-select v-model="formData.executorRouteStrategy"
                       placeholder="请设置"
                       style="width: 100%">
              <el-option v-for="item in executorRouteStrategyOptions"
                         :key="item.value"
                         :value="item.value"
                         :label="item.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Cron"
                        prop="jobCron">
            <el-input v-model="formData.jobCron"
                      placeholder="Cron表达式...">
              <el-button slot="append"
                         icon="el-icon-edit"
                         @click="cronPopover=true"></el-button>

            </el-input>
            <el-popover v-model="cronPopover">
              <cron @change="changeCron"
                    @close="cronPopover=false"></cron>
            </el-popover>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="运行模式"
                        prop="glueType">
            <el-select v-model="formData.glueType"
                       placeholder="请设置"
                       style="width: 100%">
              <el-option v-for="item in glueTypeOptions"
                         :key="item.value"
                         :value="item.value"
                         :label="item.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="JobHandler"
                        prop="executorHandler">
            <el-input v-model="formData.executorHandler"
                      placeholder="请输入JobHandler" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="阻塞处理策略"
                        prop="executorBlockStrategy">
            <el-select v-model="formData.executorBlockStrategy"
                       placeholder="请设置"
                       style="width: 100%">
              <el-option v-for="item in executorBlockStrategyOptions"
                         :key="item.value"
                         :value="item.value"
                         :label="item.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="子任务ID"
                        prop="childJobId">
            <el-input v-model="formData.childJobId"
                      placeholder="请输入子任务ID，如存在多个逗号分隔" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="任务超时时间"
                        prop="executorTimeout">
            <el-input v-model="formData.executorTimeout"
                      placeholder="任务超时时间，单位秒，大于零时生效" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="失败重试次数"
                        prop="executorFailRetryCount">
            <el-input v-model="formData.executorFailRetryCount"
                      placeholder="失败重试次数，大于零时生效" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="负责人"
                        prop="author">
            <el-input v-model="formData.author"
                      placeholder="请输入负责人" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="报警邮件"
                        prop="alarmEmail">
            <el-input v-model="formData.alarmEmail"
                      placeholder="请设置" />
          </el-form-item>
        </el-col>
      </el-row>
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
import { postJobgroupFindAll, postJobAdd, postJobUpdate } from '@/api/job'
import { cron } from 'vue-cron'

export default {
  name: 'Form',
  components: { cron },
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
      dialogStatus: 'create',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      // 执行器
      jobGroupOptions: [],
      // 路由策略
      executorRouteStrategyOptions: [
        { value: 'FIRST', label: '第一个' },
        { value: 'LAST', label: '最后一个' },
        { value: 'ROUND', label: '轮询' },
        { value: 'RANDOM', label: '随机' },
        { value: 'CONSISTENT_HASH', label: '一致性HASH' },
        { value: 'LEAST_FREQUENTLY_USED', label: '最不经常使用' },
        { value: 'LEAST_RECENTLY_USED', label: '最近最久未使用' },
        { value: 'FAILOVER', label: '故障转移' },
        { value: 'BUSYOVER', label: '忙碌转移' },
        { value: 'SHARDING_BROADCAST', label: '分片广播' }
      ],
      // 运行模式
      glueTypeOptions: [
        { value: 'BEAN', label: 'BEAN' },
        { value: 'GLUE_GROOVY', label: 'GLUE(Java)' },
        { value: 'GLUE_SHELL', label: 'GLUE(Shell)' },
        { value: 'GLUE_PYTHON', label: 'GLUE(Python)' },
        { value: 'GLUE_PHP', label: 'GLUE(PHP)' },
        { value: 'GLUE_NODEJS', label: 'GLUE(Nodejs)' },
        { value: 'GLUE_POWERSHELL', label: 'GLUE(PowerShell)' }
      ],
      // 阻塞处理策略
      executorBlockStrategyOptions: [
        { value: 'SERIAL_EXECUTION', label: '单机串行' },
        { value: 'DISCARD_LATER', label: '丢弃后续调度' },
        { value: 'COVER_EARLY', label: '覆盖之前调度' }

      ],
      rules: {
        jobGroup: [{ required: true, message: '执行器不能为空', trigger: 'blur' }],
        jobDesc: [{ required: true, message: '任务描述为空', trigger: 'blur' }],
        executorRouteStrategy: [{ required: true, message: '路由策略不能为空', trigger: 'blur' }],
        jobCron: [{ required: true, message: 'Cron表达式不能为空', trigger: 'blur' }],
        glueType: [{ required: true, message: '运行模式不能为空', trigger: 'blur' }],
        executorHandler: [{ required: true, message: 'JobHandler不能为空', trigger: 'blur' }],
        executorBlockStrategy: [{ required: true, message: '阻塞处理策略不能为空', trigger: 'blur' }],
        author: [{ required: true, message: '负责人不能为空', trigger: 'blur' }]
      },
      cronPopover: false
    }
  },
  methods: {
    // 弹框弹出初始化
    handleOpen () {
      this.$nextTick(() => {
        postJobgroupFindAll().then(response => {
          response.data.forEach(element => {
            this.jobGroupOptions.push({ id: element.id, appname: element.appname })
          })
        })
      })
    },
    // 设置cron表达式
    changeCron (val) {
      this.formData.jobCron = val
    },
    // 创建
    handleCreateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          postJobAdd(this.formData).then(() => {
            this.dialogFormVisible = false
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.$parent.getTaskList()
          })
        }
      })
    },
    // 更新
    handleUpdateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDataData = Object.assign({}, this.formData)
          postJobUpdate(formDataData).then(() => {
            this.dialogFormVisible = false
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.$parent.getTaskList()
          })
        }
      })
    }
  }
}
</script>
