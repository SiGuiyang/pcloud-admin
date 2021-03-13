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
      <el-form-item label="上级部门"
                    prop="parentId">
        <treeselect v-model="formData.parentId"
                    :options="deptOption"
                    :normalizer="normalizer"
                    placeholder="请选择" />
      </el-form-item>
      <el-form-item label="部门名称"
                    prop="name">
        <el-input v-model="formData.name"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="部门经理"
                    prop="manager">
        <el-select v-model="formData.managerId"
                   filterable
                   remote
                   reserve-keyword
                   clearable
                   placeholder="请输入"
                   :remote-method="remoteMethod"
                   :loading="loading"
                   style="width: 100%">
          <el-option v-for="item in userOptions"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
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
import { postDeptCreate, postDeptTree, putDeptModify } from '@/api/dept'
import { postUserList } from '@/api/sysuser'
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
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        roleCode: [{ required: true, message: '角色编码不能为空', trigger: 'blur' }]
      },
      // 部门
      deptOption: [],
      // 用户信息
      userOptions: [],
      loading: false
    }
  },
  methods: {
    handleOpen () {
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        // 部门树
        postDeptTree({}).then(response => {
          this.deptOption = response.data
        })
        // 用户检索方法
        this.remoteMethod()
      })
    },
    // 下拉用户检索
    remoteMethod (keyword) {
      this.loading = true
      postUserList({ pageNo: 1, pageSize: 20, keyword: keyword }).then(response => {
        this.userOptions = response.data
        setTimeout(() => {
          this.loading = false
        }, 1.5 * 1000)
      }).catch(() => {
        this.loading = false
      })
    },
    // 新增数据
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.confirmLoading = true
          this.formData.gmtCreatedName = this.$store.state.user.username
          this.formData.gmtModifiedName = this.$store.state.user.username
          postDeptCreate(this.formData).then(() => {
            this.dialogFormVisible = false
            this.confirmLoading = false
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.$parent.getDeptList()
          })
        }
      })
    },
    // 更新数据
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.confirmLoading = true
          const tempData = Object.assign({}, this.formData)
          tempData.gmtModifiedName = this.$store.state.user.username
          putDeptModify(tempData).then(() => {
            this.dialogFormVisible = false
            this.confirmLoading = false
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.$parent.getDeptList()
          })
        }
      })
    },
    normalizer (node) {
      //去掉children=null的属性
      if (node.children === null || node.children === undefined) {
        delete node.children
      }
    }
  }
}
</script>
