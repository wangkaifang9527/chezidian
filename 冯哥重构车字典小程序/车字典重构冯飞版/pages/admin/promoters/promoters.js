//获取应用实例
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");

var count = 0;//加载页
var size = 20;//每页加载条数
var post_list_url = url.promoterList

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    isEmpty: true,//第一次为空
    isloading: false,//
    isloadover: false,//
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()//隐藏转发按钮
    var that = this;
    //ajax
    count = 0;
    wx.showLoading({ title: "提交中" });
    url.ajaxPost(false, post_list_url, {
      openId: app.globalData.openid,
      start: count
    }, function (data) {
      console.log("服务器回掉:", data);
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
  //审核
  onAudit: function (e) {
    var that = this
    var tip_text = '';
    var state = '';
    var stateint = '';
    var queryUrl = '';
    wx.showActionSheet({
      itemList: ['拒绝'],
      success: function (res) {
        // console.log(res.tapIndex)
        
        tip_text = "拒绝";
        state = '已拒绝';
        stateint = '1';
        queryUrl = url.cancelPromoter;
        
        //ajax
        var datas = that.data.list;
        url.ajaxPost(false, queryUrl, {
          promoterOpenId: datas[e.currentTarget.dataset.i].openId,
          openId: app.globalData.openid,
        }, function (data) {
          console.log('推广人审核回掉', data);
          util.showToast(state, 'success', 1000)
          console.log(datas[0].state)
          datas[e.currentTarget.dataset.i].state = state;
          that.setData({
            list: datas
          })
        })

      
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    console.log('下拉刷新');
    wx.showNavigationBarLoading();//在当前页面显示导航条加载动画。
    var that = this;
    this.setData({
      isloading: true,
      isloadover: false,
      isEmpty: true,
    });
    count = 0;//加载页
    url.ajaxPost(false, post_list_url, {
      openId: app.globalData.openid,
      start: count
    }, function (data) {
      console.log("服务器回掉:", data);
      wx.stopPullDownRefresh() //停止当前页面的下拉刷新。
      that.callbackData(data);
    });

  },

  // 加载更多
  onReachBottom: function () {
    console.log('加载更多');

    var that = this;
    if (this.data.isloadover) {
      return false;
    }
    count++;
    url.ajaxPost(false, post_list_url, {
      openId: app.globalData.openid,
      start: count
    }, function (data) {
      console.log("服务器回掉:", data);
      that.callbackData(data);
    });
  },

  //回调数据
  callbackData: function (data) {
    var that = this;
    var datas = [];
    wx.hideLoading();
    data.list = data.result.promoterList;
    if (data.list.length == size) {
      // console.log('持续加载');
    } else {
      that.setData({
        isloadover: true
      });
      console.log('所有数据加载完毕');
    }
    if (data.list.length > 0) {
      for (var i = 0; i < data.list.length; i++) {
        // data.list[i].time_long = util.toDate(data.list[i].applyTime, 'YMDhms');
        if (data.list[i].promoteStatus == 0) {
          data.list[i].state = '初始'
        } else if (data.list[i].promoteStatus == 1) {
          data.list[i].state = '审核中'
        } else if (data.list[i].promoteStatus == 2) {
          data.list[i].state = '已通过'
        } else if (data.list[i].promoteStatus == 3) {
          data.list[i].state = '已拒绝'
        } else if (data.list[i].promoteStatus == -1) {
          data.list[i].state = ''
        }

      }
    }
    if (!that.data.isEmpty) {
      // console.log('非第一次加载');
      datas = that.data.list.concat(data.list);//连接多个数组
    } else {
      console.log('初次加载');
      datas = data.list;
      that.setData({
        isEmpty: false
      });
    }
    console.log('列表数据:', datas);
    //更新数据
    that.setData({
      list: datas,
      isloading: false
    });
    wx.hideNavigationBarLoading() //隐藏导航条加载动画。

  },
})