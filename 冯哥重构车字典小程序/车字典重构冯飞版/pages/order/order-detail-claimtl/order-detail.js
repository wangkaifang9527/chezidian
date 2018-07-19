//获取应用实例
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    car: {},
    // share_title: '保险理赔报告详情',
    share_path: 'pages/order/order-detail-claimtl/order-detail',
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
          wx.hideLoading()
          console.log('身份获取完毕');
          // 请求订单数据
          wx.request({
            url: url.order_detail,
            data: { orderNo: options.id },
            success: function (data) {
              console.log('图灵理赔分享订单:', data);
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
            console.log('图灵理赔分享订单:', data);
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
          console.log('图灵理赔订单:', data);
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
    console.log(car_data);
      var zhaiyao = car_data.data.itemData[0].itemPropValue;
      zhaiyao[1].itemPropValue = util.divide100(zhaiyao[1].itemPropValue)+" 元";
      zhaiyao[3].itemPropValue = util.divide100(zhaiyao[3].itemPropValue)+" 元";
      zhaiyao[5].itemPropValue = util.divide100(zhaiyao[5].itemPropValue)+" 元";
      zhaiyao[0].itemPropValue = zhaiyao[0].itemPropValue + " 次";
      zhaiyao[2].itemPropValue = zhaiyao[2].itemPropValue + " 次";
      zhaiyao[4].itemPropValue = zhaiyao[4].itemPropValue + " 次";

      var item = car_data.data.itemData[1].itemPropValue
      for (var j = 0; j < item.length; j++) {
        var item2 = item[j][0].itemPropValue;
        for (var z = 0; z < item2.length; z++) {
           item2[z].dangerSingleMoney = util.divide100(item2[z].dangerSingleMoney);
        }
        //item[j][2].itemPropValue = util.divide100(item[j][2].itemPropValue) + " 元";
        //item[j][3].itemPropValue = util.divide100(item[j][3].itemPropValue) + " 元";
        //item[j][4].itemPropValue = util.divide100(item[j][4].itemPropValue) + " 元";
        //item[j][7].itemPropValue = util.divide100(item[j][7].itemPropValue) + " 元";
        for(var i=0;i<item[j].length;i++){
          var name =  item[j][i].itemPropName
          switch(name){
            case 'otherMoney':
              item[j][i].itemPropValue = util.divide100(item[j][i].itemPropValue) + " 元";
            break;
            case 'barterMoney':
              item[j][i].itemPropValue = util.divide100(item[j][i].itemPropValue) + " 元";
              break;
            case 'dangerMoney':
              item[j][i].itemPropValue = util.divide100(item[j][i].itemPropValue) + " 元";
              break;
            case 'serviceMoney':
              item[j][i].itemPropValue = util.divide100(item[j][i].itemPropValue) + " 元";
              break;
            case 'plate':
              item[j][i].itemPropValue = util.encryptionStrFront(item[j][i].itemPropValue,3);
              break;
          }
        }
      }
   
    
    this.setData({
      car: car_data
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
  }
})