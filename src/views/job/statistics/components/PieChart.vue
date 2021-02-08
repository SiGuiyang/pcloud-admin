<template>
  <div :class="className"
       :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import { postJobChartInfo } from '@/api/job'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

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
      chart: null,
      triggerCountRunningTotal: 0,
      triggerCountSucTotal: 0,
      triggerCountFailTotal: 0
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
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '10',
            data: ['成功', '进行中', '失败']
          },
          series: [
            {
              name: '调度状态',
              type: 'pie',
              roseType: 'radius',
              radius: [15, 95],
              center: ['50%', '38%'],
              data: [
                { value: response.content.triggerCountSucTotal, name: '成功' },
                { value: response.content.triggerCountRunningTotal, name: '进行中' },
                { value: response.content.triggerCountFailTotal, name: '失败' }
              ],
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ]
        })
      })

    }
  }
}
</script>
