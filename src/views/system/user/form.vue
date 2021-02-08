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
      <el-form-item label="手机号码"
                    prop="phone">
        <el-input v-model="formData.phone"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="姓名"
                    prop="name">
        <el-input v-model="formData.name"
                  placeholder="请设置" />
      </el-form-item>
      <template v-if="passwordVisiable">
        <el-form-item label="密码"
                      prop="password">
          <el-input v-model="formData.password"
                    type="password"
                    placeholder="请设置" />
        </el-form-item>
      </template>
      <el-form-item label="拥有角色"
                    prop="roleIds">
        <el-select v-model="formData.roleIds"
                   class="filter-item"
                   style="width:100%"
                   multiple
                   placeholder="请选择">
          <el-option v-for="(item,index) in roles"
                     :key="index"
                     :label="item.name"
                     :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="头像"
                    prop="avatar">
        <div style="margin-bottom: 20px;">
          <Upload v-model="formData.avatar" />
        </div>
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
import { postCreate, putModify } from '@/api/sysuser'
import { postRoleList } from '@/api/role'
import Upload from '@/components/Upload/singleImage3'

export default {
  name: 'Form',
  components: { Upload },
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
      passwordVisiable: false,
      dialogStatus: 'create',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      // 角色数据
      roles: [],
      rules: {
        phone: [{ required: true, message: '手机号码不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        roleIds: [{ required: true, message: '角色不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 弹框初始化
    handleOpen () {
      postRoleList({}).then(response => { // 获取角色列表
        this.roles = response.data
      })
    },
    // 创建
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.formData.gmtCreatedName = this.$store.state.user.username
          this.formData.gmtModifiedName = this.$store.state.user.username
          this.formData.loginCode = this.formData.username
          postCreate(this.formData).then(() => {
            this.dialogFormVisible = false
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.$parent.getUserList()
          })
        }
      })
    },
    // 更新
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDataData = Object.assign({}, this.formData)
          formDataData.gmtModifiedName = this.$store.state.user.username
          putModify(formDataData).then(() => {
            this.dialogFormVisible = false
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.$parent.getUserList()
          })
        }
      })
    }
  }
}
</script>
