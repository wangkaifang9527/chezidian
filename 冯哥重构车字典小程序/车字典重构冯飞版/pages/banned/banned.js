// pages//banned/banned.js

var app = getApp();
var url = require("../../utils/url.js");//服务列表
var util = require("../../utils/util.js");
var area = require('../../data/area.js');
var count = 0;//加载页
var size = 20;//每页加载条数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEmpty: true,//第一次为空
    isloading: false,//
    isloadover: false,//
    path: 'pages/banned/banned',//分享的页面路径
    list:[],

    zhezhao: false,//遮罩
    xiangqing:'',

    focus: false,
    hidden: true,
    search_value:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //wx.hideShareMenu()//隐藏转发按钮
      
    if (app.globalData.openid == null || app.globalData.openid == '' || app.globalData.openid==undefined) {
      //获取用户登陆身份
      wx.showLoading({ title: "初始化", mask: true });
      app.getUserId(function (data) {
        wx.hideLoading()
      });
    }

    that.setData({
      list: [],//渲染数据
      isEmpty: true,//第一次为空
      isloading: false,//
      isloadover: false,//
      search_value:'',
    })
    count = 0;
    wx.showLoading({ title: "提交中" });
    url.ajaxGet(false, url.banned_find, {
      openId: app.globalData.openid,
      start: count,

    }, function (data) {
      console.log("车辆列表:", data);
      that.callbackData(data);
    });
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
    var that = this;
   
    wx.showNavigationBarLoading();//在当前页面显示导航条加载动画。
    this.setData({
      isloading: true,
      isloadover: false,
      isEmpty: true,
      search_value:'',
    });
    count = 0;//加载页
    url.ajaxGet(false, url.banned_find, {
      openId: app.globalData.openid,
      location: app.globalData.location,
      start: count
    }, function (data) {
      console.log("车辆列表:", data);
      wx.stopPullDownRefresh() //停止当前页面的下拉刷新。
      that.callbackData(data);
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (this.data.isloadover) {
      return false;
    }
    count++;
    url.ajaxGet(false, url.banned_find, {
      openId: app.globalData.openid,
      location: app.globalData.location,
      start: count,
      keyword: that.data.search_value,
    }, function (data) {
      console.log("车辆列表:", data);
      that.callbackData(data);
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    console.log('res', res);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log('button', res.target)
    }
    return {
      title: '全网封杀',
      path: that.data.path,//+'?id=111',
      // imageUrl: that.data.share.imageUrl,
      success: function (res) {
        console.log(app.globalData.openid);
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  //回调数据
  callbackData: function (data) {
    wx.hideLoading();
    var that = this;
    var orders_data = [];
    if (data.resultCode != 1) {
      that.setData({
        isloadover: true
      });
      console.log('未初始化完或者非法进入');
      return;
    }
    var bannedList = data.result.bannedList;
    for (var i = 0; i < bannedList.length; i++) {
      bannedList[i].createTime = util.timeBefore(bannedList[i].createTime);
      
      for (var j = 0; j < bannedList[i].images.length; j++) {
        bannedList[i].images[j] = url.qiniu + bannedList[i].images[j];
      }
      bannedList[i].comments = [];
    }
    if (bannedList.length == size) {
      // console.log('持续加载');
    } else {
      that.setData({
        isloadover: true
      });
      console.log('所有数据加载完毕');
    }
    if (!that.data.isEmpty) {
      console.log('非第一次加载');
      orders_data = that.data.list.concat(bannedList);//连接多个数组
    } else {
      console.log('初次加载');
      orders_data = bannedList;
      that.setData({
        isEmpty: false
      });
    }
    console.log('列表数据:', bannedList);
    //更新数据
    that.setData({
      list: orders_data,
      isloading: false
    });

    wx.hideNavigationBarLoading() //隐藏导航条加载动画。
  },

  //我要封杀
  woyaofengsha:function(){
    wx.navigateTo({
      url: '/pages/banned/add/add',
    })
  },
  //详情
  xiangqing:function(e){
    console.log(e);
    var that = this;
    var list = that.data.list;
    that.setData({
      zhezhao: true,
      xiangqing: list[e.currentTarget.dataset.i],
    });
    console.log('详情',that.data.xiangqing);
  },
  zhezhao: function () {
    var that = this;
    that.setData({
      zhezhao: false,
    });
  },
  //预览图片
  lookImg: function (e) {
    console.log('预览图片', e);
    //获取图片信息
    var that = this;
    var imgurl = e.currentTarget.dataset.images;
    console.log('预览图片', imgurl);
    wx.previewImage({
      current: imgurl[e.currentTarget.dataset.i], // 当前显示图片的http链接
      urls: imgurl// 需要预览的图片http链接列表
    })
  },
  //评论
  pinglun: function (e) {
    console.log(e);
    var that = this;
    that.setData({
      focus: true,
      hidden: false,
      vehicleId: e.currentTarget.dataset.vehicleid,
      i: e.currentTarget.dataset.i,
    });

  },
  //评论失焦事件
  bindblur: function () {
    var that = this;
    that.setData({
      focus: false,
      hidden: true,
      pinglun_value: '',
    });
  },

  //发送评论
  bindconfirm: function () {
    var that = this;
    that.setData({
      focus: false,
      hidden: true,
    });
    var content = that.data.pinglun_value;
    if (content == '') {
      util.showToast('评论不能为空', 'success');
      return;
    }
    //评论
    url.ajaxPost(false, url.comment_comment, {
      openId: app.globalData.openid,
      vehicleId: that.data.vehicleId,
      content: that.data.pinglun_value
    }, function (data) {
      console.log("评论回调:", data, app.globalData.userInfo);
      var userInfo = app.globalData.userInfo;
      var pin = {
        'avatarUrl': userInfo.avatarUrl,
        'nickName': userInfo.nickName,
        'content': content,
        'commentTime': util.toDate(new Date().getTime(), 'YMDhms'),
      };
      var contents = [];
      contents.push(pin);
      var list = that.data.list;
      var comments = list[that.data.i].comments;
      for (var i = 0; i < comments.length; i++) {
        contents.push(comments[i]);
      }
      list[that.data.i].comments = contents;
      list[that.data.i].commentCount = list[that.data.i].commentCount + 1;

      that.setData({
        list: list,
        pinglun_value: '',
      })

    });

  },
  bindinput: function (e) {
    console.log(e.detail.value);
    this.setData({
      pinglun_value: e.detail.value
    });

  },
  bindKeyInput:function(e){
    console.log(e);
    var that = this;
    that.setData({
      search_value: e.detail.value,
    });
  },
  //查询
  search:function(){
    var that = this;
    that.setData({
      list: [],//渲染数据
      isEmpty: true,//第一次为空
      isloading: false,//
      isloadover: false,//
    })
    count = 0;
    wx.showLoading({ title: "提交中" });
    url.ajaxGet(false, url.banned_find, {
      openId: app.globalData.openid,
      start: count,
      keyword: that.data.search_value,
    }, function (data) {
      console.log("封杀列表:", data);
      that.callbackData(data);
    });

  },
})