// pages/market/market.js
var app = getApp();
var url = require("../../utils/url.js");//服务列表
var util = require("../../utils/util.js");
var area = require('../../data/area.js');
var count = 0;//加载页
var size = 20;//每页加载条数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],//渲染数据
    isEmpty: true,//第一次为空
    isloading: false,//
    isloadover: false,//

    change_flag:true,//图文与9宫格切换
    pinglun_flag:false,//点击评论出险
    tuwen_url:'/images/chonggou/shichang/tuwenbai.png',
    jiugongge_url:'/images/chonggou/shichang/jiugonggehei.png',
  
    path: 'pages/market/details/details',//分享的页面路径
    list: [] ,
    cheliangxingzhi: 0,
    //0.全部,1.过户车 2抵押车 3离我最近, 4.车龄最短 5.里程最少 6.价格最低 7.事故车，8.收藏车

    pinpai:0.3,
    guohuche: 0.3,
    diyache: 0.3,
    liwozuijin: 0.3,
    saixuan: 0.3,

    array: ['筛选', '车龄最短', '里程最少', '价格最低', '事故车','摩托车'],
    index: 0,
    city:'全国',
    focus:false, 
    hidden:true,
    pinglun_value:'',
    vehicleId:-1,//车辆id
    i:-1,
    pos:'fixed',
    mar_top:'210rpx',

    videoflag:true,//播放视频的遮罩层
    mp4:'',

    fixed:'',
    background:'rgba(255, 255, 255, 0)',

    top:0,

    forwardCount:0,//转发的次数每天限时5次有车模
    scrollTop:0,
    vehicleSearch:'输入关键字搜索'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()//隐藏转发按钮
    var that = this;
    var sv  = wx.getStorageSync('ShareVehicleSourceAmount');
    var svTime = wx.getStorageSync('ShareVehicleSourceTime');
    var date = util.toDate(new Date().getTime(), 'YMD');
    if (svTime == date){
      that.setData({
        forwardCount: sv,
      });
    }
    
    that.setData({
      list: [],//渲染数据
      isEmpty: true,//第一次为空
      isloading: false,//
      isloadover: false,//
    })
    count = 0;
    wx.showLoading({ title: "提交中" });
    url.ajaxGet(false, url.souche, {
      openId: app.globalData.openid,
      location: app.globalData.location,
      start: count
    }, function (data) {
      console.log("车辆列表:", data);
      that.callbackData(data);
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var city = wx.getStorageSync('city');
    if (city) {
      that.setData({
        city:city,
        list: [],//渲染数据
        isEmpty: true,//第一次为空
        isloading: false,//
        isloadover: false,//
      });
      count = 0;
      url.ajaxGet(false, url.souche, {
        openId: app.globalData.openid,
        keyword: city,
        start: count,
      }, function (data) {
        console.log("城市:", data);
        wx.setStorageSync('city','');
        that.callbackData(data);
      });
    }
    var vehicleSearch = wx.getStorageSync('vehicleSearch');
    if (vehicleSearch) {
      that.setData({
        vehicleSearch: vehicleSearch,
        list: [],//渲染数据
        isEmpty: true,//第一次为空
        isloading: false,//
        isloadover: false,//
      });
      count = 0;
      url.ajaxGet(false, url.souche, {
        openId: app.globalData.openid,
        keyword: vehicleSearch,
        start: count,
      }, function (data) {
        console.log("关键词:", data);
        wx.setStorageSync('vehicleSearch', '');
        that.callbackData(data);
      });
    }
    
  },


  


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    
    console.log('下拉刷新');
    this.setData({
      pos: '',
      mar_top: '0',
      pinpai: 0.3,
      guohuche: 0.3,
      diyache: 0.3,
      liwozuijin: 0.3,
      saixuan: 0.3,
      index:0,
    })
    wx.showNavigationBarLoading();//在当前页面显示导航条加载动画。
    this.setData({
      isloading: true,
      isloadover: false,
      isEmpty: true,
    });
    count = 0;//加载页
    url.ajaxGet(false, url.souche, {
      openId: app.globalData.openid,
      location: app.globalData.location,
      start: count
    }, function (data) {
      console.log("车辆列表:", data);
      wx.stopPullDownRefresh() //停止当前页面的下拉刷新。
      wx.showTabBar({
      })
      that.setData({
        pos: 'fixed',
        mar_top: '210rpx',
        city: '全国',
        vehicleSearch: '输入关键字搜索',
      });
      that.callbackData(data);
      wx.showTabBar()
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
    console.log('加载更多');
    var that = this;
    var cheliangxingzhi = that.data.cheliangxingzhi;
    var targetOpenId=''    //对方的openId
    var type1 = ''         // 1 抵押车  2收藏车  3 事故车 可多选，用,隔开  可空
    var excludeType = ''   // 空：查包含type   非空：查不含type  可空
    var property = ''      // 	1 非营运 2营运  可空
    var keyword = ''       // 关键词搜索 可空 ，包含 城市，模糊搜索
    var status = ''        // 1 在售 2已成交  3删除 可空
    var orderBy = ''       //1 按时间排序  2 按车龄  3按公里数  4按价格  5按距离    可空
    var sort = ''          //  0：正序  空时默认倒序   可空
    if(that.data.city!='全国'){
      keyword = that.data.city;
    }
    switch (cheliangxingzhi){
      
      case 1:
        type1 = 1;
        excludeType = 1;
      case 2:
        type1 = 1;
      case 3:
        orderBy = 5
      case 4: 
        orderBy = 2
      case 5:
        orderBy = 3
      case 6:
        orderBy = 4
      case 7:
        type1 = 3
      case 8:
        type1 = 2
    }
    if (this.data.isloadover) {
      return false;
    }
    count++;
    url.ajaxGet(false, url.souche, {
      openId: app.globalData.openid,
      type:type1,
      excludeType: excludeType,
      keyword:keyword,
      orderBy:orderBy,
      location: app.globalData.location,
      start: count,

    }, function (data) {
      console.log("车辆列表:", data);
      
      that.callbackData(data);
    });
  },

  //回调数据
  callbackData: function (data) {
    wx.hideLoading();
    var that = this;
    var orders_data = [];
    if (data.resultCode != 1) {
      that.setData({
        isloadover: true
      });
      console.log('未初始化完或者非法进入');
      return;
    }
    var vehicleList = data.result.vehicleList;
    for (var i = 0; i < vehicleList.length;i++){
      // vehicleList[i].createTime = util.toDate(vehicleList[i].createTime, 'hm');
      vehicleList[i].createTime = util.timeBefore(vehicleList[i].createTime);
      vehicleList[i].distance = util.divide1000(vehicleList[i].distance);
      if (vehicleList[i].price != null && vehicleList[i].price != '' && vehicleList[i].price != undefined && vehicleList[i].price != 'undefined' ){
        if (vehicleList[i].price.toString().length>6){
          vehicleList[i].price = vehicleList[i].price.toString().substring(0,6);
        }
      }
      for(var j = 0; j < vehicleList[i].images.length;j++){
        vehicleList[i].images[j] = vehicleList[i].images[j].replace('.mp4','.jpg');
        vehicleList[i].images[j] = url.qiniu + vehicleList[i].images[j] + url.qiniu_compress;
      }

      vehicleList[i].location = vehicleList[i].location.split(',')[1];
      if (vehicleList[i].type != '' && vehicleList[i].type != null){
        vehicleList[i].xz = [];
        var xx = vehicleList[i].type.split(',');
        for(var j=0;j<xx.length;j++){
          vehicleList[i].xz.push(xx[j]);
        }
        // vehicleList[i].xz.push(vehicleList[i].type.split(',')[0]);
        // vehicleList[i].xz.push(vehicleList[i].type.split(',')[1]);
      }

    }
    if (vehicleList.length == size) {
      // console.log('持续加载');
    } else {
      that.setData({
        isloadover: true
      });
      console.log('所有数据加载完毕');
    }
    if (!that.data.isEmpty) {
      console.log('非第一次加载');
      orders_data = that.data.list.concat(vehicleList);//连接多个数组
    } else {
      console.log('初次加载');
      orders_data = vehicleList;
      that.setData({
        isEmpty: false
      });
    }
    console.log('列表数据:', vehicleList);
    //更新数据
    that.setData({
      list: orders_data,
      isloading: false
    });

    wx.hideNavigationBarLoading() //隐藏导航条加载动画。
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    console.log('res', res);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log('button', res.target)
    }
    return {
      title: '车辆详细信息',
      path: that.data.path + "?id_="+res.target.dataset.id,
      // imageUrl: that.data.share.imageUrl,
      success: function (res1) {
        console.log(app.globalData.openid);
        if (that.data.forwardCount >= 3){
          util.showToast('3次已用完', 'error');
          return;
        }
        url.ajaxPost(false, url.shareVehicle, {
          openId: app.globalData.openid,
          vehicleId: res.target.dataset.id
        }, function (data) {
          console.log("分享车源回掉:", data);
          util.showToast('获取一个车模', 'success');
          var count = that.data.forwardCount + 1
          that.setData({
            forwardCount: count
          });
          wx.setStorageSync('ShareVehicleSourceAmount', count);
          wx.setStorageSync('ShareVehicleSourceTime', util.toDate(new Date().getTime(), 'YMD'));
        });

      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //输入关键字搜索
  search:function(){
    wx.navigateTo({
      url: 'search/search',
    })
  },

  //选择城市
  xuanzechengshi:function(){
    wx.navigateTo({
      url: 'area/area',
    })
  },
  //评论失焦事件
  bindblur:function(){
    var that = this;
    that.setData({
      focus: false,
      hidden: true,
      pinglun_value:'',
    });
  },
  //发送评论
  bindconfirm:function(){
    var that = this;
    that.setData({
      focus: false,
      hidden: true,
    });
    var content = that.data.pinglun_value;
    if (content == ''){
      util.showToast('评论不能为空','success');
        return;
    }
    //评论
    url.ajaxPost(false, url.comment_comment, {
      openId: app.globalData.openid, 
      vehicleId: that.data.vehicleId,
      content: that.data.pinglun_value
    }, function (data) {
      console.log("评论回调:", data, app.globalData.userInfo);
      var userInfo = app.globalData.userInfo;
      var pin = {
        'avatarUrl': userInfo.avatarUrl,
        'nickName': userInfo.nickName,
        'content': content,
        'commentTime': util.toDate(new Date().getTime(), 'YMDhms'),
      };
      var contents = [];
      contents.push(pin);
      var list = that.data.list;
      var comments = list[that.data.i].comments;
      for (var i = 0; i < comments.length;i++){
        contents.push(comments[i]);
      }
      list[that.data.i].comments = contents;
      list[that.data.i].commentCount = list[that.data.i].commentCount+1;

      that.setData({
        list: list,
        pinglun_value:'',
      })
      
    });

  },
  bindinput:function(e){
    console.log(e.detail.value);
    this.setData({
      pinglun_value: e.detail.value
    });

  },

  //评论
  pinglun:function(e){
    console.log(e);
    var that = this;
    that.setData({
      focus:true,
      hidden:false,
      vehicleId: e.currentTarget.dataset.vehicleid,
      i: e.currentTarget.dataset.i,
    });
 
  },
  //评论区
  pinglunqu: function (e) {
    console.log(e);
    var that = this;
    that.setData({
      focus: true,
      hidden: false,
      vehicleId: e.currentTarget.dataset.vehicleid,
      i: e.currentTarget.dataset.i,
    });

  },

  //收藏
  shoucang:function(e){
    console.log(e);
    var that = this;
    var list = that.data.list;
    console.log('车辆的ID',list[e.currentTarget.dataset.i].id);
    if (list[e.currentTarget.dataset.i].favorite){
      //取消收藏
      url.ajaxPost(false, url.favorite_remove, {
        openId: app.globalData.openid,
        vehicleId: list[e.currentTarget.dataset.i].id,
      }, function (data) {
        console.log("取消收藏返回:", data);
        util.showToast('取消收藏', 'success');
        list[e.currentTarget.dataset.i].favorite = false;
        list[e.currentTarget.dataset.i].collectCount = list[e.currentTarget.dataset.i].collectCount-1;
        that.setData({
          list: list
        });
      });

    }else{
      //收藏车辆
      url.ajaxPost(false, url.favorite_collect, {
        openId: app.globalData.openid,
        vehicleId: list[e.currentTarget.dataset.i].id,
      }, function (data) {
        console.log("收藏车辆返回:", data);
        util.showToast('已收藏', 'success');
        list[e.currentTarget.dataset.i].favorite = true;
        list[e.currentTarget.dataset.i].collectCount = list[e.currentTarget.dataset.i].collectCount +1;
        that.setData({
          list: list
        });
      });

    }
    
  },
  //加号
  jiahao:function(){
    wx.navigateTo({
      url: 'fache/fache',
    })
  },
  //图文列表
  tuwen: function () {
    var that = this;
    var change_flag = that.data.change_flag;
    if (change_flag){
      that.setData({
        change_flag: false,
        tuwen_url: '/images/chonggou/shichang/jiugonggebai.png',
      });
    }else{
      that.setData({
        change_flag: true,
        tuwen_url: '/images/chonggou/shichang/tuwenbai.png',
      });
    }
    
  },
  //九宫格列表
  jiugongge: function () {
    this.setData({
      change_flag: false,
      tuwen_url: '/images/chonggou/shichang/tuwenhei.png',
      jiugongge_url: '/images/chonggou/shichang/jiugonggebai.png',
    });
  },
  //品牌
  pinpai: function () {
    // wx.navigateTo({
    //   url: 'brand/brand',
    // })
  },
  //过户车
  guohuche:function(){
    var that = this;
    that.setData({
      cheliangxingzhi:1,
      list:'',
      isEmpty:true,
      guohuche: 1,
      diyache: 0.3,
      liwozuijin: 0.3,
      saixuan: 0.3,
    })
    var type = 1;
    var excludeType =1;
    var orderBy = '';
    var sort = '';
    that.gonggongfangfa(that, type, excludeType, orderBy,sort);
    
  },
  //抵押车
  diyache:function(){
    var that = this;
    that.setData({
      cheliangxingzhi: 2,
      list: '',
      isEmpty: true,
      guohuche: 0.3,
      diyache: 1,
      liwozuijin: 0.3,
      saixuan: 0.3,
    })
    var type = 1;
    var excludeType = '';
    var orderBy = '';
    var sort = '';
    that.gonggongfangfa(that, type, excludeType, orderBy,sort);
  },
  //离我最近
  liwozuijin:function(){
    var that = this;
    that.setData({
      cheliangxingzhi: 3,
      list: '',
      isEmpty: true,
      guohuche: 0.3,
      diyache: 0.3,
      liwozuijin: 1,
      saixuan: 0.3,
    })
    var type = '';
    var excludeType = '';
    var orderBy = '5';
    var sort = '';
    that.gonggongfangfa(that, type, excludeType, orderBy,sort);
  },
  //筛选
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var that = this;
    that.setData({
      index: e.detail.value,
      isEmpty: true,
      guohuche: 0.3,
      diyache: 0.3,
      liwozuijin: 0.3,
      saixuan: 0.3,
    });
    var cheliangxingzhi = '';//车辆性质
    var type = '';
    var excludeType = '';
    var orderBy = ''
    var sort = '';
    if (e.detail.value != 0) {
      if (e.detail.value == 1){
        orderBy='2'
        cheliangxingzhi = 4
      } else if (e.detail.value == 2){
        orderBy = '3'
        cheliangxingzhi = 5
        sort = 0;
      } else if (e.detail.value == 3) {
        orderBy = '4'
        cheliangxingzhi = 6
        sort = 0;
      } else if (e.detail.value == 4) {
        type=3
        cheliangxingzhi = 7
      } else if (e.detail.value == 5) {
        type = 2
        cheliangxingzhi = 8
      }
      that.setData({
        cheliangxingzhi: cheliangxingzhi,
        list: '',
        isEmpty: true,
        guohuche: 0.3,
        diyache: 0.3,
        liwozuijin: 0.3,
        saixuan: 1,
      });
    }
    that.gonggongfangfa(that, type, excludeType, orderBy,sort);
  },

  gonggongfangfa: function (that, type, excludeType, orderBy, sort) {
    count = 0;
    url.ajaxGet(false, url.souche, {
      openId: app.globalData.openid,
      type: type,
      excludeType: excludeType,
      orderBy: orderBy,
      start: count,
      sort: sort,
    }, function (data) {
      console.log("过户车:", data);
      that.callbackData(data);
    });
  },





  //预览图片
  lookImg: function (e) {
    console.log('预览图片',e);
    //获取图片信息
    var that = this;
    var imgurl = e.currentTarget.dataset.images;
    wx.previewImage({
      current: imgurl[e.currentTarget.dataset.i], // 当前显示图片的http链接
      urls: imgurl// 需要预览的图片http链接列表
    })
  },
  //详情
  xiangqing:function(e){
    console.log('详情',e);
    wx.navigateTo({
      url: 'details/details?id=' + e.currentTarget.dataset.id,
    })
  },

  
  //点击头像进入个人主页
  zhuye:function(e){
    console.log(app.globalData.openid, e.currentTarget.dataset.openid, app.globalData.openid == e.currentTarget.dataset.openid);
    if (app.globalData.openid == e.currentTarget.dataset.openid){
      wx.navigateTo({
        url: '/pages/my/my-homepage/my-homepage',
      })
    }else{
      wx.navigateTo({
        url: '/pages/my/his-homepage/his-homepage?targetOpenId=' + e.currentTarget.dataset.openid,
      })
    }
  },

  //点击九宫格图片
  jiugonggetupian:function(e){

    wx.navigateTo({
      url: 'details/details?id=' + e.currentTarget.dataset.id,
    })
 
  },

  //播放视频
  bofangshipin:function(e){
    console.log('播放视频', e);
    var name = e.currentTarget.dataset.name;
    name = name.replace('.jpg','.mp4');
    this.setData({
      videoflag:false,
      mp4:name,
    });
  },
  //关闭遮罩
  guanbizhezhao:function(){
    this.setData({
      videoflag: true,
    });
  },

  onPageScroll: function (event) {
 
    if (event.scrollTop > 55) {
      this.setData({
        fixed: 'fixed',
        background: 'rgba(28, 43, 60, 1)'
      })
    } else if (event.scrollTop > 53) {
      this.setData({
        background: 'rgba(28, 43, 60, 0.9)'
      })
    } else if (event.scrollTop > 51) {
      this.setData({
        background: 'rgba(28, 43, 60, 0.8)'
      })
    } else if (event.scrollTop > 49) {
      this.setData({
        background: 'rgba(28, 43, 60, 0.7)'
      })
    } else if (event.scrollTop > 47) {
      this.setData({
        background: 'rgba(28, 43, 60, 0.6)'
      })
    } else if (event.scrollTop > 45) {
      this.setData({
        background: 'rgba(28, 43, 60, 0.5)'
      })
    } else if (event.scrollTop > 43) {
      this.setData({
        background: 'rgba(28, 43, 60, 0.4)'
      })
    } else if (event.scrollTop > 41) {
      this.setData({
        background: 'rgba(28, 43, 60, 0.3)'
      })
    } else if (event.scrollTop > 39) {
      this.setData({
        background: 'rgba(28, 43, 60, 0.2)'
      })
    } else if (event.scrollTop > 37) {
      this.setData({
        background: 'rgba(28, 43, 60, 0.1)'
      })
    }else{
      this.setData({
        fixed: '',
        background: 'rgba(255, 255, 255, 0)'
      })
    }
  },

  // //手指触摸动作开始
  // start: function (event){
  //   console.log(event);
   
  // },
  // //手指触摸动作开始
  // move: function (event) {
  //   setTimeout(function () {
  //     wx.hideTabBar()
  //   }, 0);
  // },
  // //手指触摸动作结束
  // end: function (event){
  //   setTimeout(function () {
  //     wx.showTabBar()
  //   }, 500);
    
  // },


  
})