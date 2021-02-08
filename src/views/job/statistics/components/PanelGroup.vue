<template>
  <el-row :gutter="40"
          class="panel-group">
    <el-col :xs="12"
            :sm="12"
            :lg="8"
            class="card-panel-col">
      <div class="card-panel"
           @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples"
                    class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">任务数量</div>
          <count-to :start-val="0"
                    :end-val="jobInfoCount"
                    :duration="2600"
                    class="card-panel-num" />
          <div class="card-panel-desc">调度中心运行的任务数量</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12"
            :sm="12"
            :lg="8"
            class="card-panel-col">
      <div class="card-panel"
           @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message"
                    class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">调度次数</div>
          <count-to :start-val="0"
                    :end-val="jobLogCount"
                    :duration="3000"
                    class="card-panel-num" />
          <div class="card-panel-desc">调度中心触发的调度次数</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12"
            :sm="12"
            :lg="8"
            class="card-panel-col">
      <div class="card-panel"
           @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money"
                    class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">执行器数量</div>
          <count-to :start-val="0"
                    :end-val="executorCount"
                    :duration="3200"
                    class="card-panel-num" />
          <div class="card-panel-desc">调度中心在线的执行器机器数量</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { postJobStatistics } from '@/api/job'
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  data () {
    return {
      jobInfoCount: 0, // 任务数量
      jobLogCount: 10, // 调度数量
      executorCount: 0 // 执行器数量
    }
  },
  created () {
    this.initData()
  },
  methods: {
    handleSetLineChartData (type) {
      this.$emit('handleSetLineChartData', type)
    },
    // 初始化数据
    initData () {
      postJobStatistics({}).then(response => {
        this.jobInfoCount = response.data.jobInfoCount
        this.jobLogCount = response.data.jobLogCount
        this.executorCount = response.data.executorCount
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-desc {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 12px;
        margin-top: 6px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
