//获取应用实例
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        car: {},
        License:'',
        // share_title: '4S保养报告详情',
        share_path: 'pages/order/order-detail-4s/order-detail',
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
              //url: 'http://localhost:8080/chezidian/v1/chewu/order/info',
              url: url.order_detail,
              data: { orderNo: options.id },
              success: function (data) {
                console.log('分享订单:', data);
                if (data.data.resultCode) {
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
            //url: 'http://localhost:8080/chezidian/v1/chewu/order/info',
            url: url.order_detail,
            data: { orderNo: options.id },
            success: function (data) {
              console.log('分享订单:', data);
              if (data.data.resultCode) {
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
          //url: 'http://localhost:8080/chezidian/v1/chewu/order/info',
          url: url.order_detail,
          data: { orderNo: car_data.orderNo },
          success: function (data) {
            console.log('订单:', data);
            if (data.data.resultCode) {
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
        //car_data = car_data.toLowerCase();
        //car_data = JSON.parse(car_data);
        console.log(car_data);
        car_data.report_time = util.toDate(car_data.report_time,'YMDhms');
        car_data.data.wei_bao_ci_shu = car_data.data.wei_bao_ci_shu == '' ? '-' : car_data.data.wei_bao_ci_shu;
        car_data.data.wei_bao_zhou_qi = car_data.data.wei_bao_zhou_qi == '' ? '-' : car_data.data.wei_bao_zhou_qi;
        car_data.data.zui_da_li_cheng = car_data.data.zui_da_li_cheng == '' ? '-' : car_data.data.zui_da_li_cheng;
        if (car_data.data.engine == null || car_data.data.engine == ''){
          car_data.data.engine = '-'
        } else if (car_data.data.engine == '正常' || car_data.data.engine == '0'){
          car_data.data.engine = '是'
        }else {
          car_data.data.engine = '否'
        }
        if (car_data.data.mileage == null || car_data.data.mileage == '') {
          car_data.data.engine = '-'
        } else if (car_data.data.mileage == '正常' || car_data.data.mileage == '0') {
          car_data.data.mileage = '是'
        } else {
          car_data.data.mileage = '否'
        }
        if (car_data.data.tr == null || car_data.data.tr == '') {
          car_data.engine = '-'
        } else if (car_data.data.tr == '正常' || car_data.data.tr == '0') {
          car_data.data.tr = '是'
        } else {
          car_data.data.tr = '否'
        }
        if (car_data.data.fire == null || car_data.data.fire == '') {
          car_data.data.engine = '-'
        } else if (car_data.data.fire == '正常' || car_data.data.fire == '0') {
          car_data.data.fire = '是'
        } else {
          car_data.data.fire = '否'
        }
        if (car_data.data.water == null || car_data.data.water == '') {
          car_data.engine = '-'
        } else if (car_data.data.water == '正常' || car_data.data.water == '0') {
          car_data.data.water = '是'
        } else {
          car_data.data.water = '否'
        }
        if (car_data.data.main == null || car_data.data.main == '') {
          car_data.data.engine = '-'
        } else if (car_data.data.main == '正常' || car_data.data.main == '0') {
          car_data.data.main = '是'
        } else {
          car_data.data.main = '否'
        }
        if (car_data.data.out == null || car_data.data.out == '') {
          car_data.data.engine = '-'
        } else if (car_data.data.out == '正常' || car_data.data.out == '0') {
          car_data.data.out = '是'
        } else {
          car_data.data.out = '否'
        }

        if (car_data.detail.length>0) {
          for (var i = 0; i < car_data.detail.length; i++) {
            var pro = car_data.detail[i].repair_project;
            var mat = car_data.detail[i].repair_material;
            // car_data.detail[i].repair_project = pro.substring(2,pro.length-2);
            // car_data.detail[i].repair_material = pro.substring(1, mat.length-1);
            car_data.detail[i].repair_project = pro.replace("<h style='color:#ff3030;font-weight:bold;'>", '')
            car_data.detail[i].repair_project = car_data.detail[i].repair_project.replace("<h style='color:#ff3030;font-weight:bold;'>", '')
            car_data.detail[i].repair_material = mat.replace("<h style='color:#ff3030;font-weight:bold;'>", '')
            car_data.detail[i].repair_material = car_data.detail[i].repair_material.replace("<h style='color:#ff3030;font-weight:bold;'>", '')
            // car_data.detail[i].repair_material = car_data.detail[i].repair_material.replace('>', '>"')
                // if (car_data.data.result_content[i].content == null) {
                //     car_data.data.result_content[i].content = "-"
                // }
                // if (car_data.data.result_content[i].materal == null) {
                //     car_data.data.result_content[i].materal = "-"
                // }
                // if (car_data.data.result_content[i].remark == null) {
                //     car_data.data.result_content[i].remark = "-"
                // }
            }
        }
        this.setData({
            car: car_data
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (options) {
        // console.log('show', options.id);
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
      // console.log('监听页面卸载');
      // wx.setStorageSync('bujiazai', 1);
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
            title: "4S保养报告详情",
            path: that.data.share_path + '?id=' + that.data.car.Id_,
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