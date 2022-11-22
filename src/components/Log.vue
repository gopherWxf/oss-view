<template>
  <div class="log">
    <div class="search_group">
      <!--         style="display: flex;justify-content:space-around;align-items:center;margin-bottom: 20px;max-width: 100%">-->
      <div class="ui  grid " style="width: 100%">
        <div class="five column row">
          <div class="three wide column">
            <el-dropdown @command="handleCommand">
            <span>
              <button class="ui inverted grey basic button" style="width: 100%;margin: 0">
                  <font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                    <span>日志级别<span v-if="this.level !=='' ">:{{ level }}</span></span>
                  </font></font>
              </button>
            </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="">全部</el-dropdown-item>
                <el-dropdown-item command="TRACE">TRACE</el-dropdown-item>
                <el-dropdown-item command="INFO">INFO</el-dropdown-item>
                <el-dropdown-item command="WARN">WARN</el-dropdown-item>
                <el-dropdown-item command="ERROR">ERROR</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="three wide column">
            <div class="ui small inverted transparent input" style="width: 100%;margin: 0">
              <input type="text" v-model.trim="osName" placeholder="机器名...">
            </div>
          </div>
          <div class="three wide column">
            <div class="ui small inverted transparent input" style="width: 100%;margin: 0">
              <input type="text" v-model.trim="content" placeholder="日志关键词...">
            </div>
          </div>
          <div class="four wide column">
            <div class="block">
              <el-date-picker
                  style="width: 100%"
                  v-model="dataTimeValue"
                  type="datetimerange"
                  :default-time="['00:00:00', '23:59:00']"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </div>
          <div class="three wide column" style="width: 100%">
            <div class="ui buttons">
              <button @click="clear" class="ui button"><font style="vertical-align: inherit;"><font
                  style="vertical-align: inherit;">清空条件</font></font></button>
              <div class="or"></div>
              <button @click="getLog(1)" class="ui blue button"><font style="vertical-align: inherit;"><font
                  style="vertical-align: inherit;">查询</font></font></button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="log_content">
      <table class="ui very compact celled inverted  padded table">
        <thead>
        <tr>
          <th class="three wide">机器</th>
          <th class="one wide">级别</th>
          <th class="three wide">时间</th>
          <th class="ten wide">内容</th>
        </tr>
        </thead>
        <tbody v-for="(item, index) in logData" :key="index">
        <tr>
          <td>
            {{ item.osName }}
          </td>
          <td>
            <a v-if="item.level==='INFO'" class="ui blue label"><font style="vertical-align: inherit;"><font
                style="vertical-align: inherit;">{{ item.level }}</font></font></a>
            <a v-if="item.level==='ERROR'" class="ui red label"><font style="vertical-align: inherit;"><font
                style="vertical-align: inherit;">{{ item.level }}</font></font></a>
            <a v-if="item.level==='WARN'" class="ui orange label"><font style="vertical-align: inherit;"><font
                style="vertical-align: inherit;">{{ item.level }}</font></font></a>
            <a v-if="item.level==='TRACE'" class="ui black label"><font style="vertical-align: inherit;"><font
                style="vertical-align: inherit;">{{ item.level }}</font></font></a>
          </td>
          <td>
            {{ item.dateTime |dateFilter("yyy-mm-dd hh:mm:ss") }}
          </td>
          <td>
            {{ item.content }}
          </td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
          <th colspan="4">
            显示20条
          </th>
        </tr>
        </tfoot>
      </table>
      <!--
        分页组件
       1、在列表数据tableData长度为0的时候不显示
       2、约定每页显示5条
       3、总条数total为 tableDataSize
       4、切换页码的函数为handleCurrentChange
       --><!--          v-if="logData.length !==0 & logData.size!==0"-->
      <el-pagination
          style="margin-top: 20px"
          :page-size="20"
          :pager-count="11"
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="logDataSize">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "Log",
  data() {
    return {
      level: "",// 查询级别
      osName: "",// 查询主机名
      content: "",// 查询日志内容
      dataTimeValue: [],
      dataTime: {
        from: "",
        to: ""
      },//查询日志时间范围
      logDataSize: 0,
      logData: {} // 日志数据
    }
  },
  mounted() {
    this.getLog(1)
  },
  methods: {
    clear() { // 清除搜索条件
      this.level = ""
      this.osName = ""
      this.content = ""
      this.dataTimeValue = []
    },
    handleCommand(command) { // 下拉框选项
      this.level = command
    },

    handleCurrentChange(val) {    //分页的点击函数current-change，在currentPage 改变时会触发
      console.log(val)
      this.getLog(val)
    },
    splitParam() {
      let paramData = Object.create(null)
      if (this.level !== "") {
        paramData["level"] = this.level
      }
      if (this.osName !== "") {
        paramData["osName"] = this.osName
      }
      if (this.content !== "") {
        paramData["content"] = this.content
      }
      if (this.dataTimeValue.length !== 0) {
        var dateTime = {
          "from": Math.trunc(this.dataTimeValue[0].getTime() / 1000),
          "to": Math.trunc(this.dataTimeValue[1].getTime()/ 1000)
        }
        paramData["dateTime"] = dateTime
      }
      return paramData
    },
    async getLog(index) {
      // 拼接参数
      this.logData = []
      var data = await this.splitParam();
      this.$request.getLog(index, data).then(value => {
        this.logDataSize = value.data.size
        this.logData = value.data.data
      })
    },
  },
  // 日期格式化
  filters: {
    dateFilter: function (value) {
      var date = new Date(value * 1000);
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
      return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    }
  }
}
</script>

<style lang="less">
.log {
  width: 100%;

  .search_group {
    margin-bottom: 30px;
    width: 100%;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .ui.transparent.input {
    //width: 200px;
    max-width: 200px;
    border: 0.22rem solid #8d8f91 !important;
    border-radius: 0.28571429rem;
    padding: 8px;
  }

  .el-range-editor.el-input__inner {
    border: 0.22rem solid #8d8f91 !important;
    border-radius: 0.28571429rem;
    height: 39px;
    background-color: transparent;
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;

  }

  .el-date-editor .el-range-separator {
    padding: 0 !important;
    line-height: 25px !important;
    color: #6a6767;
  }

  .el-range-editor .el-range-input {
    background-color: transparent;
    line-height: 1;
    color: whitesmoke !important;
  }

}

</style>