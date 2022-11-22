<!-- 首页内容组件 -->
<template>
  <div class="content">
    <div class="title">产品特点</div>
    <div class="ui two column grid container">
      <!-- 遍历表格数据 -->
      <div class="column" v-for="(item, index) in list" :key="index">
        <div class="ui items">
          <div class="item">
            <a class="ui mini image">
              <img :src="item.image"/>
            </a>
            <div class="content">
              <a class="header">{{ item.header }}</a>
              <div class="description" style="color: grey">
                <p>
                  {{ item.text }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Content",
  components: {},
  data() {
    return {
      list: [
        {
          image: "https://pic.imgdb.cn/item/624afcab239250f7c5e04d5b.png",
          header: "易扩展",
          text: "存储空间无上限的同时也无需担心扩容问题，能够实现存储需求的弹性伸缩",
        },
        {
          image: "https://pic.imgdb.cn/item/624afd82239250f7c5e274d7.png",
          header: "高可靠",
          text: "4+2RS纠删码存储方案,跨数据中心的副本冗余，定期或手动数据恢复，保证高可用性",
        },
        {
          image: "https://pic.imgdb.cn/item/624afcdf239250f7c5e0d0ac.png",
          header: "版本控制",
          text: "通过SHA-256散列函数和Elasticsearch记录对象元数据，是对象存储系统高可用的基石",
        },
        {
          image: "https://pic.imgdb.cn/item/624afcf5239250f7c5e10c6d.png",
          header: "数据校验去重",
          text: "消除重复数据多余副本，极好地实现节省存储空间、提升存储利用率",
        },
        {
          image: "https://pic.imgdb.cn/item/624afd11239250f7c5e15717.png",
          header: "数据压缩",
          text: "用gzip实现对象存储和下载时的数据压缩，进一步节省网络带宽和存储空间",
        },
        {
          image: "https://pic.imgdb.cn/item/624afcc2239250f7c5e088d1.png",
          header: "断点续传",
          text: "提供断点续传功能，允许客户端从某个检查点开始上传或者下载对象",
        },
      ],
    };
  }
};
</script>
<style lang="less" scoped>
@media only screen and (min-width: 768px) {
  .content {
    margin-top: 30px;
    margin-left: 250px;
    margin-right: 250px;
    padding-bottom: 30px;
    text-align: left;
  }

  .title {
    font-size: 25px;
    font-weight: bold;
    text-align: center;
    margin: 00px 20px 30px 20px;
  }

  .pc-hide {
    display: none;
  }
}

@media only screen and (max-width: 768px) {
  .content {
    padding: 0 10px 20px;
    margin: 1.875rem;
  }

  .poster {
    img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      display: block;
    }
  }

  .title {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    margin: 10px 0;
  }

  .moiblie-hide {
    display: none;
  }
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
