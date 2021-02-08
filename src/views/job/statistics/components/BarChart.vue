<template>
  <div :class="className"
       :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import { postJobChartInfo } from '@/api/job'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data () {
    return {
      chart: null
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart () {
      this.chart = echarts.init(this.$el, 'macarons')

      postJobChartInfo({}).then(response => {
        this.chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'line' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            top: 10,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: response.content.triggerDayList,
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            type: 'value',
            axisTick: {
              show: false
            }
          }],
          series: [{
            name: '失败',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: response.content.triggerDayCountFailList,
            animationDuration
          }, {
            name: '进行中',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: response.content.triggerDayCountRunningList,
            animationDuration
          }, {
            name: '成功',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: response.content.triggerDayCountSucList,
            animationDuration
          }]
        })
      })
    }
  }
}
</script>
