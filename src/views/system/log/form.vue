<template>
  <el-dialog :visible.sync="dialogFormVisible"
             :close-on-click-modal="false"
             center
             @open="handleOpen">
    <json-editor ref="jsonEditor"
                 v-model="value" />
  </el-dialog>
</template>

<script>
import JsonEditor from '@/components/JsonEditor'

export default {
  name: 'JsonEditorDemo',
  components: { JsonEditor },
  props: {
    jsonValue: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogFormVisible: false,
      value: ''
    }
  },
  methods: {
    handleOpen () {
      this.$nextTick(() => {
        this.value = JSON.parse(this.jsonValue)
      })
    }
  }
}
</script>
