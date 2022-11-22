<!--系统管理-->
<template>
  <div style="width: 100%">
    <!--系统概览 对象存储数量，上传请求次数，维护次数-->
    <div class="ui four statistics">
      <div class="statistic">
        <h2 class="ui small center aligned icon header">
          <i class="blue hdd icon"></i><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
          <div class="wrapper-header">
            <span>系</span>
            <span>统</span>
            <span>概</span>
            <span>览</span>
          </div>
        </font></font></h2>
      </div>
      <div class="brown statistic">
        <div class="value"><font style="vertical-align: inherit;">
          <i class="small archive icon"></i> <font style="vertical-align: inherit;">
          {{ systemInfo.Obj }}
        </font></font></div>
        <div class="label"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
          存储对象数量/个
        </font></font></div>
      </div>
      <div class="teal statistic">
        <div class="value"><font style="vertical-align: inherit;">
          <i class="small upload icon"></i>
          <font style="vertical-align: inherit;">
            {{ systemInfo.Put }}</font></font></div>
        <div class="label"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
          上传请求次数/次
        </font></font></div>
      </div>
      <div class="orange statistic">
        <div class="value">
          <i class="small sync alternate icon"></i> <font style="vertical-align: inherit;"><font
            style="vertical-align: inherit;">{{ systemInfo.Uphold }}
        </font></font></div>
        <div class="label"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
          维护次数/次
        </font></font></div>
      </div>
    </div>
    <!-- 日历热力图 -->
    <div id="main" :style="styles"></div>
    <div class="ui section divider"></div>

    <!-- 系统维护按钮 -->
    <div>
      <div class="ui four statistics" style="width: auto">
        <div class="statistic" style="margin-top: 100px">
          <h2 class="ui small center aligned icon header text">
            <i class="blue settings icon"></i><font style="vertical-align: inherit;"><font
              style="vertical-align: inherit;">
            <div class="wrapper-header">
              <span>系</span>
              <span>统</span>
              <span>维</span>
              <span>护</span>
            </div>
          </font></font>
          </h2>

          <!-- 紧随其下的div，只有在loading为true的时候才会上显示 -->
          <div class="autumn ui icon message" v-if="loading">
            <i class="notched circle loading icon"></i>
            <div class="content">
              <div class="header"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                只需一小会，请不要刷新页面
              </font></font></div>
              <p><font style="vertical-align: inherit;"><font
                  style="vertical-align: inherit;">正在进行{{ operation }}的操作...</font></font>
              </p>
            </div>
          </div>

          <!-- 紧随其下的div，只有在complete为true的时候才会上显示 -->
          <div class="autumn ui icon message" v-if="complete">
            <i class="notched green check circle outline icon"></i>
            <div class="content" style="margin-right: 40px ">
              <div class="header"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                {{ operation }}已完成
              </font></font></div>
            </div>
          </div>

          <!-- 紧随其下的div，只有在error为true的时候才会上显示 -->
          <div class="autumn ui icon message" v-if="error">
            <i class="notched red x icon"></i>
            <div class="content" style="margin-right: 40px ">
              <div class="header"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                {{ operation }} 发生错误
              </font></font></div>
            </div>
          </div>
        </div>

        <div style="margin:25px 20px 0px 150px;text-align: left;">
          <div class="ui divided items" style="width: 100%">
            <div class="item">
              <div style="width:100px">
                <i class="huge grey map icon"></i>
              </div>
              <div class="content">
                <a class="header label"><font style="vertical-align: inherit;"><font
                    style="vertical-align: inherit;">选择对象保留版本数量</font></font></a>
                <div class="meta text">
                  <span class="cinema"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">这个操作将所有对象从最新版本起，保留n个版本的元数据</font></font></span>
<!--                </div>-->
<!--                <div class="description">-->
<!--                  <p></p>-->
<!--                </div>-->
<!--                <div class="extra">-->
                  <el-popconfirm
                      @confirm="deleteOldMetadata"
                      cancel-button-text="再考虑一下"
                      title="您是否已经知晓该操作带来的影响并执行？">
                    <div class="ui right floated primary button" style="margin-left: 100px;margin-top: -20px" slot="reference"><font
                        style="vertical-align: inherit;"><font
                        style="vertical-align: inherit;">
                      保留版本
                    </font></font><i class="right chevron icon"></i>
                    </div>
                  </el-popconfirm>
                </div>
              </div>
            </div>
            <div class="ui divided items">
              <div class="item">
                <div style="width:100px">
                  <i class="huge grey trash icon"></i>
                </div>
                <div class="content">
                  <a class="header label"><font style="vertical-align: inherit;"><font
                      style="vertical-align: inherit;">删除无元数据引用的文件</font></font></a>
                  <div class="meta">
                    <span class="cinema text"><font style="vertical-align: inherit;"><font
                        style="vertical-align: inherit;">这个操作将无元数据引用的对象文件移动至垃圾目录，受上个操作的影响</font></font></span>
<!--                  </div>-->
<!--                  <div class="description">-->
<!--                    <p></p>-->
<!--                  </div>-->
<!--                  <div class="extra">-->
                    <el-popconfirm
                        @confirm="deleteOrphan"
                        cancel-button-text="再考虑一下"
                        title="您是否已经知晓该操作带来的影响并执行？">
                      <div class="ui right floated primary button" style="margin-left: 100px;margin-top: -20px" slot="reference"><font
                          style="vertical-align: inherit;"><font
                          style="vertical-align: inherit;">
                        删除数据
                      </font></font><i class="right chevron icon"></i>
                      </div>
                    </el-popconfirm>
                  </div>
                </div>
              </div>
              <div class="ui divided items">
                <div class="item">
                  <div style="width:100px">
                    <i class="huge grey  wrench icon"></i>
                  </div>
                  <div class="content">
                    <a class="header label"><font style="vertical-align: inherit;"><font
                        style="vertical-align: inherit;">对象数据的检查和修复</font></font></a>
                    <div class="meta text">
                      <span class="cinema"><font style="vertical-align: inherit;"><font
                          style="vertical-align: inherit;">这个操作将全盘扫描，对可修复的对象文件进行修复操作</font></font></span>
<!--                    </div>-->
<!--                    <div class="description">-->

<!--                    </div>-->
<!--                    <div class="extra">-->
                      <el-popconfirm
                          @confirm="objectScanner"
                          cancel-button-text="再考虑一下"
                          title="您是否已经知晓该操作带来的影响并执行？">
                        <div class="ui right floated primary button" style="margin-left: 100px;margin-top: -20px" slot="reference"><font
                            style="vertical-align: inherit;"><font
                            style="vertical-align: inherit;">
                          全盘修复
                        </font></font><i class="right chevron icon"></i>
                        </div>
                      </el-popconfirm>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style="width: 90%;margin: 50px 0px 0px 80px"></div>

    <!--系统维护列表-->
    <div class="ui section divider"></div>
    <div style="text-align: left;margin-left: 120px">
      <div class="wrapper-header">
        <span>历</span>
        <span>史</span>
        <span>维</span>
        <span>护</span>
        <span>列</span>
        <span>表</span>
      </div>
    </div>

    <div class="block" style="text-align: left;margin-left: 80px;margin-top: 50px;width: 85%">
      <div v-if="operationSize===0" class="wrapper">
        <span>暂</span>
        <span>无</span>
        <span>数</span>
        <span>据</span>
      </div>
      <el-timeline  style="background-color: transparent;margin-left: 50px">
        <el-timeline-item color="#2185d0" :timestamp="operation.Date" placement="top"
                          v-for="(operation,i) in operationData" :key="i" >
          <el-card style="background-color: transparent;border: 0px solid transparent;box-shadow:none;">
            <el-timeline :reverse="reverse" v-for="(activity, index) in operation.Data" :key="index">
              <el-timeline-item
                  icon="el-icon-s-tools"
                  placement="top"
                  color='transparent'
                  size='large'
                  style="margin-left: -50px!important;"
                  :timestamp="activity.Time">
                <span style="color:#f9f9f9;">{{ activity.Operation }}</span>
              </el-timeline-item>
            </el-timeline>
          </el-card>
        </el-timeline-item>

      </el-timeline>
    </div>
    <!-- 分页组件 -->
    <el-pagination
        v-if="operationSize!==0"
        :page-size="5"
        :pager-count="11"
        background
        :current-page="1"
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :total="operationSize">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'System',
  data() {
    return {
      operation: "",
      error: false,
      complete: false,
      loading: false,
      styles: {
        width: '100%',
        height: "250px",
      },
      myChart: null,
      systemInfo: [],
      echartsData: [],
      reverse: true,
      operationData: [],
      operationSize: 0,
    }
  },
  mounted() {
    this.getVirtulData(new Date().getFullYear()) // 加载日历热力图
    this.getSystemInfo(0) // 获取系统信息
  },
  created() {
  },
  methods: {
    // 保留对象版本的操作
    deleteOldMetadata() {
      this.operation = "保留对象版本"
      // 弹出输入框 并校验数据为正整数
      this.$prompt('请选择需要保留的版本数量，此操作将对所有对象执行操作', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\d+$/,
        inputErrorMessage: '格式不正确'
      }).then(({value}) => {
        this.loading = true // 开启loading
        setTimeout(() => { // 延迟两秒发送请求
          this.$request.deleteOldMetadata(value).then(val => {
            this.loading = false // 关闭loading
            if (val.status === 200) {
              this.complete = true // 显示完成
            } else {
              this.error = true // 显示error
            }
          }).finally(() => {
            setTimeout(() => { // 发送请求成功后
              this.error = false // 关闭 错误
              this.complete = false // 关闭 完成显示
              this.getSystemInfo(0) // 重新获取维护列表数据第1页
            }, 2000);
          })
        }, 2000);
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '取消操作'
        // });
      });
    },

    // 删除无元数据引用的对象数据
    deleteOrphan() {
      this.operation = "删除数据"
      this.loading = true // 开启loading
      setTimeout(() => { // 延时2秒发送请求
        this.$request.deleteOrphan().then(val => {
          this.loading = false // 关闭loading
          if (val.status === 200) {
            this.complete = true // 显示完成
          } else {
            this.error = true // 显示error
          }
        }).finally(() => {
          setTimeout(() => { // 请求完成后2秒
            this.error = false // 关闭 错误
            this.complete = false // 关闭完成
            this.getSystemInfo(0) // 重新获取维护列表数据第1页
          }, 2000);
        })
      }, 2000);
    },

    // 全盘扫描修复
    objectScanner() {
      this.operation = "扫描修复"
      this.loading = true
      setTimeout(() => {
        this.$request.objectScanner().then(val => {
          this.loading = false // 关闭loading
          if (val.status === 200) {
            this.complete = true  // 显示完成
          } else {
            this.error = true // 显示error
          }
        }).finally(() => {
          setTimeout(() => { // 请求完成后2秒
            this.error = false // 关闭 错误
            this.complete = false // 关闭完成
            this.getSystemInfo(0) // 重新获取维护列表数据第1页
          }, 2000);
        })
      }, 2000);
    },

    // 获取系统维护信息
    getSystemInfo(index) {
      this.$request.systemInfo(index).then(async val => {
        if (val.status === 200) {
          // console.log(val.data.Operation)
          this.operationData = val.data.Operation.OperationData
          this.operationSize = val.data.Operation.OperationSize

          val.data.Put = this.numberFormat(val.data.Put)
          val.data.Obj = this.numberFormat(val.data.Obj)
          val.data.Uphold = this.numberFormat(val.data.Uphold)
          this.systemInfo = val.data
          var body = this.systemInfo.Echarts
          Object.keys(body).forEach((key, index) => {
            let data = []
            data[0] = key
            data[1] = body[key]
            this.echartsData.push(data)
          })
          this.getVirtulData(new Date().getFullYear()) // 加载日力图
        } else {
          this.$message.error("获取信息失败")
        }
      })
    },

    // 获取日历图
    getVirtulData(year) {
      year = year || '2017';
      var data = [];
      data = this.echartsData
      this.echartsView(year)
    },

    echartsView(year) {
      if (this.myChart != null && this.myChart !== "" && this.myChart !== undefined) {
        this.myChart.dispose();
      }

      this.myChart = this.$echarts.init(document.getElementById('main'))

      this.myChart.setOption({
        title: {
          top: 30,
          left: 'center',
          text: '上传日历热力图',
          textStyle: {
            color: '#a19e9e'
          }
        },
        // backgroundColor: 'transparent',
        tooltip: {
          position: 'top',
          formatter: function (p) {
            return p.data[0] + ' ：' + p.data[1] + '次';
          },
          backgroundColor: "#0a0a0a",
          borderWidth: 2,
          textStyle: {
            color: '#a19e9e'
          }
        },
        visualMap: {
          min: 0,
          max: 10000,
          type: 'piecewise',
          orient: 'horizontal',
          left: 'center',
          top: 65,
          textStyle: {
            color: "#a19e9e"
          }
        },
        calendar: {
          top: 120,
          left: 30,
          right: 30,
          cellSize: ['auto', 13],
          range: year,
          itemStyle: {
            borderWidth: 1,
            color: '#35383b'
          },
          yearLabel: {show: false},
          monthLabel: {
            color: "#a19e9e"
          },
          dayLabel: {
            color: "#a19e9e"
          }
        },
        series: {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: this.echartsData
        }
      })

      // 让图表跟随屏幕自动的去适应
      window.addEventListener('resize', () => {
        this.myChart.resize()
      })
    },

    // 分页函数
    handleCurrentChange(val) {    //分页的点击函数current-change，在currentPage 改变时会触发
      this.getSystemInfo(val - 1)
    },

    // 大数值的转换
    numberFormat(value) {
      var param = '';
      var k = 10000,
          sizes = ['', '万', '亿', '万亿'],
          i;
      if (value < k) {
        return value
      } else {
        i = Math.floor(Math.log(value) / Math.log(k));
        param += ((value / Math.pow(k, i))).toFixed(2);
        param += sizes[i];
      }
      return param;
    }
  }
}
</script>

<style lang="less" scoped>
.text {
  color: #b0adad !important;
}

.label {
  color: #d8cccc !important;
}
</style>