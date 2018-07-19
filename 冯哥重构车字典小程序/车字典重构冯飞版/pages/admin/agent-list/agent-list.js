//获取应用实例 所有代理商
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");

var count = 0;//加载页
var size = 20;//每页加载条数
var post_list_url = url.admin_agent_list

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],//渲染数据
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
        var that=this;
        that.setData({
            list: [],//渲染数据
            isEmpty: true,//第一次为空
            isloading: false,//
            isloadover: false,//
        })
        //ajax
        count = 0;
        wx.showLoading({ title: "加载中" });
        // url.ajaxPost('needtoken', post_list_url, {
        //     count: count
        // }, that.callbackData);
        wx.request({
          //url: 'http://localhost:8080/guohubao/v1/chewu/admin/agent/list',
          url: post_list_url,
          data: { start: count, openId: app.globalData.openid },
          success: function (data) {
            that.callbackData(data);
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
    //操作单个
    onAgentUpdate: function (e) {
        // console.log("记录高度：", e.target.offsetTop);
        // wx.setStorageSync('agent_list_offsetTop', e.target.offsetTop)

        console.log('记录数据', this.data.list[e.currentTarget.dataset.i]);

        wx.setStorageSync('agent_detail', this.data.list[e.currentTarget.dataset.i])
        wx.setStorageSync('agent_detail_index', e.currentTarget.dataset.i)
        wx.navigateTo({
            url: '../agent-update/agent-update',
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
      
        wx.request({
          //url: 'http://localhost:8080/guohubao/v1/chewu/admin/agent/list',
          url: post_list_url,
          data: { start: count, openId: app.globalData.openid },
          success: function (data) {
            wx.stopPullDownRefresh() //停止当前页面的下拉刷新。
            that.callbackData(data);
          }
        })

    },

    // 加载更多
    onReachBottom: function () {
        console.log('加载更多');

        var that = this;
        if (that.data.isloadover) {
            return false;
        }
        count++;
        wx.request({
          //url: 'http://localhost:8080/guohubao/v1/chewu/admin/agent/list',
          url: post_list_url,
          data: { start: count, openId: app.globalData.openid },
          success: function (data) {
            that.callbackData(data);
          }
        })
    },

    //回调数据
    callbackData: function (data) {
        var that = this;
        var datas = [];
        wx.hideLoading();
        console.log(data);

        if (data.data.resultCode != 1) {
          that.setData({
            isloadover: true
          });
          console.log('未初始化完或者非法进入');
          return;
        }
        data.list = data.data.result.agentList;
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
              data.list[i].time_long = util.toDate(data.list[i].applyTime, 'YMDhms');

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


        //滚动条高度设置
        // if (wx.getStorageSync('agent_list_offsetTop') > 0) {
        //     wx.pageScrollTo({
        //         scrollTop: wx.getStorageSync('agent_list_offsetTop')
        //     })
        //     console.log("设置高度", wx.getStorageSync('agent_list_offsetTop'));
        //     // wx.setStorageSync('agent_list_offsetTop', 0)
        // } else {
        // }

    },


})