<template>
  <el-dialog title="下次执行时间"
             :visible.sync="dialogFormVisible"
             :close-on-click-modal="false"
             center>
    <el-table :data="list"
              stripe
              fit
              highlight-current-row>
      <el-table-column label="时间"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>

export default {
  name: 'nextTriggerTimeForm',
  data () {
    return {
      dialogFormVisible: false,
      list: []
    }
  }
}
</script>
