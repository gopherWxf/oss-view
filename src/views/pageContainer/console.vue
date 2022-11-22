<!-- 页面的主容器 -->
<template>
  <div class='console'>
    <el-container direction="vertical">
      <div class="header">
        <div class="header-left-box">
          <img src="../../assets/img/logo.png.bak" alt="">
          <div style="font-size: 20px;color: #99a9bf"> Gopher 对象存储控制台</div>
        </div>
        <div id="container" style="margin-right: 30px">
          <button class="learn-more" @click="toHome">
              <span class="circle" aria-hidden="true">
                <span class="icon arrow"></span>
              </span>
            <span class="button-text">回到首页</span>
          </button>
        </div>
      </div>

      <el-header>
        <headers>
          <nav>
            <ul>
              <li v-for="(item,index) in tabsList" @click="onAddClass(index)" >
                <router-link id="overview" :to="item.to" :class="{'active':index === orderNum}">{{item.name}}</router-link>
              </li>
            </ul>
          </nav>
        </headers>
      </el-header>

      <el-main style="padding: 20px 20px 20px 20px">
        <router-view v-if="isRouterAlive"></router-view>
      </el-main>

      <el-footer>
        <Footer></Footer>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
// 引入组件
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Overview from '@/components/Overview.vue'
import OssAdmin from '@/components/OssAdmin.vue'
import System from '@/components/System.vue'
import $ from 'jquery'

export default {
  name: 'console',
  components: {
    //组件名
    Header,
    Footer,
    Overview,
    OssAdmin,
    System
  },
  provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true,   //控制视图是否显示的变量
      tabsList: [ // tab切换按钮选项
        {name: '节点监控', num: 0, to: "/overview"},
        {name: '桶/对象管理', num: 1, to: "/ossAdmin"},
        {name: '系统维护', num: 2, to: "/system"},
        {name: '日志管理', num: 3, to: "/log"}
      ],
      orderNum:0
    }
  },
  computed: {},
  watch: {},
  methods: {
    reload() {
      this.isRouterAlive = false;   //先关闭，
      this.$nextTick(function () {
        this.isRouterAlive = true;  //再打开
      })
    },
    toHome() {
      this.$router.push("/")
    },
    onAddClass(i){
      this.orderNum = i;
    }
  },
  created() {
  },

  mounted() {
    // 路由与导航列表匹配则高亮
    for (const index in this.tabsList) {
      if (this.tabsList[index].to === this.$route.path.toString()){
        this.orderNum= this.tabsList[index].num
      }
    }
  }
}
</script>

<style lang='less' scoped>
.console {
  min-height: 100vh;
  overflow: auto;
  background: #1A1E23;
  font-family: 'Lato', sans-serif;
  -webkit-font-smoothing: antialiased;

  .el-container.is-vertical {
    height: 100%;
  }

  .header {
    display: flex;
    align-items: center;
    color: whitesmoke;
    justify-content: space-between;
    background-color: Transparent;
    background-repeat: no-repeat;
    border: none;
    cursor: pointer;
    overflow: hidden;

    .header-left-box {
      margin: 10px 0px 25px 25px;
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: bold;

      img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
      }

      div {
        margin-left: 10px;
      }
    }
  }

  .el-header {
    headers {
      background-color: #181a1b;
      border-radius: 90px;
      box-shadow: 1px 1px 0 rgba(255, 255, 255, 0.05), inset 1px 1px 1px rgba(0, 0, 0, 0.3);
      left: 50%;
      max-width: 97%;
      position: absolute;
      margin-top: 20px;
      transform: translate(-50%, -50%);
      width: 100%;
    }

    nav {
      border-radius: 90px;
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
      margin: 0.5em;
    }

    ul {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    ul a {
      background-color: #35393b;
      color: #fff;
      display: block;
      line-height: 10px;
      padding: 10px;
      text-align: center;
      text-decoration: none;
      transition: all 100ms ease-out;
    }

    ul a:hover, ul a:active, ul a.active {
      background-color: #2185d0;
      box-shadow: inset 0 -0.3em 0 rgba(0, 0, 0, 0.3);
      margin-top: -0.3em;
      padding-bottom: 1.3em;
      position: relative;
    }

    ul a:hover:after, ul a:active:after, ul a.active:after {
      background-color: rgba(0, 0, 0, 0.05);
      border-bottom: 1px solid #2185d0;
      bottom: -0.5em;
      content: "";
      display: block;
      left: 0;
      position: absolute;
      right: 0;
      top: 0.3em;
    }

    ul li {
      flex: 1;
    }

    ul li + li {
      box-shadow: -2px 0 0 rgba(0, 0, 0, 0.2), -1px 0 0 rgba(255, 255, 255, 0.15);
    }

    ul li:first-child a {
      border-top-left-radius: 90px;
      border-bottom-left-radius: 90px;
    }

    ul li:first-child a:hover:after, ul li:first-child a:active:after, ul li:first-child a.active:after {
      border-top-left-radius: inherit;
      border-bottom-left-radius: inherit;
      left: -0.5em;
    }

    ul li:last-child a {
      border-top-right-radius: 90px;
      border-bottom-right-radius: 90px;
    }

    ul li:last-child a:hover:after, ul li:last-child a:active:after, ul li:last-child a.active:after {
      border-top-right-radius: inherit;
      border-bottom-right-radius: inherit;
      right: -0.5em;
    }

    .el-container.is-vertical {
      height: 100%;
    }
  }

  .el-footer {
    color: gray;
    text-align: center;
    line-height: 50px;
  }

  .el-main {
    margin-top: 10px;
    color: #333;
    text-align: center;
    padding: 0;
    overflow-x: hidden;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
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
    padding: 0;
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
}
</style>
