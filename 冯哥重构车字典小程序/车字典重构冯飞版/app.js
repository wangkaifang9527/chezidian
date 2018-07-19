//获取应用实例
var url = require("utils/url.js");//服务列表
//app.js
App({
  /**
   * 生命周期函数--监听小程序初始化
   */
  onLaunch: function (options) {
    var that = this;
    console.log('小程序初始化options:', options);
    //调用API从本地缓存中获取数据

  },

  //获取用户登陆身份
  getUserId: function (cb) {
    //console.log("cb:", cb);
    var that = this;
    
    // 调用接口获取登录凭证（code）进而换取用户登录态信息
    // 包括用户的唯一标识（openid） 及本次登录的 会话密钥（session_key）等
    // 用户数据的加解密通讯需要依赖会话密钥完成。
    wx.login({
      success: function (res) {
        console.log("微信获取登录凭证code:", res);
        if (res.code) {
          wx.request({
            //url:'https://chezidian.chejiwei.com/user/login',
            url: url.login,
            data: { 'code': res.code },
            header: { 'content-type': 'application/json' },
            success: function (data1) {
              console.log('登陆回掉数据', data1);
              that.globalData.session_key = data1.data.result.sessionKey;
              that.globalData.openid = data1.data.result.openid;
              that.globalData.isadmin = data1.data.result.user.admin;
              that.globalData.cellphoneNumber = data1.data.result.user.cellphoneNumber;
             
              //本地存是否有手机号信息
              wx.setStorageSync('isphone', data1.data.result.user.hasCellphoneNumber)
              wx.setStorageSync('newUser', data1.data.result.user.newUser)
              typeof cb == "function" && cb(data1.data.result.user);
              // if (!data1.data.result.user.newUser) {//判断是否是新用户
              //   that.getUserInfo(function (data2) {
              //     console.log('data2', data2.userInfo);
              //     console.log('查看本地openid', that.globalData.openid);
              //     that.globalData.userInfo = data2.userInfo;
              //     wx.request({
              //       //url: 'http://localhost:8080/fours/v1/chewu/account/user',
              //       url: url.user,
              //       data: {
              //         'openId': that.globalData.openid,
              //         'userinfo': data2.userInfo,
              //       },
              //       success: function (data3) {
              //         console.log('data3:新用户入库', data3);
              //         that.globalData.isGetUserInfo = true;

              //         cb(data2.userInfo);
              //       }
              //     })
              //   });
              // } 


            }
          })

        } else {
          wx.hideLoading();
          console.log('获取用户登录态失败！' + res.errMsg)
          wx.showModal({
            title: '提示',
            content: '获取用户登录态失败！',
            success: function (res) {
              if (res.confirm) {

              } else if (res.cancel) {

              }
            }
          })

        }
      },
      fail: function (res) {
        console.log("微信获取登录凭证code失败", res);
      }
    });
  },


  //获取用户信息
  getUserInfo: function (cb) {
    console.log('cb2', cb);
    var that = this
    // if (this.globalData.userInfo) {
    //     typeof cb == "function" && cb(this.globalData.userInfo)
    // } else {
    //获取用户信息
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        console.log('微信获取用户信息：', res);
        that.globalData.userInfo = res
        typeof cb == "function" && cb(that.globalData.userInfo)

      },
      fail: function (res) {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '请允许微信授权，否则无法体验该小程序',
          success: function (res) {
            //重新授权
            wx.openSetting({
              success: (res) => {
                console.log("用户授权openSetting:", res);
                res.authSetting = {
                  "scope.userInfo": true,
                  "scope.userLocation": true
                }
                wx.getSetting({
                  success: (res2) => {
                    console.log("用户授权getSetting：", res2.authSetting);

                    if (!res2.authSetting["scope.userInfo"]) {
                      console.log('用户拒绝授权');
                      wx.authorize({
                        scope: 'scope.userInfo',
                        success() {
                          // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                         // that.getUserInfo(cb)
                        }
                      })
                    } else {
                      that.getUserInfo(cb)
                    }


                  }
                })


              }
            })

          }
        })
      }
    })
    // }
  },


  globalData: {
    userInfo: null,
    times: '',
    times_claim: '',
    openid: null,
    token: null,
    isGetUserInfo: false,
    location: {},
    bg_gary: '/images/bg_gary.png',
    session_key: null,
    isadmin: false,
    cellphoneNumber:'',

  }
})
