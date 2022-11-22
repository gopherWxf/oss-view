<!--心跳检测及节点信息-->
<template>
  <div class="overview">
    <!-- 心跳检测echarts节点图 -->
    <div id="main" :style="styles"></div>

    <div>
      <!-- 心跳检测列表数据 -->
      <table class="ui five column selectable inverted table" style="margin-top: 10px">
        <thead>
        <tr>
          <th><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">节点</font></font></th>
          <th><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">IP</font></font></th>
          <th><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">实时心跳检测时间</font></font></th>
          <th><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">状态</font></font></th>
          <th><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">节点系统信息</font></font></th>
        </tr>
        </thead>
        <tbody>
        <tr v-if=" HeartbeatTableData.length === 0">
          <td><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
            暂无数据
          </font></font>
          </td>
        </tr>
        <tr v-for="(item,index) in HeartbeatTableData" :key="index">
          <td><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
            {{ item.name }}</font></font>
          </td>
          <td><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
            {{ item.value }}</font></font>
          </td>
          <td><font style="vertical-align: inherit;"><font
              style="vertical-align: inherit;">{{ item.date |dateFilter("yyy-mm-dd hh:mm:ss") }}</font></font>
          </td>
          <td><font style="vertical-align: inherit;"><font style="vertical-align: inherit; ">
            <i v-if="item.state ==='故障'" class="red attention icon"></i>
            <i v-if="item.state ==='正常'" class="green check icon"></i>
            {{ item.state }}</font></font>
          </td>
          <td><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
            <button v-if="item.state ==='正常'" class="ui inverted black basic button"
                    @click="handleClick(item.value,$event)"><font style="vertical-align: inherit;"><font
                style="vertical-align: inherit;">查看</font></font></button>
            <button v-if="item.state ==='故障'" class="ui inverted disabled black basic button"><font
                style="vertical-align: inherit;"><font style="vertical-align: inherit;">查看</font></font></button>
          </font></font></td>
        </tr>
        </tbody>
      </table>
    </div>

    <el-dialog :visible.sync="dialogTableVisible" width="90%" @close='closeDialog'>
      <span></span>
      <span></span>

      <h2 style="margin-top: -30px;margin-bottom: 20px;text-align: center">{{ title }}</h2>

      <div class="ui four statistics">
        <!--系统信息-->
        <div class="statistic">
          <div class="text value"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
            系统信息</font></font><br><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
          </font></font></div>
          <div class="label"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
            <div style="text-align: left;display: flex;justify-content: center;align-items: center;">
              内核版本: {{ systemStatus.systemInfo.kernelVersion }} <br>
              平台信息: {{ systemStatus.systemInfo.platform }} <br>
              OS Family: {{ systemStatus.systemInfo.osFamily }}<br>
              os版本: {{ systemStatus.systemInfo.osVersion }}<br>
            </div>
          </font></font></div>

        </div>

        <!--CPU信息-->
        <div class="statistic">
          <div class="text value"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
            CPU</font></font><br><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
          </font></font></div>
          <div class="label"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
            <div style="text-align: left;display: flex;justify-content: center;align-items: center;">
              物理核数: {{ systemStatus.cpu.physicalCnt }} <br>
              逻辑核数: {{ systemStatus.cpu.logicalCnt }} <br>
            </div>
          </font></font></div>

          <div class="progressBox">
            <Dashboard
                type="dashboard"
                :width="dashboardData.width"
                :rate="dashboardData.rate"
                :percentage="systemStatus.cpu.cpuTotalPercent"
                :bgColor="dashboardData.bgColor"
                :color="dashboardData.colors"
                :stroke-width="dashboardData.strokeWidth"
                :stroke-linecap="dashboardData.strokeLinecap"
            />
            <div class="labelBox">负载</div>
          </div>
        </div>

        <!--内存信息-->
        <div class="statistic">
          <div class="text value"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
            内存</font></font><br><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
          </font></font></div>
          <div class="label"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
            <div style="text-align: left;display: flex;justify-content: center;align-items: center;">
              总大小: {{ systemStatus.mem.total }} <br>
              可用大小: {{ systemStatus.mem.available }} <br>
            </div>
          </font></font></div>
          <div class="progressBox">
            <Dashboard
                type="dashboard"
                :width="dashboardData.width"
                :rate="dashboardData.rate"
                :percentage="systemStatus.mem.memTotalPercent"
                :bgColor="dashboardData.bgColor"
                :color="dashboardData.colors"
                :stroke-width="dashboardData.strokeWidth"
                :stroke-linecap="dashboardData.strokeLinecap"
            />
            <div class="labelBox">使用率</div>
          </div>
        </div>

        <!--硬盘信息-->
        <div class="statistic">
          <div class="text value"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
            硬盘分区 {{ systemStatus.disk.path }} </font></font><br><font style="vertical-align: inherit;"><font
              style="vertical-align: inherit;">
          </font></font></div>
          <div class="label"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
            <div style="text-align: left;display: flex;justify-content: center;align-items: center;">
              分区总容量: {{ systemStatus.disk.total }} <br>
              空闲容量: {{ systemStatus.disk.free }} <br>
            </div>
          </font></font></div>
          <div class="progressBox">
            <Dashboard
                type="dashboard"
                :width="dashboardData.width"
                :rate="dashboardData.rate"
                :percentage="systemStatus.disk.usedPercent"
                :bgColor="dashboardData.bgColor"
                :color="dashboardData.colors"
                :stroke-width="dashboardData.strokeWidth"
                :stroke-linecap="dashboardData.strokeLinecap"
            />
            <div class="labelBox">使用率</div>
          </div>
          <span></span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Dashboard from "@/components/Dashboard";
import $ from "jquery"

export default {
  name: 'Overview',
  components: {
    Dashboard
  },
  data() {
    return {
      index: 0,
      tableIndexFaultColor: [],// 故障节点
      styles: {
        width: '100%',
        height: "300px"
      },
      timer: null,
      myChart: null,
      links: [], // echarts 节点连接
      HeartbeatTableData: [],
      HeartbeatEChartsData: [], // echarts数据
      checks: null, // 检查
      title: '', // dialog的表头
      dialogTableVisible: false, // 查看节点系统信息的dialog
      systemStatus: {// 节点系统信息
        cpu: {
          physicalCnt: 0,
          logicalCnt: 0,
          cpuTotalPercent: 0
        },
        mem: {
          total: 0,
          available: 0,
          memTotalPercent: 0
        },
        disk: {
          path: "/",
          total: 0,
          used: 0,
          free: 0,
          usedPercent: 0
        },
        systemInfo: {
          kernelVersion: "",
          platform: "",
          osFamily: "",
          osVersion: ""
        }
      },
      dashboardData: { // 仪表盘
        width: 100,
        strokeLinecap: "square",
        strokeWidth: 10,
        rate: 0.75,
        percentage: 90,
        bgColor: "#cfcfcf",
        colors: [
          {color: "#30b313", percentage: 25},
          {color: "#3d64ed", percentage: 50},
          {color: "#d57f08", percentage: 75},
          {color: "#b90101", percentage: 100},
        ],
      },
      getNodeSystemInfoTimer: null,// 获取系统节点信息的定时器
    }
  },
  mounted() {
    this.getHeartbeat()
    this.checks = setInterval(this.check, 0);// 防止定时任务时间问题，再多跑一次执行检查
    this.timer = setInterval(this.getHeartbeat, 5000); //5秒去执行一次定时任务
  },
  beforeDestroy() {// 实例销毁时清除定时任务
    if (this.timer) { //如果定时器还在运行
      clearInterval(this.timer); //关闭
    }
    if (this.checks) { //如果定时器还在运行
      clearInterval(this.checks); //关闭
    }
  },
  methods: {
    // 获得心跳检测
    getHeartbeat() {
      this.$request.getHeartbeat().then(async val => {
        await this.splitData(val)// 组装数据
        this.check() // 检查是否有心跳失败节点
      })
    },

    // 组装echarts数据
    splitData(val) {
      let i = 1;
      this.links = [];
      this.HeartbeatTableData = []
      this.HeartbeatEChartsData = [{
        symbol: 'image://https://pic.imgdb.cn/item/6276198809475431298d85b6.png',
        name: "",
        value: "接口服务",
        x: 300,
        y: 0,
        colors: '#009991'
      }]
      for (let key in val) {
        let tableData = Object.create(null)
        let EChartsData = Object.create(null)
        let nodeLink = Object.create(null)

        tableData["name"] = "node" + i
        tableData["value"] = key
        tableData["date"] = val[key]
        tableData["state"] = "正常"

        EChartsData["symbol"] = 'image://https://pic.imgdb.cn/item/6276134a094754312978eea7.png'
        EChartsData["name"] = "node" + i
        EChartsData["value"] = key
        if (i % 2 === 0) {
          EChartsData["x"] = 700
          EChartsData["y"] = i * 100
        } else {
          EChartsData["x"] = -100
          EChartsData["y"] = (i + 1) * 100
        }
        EChartsData["colors"] = "#5470c6"

        nodeLink["source"] = ""
        nodeLink["target"] = "node" + i
        nodeLink["lineStyle"] = {}

        if (this.tableIndexFaultColor.indexOf(i - 1) !== -1) { //宕机
          EChartsData["colors"] = "#F72C5B"
          nodeLink["lineStyle"] = {
            color: "#F72C5B",
            type: 'dotted'
          }
        }

        this.HeartbeatTableData.push(tableData)
        this.HeartbeatEChartsData.push(EChartsData)
        this.links.push(nodeLink)
        this.HeartbeatEChartsData[0].y = (i * 100) / 2 + 100
        i++
      }
      this.styles.height = (i - 3) * 100
      this.echarts()
    },

    // 检查心跳失败的节点
    check() {
      this.tableIndexFaultColor = []
      this.HeartbeatTableData.map((item) => { // 获取时间小于当前时间10秒的,将节点添加到 故障节点
        var date1 = item.date;  //开始时间
        var date2 = new Date();    //结束时间
        var date3 = date2.getTime() - new Date(date1).getTime();   //时间差的毫秒数
        var leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
        var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
        //计算相差秒数
        var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
        var seconds = Math.round(leave3 / 1000)

        if (seconds > 10) {
          // console.log(parseInt(item.name.charAt(item.name.length - 1)) - 1 + "应该变色")
          this.tableIndexFaultColor.push(parseInt(item.name.charAt(item.name.length - 1)) - 1)
          item.state = "故障"
        }
      })
    },

    // echarts节点图
    echarts() {
      if (this.myChart != null && this.myChart !== "" && this.myChart !== undefined) {
        this.myChart.dispose();
      }
      this.myChart = this.$echarts.init(document.getElementById('main'));

      this.myChart.setOption({
        //animation:false,// 取消动画
        title: {
          text: '数据服务节点(Refresh every 5 seconds)',
          textStyle: {
            color: '#a19e9e'
          }
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            type: 'graph',
            layout: 'none',
            symbolSize: 50,
            // roam: true,
            label: {
              show: true
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              fontSize: 20
            },
            data: this.HeartbeatEChartsData.map((item) => {
              return {
                symbol: item.symbol,
                name: item.name,
                value: item.value,
                colors: item.colors,
                x: item.x,
                y: item.y
              }
            }),
            links: this.links.map((item) => {
              return {
                source: item.source,
                target: item.target,
                lineStyle: item.lineStyle
              }
            }),
            lineStyle: {
              opacity: 0.9,
              width: 2,
              curveness: 0.2
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  return params.data.colors; //获取具体的参数
                }
              }
            }
          }
        ]
      })

      // 让图表跟随屏幕自动的去适应
      window.addEventListener('resize', () => {
        this.myChart.resize()
      })
    },

    // 获取节点信息按钮事件
    async handleClick(row, event) {
      this.title = row + " 节点系统信息"
      event.currentTarget.className = 'ui inverted black loading basic button' // 增加按钮loading
      var nodeSystemStatus = await this.getNodeSystemStatus(row); // 先执行一次
      $("button").removeClass("loading") //关闭按钮loading
      if (nodeSystemStatus === false) {
        return
      }
      this.getNodeSystemInfoTimer = setInterval(() => {
        if (this.getNodeSystemStatus(row) === false) {
          clearInterval(this.getNodeSystemInfoTimer); //关闭
        }
      }, 5000); //5秒去执行一次定时任务

    },

    // 获取节点系统信息的数据
    async getNodeSystemStatus(row) {
      var flag = false
      await this.$request.getNodeSystemInfo(row).then(val => {
        if (val.status === 200) {
          // 重新组装数据
          var info = val.data
          info.mem.total = this.conver(info.mem.total)
          info.mem.available = this.conver(info.mem.available)

          info.disk.total = this.conver(info.disk.total)
          info.disk.used = this.conver(info.disk.used)
          info.disk.free = this.conver(info.disk.free)

          this.systemStatus = info
          this.dialogTableVisible = true
          flag = true
        } else {
          this.dialogTableVisible = false
          this.$message.error("获取节点系统信息失败")
          flag = false
        }
      })
      return flag
    },

    //关闭弹框的事件
    closeDialog() {
      this.dialogTableVisible = false
      $("button").removeClass("loading") //关闭按钮loading
      if (this.getNodeSystemInfoTimer) { //如果定时器还在运行
        clearInterval(this.getNodeSystemInfoTimer); //关闭
      }
    },

    // B转KB、MB、GB其它单位
    conver(limit) {
      var size = "";
      if (limit < 0.1 * 1024) { //如果小于0.1KB转化成B
        size = limit.toFixed(2) + "B";
      } else if (limit < 0.1 * 1024 * 1024) {//如果小于0.1MB转化成KB
        size = (limit / 1024).toFixed(2) + "KB";
      } else if (limit < 0.1 * 1024 * 1024 * 1024) { //如果小于0.1GB转化成MB
        size = (limit / (1024 * 1024)).toFixed(2) + "MB";
      } else { //其他转化成GB
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
      }

      var sizestr = size + "";
      var len = sizestr.indexOf("\.");
      var dec = sizestr.substr(len + 1, 2);
      if (dec == "00") {//当小数点后为00时 去掉小数部分
        return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
      }
      return sizestr;
    }
  },
  // 日期格式化
  filters: {
    dateFilter: function (value) {
      var date = new Date(value);
      var year = date.getFullYear();
      /* 在日期格式中，月份是从0开始，11结束，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // 拼接
      return year + "/" + month + "/" + day + " " + hours + ":" + minutes + ":" + seconds;
    }
  }
}
</script>

<style lang='less'>

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.overview {
  width: 100%;
  height: 100%;

  .el-dialog {
    text-align: left;
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    //width: 80%;
    height: auto;
    background: #111845a6;
    box-sizing: border-box;
    overflow: hidden;
    box-shadow: 0 20px 50px rgb(23, 32, 90);
    border: 2px solid #2a3cad;
    color: white;
  }

  .text {
    color: #b0adad !important;
  }

  .label {
    color: #d8cccc !important;
  }

  .el-dialog__headerbtn {
    z-index: 99;
  }

  .el-dialog span:nth-child(1) {
    transform: rotate(0deg);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .el-dialog span:nth-child(2) {
    transform: rotate(180deg);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .el-dialog {
    span:nth-child(1):before, span:nth-child(2):before {
      content: '';
      position: absolute;
      width: 100%;
      height: 2px;
      background: #50dfdb;
      animation: animate 5s linear infinite;
    }
  }

  @keyframes animate {
    0% {
      transform: scaleX(0);
      transform-origin: left;
    }
    50% {
      transform: scaleX(1);
      transform-origin: left;
    }
    50.1% {
      transform: scaleX(1);
      transform-origin: right;
    }

    100% {
      transform: scaleX(0);
      transform-origin: right;
    }
  }

  ::v-deep .myText {
    font-weight: bolder;
    font-size: 20px !important;
    background-image: linear-gradient(0deg, #498dff, #8bb7fe);
  }

  .progressBox {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .labelBox {
    background: #4c8fff;
    width: 50px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: white;
    border-radius: 15px;
    margin-top: -20px;
  }
}
</style>