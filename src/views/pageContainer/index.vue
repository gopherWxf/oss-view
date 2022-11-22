<!-- 页面的主容器 -->
<template>
  <div class='pageContainer'>
    <el-container>
      <el-main>
        <Main></Main>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// 引入组件
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Main from '@/components/Main.vue'

export default {
  name: 'pageContainer',
  components: {
    //组件名
    Header,
    Footer,
    Main
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  methods: {},
  created() {

  },
  mounted() {

  }
}
</script>
<style lang='less' scoped>
.pageContainer {
  height: 100%;
  overflow: auto;

  .el-container.is-vertical {
    height: 100%;
  }

  .el-header {
    background-color: #1b1c1d;
    padding: 10px 20px 10px 20px;
    height: 4rem !important;
  }

  .el-footer {
    //background-color: #1b1c1d;
    color: gray;
    text-align: center;
    border-top: 1px solid #e7e7e7;
    line-height: 20px;
    /* height: 80px !important; */
    padding-top: 20px;
  }

  .el-main {
    background-color: white;
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

}
</style>
