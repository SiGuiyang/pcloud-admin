<template>
  <el-dialog title="角色授权"
             :visible.sync="dialogFormVisible"
             :close-on-click-modal="false"
             style="height: 90%"
             center
             @open="handleOpen">
    <el-container>
      <el-aside class="p-aside">
        <h3>路由权限</h3>
        <el-tree ref="routers"
                 :data="routers"
                 :default-checked-keys="hasRouters"
                 :props="defaultProps"
                 show-checkbox
                 node-key="id"
                 highlight-current />
      </el-aside>
      <el-main>
        <div class="p-main-header">
          <h3>访问资源权限</h3>
        </div>
        <el-tree ref="resources"
                 :data="resources"
                 :default-checked-keys="hasResources"
                 :props="defaultProps"
                 show-checkbox
                 node-key="id"
                 highlight-current />
      </el-main>
    </el-container>
    <div slot="footer"
         class="dialog-footer">
      <el-button icon="el-icon-circle-close"
                 @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary"
                 icon="el-icon-circle-check"
                 @click="handleSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { grantAuthorization, postRolePermission } from '@/api/role'

export default {
  name: 'IPermission',
  data () {
    return {
      dialogFormVisible: false,
      // 路由
      routers: [],
      // 拥有路由的权限
      hasRouters: [],
      // 资源
      resources: [],
      // 拥有资源的权限
      hasResources: [],
      selectedRoleId: 0,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    handleOpen () {
      this.initPermission(this.selectedRoleId)
    },
    initPermission (roleId) {
      // 获取菜单列表
      postRolePermission({ roleId: roleId }).then(response => {
        this.routers = response.data.routers
        this.hasRouters = response.data.hasRouters
        this.resources = response.data.resources
        this.hasResources = response.data.hasResources
      })
    },
    handleSubmit () {
      // 路由
      const data = []
      const checked = this.$refs.routers.getCheckedKeys() // 获取全选择中的节点
      const halfChecked = this.$refs.routers.getHalfCheckedKeys() // 获取半选中的节点
      checked.forEach(ck => data.push(ck))
      halfChecked.forEach(hc => data.push(hc))

      // 访问资源
      const resource = []
      const resourceRhecked = this.$refs.resources.getCheckedKeys() // 获取全选择中的节点
      const halfResourceChecked = this.$refs.resources.getHalfCheckedKeys() // 获取半选中的节点
      resourceRhecked.forEach(ck => resource.push(ck))
      halfResourceChecked.forEach(hc => resource.push(hc))

      const params = {
        routers: data, // 将最终获取的权限节点入参进行授权
        resources: resource,
        roleId: this.selectedRoleId
      }
      grantAuthorization(params).then(() => {
        this.dialogFormVisible = false
        this.$message({
          message: '授权成功',
          type: 'success'
        })
        this.$parent.getRoleList()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.p-aside {
  margin: 20px;
}

.p-main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
