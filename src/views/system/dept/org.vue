<template>
  <el-dialog title="部门架构图"
             :visible.sync="dialogFormVisible"
             :close-on-click-modal="false"
             :fullscreen="true"
             @open="handleOpen">
    <vue2-org-tree :data="orgs"
                   :horizontal="false" />
  </el-dialog>
</template>

<script>
import { getDeptOrg } from '@/api/dept'
export default {
  name: 'Org',
  data () {
    return {
      dialogFormVisible: false,
      orgs: undefined
    }
  },
  methods: {
    handleOpen () {
      this.$nextTick(() => {
        // 部门树
        getDeptOrg({}).then(response => {
          this.orgs = response.data
        })
      })
    }
  }
}
</script>
