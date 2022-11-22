<template>
  <div class="bucket">
    <p style="text-align: left;margin-left: 20px;font-size: 20px;color:#b0adad;font-weight: bolder;margin-top: -20px">
      桶管理</p>
    <div class="ui two statistics">
      <div class="statistic">
        <div class="search-view">
          <div class="ui center aligned basic segment">
            <div class="column">
              <div class="ui inverted icon header">
                <i class="search icon"></i>
                <div class="wrapper-header">
                  <span>S</span>
                  <span>e</span>
                  <span>a</span>
                  <span>r</span>
                  <span>c</span>
                  <span>h</span>
                  &nbsp;
                  <span>B</span>
                  <span>u</span>
                  <span>c</span>
                  <span>k</span>
                  <span>e</span>
                  <span>t</span>
                </div>
              </div>
              <div class="field">
                <div class="ui  search">
                  <div class="ui icon input">
                    <!--搜索输入框-->
                    <input v-model.trim="searchContent" @input="getBucket(searchContent,1)" class="prompt" type="text"
                           placeholder="Input Bucket Name">
                    <i class="search icon"></i>
                  </div>
                  <div class="results"></div>
                </div>
              </div>
            </div>
            <div class="ui inverted horizontal divider" style="margin-top: 50px;margin-bottom: 50px"><font
                style="vertical-align: inherit"><font
                style="vertical-align: inherit;">
              Or
            </font></font></div>
            <div class="column">
              <div class="ui inverted icon header">
                <i class="cloud icon"></i>
                <div class="wrapper-header">
                  <span>A</span>
                  <span>d</span>
                  <span>d</span>
                  &nbsp;
                  <span>B</span>
                  <span>u</span>
                  <span>c</span>
                  <span>k</span>
                  <span>e</span>
                  <span>t</span>
                </div>
              </div>
              <div class="field">
                <div class="ui action input" style="max-width: 100%">
                  <input v-model.trim="bucketName" type="text" placeholder="Add Bucket..."
                         style="border-radius: 500rem 0px 0px 500rem!important">
                  <button class="ui teal button" @click="addBucket(bucketName)"
                          style="border-radius: 0px 500rem 500rem 0px;border: 0px!important">
                    <i class="cloud icon"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div class="statistic">
        <div class="bucket-view">
          <div class="option-group">
            <div class="option-container" @change="onChange">
              <input class="option-input" checked id="option-1" type="radio" name="options"
                     :disabled="bucketData[0] === undefined"/>
              <input class="option-input" id="option-2" type="radio" name="options"
                     :disabled="bucketData[1] === undefined"/>

              <label class="option" for="option-1"
                     :style="(bucketData[0]===undefined?'background: transparent;color: whitesmoke':'')">

                <span class="option__indicator"></span>
                <span class="option__label">{{ (bucketData[0] === undefined ? "待添加..." : bucketData[0]) }}</span>
              </label>

              <label class="option" for="option-2"
                     :style="(bucketData[1]===undefined?'background: transparent;color: whitesmoke':'')">
                <span class="option__indicator"></span>
                <span class="option__label">{{ (bucketData[1] === undefined ? "待添加..." : bucketData[1]) }}</span>
              </label>

            </div>
          </div>
          <div class="option-group" id="option-group2">
            <div class="option-container" @change="onChange">

              <input class="option-input" id="option-3" type="radio" name="options"
                     :disabled="bucketData[2] === undefined"/>
              <input class="option-input" id="option-4" type="radio" name="options"
                     :disabled="bucketData[3] === undefined"/>

              <label class="option" for="option-3"
                     :style="(bucketData[2]===undefined?'background: transparent;color: whitesmoke':'')">
                <span class="option__indicator"></span>
                <span class="option__label">{{ (bucketData[2] === undefined ? "待添加..." : bucketData[2]) }}</span>
              </label>

              <label class="option" for="option-4"
                     :style="(bucketData[3]===undefined?'background: transparent;color: whitesmoke':'')">
                <span class="option__indicator"></span>
                <span class="option__label">{{ (bucketData[3] === undefined ? "待添加..." : bucketData[3]) }}</span>
              </label>

            </div>
          </div>
        </div>

        <div id="container" style="margin-top: 20px">
          <button class="learn-more" @click="toOssAdmin" :disabled="bucketData.length===0"
                  :style="(bucketData.length===0 ? 'opacity: 0.6;cursor:not-allowed;':'')">
              <span class="circle" aria-hidden="true">
                <span class="icon arrow"></span>
              </span>
            <span class="button-text">进入桶</span>
          </button>
          <button class="learn-more" @click="deleteButton" :disabled="bucketData.length===0"
                  :style="(bucketData.length===0 ? 'opacity: 0.6;cursor:not-allowed;':'')">
              <span class="circle" aria-hidden="true">
                <span class="icon arrow"></span>
              </span>
            <span class="button-text">删除桶</span>
          </button>
        </div>

        <!-- 删除模态框 -->
        <div class="ui small basic test modal transition  ">
          <div class="ui icon header">
            <i class="trash alternate icon"></i><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
            删除桶
          </font></font></div>
          <div class="content">
            <p><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">删除桶后，桶内数据将一并删除，您确认操作吗？</font></font></p>
          </div>
          <div class="actions">
            <div class="ui red basic cancel inverted button">
              <i class="remove icon"></i><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
              不
            </font></font></div>
            <div class="ui green ok inverted button" @click="deleteBucket">
              <i class="checkmark icon"></i><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
              是的
            </font></font></div>
          </div>
        </div>

        <el-pagination
            style="margin-top: 20px"
            v-if="bucketDataSize!==0"
            :page-size="4"
            :pager-count="5"
            background
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :total="bucketDataSize">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery"
export default {
  name: "Bucket",
  inject: ['reload'],
  data() {
    return {
      bucketDataSize: 0,// 数据总条数 ，分页组件使用
      bucketData: [],// 桶数据列表
      searchContent: "", // 搜索框
      bucketName: "",// 新增输入框
      radio: "" // 复选框选中数据值
    }
  },
  mounted() {
  },
  created() {
    this.searchContent = ""
    this.getBucket(this.searchContent, 1)
  },
  methods: {
    // 切换复选框的操作
    onChange(event) {
      var id = event.target.id.replace("option-", "");
      this.radio = this.bucketData[id - 1]
    },
    // 无感跳转
    toOssAdmin() {
      sessionStorage.setItem("bucketName", this.radio)
      this.reload();
    },
    deleteButton() {
      $('.ui.basic.modal')
          .modal('show')
      ;

    },
    deleteBucket(){
      this.$request.delBucket(encodeURI(this.radio)).then(val => {
        if (val.status === 200) {
          this.$message.success("删除桶成功")
        } else {
          this.$message.error("删除桶失败")
        }
      }).finally(() => {
        this.bucketName = ""
        this.getBucket(this.searchContent, 1)
      })
    },
    // 获取桶列表
    getBucket(name, index) {
      this.$request.getBucketList(index, encodeURI(name)).then(val => {
        if (val.status === 200) {
          if (val.data.size !== 0) {
            this.bucketDataSize = val.data.size
            this.bucketData = val.data.data;
          } else {
            this.bucketDataSize = 0
            this.bucketData = [];
          }
        } else {
          this.$message.error("获取桶列表失败")
        }
      }).finally(() => { // 获取桶后 默认将第一个桶名作为被选项
        this.radio = this.bucketData[0]
      })
    },
    //分页切换函数
    handleCurrentChange(val) {    //分页的点击函数current-change，在currentPage 改变时会触发
      this.getBucket(this.searchContent, val)
    },
    // 新增桶
    addBucket(bucketName) {
      if (bucketName === "") {
        this.$message.error("桶名称不得为空")
        return
      }
      if (bucketName.length > 5 ) {
        this.$message.error("桶名称不能超过5个字符")
        return
      }
      var headerParam = encodeURI(bucketName)
      this.$request.addBucket(headerParam).then(val => {
        if (val.status === 201) {
          this.$message.success("创建桶成功")
        } else {
          this.$message.error("创建桶失败")
        }
      }).finally(() => {
        this.bucketName = ""
        this.getBucket(this.searchContent, 1)
      })
    },
  }
}
</script>

<style scoped>
.bucket {
  width: 100%;
  margin: auto;
}

.option-group {
  width: 90%;
  max-width: 400px;
  height: 150px;
  position: relative;
  overflow: hidden;
  border-radius: 0.25em;
  font-size: 20px;
  margin: 0.2em auto;
  transform: translateZ(0);
}

.option-container {
  display: flex;
  justify-content: center;
  align-items: stretch;
  width: 120%;
  height: 100%;
  margin: 0 -10%;
}

.option {
  overflow: hidden;
  flex: 1;
  display: block;
  padding: 0.5em;
  background: linear-gradient(to bottom, #6d91f0, #b8d1d6);
  /*background: #FFF;*/
  position: relative;
  margin: 0em;
  margin-right: 0.2em;
  border-radius: 0.25em;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  flex-direction: column;
  cursor: pointer;
  opacity: 0.5;
  transition-duration: 0.8s, 0.6s;
  transition-property: transform, opacity;
  transition-timing-function: cubic-bezier(0.98, 0, 0.22, 0.98), linear;
  will-change: transform, opacity;
}

.option:last-child {
  margin-right: 0;
}

.option__indicator {
  display: block;
  transform-origin: left bottom;
  transition: inherit;
  will-change: transform;
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  left: 0.5em;
}

.option__indicator:before,
.option__indicator:after {
  content: '';
  display: block;
  border: solid 2px #64D6EE;
  border-radius: 50%;
  width: 0.25em;
  height: 0.25em;
  position: absolute;
  top: 0;
  right: 0;
}

.option__indicator:after {
  background: #64D6EE;
  transform: scale(0);
  transition: inherit;
  will-change: transform;
}

.option-input {
  position: absolute;
  top: 0;
  z-index: -1;
  visibility: hidden;
}

.option__label {
  display: block;
  width: 100%;
  text-transform: uppercase;
  font-size: 1.5em;
  font-weight: bold;
  transform-origin: left bottom;
  transform: translateX(20%) scale(0.7);
  transition: inherit;
  will-change: transform;
}

.option__label sub {
  margin-left: 0.25em;
  font-size: 0.4em;
  display: inline-block;
  vertical-align: 0.3em;
}

.option__label:after {
  content: '';
  display: block;
  border: solid 2px #fbfbfb;
  width: 100%;
  margin-top: 20px;
  transform-origin: 0 0;
  transform: scaleX(0.2);
  transition: inherit;
  will-change: transform;
}

.option:last-child .option__label {
  transform: translateX(0%) scale(0.7);
}

.option:last-child .option__indicator {
  transform: translateX(-20%);
}

.option-input:checked ~ .option {
  transform: translateX(-20%) translateX(0.2em);
}

.option-input:checked ~ .option .option__indicator {
  transform: translateX(0%);
}

.option-input:checked ~ .option .option__label {
  transform: translateX(40%) scale(0.7);
}

.option-input:first-child:checked ~ .option {
  transform: translateX(20%) translateX(-0.2em);
}

.option-input:first-child:checked ~ .option .option__indicator {
  transform: translateX(-40%);
}

.option-input:first-child:checked ~ .option .option__label {
  transform: translateX(0%) scale(0.7);
}

.option-input:nth-child(1):checked ~ .option:nth-of-type(1),
.option-input:nth-child(2):checked ~ .option:nth-of-type(2) {
  opacity: 1;
}

.option-input:nth-child(1):checked ~ .option:nth-of-type(1) .option__indicator,
.option-input:nth-child(2):checked ~ .option:nth-of-type(2) .option__indicator {
  transform: translateX(0);
}

.option-input:nth-child(1):checked ~ .option:nth-of-type(1) .option__indicator::after,
.option-input:nth-child(2):checked ~ .option:nth-of-type(2) .option__indicator::after {
  transform: scale(1);
}

.option-input:nth-child(1):checked ~ .option:nth-of-type(1) .option__label,
.option-input:nth-child(2):checked ~ .option:nth-of-type(2) .option__label,
.option-input:nth-child(1):checked ~ .option:nth-of-type(1) .option__label::after,
.option-input:nth-child(2):checked ~ .option:nth-of-type(2) .option__label::after {
  transform: scale(1);
}

button {
  position: relative;
  display: inline-block;
  cursor: pointer;
  outline: none;
  border: 0;
  vertical-align: middle;
  text-decoration: none;
  background: transparent;
  padding: 2px;
  font-size: inherit;
  font-family: inherit;
}

button.learn-more {
  width: 10rem;
  height: auto;
}

button.learn-more .circle {
  transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
  position: relative;
  display: block;
  margin: 0;
  width: 3rem;
  height: 3rem;
  background: #282936;
  border-radius: 1.625rem;
}

button.learn-more .circle .icon {
  transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  background: #fff;
}

button.learn-more .circle .icon.arrow {
  transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
  left: 0.625rem;
  width: 1.125rem;
  height: 0.125rem;
  background: none;
}

button.learn-more .circle .icon.arrow::before {
  position: absolute;
  content: "";
  top: -0.25rem;
  right: 0.0625rem;
  width: 0.625rem;
  height: 0.625rem;
  border-top: 0.125rem solid #fff;
  border-right: 0.125rem solid #fff;
  transform: rotate(45deg);
}

button.learn-more .button-text {
  transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0.75rem 0;
  margin: 0 0 0 1.85rem;
  color: #959598;
  font-weight: 700;
  line-height: 1.6;
  text-align: center;
  text-transform: uppercase;
}

button:hover .circle {
  width: 100%;
}

button:hover .circle .icon.arrow {
  background: #fff;
  transform: translate(1rem, 0);
}

button:hover .button-text {
  color: #fff;
}

@supports (display: grid) {
  body {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 0.625rem;
    grid-template-areas: ". main main ." ". main main .";
  }

  #container {
    grid-area: main;
    align-self: center;
    justify-self: center;
  }
}
</style>