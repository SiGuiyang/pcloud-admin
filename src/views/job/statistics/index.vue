<template>
  <div class="dashboard-editor-container">

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row>
      <div class="chart-wrapper">
        <pie-chart />
      </div>
    </el-row>
    <el-row>
      <div class="chart-wrapper">
        <bar-chart />
      </div>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import BarChart from './components/BarChart'
import PieChart from './components/PieChart'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    BarChart,
    PieChart
  },
  data () {
    return {
      triggerCountRunningTotal: 0,
      triggerCountSucTotal: 0,
      triggerCountFailTotal: 0
    }
  },
  mounted () {
    this.handleSetLineChartData()
  },
  methods: {
    handleSetLineChartData (type) {

    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
