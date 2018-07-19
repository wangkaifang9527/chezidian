// pages/anli.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weibao:0.3,
    chuxian:0,
    zaibao:0,
    src:'https://guohubaoimage.oss-cn-shanghai.aliyuncs.com/fours',

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

  weibao:function(){
    var that = this;
    that.setData({
      weibao: 0.3,
      chuxian: 0,
      zaibao: 0,
      src: 'https://guohubaoimage.oss-cn-shanghai.aliyuncs.com/fours',
    });
  },
  dingsun: function () {
    var that = this;
    that.setData({
      weibao: 0,
      chuxian: 0.3,
      zaibao: 0,
      src: 'https://guohubaoimage.oss-cn-shanghai.aliyuncs.com/claim',
    });
  },
  zaibao: function () {
    var that = this;
    that.setData({
      weibao: 0,
      chuxian: 0,
      zaibao: 0.3,
      src: 'https://guohubaoimage.oss-cn-shanghai.aliyuncs.com/info',
    });
  },
})