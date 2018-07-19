// pages/my/apply-tg/apply-tg.js
//获取应用实例
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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

  //申请开通推广
  apply_tg:function(){
    url.ajaxPost(false, url.promoteApply, {
      openId: app.globalData.openid,
    }, function (data) {
      console.log("申请开通推广回掉:", data);
      wx.showModal({
        title: '提示',
        content: '推广申请成功，请耐心等待',
        success: function (res) {
          wx.switchTab({
            url: '/pages/my/my',
          })
        }
      })
      
    });
  }
})