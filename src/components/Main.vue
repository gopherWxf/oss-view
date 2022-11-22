<!-- 首页 -->
<template>
  <div>
    <Rainbow></Rainbow>
    <div class="main">
      <div class="header">
        <Header></Header>
      </div>
      <div class="title">Simple Distributed Object Storage</div>
      <div class="sub-title">
        基于Golang实现的一个简单的分布式对象存储<span class="caret"></span>
      </div>
      <div class="wave1"></div>
      <div class="wave2"></div>
      <div>
        <el-button class="to-btn" type="primary" @click="toConsole">进入控制台</el-button>
        <el-button class="to-btn" type="primary" @click="toDoc">帮助文档</el-button>
      </div>

    </div>
  </div>
</template>

<script>
import Content from "@/components/Content.vue";
import Header from "@/components/Header.vue";
import Rainbow from "@/components/Rainbow"
import Footer from "@/components/Footer"

export default {
  name: "Main",
  components: {
    Content,
    Header,
    Rainbow,
    Footer
  },
  data() {
    return {
      size: "40%"
    };
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    // 跳转到excessive过渡动画
    toConsole() {
      this.$router.push("/excessive")
    },
    // 跳转到文档链接
    toDoc() {
      window.open("https://github.com/gopherWxf", '_blank')
    }
  }
};
</script>
<style lang="less" scoped>
.main {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  color: white;
  position: relative;

  .title {
    margin-top: 20px;
    font-size: 40px;
  }

  .to-btn {
    margin-top: 50px;
    background-color: Transparent;
    background-repeat: no-repeat;
    border: none;
    cursor: pointer;
    overflow: hidden;
    border: 0.1rem white solid;
    font-weight: 800;
  }

  .to-btn:hover {
    background-color: white;
    color: black;
  }

  .caret {
    animation-name: flash;
    width: 4px;
    height: 20px;
    background-color: #fff;
    margin-left: 5px;
    // margin-bottom: 12px;
    animation-duration: 3s;
    animation-fill-mode: both;
    animation-iteration-count: infinite;
    display: inline-block;
    vertical-align: bottom;
  }

  .sub-title {
    font-size: 20px;
    margin: 30px 10px 0px 10px;
  }
}

// PC
@media only screen and (min-width: 768px) {
  .main {
    width: 100%;
    height: 100vh;
    line-height: 20px;
    object-fit: contain;

    .header {
      top: 0;
      position: absolute;
      width: 100%;
      padding: 20px 150px;
    }
  }
}

// 移动端
@media only screen and (max-width: 768px) {
  .main {
    width: 100%;
    height: 100vh;
    line-height: 50px;
    object-fit: contain;

    .header {
      top: 0;
      position: absolute;
      width: 100%;
      padding: 20px 40px;
    }
  }
}
</style>
