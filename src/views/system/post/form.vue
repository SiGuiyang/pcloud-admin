<template>
  <el-dialog :title="textMap[dialogStatus]"
             :visible.sync="dialogFormVisible"
             :close-on-click-modal="false"
             width="60%"
             center
             @open="handleOpen">
    <el-form ref="dataForm"
             :rules="rules"
             :model="formData"
             label-position="top"
             label-width="100px"
             width="50%">
      <el-form-item label="上级岗位"
                    prop="parentId">
        <treeselect v-model="formData.parentId"
                    :options="postOption"
                    :load-options="loadPostOption"
                    placeholder="请选择" />
      </el-form-item>
      <el-form-item label="岗位名称"
                    prop="name">
        <el-input v-model="formData.name"
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
import { postPostCreate, putPostModify, postPostList } from '@/api/post'
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
      confirmLoading: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      rules: {
        name: [{ required: true, message: '岗位名称不能为空', trigger: 'blur' }]
      },
      postOption: []
    }
  },
  methods: {
    handleOpen () {
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        postPostList({ parentId: 0 }).then(response => {
          this.postOption = response.data
        })
      })
    },
    loadPostOption ({ action, parentNode, callback }) {
      postPostList({ parentId: parentNode.id }).then(response => {
        parentNode.children = response.data
        callback()
      })
    },
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.confirmLoading = true
          this.formData.gmtCreatedName = this.$store.state.user.username
          this.formData.gmtModifiedName = this.$store.state.user.username
          postPostCreate(this.formData).then(() => {
            this.dialogFormVisible = false
            this.confirmLoading = false
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.$parent.getPostList()
          })
        }
      })
    },

    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.confirmLoading = true
          const tempData = Object.assign({}, this.formData)
          tempData.gmtModifiedName = this.$store.state.user.username
          putPostModify(tempData).then(() => {
            this.dialogFormVisible = false
            this.confirmLoading = false
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.$parent.getPostList()
          })
        }
      })
    }
  }
}
</script>
