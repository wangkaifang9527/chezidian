//获取应用实例
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");

var count = 0;//加载页
var size = 50;//
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:'',
    orders:{},
    openid:'',
    isEmpty: true,//第一次为空
    isloading: false,//
    isloadover: false,//
    flag:false,
    isphone:false,
    myRanking:'',
    maxQueryUser:'',
    path:'pages/my/my-rankings/my-rankings',
   
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    });
    var that = this;

    if(options.openid){
      if (!app.globalData.isGetUserInfo) {
        app.getUserId(function (data) {
          wx.hideLoading()
          console.log('身份获取完毕');
        })
      }
      
      that.setData({
        orders: [],//渲染数据
        isEmpty: true,//第一次为空
        isloading: false,//
        isloadover: false,//
        openid: options.openid,
      })
      count = 0;
      wx.showLoading({ title: "提交中" });
      wx.request({
        url: url.rankings,
        data: { start: count, openId: options.openid},
        success: function (data) {
          console.log("排行榜回掉", data);
          that.callbackData(data);

        }
      })
    }else{
      that.setData({
        orders: [],//渲染数据
        isEmpty: true,//第一次为空
        isloading: false,//
        isloadover: false,//
        openid: app.globalData.openid
      })
      count = 0;
      wx.showLoading({ title: "提交中" });
      wx.request({
        url: url.rankings,
        data: { start: count, openId: app.globalData.openid },
        success: function (data) {
          console.log("排行榜回掉", data);
          that.callbackData(data);

        }
      })
    }

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
    console.log('加载更多');
    var that = this;
    if (this.data.isloadover) {
      return false;
    }
    count = count+1;
    wx.request({
      //url: 'http://localhost:8080/fours/v1/chewu/rankings/get',
      url: url.rankings,
      data: { start: count, openId: app.globalData.openid },
      success: function (data) {
        that.callbackData(data);

      }
    })
  },
  //回调数据
  callbackData: function (data) {
    console.log('回掉data:', data)
    var that = this;
    var orders_data = [];
    data.orders = data.data.result.rankingList;
    wx.hideLoading();
    if (data.data.resultCode != 1) {
      that.setData({
        isloadover: true
      });
      console.log('未初始化完或者非法进入');
      return;
    }

    if (data.orders.length == size) {
      // console.log('持续加载');
    } else {
      that.setData({
        isloadover: true
      });
      console.log('所有数据加载完毕');
    }

    if (data.data.result.myRanking!=0){
      var fu = data.data.result.myRanking.lastRanking - data.data.result.myRanking.currentRanking;
      data.data.result.myRanking.risefall = fu;
      data.data.result.myRanking.rise_fall = fu;
      if (fu < 0) {
        data.data.result.myRanking.rise_fall = data.data.result.myRanking.currentRanking - data.data.result.myRanking.lastRanking;
      }
    }
    
    for (var i = 0; i < data.orders.length; i++) {
      var fudong = data.orders[i].lastRanking - data.orders[i].currentRanking;
      data.orders[i].risefall = fudong;
      data.orders[i].rise_fall = fudong;
      if (data.orders[i].rise_fall<0){
        data.orders[i].rise_fall = data.orders[i].currentRanking - data.orders[i].lastRanking
      }

    }
    

    if (!that.data.isEmpty) {
        // console.log('非第一次加载');
        orders_data = that.data.orders.concat(data.orders);//连接多个数组;
        console.log('总个数',orders_data.length);
        if (orders_data.length >= 150){
          that.setData({
            isloadover: true
          });
          console.log('所有数据加载完毕');
        }
    } else {
        // console.log('初次加载');
        orders_data = data.orders;
        that.setData({
            isEmpty: false
        });
    }
    console.log('列表数据:', orders_data);
    //更新数据
    that.setData({
        orders: orders_data,
        isloading: false,
        maxQueryUser: data.data.result.maxQueryUser,
        myRanking: data.data.result.myRanking,
    });
    
    wx.hideNavigationBarLoading() //隐藏导航条加载动画。
  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    console.log('res',res);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log('button',res.target)
    }
    return {
      title: '排行榜',
      path: that.data.path + '?openid=' + that.data.openid,
      // imageUrl: that.data.share.imageUrl,
      success: function (res) {
        console.log(app.globalData.openid);
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  getPhoneNumber: function (e) {
    var that = this;
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || e.detail.errMsg == 'getPhoneNumber:fail:cancel to confirm login') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) {
          that.setData({ flag: true })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '同意授权',
        success: function (res) {
          wx.request({
            url: url.phone,
            //url:'http://localhost:8080/guohubao/v1/chewu/account/phone',
            data: {
              'encryptedData': e.detail.encryptedData,
              'iv': e.detail.iv,
              'session_key': app.globalData.session_key,
              'openId': app.globalData.openid,
              'location': app.globalData.location
            },
            success: function (data) {
              console.log('获取手机号', data);
            }
          })
        }
      })
    }
  },

  //定损免费排行榜
  dingsunmianfeipaihangbang:function(){
    // wx.navigateTo({
    //   url: '/pages/my/my-er/my-er',
    // });
    util.showToast("开发中...", 'error');
  },
  //分享
  fenxiang:function(e){
    var that = this;
    console.log(e);
    return {
      title: '排行榜',
      path: that.data.path + '?openid=' + that.data.openid,
      // imageUrl: that.data.share.imageUrl,
      success: function (res) {
        console.log(app.globalData.openid);
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
  
})