//获取应用实例
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");


Page({

    /**
     * 页面的初始数据
     */
    data: {
        id:'',
        src:'',
        share_path: 'pages/order/order-detail-claim2/order-detail',
        order_claim2:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var that = this;
      if (options.id) {
        that.setData({
          id: options.id
        })
        console.log("是否有用户信息", app.globalData.isGetUserInfo);
        if (!app.globalData.isGetUserInfo) {
          //获取用户登陆身份
          wx.showLoading({ title: "初始化", mask: true });
          app.getUserId(function (data) {
            // that.callBackgetUserId(data)
            wx.hideLoading()
            console.log('身份获取完毕');
            // 请求订单数据
            wx.request({
              url: url.order_detail,
              data: { orderNo: options.id },
              success: function (data) {
                console.log('分享claim2订单:', data);
                if (data.data.resultCode == 1) {
                  var json = data.data.result;
                  that.callback(json);
                } else {
                  util.showToast(data.data.resultMsg, 'error');
                }
              }
            })
          });
        } else {
          // 请求订单数据
          wx.request({
            url: url.order_detail,
            data: { orderNo: options.id },
            success: function (data) {
              console.log('分享claim2订单:', data);
              if (data.data.resultCode == 1) {
                var json = data.data.result;
                that.callback(json);
              } else {
                util.showToast(data.data.resultMsg, 'error');
              }
            }
          })
        }
        return;
      }
      if (wx.getStorageSync('order_detail')) {
        var car_data = wx.getStorageSync('order_detail')
        console.log('缓存数据', car_data);
        that.setData({
          id: car_data.orderNo
        })
        wx.request({
          url: url.order_detail,
          data: { orderNo: car_data.orderNo },
          success: function (data) {
            console.log('claim2订单:', data);
            if (data.data.resultCode == 1) {
              var json = data.data.result;
              that.callback(json);
            } else {
              util.showToast(data.data.resultMsg, 'error');
            }
          }
        })
        return;
      }
    },

    //处理数据
    callback: function (car_data) {
      //金额分转换元------
      //理赔总金额
      
      
      this.setData({
        order_claim2: car_data
      })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function (car_data) {

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
    onShareAppMessage: function (res) {
        var that = this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: "保险理赔报告详情",
            path: that.data.share_path + '?id=' + that.data.id,
            // imageUrl: that.data.share.imageUrl,
            success: function (res) {
                console.log(app.globalData.openid);
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
    //返回首页
    fanhui: function () {
      wx.switchTab({
        url: '/pages/index/index',
      })
    },

  //生成报告
  bindReport: function () {
    var car_data = wx.getStorageSync('order_detail')
    var report = "http://www.levau.com/query-mould/claim/claim_clz.html?orderNo=" + car_data.orderNo
    wx.setClipboardData({
      data: report,
      success: function (res) {
        util.showToast("复制成功", "success", 500)
      }
    });
  },
})