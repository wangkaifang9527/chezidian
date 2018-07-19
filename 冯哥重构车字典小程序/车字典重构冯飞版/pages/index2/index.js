//获取应用实例
var app = getApp();
var url = require("../../utils/url.js");//服务列表
var util = require("../../utils/util.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        vin: '',
        plate_num: '',
        issueDate: '',
        times: '',
        times_claim: '',
        // banners: [
        //     'http://oevljwxwv.bkt.clouddn.com/banner/01.jpg',
        //     'http://oevljwxwv.bkt.clouddn.com/banner/02.jpg'
        // ],
        banners: [
          'http://ofp5zlidt.bkt.clouddn.com/1513952041/ebb68136-9533-47b4-bd35-cbdfe0e74ced',
          'http://ofp5zlidt.bkt.clouddn.com/1513952058/0e8b95f6-bc8b-4905-9f83-d953e3360be7'
        ],
        share_title: '查一千次,送一辈子',
        share_path: 'pages/index/index',
        picker_cartype_arr: [],//picker中range属性值
        picker_cartype_index: 0,//picker中value属性值
        cartype_id_arr: [],//存储id数组
        cartypeData: [{
            id: "请选择",
            name: "请选择车型"
        },{
            id: "01",
            name: "大型汽车"
        }, {
            id: "02",
            name: "小型汽车"
        }, {
            id: "03",
            name: "使馆汽车"
        }, {
            id: "04",
            name: "领馆汽车"
        }, {
            id: "05",
            name: "境外汽车"
        }, {
            id: "06",
            name: "外籍汽车"
        }, {
            id: "07",
            name: "普通摩托车"
        }, {
            id: "08",
            name: "轻便摩托车"
        }, {
            id: "09",
            name: "使馆摩托车"
        }, {
            id: "10",
            name: "领馆摩托车"
        }, {
            id: "11",
            name: "境外摩托车"
        }, {
            id: "12",
            name: "外籍摩托车"
        }, {
            id: "13",
            name: "低速车"
        }, {
            id: "14",
            name: "拖拉机"
        }, {
            id: "15",
            name: "挂车"
        }, {
            id: "16",
            name: "教练汽车"
        }, {
            id: "17",
            name: "教练摩托车"
        }, {
            id: "20",
            name: "临时入境汽车"
        }, {
            id: "21",
            name: "临时入境摩托车"
        }, {
            id: "22",
            name: "临时行驶车"
        }, {
            id: "23",
            name: "警用汽车"
        }, {
            id: "24",
            name: "警用摩托"
        }],
        isphone: false,
        flag: false,//不显示
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        var that = this;
        
        // 请求banner
        url.ajaxPost(false, url.banner2, {}, function (data) {
            console.log("服务器返回banner:", data);
            that.setData({
                banners: data.banners.values,
            })
        });

        console.log("是否有用户信息", app.globalData.isGetUserInfo, app.globalData.userInfo);
        // if (!app.globalData.isGetUserInfo) {
        //获取用户登陆身份
        wx.showLoading({ title: "初始化", mask: true });
        app.getUserId(function (data) {
            // that.callBackgetUserId(data)
            wx.hideLoading()
            console.log('身份获取完毕', app.globalData.userInfo);
            that.callBackgetUserId(options);
        });
        // } else {
        //     that.callBackgetUserId(options);
        // }

        var picker_cartype_arr = [],
            cartype_id_arr = [];
        that.data.cartypeData.forEach(function (e) {
            picker_cartype_arr.push(e.name);
            cartype_id_arr.push(e.id);
        })
        that.setData({
            picker_cartype_arr: picker_cartype_arr,
            cartype_id_arr: cartype_id_arr
        });

    },
    //选择车型
    bindCarTypeChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value,)
        this.setData({
            picker_cartype_index: e.detail.value
        })
    },

    //身份获取完毕后回调
    callBackgetUserId: function (options) {
        console.log(options);
        var that = this;
        // 请求分享数据
        // url.ajaxPost('needtoken', url.share, {
        //     page: that.data.share_path
        // }, function (data) {
        //     console.log("服务器返回share文案:", data);
        //     that.setData({
        //         share_title: data.share,
        //     })
        // })

        // 通过别人的分享链接进入的
        if (options.openid) {
            console.log('通过别人的分享链接进入的:', options.openid);
            // url.ajaxPost('needtoken', url.agent_binding, { agent_id: options.openid }, function (data) {
            //     console.log("分享绑定代理商:", data);
            // })
            wx.request({
              url: url.agent_binding,
              data: { agent_id: options.openid, openid: app.globalData.openid },
              success: function (data) {
                console.log("分享绑定代理商:", data);
              }
            })
        }
        // 通过扫描别人的二维码进入的
        if (typeof (options.scene) != 'undefined') {
            console.log('通过扫描别人的二维码进入的:', decodeURIComponent(options.scene));
            url.ajaxPost(false, url.banner, {}, function (data) {
                console.log("请求banner看看服务怎么了1:", data);
            });

            // url.ajaxPost('needtoken', url.agent_binding, { agent_id: decodeURIComponent(options.scene) }, function (data) {
            //     console.log("二维码绑定代理商:", data);
            // }, function (data) {
            //     console.log("二维码绑定失败", data);
            // })
            wx.request({
              url: url.agent_binding,
              data: { agent_id: decodeURIComponent(options.scene), openid: app.globalData.openid },
              success: function (data) {
                console.log("二维码绑定代理商:", data);
              },
              fail: function (data) {
                console.log("二维码绑定失败", data);
              }
            })
            url.ajaxPost(false, url.banner, {}, function (data) {
                console.log("请求banner看看服务怎么了2:", data);
            });
        }



        //获取当前定位
        util.getLocation(function (data) {
            app.globalData.location = data;
        });

        console.log("距离4S查询终身免费还有：", app.globalData.times);
        that.setData({
            times: app.globalData.times,
            times_claim: app.globalData.times_claim
        })
       
        console.log(wx.getStorageSync('isphone'));
        if (wx.getStorageSync('isphone')) {//数据库里有手机号 则不显示
          that.setData({
            flag: false,
          })
        } else {
          that.setData({//数据库里没有手机号 则显示
            flag: true,
          })
        }
        
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
    onShareAppMessage: function (res) {
        var that = this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: that.data.share_title,
            path: that.data.share_path + '?openid=' + app.globalData.openid,
            // imageUrl: that.data.share.imageUrl,
            success: function (res) {
                console.log(app.globalData.openid);
            },
            fail: function (res) {
                // 转发失败
            }
        }

    },

    //  点击日期组件确定事件  
    bindDateChange: function (e) {
        console.log(e.detail.value)
        this.setData({
            issueDate: e.detail.value
        })
    },

    //拍照
    onPhotograph: function () {
        var that = this;
        //从本地相册选择图片或使用相机拍照。
        wx.chooseImage({
            count: 3, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
                // console.log("选择图片:", tempFilePaths)

                wx.showLoading({
                    title: '上传中',
                    success: function () {
                        //将本地资源上传到开发者服务器
                        //其中 content-type 为 multipart/form-data 。
                        wx.uploadFile({
                            url: url.photo_ocr,
                            filePath: tempFilePaths[0],
                            name: 'file',
                            formData: {
                                'upload': tempFilePaths[0],
                            },
                            header: {// 设置请求的 header
                                'content-type': 'multipart/form-data',
                                'Token': wx.getStorageSync('token')
                            },
                            success: function (res) {
                                console.log('图片匹配返回：', res);
                                var data = JSON.parse(res.data);
                                if (data.plate_num == '' || data.vin == '') {
                                    // util.showToast('');
                                }
                                that.setData({
                                    plate_num: data.plate_num,
                                    vin: data.vin,
                                    issueDate: data.issue_date
                                })
                                wx.hideLoading();
                                util.showToast("上传成功", "success", 800)
                            },
                            fail: function (res) {
                                wx.showModal({
                                    title: '提示',
                                    content: '图片上传识别失败，请重试',
                                })
                            }
                        })
                    }
                })
            }
        })
    },


    //提交表单
    formSubmit: function (e) {
        var that=this;
        var post_data = e.detail.value;
        var tip_money = '';
        switch (e.detail.target.id) {//判断是哪个id的按钮
            case 'onQueryMaintainLog':
                console.log('查询车辆信息')
                post_data.type = "info";
                tip_money = '查询车辆信息';
                break;
            case 'onQueryAccidentLog':
                console.log('查询车辆及投保信息')
                post_data.type = "baodan";
                tip_money = '查询车辆及投保信息';
                break;
        }
        if (post_data.license == '') {
            util.showToast('请输入车牌号', 'error');
            return;
        }
        //获取当前定位
        util.getLocation(function (data) {
            app.globalData.location = data
        });

        post_data.location = app.globalData.location
        post_data.cartype = that.data.cartype_id_arr[e.detail.value.cartype];
        post_data.openid = app.globalData.openid;
        post_data.access_token = app.globalData.token;
        if (post_data.cartype=="请选择"){
            util.showToast('请选择车型', 'error');
            return;
        }
        console.log('form数据:', post_data);
        wx.showModal({
          title: '提示',
          content: '确认查询' + tip_money + '?',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              //ajax
              wx.showLoading({
                title: "提交中"
              });
              wx.request({
                //url: 'http://localhost:8080/guohubao/v1/chewu/order/new2',
                url: url.agent_order_new2,
                data: { 'post_data': post_data },
                header: { 'Content-Type': 'application/json;charset=UTF-8;' },
                success: function (data) {
                  console.log('请求订单回掉', data)
                  wx.hideLoading()
                  //发起微信支付
                  wx.requestPayment({
                    'timeStamp': data.data.timeStamp,
                    'nonceStr': data.data.nonceStr,
                    'package': data.data.package,
                    'signType': 'MD5',
                    'paySign': data.data.paySign,
                    'success': function (res) {
                      console.log(res);
                      wx.showModal({
                        title: '提示',
                        content: '支付成功！稍后记录会反馈到您的订单，请注意查收～',
                        success: function (res) {
                          if (res.confirm) {
                            wx.setStorageSync('package', data.data.package);
                            wx.switchTab({
                              url: "../order/order-list/order-list",
                            })
                          } else if (res.cancel) {

                          }
                        }
                      })
                    },
                    'fail': function (res) {
                      console.log(res);
                    }
                  })

                }
              })
            }
          }
        })
        // wx.showModal({
        //     title: '提示',
        //     content: '确认' + tip_money + '?',
        //     success: function (res) {
        //         if (res.confirm) {
        //             // console.log('用户点击确定')
        //             //ajax
        //             wx.showLoading({
        //                 title: "提交中"
        //             });
        //             url.ajaxPost('needtoken', url.agent_order_new2, post_data, function (data) {
        //                 console.log(data)
        //                 wx.hideLoading()
        //                 //发起微信支付
        //                 wx.requestPayment({
        //                     'timeStamp': data.info.timeStamp,
        //                     'nonceStr': data.info.nonceStr,
        //                     'package': data.info.package,
        //                     'signType': data.info.signType,
        //                     'paySign': data.info.paySign,
        //                     'success': function (res) {
        //                         wx.showModal({
        //                             title: '提示',
        //                             content: '支付成功！稍后记录会反馈到您的订单，请注意查收～',
        //                             success: function (res) {
        //                                 console.log("支付成功:", res);
        //                                 if (res.confirm) {
        //                                     wx.switchTab({
        //                                         url: "../order/order-list/order-list",
        //                                     })
        //                                 } else if (res.cancel) {

        //                                 }
        //                             }
        //                         })

        //                     },
        //                     'fail': function (res) {
        //                         util.showToast('支付失败', 'error');
        //                     }
        //                 })
        //             }, function (data) {
        //             });
        //         } else if (res.cancel) {
        //             // console.log('用户点击取消')
        //             return false;
        //         }
        //     }
        // })




    },

    //不知道车架号在哪？
    onHrefChassisNumber: function () {
        wx.navigateTo({
            url: 'doc-chassis-number/doc-chassis-number'
        })
    },

    //rule
    onRuleUser: function () {
        wx.navigateTo({
            url: '../rule/user/user'
        })
    },

    getPhoneNumber: function (e) {
      var that = this;
      console.log(e.detail.errMsg)
      console.log(e.detail.iv)
      console.log(e.detail.encryptedData)
      if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || e.detail.errMsg == 'getPhoneNumber:fail:cancel to confirm login') {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '未授权',
          success: function (res) {
            that.setData({ flag: true })
           }
        })
      } else {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '同意授权',
          success: function (res) { 
            wx.request({
              url: url.phone,
              //url:'http://localhost:8080/guohubao/v1/chewu/account/phone',
              data:{
                'encryptedData': e.detail.encryptedData,
                'iv': e.detail.iv,
                'session_key': app.globalData.session_key,
                'openId': app.globalData.openid
              },
              success:function(data){
                console.log('获取手机号',data);
              }
            })
          }
        })
      }
    } ,
    //显示
    a: function () {
      this.setData({ flag: true })
    },
    b: function () {
      this.setData({ flag: false })
    } 
})