<!-- 头部组件 -->
<template>
  <div>
    <div class='header'>
      <div class="header-left-box">
        <img src="../assets/img/logo.png.bak" alt="">
        <div style="font-size: 20px;">Gopher</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Header',
  data() {
    return {}
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {}
}
</script>
<style lang='less' scoped>
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
</style>
