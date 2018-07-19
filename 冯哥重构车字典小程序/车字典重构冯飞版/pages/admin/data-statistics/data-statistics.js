var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //   console.log('admin缓存：', wx.getStorageSync('admin'))
    //   var admin = wx.getStorageSync('admin');
    //   admin.todayMoneySum = util.divide100(admin.todayMoneySum);
    //   admin.todayMoneyProfit = util.divide100(admin.todayMoneyProfit);
    //   admin.sevenMoneySum = util.divide100(admin.sevenMoneySum);
    //   admin.sevenMoneyProfit = util.divide100(admin.sevenMoneyProfit);
    //   admin.thirtyMoneySum = util.divide100(admin.thirtyMoneySum);
    //   admin.thirtyMoneyProfit = util.divide100(admin.thirtyMoneyProfit);
    // this.setData({
    //   user: admin,
    // })
    var that = this;
    url.ajaxPost(false, url.member_change, {}, function (data) {
      console.log("管理员统计信息:", data);
      that.setData({
        user:data.result,
      })
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
    
  }
})