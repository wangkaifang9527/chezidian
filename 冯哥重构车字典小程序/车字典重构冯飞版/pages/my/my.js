//获取应用实例
var app = getApp();
var url = require("../../utils/url.js");//服务列表
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    // name:'流失的回忆',
    balence: 0,//余额
    withdrawAbleBalance:0,//可用余额
    frozenBalance:0,//冻结金额
    promoteStatus: 0,//0 初始  1 已申请  2 审核通过  3拒绝

    totalIncome: 0,
    citys: [],
    isadmin: false,
    avatarUrl:'',
    nickName:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    flag:false,//不显示
    ismember:0, //0 开通会员 ，1我的会员
    expiretime:'',//到期时间

    modelCarCount:0//车模
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()//隐藏转发按钮
    var that = this

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.request({
      url: url.agent_info,
      data: { 'openId': app.globalData.openid },
      success: function (data) {
        console.log('个人主页', data);
        var user = data.data.result;
        var ismember = 0;
        if (user.cardId){
          ismember = user.cardId
        }
        var expiretime = 0;
        if (user.expiredTime) {
          expiretime = util.toDate(user.expiredTime, 'YMDhms');
        }

        that.setData({
          isadmin: app.globalData.isadmin,
          balence: user.balance,
          withdrawAbleBalance: user.withdrawAbleBalance,
          frozenBalance: user.frozenBalance,
          promoteStatus: user.promoteStatus,
          totalIncome: user.totalIncome.toFixed(2),
          citys: user.cities,
          nickName: user.nickName,
          avatarUrl: user.avatarUrl,
          ismember: ismember,
          expiretime: expiretime,
          modelCarCount: user.modelCarCount
        });
        wx.setStorageSync("user", user)  
            
      }
    })

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
  //提现
  onWithdraw: function (e) {
    var that = this;
    wx.navigateTo({
      url: '../withdraw/withdraw?balence=' + that.data.balence,
    })
  },

  //提现记录
  onWithdrawLog: function () {
    var that = this;
    wx.navigateTo({
      url: '../bill/bill?userstatus=agent&balence=' + that.data.balence + '&withdrawAbleBalance=' + that.data.withdrawAbleBalance + '&frozenBalance=' + that.data.frozenBalance,
    })
  },

  //前往发车
  onFache:function(){
    wx.switchTab({
      url: '/pages/market/fache/fache',
    })
  },

  //我要推广
  onMyPromotion: function () {
    var that = this;
    if (wx.getStorageSync('isphone')) {//数据库里有手机号 则不显示
      that.setData({
        flag: false,
      });

      if (that.data.promoteStatus == 0){
        wx.navigateTo({
          url: 'apply-tg/apply-tg',
        })
      } else if (that.data.promoteStatus == 1) {
        util.showToast('推广申请中','loading');
      } else if (that.data.promoteStatus == 2) {
        wx.navigateTo({
          url: 'my-qr/my-qr',
        })
      } else if (that.data.promoteStatus == 3) {
        wx.navigateTo({
          url: 'apply-tg/apply-tg',
        })
      }
    
    } else {
      that.setData({//数据库里没有手机号 则显示
        flag: true,
      })
    }
    
  },
  //推广收益
  onPromotionRevenue: function (e) {
    wx.navigateTo({
      url: 'my-earnings/my-earnings?money=' + e.currentTarget.dataset.money,
    })
  },
  //区域代理
  onRegionalAgents: function () {
    wx.navigateTo({
      url: 'agents-area/agents-area',
    })
  },



  //联系客服
  onPhoneCall: function (e) {
    wx.navigateTo({
      url: "kefu/kefu",
    })
  },

  //二级代理
  erjidaili: function () {
    var that = this;
    if (wx.getStorageSync('isphone')) {//数据库里有手机号 则不显示
      that.setData({
        flag: false,
      });

      if (that.data.promoteStatus == 0) {
        wx.navigateTo({
          url: 'apply-tg/apply-tg',
        })
      } else if (that.data.promoteStatus == 1) {
        util.showToast('推广申请中', 'loading');
      } else if (that.data.promoteStatus == 2) {
        wx.navigateTo({
          url: "my-er/my-er",
        })
      } else if (that.data.promoteStatus == 3) {
        wx.navigateTo({
          url: 'apply-tg/apply-tg',
        })
      }

    } else {
      that.setData({//数据库里没有手机号 则显示
        flag: true,
      })
    }
  },
  //一级代理
  yijidaili: function () {
    wx.navigateTo({
      url: "my-yi/my-yi",
    })
  },
  //后台管理
  onHrefMGR: function (e) {
    wx.navigateTo({
      url: '../admin/admin?balence=' + e.currentTarget.dataset.balence,
    })
  },

  //我的会员
  wodehuiyuan:function(){
    var that = this;
    if (that.data.ismember == 0){
      wx.navigateTo({
        url: '/pages/my/memberopening/memberopening',
      })
    }else {
      wx.navigateTo({
        url: '/pages/my/mymember/mymember?ismember=' + that.data.ismember + '&expiretime=' + that.data.expiretime,
      })
    }
  },

  //获取用户手机号
  getPhoneNumber: function (e) {
    var that = this;
    that.setData({ flag: false })
    console.log(e.detail.errMsg)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || e.detail.errMsg == 'getPhoneNumber:fail:cancel to confirm login') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) {

        }
      })
    } else {

      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '同意授权',
        success: function (res) {
         
          wx.setStorageSync('isphone', true)//本地存是否有手机号信息
          wx.request({
            url: url.phone,
            data: {
              'encryptedData': e.detail.encryptedData,
              'iv': e.detail.iv,
              'sessionKey': app.globalData.session_key,
              'openId': app.globalData.openid,
              //'location': app.globalData.location
            },
            success: function (data) {
              console.log('获取手机号', data);
            }
          })
        }
      })
    }
  },

  //市场收藏
  shichangshoucang:function(){
    wx.navigateTo({
      url: '/pages/my/my-collection/my-collection',
    })
  },

  //我的发布
  wodefabu:function(){
    wx.navigateTo({
      url: '/pages/my/my-homepage/my-homepage',
    })
  },

  //我的订单
  wodedingdan:function(){
    wx.switchTab({
      url: '/pages/order/order-list/order-list',
    })
  },
  //全网封杀
  quanwangfengsha:function(){
    wx.navigateTo({
      url: '/pages/banned/banned',
    })
  },

  //我的车模
  onGirls:function(){
    wx.navigateTo({
      url: '/pages/my/task/task?modelCarCount=' + this.data.modelCarCount,
    })
  },
})