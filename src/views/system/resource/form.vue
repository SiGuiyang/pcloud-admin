<template>
  <el-dialog :title="textMap[dialogStatus]"
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
      <el-form-item label="资源名称"
                    prop="name">
        <el-input v-model="formData.name"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="父级资源"
                    prop="parentId">
        <treeselect v-model="formData.parentId"
                    :options="resourceOptions"
                    :flatten-search-results="true"
                    placeholder="请选择" />
      </el-form-item>
      <el-form-item label="访问资源"
                    prop="resourceUrl">
        <el-input v-model="formData.resourceUrl"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="资源类型"
                    prop="bizType">
        <el-select v-model="formData.bizType"
                   style="width: 100%">
          <el-option :value="0"
                     label="接口" />
          <el-option :value="1"
                     label="按钮" />
        </el-select>
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
import { postResourceTree, addResource, modifyResource } from '@/api/resource'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'Form',
  components: { Treeselect },
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
      resourceOptions: [],
      textMap: {
        update: '编辑',
        create: '新建'
      },
      rules: {
        name: [{ required: true, message: '资源名称不能为空', trigger: 'blur' }],
        resourceUrl: [{ required: true, message: '访问不能为空', trigger: 'blur' }],
        bizType: [{ required: true, message: '资源类型不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 弹框初始化
    handleOpen () {
      this.$nextTick(() => {
        postResourceTree({}).then(response => {
          this.resourceOptions = response.data
        })
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 创建
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.formData.gmtCreatedName = this.$store.state.user.username
          this.formData.gmtModifiedName = this.$store.state.user.username
          addResource(this.formData).then(() => {
            this.dialogFormVisible = false
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.$parent.postResource()
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
          modifyResource(tempData).then(() => {
            this.dialogFormVisible = false
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.$parent.postResource()
          })
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
