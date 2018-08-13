//获取应用实例
var app = getApp();
var url = require("../../utils/url.js");//服务列表
var util = require("../../utils/util.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        info:{},//渲染数据
        balence:'',
        agent:'',
        agent_apply:'',
        order:'',
        withdrawCount:'',

        withdrawAbleBalance: 0,
        frozenBalance: 0,
        promoterCountToAudit:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()//隐藏转发按钮
        console.log(options);
        var that= this;
        that.setData({
          balence: options.balence,
          withdrawAbleBalance: options.withdrawAbleBalance
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
    onShow: function () {
        wx.setStorageSync('agent_list_offsetTop', 0)
        wx.setStorageSync('agent_detail_index', null) 
        var that = this;
        wx.request({
          url: url.admin_info,
          data: { openId: app.globalData.openid},
          success:function(data){
            console.log("管理员信息",data);
            if(data.data.resultCode==1){
              that.setData({
                agent: data.data.result.summary.agentsCount,
                agent_apply: data.data.result.summary.agentsCountToAudit,
                order: data.data.result.summary.orderCount,
                withdrawCount: data.data.result.summary.withdrawCount,
                promoterCountToAudit: data.data.result.summary.promoterCountToAudit,
              })
            }
           
           
          }
        })
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
    //提现
    onWithdraw: function () {
        wx.navigateTo({
          url: '../withdraw/withdraw?balence=' + this.data.withdrawAbleBalance+'&id=admin',
        })
    },
    //资金明细
    onBill: function () {
        wx.navigateTo({
          url: '../bill/bill?userstatus=admin&balence=' + this.data.balence,
        })
    },
    //提现审核
    onWithdrawAudit: function () {
        wx.navigateTo({
            url: 'withdraw-audit/withdraw-audit',
        })
    },
    //推广人审核
    onPromotersAudit:function(){
      wx.navigateTo({
        url: '/pages/admin/promoters-audit/promoters-audit',
      })
    },
    //推广人
    onPromoters: function () {
      wx.navigateTo({
        url: '/pages/admin/promoters/promoters',
      })
    },
    //代理商审核
    onAgentAudit: function () {
        wx.navigateTo({
            url: 'agent-audit/agent-audit',
        })
    },
    //代理商
    onAgent: function () {
        wx.navigateTo({
            url: 'agent-list/agent-list',
        })
    },
    //订单管理
    onHrefOrder: function () {
        wx.navigateTo({
            url: "../order/order-list-admin/order-list",
        })
    },
    //数据统计
    onHrefOrderDetails: function () {
      wx.navigateTo({
        url: "data-statistics/data-statistics",
      })
    },
   
})