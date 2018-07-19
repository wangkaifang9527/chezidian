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
        car: {},
        // share_title: '保险理赔报告详情',
        share_path: 'pages/order/order-detail-claim/order-detail',
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
                console.log('分享订单:', data);
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
              console.log('分享订单:', data);
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
            console.log('全国理赔订单:', data);
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
        //car_data = car_data.toLowerCase();
        console.log(car_data);
        car_data.data.summarydata.claimmoney = util.divide100(car_data.data.summarydata.claimmoney);
        //换件总金额
        car_data.data.summarydata.renewmoney = util.divide100(car_data.data.summarydata.renewmoney);
        //维修总金额
        car_data.data.summarydata.repairmoney = util.divide100(car_data.data.summarydata.repairmoney);
        //其他金额
        car_data.data.summarydata.othermoney = car_data.data.summarydata.othermoney == null?'0':util.divide100(car_data.data.summarydata.othermoney);

        //出险报告
        for (var i = 0; i < car_data.data.carclaimrecords.length; i++) {
          //车辆牌照
          car_data.data.carclaimrecords[i].licenseno = car_data.data.carclaimrecords[i].licenseno.toUpperCase();
          //车辆型号
          car_data.data.carclaimrecords[i].vehiclemodel = car_data.data.carclaimrecords[i].vehiclemodel.toUpperCase();
            //理赔金额
            car_data.data.carclaimrecords[i].damagemoney = util.divide100(car_data.data.carclaimrecords[i].damagemoney)
            //维修金额
            car_data.data.carclaimrecords[i].repairamount = util.divide100(car_data.data.carclaimrecords[i].repairamount)
            //换件金额
            car_data.data.carclaimrecords[i].renewalamount = util.divide100(car_data.data.carclaimrecords[i].renewalamount)
            //其他金额
            car_data.data.carclaimrecords[i].otheramount = util.divide100(car_data.data.carclaimrecords[i].otheramount)
            //理赔项金额
            for (var j = 0; j < car_data.data.carclaimrecords[i].claimdetails.length; j++) {
                car_data.data.carclaimrecords[i].claimdetails[j].itemamount = util.divide100(car_data.data.carclaimrecords[i].claimdetails[j].itemamount)
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