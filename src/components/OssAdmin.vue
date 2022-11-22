<!--对象管理-->
<template>
  <div class="ossadmin">
    <Loading v-if="loading"></Loading>
    <Bucket class="bucket" v-if="!objectInfoShow&&!loading"></Bucket>

    <!--  切换桶的操作  -->
    <div class="object" v-if="objectInfoShow&&!loading">
      <div style="display: flex;align-items: center;justify-content:space-between;margin: -20px 20px 0px 20px">
        <div style="left:0;text-align: left;font-size: 20px;color:#b0adad;font-weight: bolder">对象管理</div>
        <div class="ui left labeled button" tabindex="0" style="margin-left: 25px;">
          <a class="ui right pointing  label" style="background: #bdbdbd"><font style="vertical-align: inherit;"><font
              style="vertical-align: inherit;">
            当前桶：{{ bucketName }}
          </font></font></a>
          <div class="ui basic  button" @click="switchBucket()">
            <i class="exchange icon"></i><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">切换桶
          </font></font></div>

        </div>
      </div>
      <!-- 查找 and 上传-->
      <div class="ui  placeholder segment" style="background-color: transparent">
        <div class="ui two column stackable center aligned grid">
          <div class="ui inverted vertical divider">Or</div>
          <div class="middle aligned row">
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
                  <span>O</span>
                  <span>b</span>
                  <span>j</span>
                  <span>e</span>
                  <span>c</span>
                  <span>t</span>
                </div>
              </div>
              <div class="field">
                <div class="ui search">
                  <div class="ui icon input">
                    <!--搜索输入框-->
                    <input v-model.trim="content" @input="getObjList(content,1)" class="prompt" type="text"
                           placeholder="Input Object Name">
                    <i class="search icon"></i>
                  </div>
                  <div class="results"></div>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="gradient">
                <el-upload
                    weight="100%"
                    ref="upload"
                    action=""
                    class="upload-demo"
                    drag
                    :http-request="uploadRequest"
                    multiple>
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text" style="color: #d8cccc">拖拽或<em>点击上传</em></div>
                </el-upload>
              </div>

              <div style="display: flex;align-items: center;justify-content: space-evenly;margin-top: 10px">
              <span v-if="uploadProgressShow" :style="{'width': (uploadSliceFlag? '20%':'15%')}" style="color: #b0adad"><span
                  v-if="uploadSliceFlag">分片</span>上传进度：</span>
                <el-progress v-if="uploadProgressShow" :style="{'width': (uploadSliceFlag? '80%':'85%')}"
                             :text-inside="true"
                             :stroke-width="15"
                             :percentage="progressPercent"></el-progress>
                <span v-if="hashProgressShow" style="width:20%;color: #b0adad">上传前准备工作：</span>
                <el-progress v-if="hashProgressShow" style="width:80%" :text-inside="true"
                             :stroke-width="15"
                             :percentage="hashProgressPercent"></el-progress>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--  对象信息列表  -->
      <table class="ui seven column  selectable inverted table" style="margin-top: 10px">
        <thead>
        <tr>
          <th class="two wide"><font style="vertical-align: inherit;"><font
              style="vertical-align: inherit;">对象名称</font></font>
          </th>
          <th class="two wide"><font style="vertical-align: inherit;"><font
              style="vertical-align: inherit;">版本号</font></font>
          </th>
          <th class="two wide"><font style="vertical-align: inherit;"><font
              style="vertical-align: inherit;">大小</font></font>
          </th>
          <th class="five wide"><font style="vertical-align: inherit;"><font
              style="vertical-align: inherit;">对象散列值</font></font>
          </th>
          <th class="two wide" style="text-align: center"><font style="vertical-align: inherit;"><font
              style="vertical-align: inherit;">操作</font></font>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="tableData.Size === 0">
          <td><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
            暂无数据
          </font></font>
          </td>
        </tr>

        <tr v-for="(item,index) in tableData.Data" :key="index">
          <td>
          <span
              style="max-width: 200px;word-break:normal;width:auto;display:block;white-space:pre-wrap;word-wrap : break-word ;overflow: hidden ;">{{item.Name }}</span>
          </td>
          <td class="single line">
            {{ item.Version }}
            <div style="display:inline-block;margin-left: 5px" v-if="item.Size === '0B'">
              <el-tooltip class="item" effect="dark"
                          content="包含此标签代表对象该版本为删除标记，但仍可以查看历史版本"
                          placement="left-start">
                <el-tag size="mini" style="background-color: #7c7b7b;border: #848181;color: #ffffff">
                  <i class="el-icon-delete"></i>
                </el-tag>
              </el-tooltip>
            </div>
          </td>
          <td class="single line"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
            {{ (item.Size !== '0B' ? item.Size : '/') }}
          </font></font>
          </td>

          <td>
          <span
              style="max-width: 400px;word-break:normal;width:auto;display:block;white-space:pre-wrap;word-wrap : break-word ;overflow: hidden ;">{{(item.Size !== '0B' ? item.Hash : '/') }}</span>
          </td>

          <td style="display: grid;place-items: center;width: 100%">
            <div class="multi-button">
              <button @click="copyPath(index, item)" :data-clipboard-text="objPath" id="last" :disabled="(item.Size === '0B'? true:false)"
                      :style="(item.Size === '0B'? 'opacity: 0.6;cursor:not-allowed;':'')">
                <i class=" copy icon"></i>
                <div class="animate-normal ">复制链接</div>
              </button>
              <button @click="handleDownload(index, item)" :disabled="(item.Size === '0B'? true:false)"
                      :style="(item.Size === '0B'? 'opacity: 0.6;cursor:not-allowed;':'')">
                <i class=" download icon"></i>
                <div class="animate-normal ">下载最新版本</div>
              </button>

              <button @click="handAll(index, item)">
                <i class=" server icon"></i>
                <div class="animate-normal ">查看历史版本</div>
              </button>
              <button @click="handleDelete(index, item)" :disabled="(item.Size === '0B'? true:false)"
                      :style="(item.Size === '0B'? 'opacity: 0.6;cursor:not-allowed;':'')">
                <i class=" trash alternate icon"></i>
                <div class="animate-normal ">删除</div>
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>

      <!--
        分页组件
       1、在列表数据tableData长度为0的时候不显示
       2、约定每页显示5条
       3、总条数total为 tableDataSize
       4、切换页码的函数为handleCurrentChange
       -->
      <el-pagination
          v-if="tableData.length !==0 & tableData.Size!==0"
          :page-size="5"
          :pager-count="11"
          background
          :current-page="1"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="tableData.Size">
      </el-pagination>

      <!--查看某个对象历史版本的抽屉组件-->
      <el-drawer
          ref="upload"
          size="50%"
          title="全部版本"
          :with-header="false"
          :visible.sync="drawer">
        <p style="text-align: center;margin: 20px;font-size: 16px;color: #d6d4d4">[ {{ objName }} ] 历史版本</p>
        <!--抽屉中是table组件-->
        <table class="ui five column selectable inverted table">
          <thead>
          <tr>
            <th class="three wide"><font style="vertical-align: inherit;"><font
                style="vertical-align: inherit;">版本号</font></font>
            </th>
            <th class="one wide"><font style="vertical-align: inherit;"><font
                style="vertical-align: inherit;">大小</font></font>
            </th>
            <th class="one wide"><font style="vertical-align: inherit;"><font
                style="vertical-align: inherit;">对象散列值</font></font>
            </th>
            <th class="two wide" style="text-align: center"><font style="vertical-align: inherit;"><font
                style="vertical-align: inherit;">操作</font></font>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="tableData.Size === 0">
            <td><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
              暂无数据
            </font></font>
            </td>
          </tr>

          <tr v-for="(item,index) in othersVersion" :key="index">
            <td class="single line">
              {{ item.Version }}
              <div style="display:inline-block;margin-left: 5px" v-if="item.Size === '0B'">
                <el-tooltip class="item" effect="dark"
                            content="包含此标签代表对象该版本为删除标记，但仍可以查看历史版本"
                            placement="left-start">
                  <el-tag size="mini" style="background-color: #7c7b7b;border: #848181;color: #ffffff">
                    <i class="el-icon-delete"></i>
                  </el-tag>
                </el-tooltip>
              </div>
            </td>
            <td class="single line"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
              {{ (item.Size !== '0B' ? item.Size : '/') }}
            </font></font>
            </td>

            <td>
              <span style="max-width: 300px;word-break:normal;width:auto;display:block;white-space:pre-wrap;word-wrap : break-word ;overflow: hidden ;">{{(item.Size !== '0B' ? item.Hash : '/') }}</span>
            </td>

            <td >
              <font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                <div style="display: flex;justify-content: center;width: 100%">
                  <el-button :disabled="(item.Size === '0B'? true:false)"
                             :style="(item.Size === '0B'? 'opacity: 0.6;cursor:not-allowed;':'')"
                             class="button el-buttons"
                             size="mini"
                             @click="copyOtherPath(index, item)"
                             :data-clipboard-text="objPath"
                             id="other"
                  >
                    <button class="ui mini blue button" :disabled="(item.Size === '0B'? true:false)"
                            :style="(item.Size === '0B'? 'opacity: 0.6;cursor:not-allowed;':'')"
                            style="margin: 0"><font style="vertical-align: inherit;"><font
                        style="vertical-align: inherit;">
                      <i class="copy icon"></i>链接
                    </font></font></button>
                  </el-button>
                  <el-button :disabled="(item.Size === '0B'? true:false)"
                             :style="(item.Size === '0B'? 'opacity: 0.6;cursor:not-allowed;':'')"
                             class="button el-buttons"
                             size="mini"
                             @click="handleDownloadOther(index, item)"
                  >
                    <button class="ui mini teal button" :disabled="(item.Size === '0B'? true:false)"
                            :style="(item.Size === '0B'? 'opacity: 0.6;cursor:not-allowed;':'')"
                            style="margin: 0"><font style="vertical-align: inherit;"><font
                        style="vertical-align: inherit;">
                      <i class="download icon"></i>下载
                    </font></font></button>
                  </el-button>
                </div>

            </font></font>

            </td>
          </tr>
          </tbody>
        </table>
      </el-drawer>
    </div>
  </div>

</template>

<script>
import CryptoJS from 'crypto-js/crypto-js'
import fileDownload from 'js-file-download';
import Bucket from "@/components/Bucket";
import $ from "jquery"
import Loading from "@/components/Loading";

export default {
  name: 'OssAdmin',
  components: {Loading, Bucket},
  data() {
    return {
      loading: true,// 默认显示loading
      objectInfoShow: false, // 是否显示对象信息列表
      bucketName: "",//当前桶名称
      objName: "",// 某行操作按钮点击时获取的对象name
      content: "",// 搜索框
      progressPercent: 0, // 上传进度条默认为0
      uploadProgressShow: false, // 上传进度条默认不显示
      hashProgressShow: false,// 计算hash进度条默认不显示
      uploadSliceFlag: false,// 分片 默认不显示
      drawer: false, // 其它版本的抽屉 是否显示flag
      tableData: [], // 全部对相列表 表格数据
      othersVersion: [], // 单个对象全部版本 表格数据
      bytesPerPiece: 5242880, // 约定每个切片的长度
      // bytesPerPiece: 32000, // 约定每个切片的长度
      hashProgressPercent: 0,//计算hash进度
      notification: null,// 计算hash消息通知默认不关闭
      hash: "",// hash值
      objPath:""// 对象url地址
    }
  },
  // beforeDestroy() {// 实例销毁之前调用
  //   sessionStorage.removeItem("bucketName")
  // },
  created() {
  },
  mounted() {
    //初始化组件
    this.$request.searchBucket(encodeURI(sessionStorage.getItem("bucketName"))).then(val => {
      if (val.status !== 200) {
        sessionStorage.removeItem("bucketName")
      }
    }).finally(() => {
      setTimeout(() => {
        this.loading = false
        // 检查是否有桶名标记
        if (sessionStorage.getItem("bucketName") === null || sessionStorage.getItem("bucketName") === "") {
          this.objectInfoShow = false
        } else {
          this.bucketName = sessionStorage.getItem("bucketName")
          setTimeout(() => {
            this.objectInfoShow = true
            this.content = "" //加载组件时，搜索框内容为空
            this.getObjList(this.content, 1) // 默认获取第一页数据
          }, 0);
          setTimeout(() => {
            $('.object').transition('pulse');
          }, 0);
        }
      }, 1000)
    })

  },
  methods: {
    // 切换桶
    switchBucket() {
      $('.object').transition('fade');
      setTimeout(() => {
        this.objectInfoShow = false
      }, 200);
      setTimeout(() => {
        $('.bucket').transition('pulse');
      }, 200);
    },

    // 上传对象
    async uploadRequest(param) {
      if (param.file.name.includes("+")){
        this.$message.error("文件名不能包含 + ")
        return
      }
      if (param.file.size <= 0) {
        this.$message.error("不能上传空文件")
        return
      }
      this.progressPercent = 0// 上传新文件时，将进度条值置为零
      if (param.file.size > 104857600) { //大于100M显示hash计算进度和弹窗
        this.hashProgressPercent = 0 // 进度条为0
        this.hashProgressShow = true // 进度条显示
        this.notification = this.$notify({
          title: '提示',
          dangerouslyUseHTMLString: true,
          message: `文件有点大，计算hash过程可能比较长～`,
          duration: 0,
          showClose: false
        });
      }

      // 获取对象hash值的base64编码值
      this.hash = "";
      this.hash = await this.getFileHash(param);
      this.hashProgressShow = false

      setTimeout(() => { // 成功获取hash值后
        if (this.notification !== null) {
          this.notification.close() // 关闭通知
        }
      }, 1000);

      // 进度条
      const uploadProgressEvent = progressEvent => {
        this.progressPercent = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
      }

      if (param.file.size <= 52428800) { // 50mb 以下 普通上传;以上 分片上传
        this.uploadSliceFlag = false // 不显示分片二字
        this.uploadProgressShow = true // 显示进度条
        this.uploadObj(param, this.hash, uploadProgressEvent)// 普通上传
      } else {
        // 判断sessionStorage中有没有hash对应的token
        var sessionToken = sessionStorage.getItem(this.hash);
        if (sessionToken === null) { // 如果sessionStorage中没有token
          this.$message.info("文件大小超过50MB，将分片上传，请稍候")
          // 发送分片上传请求
          var bucket = encodeURI(sessionStorage.getItem("bucketName"))
          this.$request.getSliceUploadToken(param.file.name, this.hash, param.file.size, bucket).then(val => {
            if (val.status === 201) {  // 201表示token创建成功
              var token = val.headers.location // 保存token
              // 文件切片上传
              this.uploadSliceFlag = true // 显示分片二字
              this.uploadProgressShow = true // 显示进度条
              this.uploadSlice(param, token)
            } else if (val.status === 200) { // 200表示hash已存在，直接显示已上传，新增版本
              this.uploadSliceFlag = true // 显示分片二字
              this.uploadProgressShow = true // 显示进度条
              this.progressPercent = 100 // 进度条拉到100

              setTimeout(() => {
                this.progressPercent = 0 // 进度条归0
                this.uploadProgressShow = false // 关闭进度条
                this.$message.success("上传成功")
                this.getObjList(this.content, 1)
              }, 2000);
            } else {
              this.$message.error("获取token失败")
            }
          })
        } else { // 如果有，使用上传失败的token继续上传
          this.uploadProgressShow = true // 显示进度条
          await this.uploadSlice(param, sessionToken)
        }
      }
    },

    // 分片读取文件 增量计算hash值，并base64编码
    async getFileHash(param) {
      let sha256 = CryptoJS.algo.SHA256.create();
      const sliceSize = 10_485_760; // 10 MiB
      let start = 0;

      while (start < param.file.size) {
        this.hashProgressPercent = Math.floor((100 / param.file.size) * start)
        const slice = await this.readSlice(param.file, start, sliceSize);
        const wordArray = CryptoJS.lib.WordArray.create(slice);
        sha256 = sha256.update(wordArray);
        start += sliceSize;
      }

      sha256.finalize();
      var hash = sha256._hash.toString()
      // console.log("js计算sha256值：" + hash)
      var hashValue = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(hash));
      // console.log("散列值的base64编码" + hashValue)
      return hashValue;
    },

    async readSlice(file, start, size) {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        const slice = file.slice(start, start + size);

        fileReader.onload = () => resolve(new Uint8Array(fileReader.result));
        fileReader.onerror = reject;
        fileReader.readAsArrayBuffer(slice);
      });
    },

    // 文件普通上传
    uploadObj(param, hash, uploadProgressEvent) {
      var bucket = encodeURI(sessionStorage.getItem("bucketName"))
      this.$request.uploadObj(param.file.name, param.file, hash, bucket, uploadProgressEvent).then(val => {
        if (val.status === 200) {
          this.$message.success("上传成功")
        } else {
          this.$message.error("上传失败")
        }
      }).finally(() => {
        // 延时2秒刷新对象列表，并将对象进度条清0
        setTimeout(() => {
          this.progressPercent = 0 // 进度条归0
          this.uploadProgressShow = false // 关闭进度条
          this.getObjList(this.content, 1)
        }, 2000);
      })
    },

    // 分片上传
    async uploadSlice(param, token) {
      var start = parseInt(await this.headUploadSliceProgress(token)) // 分片起点
      if (start === -1) { // -1代表查看分片起点的请求失败
        this.progressPercent = 0 // 进度条归0
        this.uploadProgressShow = false // 关闭进度条
        return
      }
      var lastSlice = (param.file.size - start) <= this.bytesPerPiece // 最后一个分片标记

      var end = start + this.bytesPerPiece// 分片终点
      // 请求头部range
      var range = 'bytes=' + start + '-' + end
      if (lastSlice) { // 如果是最后一个分片
        range = 'bytes=' + start + '-'
      }
      // 文件分片
      var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice; // 兼容方式获取slice方法
      var chunk_file = blobSlice.call(param.file, start, end);
      // 发送上传请求
      this.$request.uploadSlice(token, chunk_file, range).then(val => {
        if (val.status === 200) {
          this.progressPercent = Math.floor((100 / param.file.size) * start)
          if (lastSlice) { // 最后一个分片上传成功
            // 循环结束提示上传成功 进度条=100
            this.progressPercent = 100
            this.$message.success("上传成功")
            // 最后进度条清零，重新获取对象列表
            setTimeout(() => {
              if (sessionStorage.getItem(this.hash) !== null) {
                sessionStorage.removeItem(this.hash)
              }
              this.progressPercent = 0 // 进度条归0
              this.uploadProgressShow = false // 关闭进度条
              this.getObjList(this.content, 1)
            }, 2000);
          } else { // 不是最后一个分片，递归调用uploadSlice方法
            this.uploadSlice(param, token)
            sessionStorage.setItem(this.hash, token)
          }
        } else {
          // 上传过程中出现错误 给出错误提示
          this.$message.error("上传错误，请重新上传")
          console.log(this.hash)
          this.progressPercent = 0 // 进度条归0
          this.uploadProgressShow = false // 关闭进度条
        }
      })
    },

    // 检查上传进度
    async headUploadSliceProgress(token) {
      var start = 0
      await this.$request.headUploadSliceProgress(token).then(val => {
        if (val.status === 200) {
          start = val.headers['content-length']// 长度
        }else if (val.status === 404){
          this.$message.error("token已经失效，请重新上传")
          sessionStorage.removeItem(this.hash)
        } else {
          this.$message.error("检查进度失败")
          sessionStorage.removeItem(this.hash)
          start = -1
        }
      })
      return start
    },

    // 下载对象最新版本
    handleDownload(index, row) {
      var bucket = encodeURI(sessionStorage.getItem("bucketName"))
      this.$request.getObj(row.Name, bucket).then(val => {
        console.log(val)
        if (val.status == 200) {
          fileDownload(val.data, row.Name);
        } else {
          this.$message.error("下载失败，对象不存在或者可能已经丢失")
        }
      })
    },

    // 下载对象其它版本
    handleDownloadOther(index, row) {
      var bucket = encodeURI(sessionStorage.getItem("bucketName"))
      this.$request.getObj(this.objName + "?version=" + row.Version, bucket).then(val => {
        if (val.status == 200) {
          fileDownload(val.data, row.Name);
        } else {
          this.$message.error("下载失败，对象不存在或者可能已经丢失")
        }
      })
    },

    // 获取全部版本列表
    handAll(index, row) {
      this.othersVersion = []
      this.objName = row.Name
      var bucket = encodeURI(sessionStorage.getItem("bucketName"))
      this.$request.getObjOtherLists(row.Name, bucket).then(val => {
        if (val.status == 200) {
          for (let valKey in val.data) {
            val.data[valKey].Size = this.conver(val.data[valKey].Size)
          }
          this.othersVersion = val.data
        } else {
          this.$message.error("获取其他版本失败")
        }
      }).finally(() => {
        // 请求成功才打开抽屉
        this.drawer = true
      })
    },
    // 复制对象链接
    copyPath(index, row) {
      this.objPath = "http://gopher.plus/apis/objects/" + sessionStorage.getItem("bucketName") + "/"+ row.Name
      let clipboard = new this.clipboard("#last");
      let that =this
      clipboard.on('success', function () {
        that.$message.success('复制成功');
        clipboard.destroy();
      });
      clipboard.on('error', function () {
        that.$message.error('复制失败');
      });
    },
    // 复制指定版本对象链接
    copyOtherPath(index, row) {
      this.objPath = "http://gopher.plus/apis/objects/" + sessionStorage.getItem("bucketName") + "/"+ row.Name+"?version="+row.Version
      var clipboard = new this.clipboard("#other");
      let that =this
      clipboard.on('success', function () {
        that.$message.success('复制成功');
        clipboard.destroy();
      });
      clipboard.on('error', function () {
        that.$message.error('复制失败');
      });
    },
    // 删除对象
    handleDelete(index, row) {
      // 再次提示
      this.$confirm('此操作不会永久删除您的对象文件，会保留版本元数据，除非元数据消失，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { //如果点击确定
        var bucket = encodeURI(sessionStorage.getItem("bucketName"))
        this.$request.deleteObj(row.Name, bucket).then(val => {
          if (val.status == 200) {
            this.$message.success("删除成功")
          } else {
            this.$message.error("删除失败")
          }
        }).finally(() => {
          // 发送请求后重新获取全部对象列表数据
          setTimeout(() => {
            this.getObjList(this.content, 1)
          }, 2000);
        })
      }).catch(() => { // 如果点击取消
        this.$message.info('已取消删除');
      });
    },

    //分页切换函数
    handleCurrentChange(val) {    //分页的点击函数current-change，在currentPage 改变时会触发
      this.getObjList(this.content, val)
    },

    // 获得全部对象列表
    getObjList(name, page) {
      var bucket = encodeURI(sessionStorage.getItem("bucketName"))
      this.$request.getObjLists(name + "?page=" + page, bucket).then(val => {
        if (val.status === 200) {
          // 把接口数据中的size单位B重新设置为KB、MB、GB等单位
          for (let valKey in val.data.Data) {
            val.data.Data[valKey].Size = this.conver(val.data.Data[valKey].Size)
          }
          this.tableData = val.data
        } else {
          this.$message.error("获取对象列表失败")
        }
      })
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
  }
}
</script>

<style lang="less">

.ossadmin {
  width: 100%;
  height: 100%;
}

.gradient, .upload-demo {
  --border-width: 2px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 170px;
  font-family: Lato, sans-serif;
  font-size: 2.5rem;
  text-transform: uppercase;
  color: white;
  background: #1A1E23;
  border-radius: 20px;
}

.gradient {
  z-index: 1;
  margin: 0 auto;
}

.ui.placeholder.segment {
  background-color: transparent;
  box-shadow: none;
  border: 0px;
}

.upload-demo::after {
  position: absolute;
  content: "";
  top: calc(-1 * 2px);
  left: calc(-1 * 2px);
  z-index: -1;
  width: calc(100% + 2px * 2);
  height: calc(100% + 2px * 2);
  background-size: 300% 300% !important;
  background: linear-gradient(60deg, #a19e9e, #8e8c8c, #6c6b6b, #4d4c4c, #f9f7f7, #a19e9e, #d8cccc, #b0adad) 0 50%;
  border-radius: 20px;
  animation: moveGradient 5s alternate infinite;
}

@keyframes moveGradient {
  50% {
    background-position: 100% 50%;
  }
}

.button {
  padding: 0;
  background-color: transparent;
  border: transparent 0px dashed;
}

.el-buttons:active {
  background: transparent !important;
  font-weight: bold;
}

/*按钮悬浮*/
.el-buttons:hover {
  background: transparent !important;
  color: white !important;
  font-weight: bold;
  border-color: transparent !important;
}

/*按钮点击*/
.el-buttons:focus {
  background: transparent !important;
  color: white !important;
  font-weight: bold;
  border-color: transparent !important;
}

.ui.icon.header .icon {
  margin: 1px !important;
}

.el-upload-dragger {
  border: 0px dashed #838181;
  background-color: transparent;
  border-radius: 30px;
}

.multi-button {
  display: flex;
  width: 100%;
  padding: 8px 10px;
  border-radius: 50px;
  background: rgba(0, 0, 0, .15);
  /*border: 0.5px solid rgba(146, 152, 176, 0.4);*/
  background: linear-gradient(60deg, #8d8b8b, #807e7e, #a9a5a5, #716e6e) 0 50%;
  box-shadow: 0 0 10px rgba(200, 203, 217, 0.2), 4px 4px 10px rgba(113, 119, 144, 0.2);
  cursor: default;
}

.multi-button button {
  width: calc(100% / 3);
  border: 0 solid transparent;
  background: transparent;
  padding: 10px 30px;
  /*margin: 0 -2px;*/
  /*color: #114cce;*/
  font-size: 18px;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  top: 0;
  left: 0;
  outline: none;
  transition: background 0.2s ease-in-out;
}

.multi-button button:first-child {
  border-top-left-radius: 40px;
  border-bottom-left-radius: 40px;
}

.multi-button button:last-child {
  border-top-right-radius: 40px;
  border-bottom-right-radius: 40px;
}

.multi-button button div {
  position: absolute;
  top: -43px;
  left: calc(50% - 60px);
  width: 130px;
  font-size: 15px;
  color: #fff;
  background: rgba(63, 64, 68, 0.8);
  border-radius: 16px;
  line-height: 30px;
  font-family: "Raleway", Arial, sans-serif;
  text-align: center;
  font-weight: 500;
  letter-spacing: 1px;
  box-shadow: 0 0 5px rgba(39, 48, 68, 0.3), 1px 1px 5px rgba(39, 48, 68, 0.2);
  display: none;
  cursor: pointer;
}

.multi-button button:hover {
  background: #c3c3c7;
}

.multi-button button:hover div {
  display: block;
  animation: tooltip-animation-normal 0.3s ease-out forwards;
}

.multi-button button:hover div.animate-right {
  animation: tooltip-animation-right 0.3s ease-out forwards;
}

.multi-button button:hover div.animate-left {
  animation: tooltip-animation-left 0.3s ease-out forwards;
}

.multi-button button:active {
  outline: none;
  background: #d6d8e1;
}

@keyframes tooltip-animation-right {
  0% {
    transform: translateX(-75px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes tooltip-animation-left {
  0% {
    transform: translateX(75px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes tooltip-animation-normal {
  0% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}


.ui.basic.button, .ui.basic.buttons .button {
  background: transparent none !important;
  border: 1px solid #9f9494 !important;
  color: #b0adad !important;
  font-weight: 400;
  border-radius: 0.28571429rem;
  text-transform: none;
  text-shadow: none !important;
  box-shadow: 0 0 0 1px rgb(34 36 38 / 15%) inset;
}

.ui.basic.button:hover {
  border: 1px solid white !important;
  color: whitesmoke !important;
  background: transparent !important;
}

.el-drawer__body {
  background-color: #2c2c2c;
}

.ui.table thead tr:first-child > th:first-child {
  border-radius: 0;
}

.ui.table thead tr:first-child > th:last-child {
  border-radius: 0;
}
</style>