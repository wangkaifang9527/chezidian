// pages/banned/add/add.js

var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    anonymous:true,//默认不是匿名
    tupianconnt:24,//上传图片的总张数
    yulan:[],
    yulan1:[],
    removeFiles: [],//如果有删除图片，删除的文件名
    requestId: '',//请求上传图片 使用
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  //是否匿名
  anonymous:function(){
    var that = this;
    var anonymous = that.data.anonymous;
    if (anonymous){
      that.setData({
        anonymous:false,
      });
    }else{
      that.setData({
        anonymous: true,
      });
    }
  },

  //上传图片
  shangchuantupian: function (e) {
    var that = this;
    var tupianconnt = that.data.tupianconnt;
    if (tupianconnt <= 0) {
      wx.showModal({
        title: '提示',
        content: '最多可以上传24张图片',
      });
      return;
    }
  
    //从本地相册选择图片或使用相机拍照。
    wx.chooseImage({
      count: tupianconnt, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log("选择图片:", tempFilePaths, tempFilePaths.length);
        url.ajaxGet(false, url.banned_getToken, {
          openId: app.globalData.openid,
          'type': 1,
          count: tempFilePaths.length,
          requestId: that.data.requestId
        }, function (data) {
          console.log("获取上传图片的token:", data);
          tupianconnt = tupianconnt - tempFilePaths.length;
          that.setData({
            requestId: data.result.requestId,
            tupianconnt: tupianconnt
          });
          wx.showLoading({
            title: '上传中',
            success: function () {
              for (var i = 0; i < tempFilePaths.length; i++) {
                wx.uploadFile({
                  url: 'https://up.qbox.me',
                  filePath: tempFilePaths[i],
                  name: 'file',
                  formData: {
                    'key': data.result.tokens[i].fileName,
                    'token': data.result.tokens[i].token
                  },
                  header: {// 设置请求的 header
                    'content-type': 'multipart/form-data',
                  },
                  success: function (res) {
                    console.log('res', res);
                    //wx.hideLoading();
                    var data = JSON.parse(res.data);
                    var yulan = that.data.yulan;
                    var yulan1 = that.data.yulan1;
                    console.log(url.qiniu + data.key);
                    yulan.push(url.qiniu + data.key);
                    yulan1.push(data.key);
                    that.setData({
                      yulan: yulan,
                      yulan1: yulan1,
                    })
                    //do something
                  },
                  fail(error) {
                    console.log(error)
                  }
                });
               
              }
            }
          })
        });
      }
    })
  },
  //删除图片
  shanchutupian: function (e) {
    var that = this;
    var removeFiles = that.data.removeFiles;
    var yulan = that.data.yulan;
    var yulan1 = that.data.yulan1;
    console.log(e);
    removeFiles.push(yulan1[e.currentTarget.dataset.i]);
    yulan1.splice(e.currentTarget.dataset.i, 1);
    yulan.splice(e.currentTarget.dataset.i, 1);
    url.ajaxPost(false, url.banned_removeFile, {
      openId: app.globalData.openid,
      requestId: that.data.requestId,
      fileName: removeFiles,
    }, function (data) {
      console.log("服务器返回：", data);
    });
    if (yulan.length == 0) {//把图片删除完毕后，把requestId清空
      that.setData({
        requestId:'',
      });
    }
    that.setData({
      yulan: yulan,
      yulan1: yulan1,
      removeFiles: removeFiles,
      tupianconnt: that.data.tupianconnt + 1
    });
  },
  //图片显示完
  imageLoad: function (ev) {
    console.log('ev', ev);
    let src = ev.currentTarget.dataset.i
    var that = this;
    var count = 24 - that.data.tupianconnt;
    if ((ev.currentTarget.dataset.i + 1) == count) {
      setTimeout(function () {
        wx.hideLoading();
      }, 1000);
    }
  },

  //提交
  formSubmit:function(form){
    console.log(form);
    var that = this;
    var form = form.detail.value;
    if (that.data.requestId == '') {
      util.showToast("没有上传图片", 'error');
      return;
    }
    if (form.wx == '') {
      util.showToast("微信号为空", 'error');
      return;
    }
    if (form.tel == '') {
      util.showToast("手机号为空", 'error');
      return;
    }
    if (form.cause == '') {
      util.showToast("封杀原因为空", 'error');
      return;
    }
    var niming  = 1;
    if (that.data.anonymous){
      niming = 1;
    }else{
      niming = 0;
    }
    wx.showLoading({
      title: "提交中",
      mask: true
    });
    url.ajaxPost(false, url.banned_create, {
      openId: app.globalData.openid,
      requestId: that.data.requestId,
      wxId: form.wx,
      cellphoneNumber: form.tel,
      description: form.cause,
      anonymous: niming,
      idCard: form.idCard
    }, function (data) {
      console.log("服务器返回:", data);
      wx.hideLoading();
      that.setData({
        yulan:[],
        wx:'',
        tel:'',
        cause:'',
        requestId:'',
        idCard:'',
      });
      wx.navigateTo({
        url: '/pages/banned/success/success',
      })
    });

    



  }
})