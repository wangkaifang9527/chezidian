//获取应用实例
var app = getApp();
var url = require("../../utils/url.js");//服务列表
var util = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        vin: '',
        plate_num: '',
        issueDate: '',
        times: '',
        times_claim: '',
        engine_num:'',
        banners: [
          'http://www.levau.com/banner/banner1.png',
        ],
        share_title: '微信里的二手车市场 ，朋友圈的车源都发这！',
        share_path: 'pages/index/index',
        isphone: false,
        flag: false,//不显示
        istype:true,//默认选择类型,
        isnumber:false,//当用户选择4s和上海车辆出险 不需要显示车牌
        picker_cartype_arr1: [],//picker中range属性值
        picker_cartype_index1: 0,//picker中value属性值
        cartype_id_arr1: [],//存储id数组
        cartypeData1:[
          {
            id: "00",
            name: "请选择查询类型",
            typename:'00',
          }, {
            id: "01",
            name: "4S维保记录",
            typename: 'cbs',
          }, {
            id: "02",
            name: "全国车辆定损记录",
            typename: 'claim',
          }, {
            id: "03",
            name: "上海车辆定损记录(数据完整)",
            typename: 'claim2',
          }, {
            id: "04",
            name: "车辆状态记录",
            typename: 'info',
          }, {
            id: "05",
            name: "投保信息记录",
            typename: 'baodan',
          },
          
        ],
        picker_cartype_arr: [],//picker中range属性值
        picker_cartype_index: 0,//picker中value属性值
        cartype_id_arr: [],//存储id数组
        cartypeData: [ {
          id: "02",
          name: "小型汽车"
        }, {
          id: "01",
          name: "大型汽车"
        },  {
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
        index:'0',
        array:[
          {
            id: "1",
            name: "全国车辆定损记录"
          },{
            id: "2",
            name: "上海车辆定损记录(数据完整)"
          }
        ],
        color1:"#333",
        color2: "#999",
        color3: "#999",
        color4: "#999",
        margin:"0",//外边距 0 ,24, 46,70
        chaxuntype:'1',//查询类型
        volume:'1',//音量 0-1
        labaurl:'../../images/laba.png',//音量的图片

        userflag:true,

        payflag:true,//支付遮罩
        priceType:true,
        modelType:false,
        payType:1, //1.余额支付，2.车模支付
        shanchutupian:[],
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
            banners: data.result.bannerList,
          })
        });
      
        console.log("是否有用户信息", app.globalData.isGetUserInfo, app.globalData.userInfo);
        // if (!app.globalData.isGetUserInfo) {
        //获取用户登陆身份
        wx.showLoading({ title: "初始化", mask: true });
        app.getUserId(function (data) {
            wx.hideLoading();
            console.log('身份获取完毕之前', data);
            that.callBackgetUserId(options, data);
        });
        
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

        var picker_cartype_arr1 = [],
          cartype_id_arr1 = [];
        that.data.cartypeData1.forEach(function (e) {
          picker_cartype_arr1.push(e.name);
          cartype_id_arr1.push(e.id);
        })
        that.setData({
          picker_cartype_arr1: picker_cartype_arr1,
          cartype_id_arr1: cartype_id_arr1
        });

        var picker_cartype_arr2 = [],
        cartype_id_arr2 = [];
        that.data.array.forEach(function (e) {
          picker_cartype_arr2.push(e.name);
          cartype_id_arr2.push(e.id);
        })
        that.setData({
          array: picker_cartype_arr2,
          
        });
        
        
    },

    //选择查询类型
    bindCarTypeChange1: function (e) {
      console.log('picker1发送选择改变，携带值为', e.detail.value, )
      this.setData({
        picker_cartype_index1: e.detail.value
      });
      if (e.detail.value == '1' || e.detail.value == '2'|| e.detail.value == '3'){
        this.setData({
          istype: true,
        });
        if (e.detail.value == '1' || e.detail.value == '3'){
          this.setData({
            isnumber: false,
          });
        }else{
          this.setData({
            isnumber: true,
          });
        }
      }else{
        this.setData({
          istype: false,
          isnumber: true,
        });
      }
      
    },
    //选择车辆类型
    bindCarTypeChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value, )
      this.setData({
        picker_cartype_index: e.detail.value
      })
    },
    //身份获取完毕后回调
    callBackgetUserId: function (options,data) {
      console.log('身份获取完毕后回调',options,data);
        var that = this;
        // 通过别人的分享链接进入的
        if (options.openid) {
            console.log('通过别人的分享链接进入的:', options.openid);
            wx.request({
              url: url.agent_binding,
              data: { promoterOpenId: options.openid, openId: app.globalData.openid},
              success:function(data){
                console.log("分享绑定代理商:", data);
              }
            })
        }
        // 通过扫描别人的二维码进入的
        if (typeof (options.scene) != 'undefined') {
            console.log('通过扫描别人的二维码进入的:', decodeURIComponent(options.scene));
            wx.request({
              url: url.agent_binding,
              data: { promoterOpenId: decodeURIComponent(options.scene), openId: app.globalData.openid },
              success: function (data) {
                console.log("二维码绑定代理商:", data);
              },
              fail:function(data){
                console.log("二维码绑定失败", data);
              }
            })
            
        }
        //获取当前定位
        util.getLocation(function (data) {
            app.globalData.location = data;
        });

        //检查用户是否授权
        wx.getSetting({
          success(res) {
            console.log('检查授权情况', res);
            if (res.authSetting['scope.userInfo']) {
             
              wx.getUserInfo({
                withCredentials: false,
                success: function (res) {
                  console.log('用户信息',res);
                  app.globalData.userInfo = res.userInfo;
                  if (res.userInfo.nickName == data.nickName && res.userInfo.avatarUrl == data.avatarUrl){
                    
                  }else{
                    wx.request({
                      url: url.user,
                      data: {
                        'openId': data.openId,
                        'userInfo': res.userInfo,
                      },
                      success: function (data3) {
                        console.log('头像和昵称入库', data3);
                        wx.setStorageSync('newUser', false)
                      }
                    })
                  }
                }
              })
            } else {
              console.log('未授权');
              that.setData({
                userflag: false,
              })

            }
          }
        });


        
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
          // 请求完新版本信息的回调
          console.log('请求完新版本信息的回调',res.hasUpdate)
          if (res.hasUpdate){
            updateManager.onUpdateReady(function (res) {
              wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                showCancel:false,
                success: function (res) {
                  console.log(res);
                  if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate()
                  }
                }
              })
            })
            updateManager.onUpdateFailed(function () {
              wx.showModal({
                title: '下载失败',
                content: '可能是网络原因等',
                success: function (res) {

                }
              })
              // 新的版本下载失败
            })
          }
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
        console.log('res',res);
        if (res.from === 'button') {
            // 来自页面内转发按钮
          console.log('来自页面内转发按钮',res.target)
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
                console.log("选择图片:", tempFilePaths)
                that.qiniuyunPic(tempFilePaths[0]);//保存图片到七牛云
                wx.showLoading({
                    title: '上传中',
                    success: function () {
                        //将本地资源上传到开发者服务器
                        //其中 content-type 为 multipart/form-data 。
                        
                        wx.uploadFile({
                            //url:'https://www.levau.com/carzidian/v1/chewu/ocr/input',
                            url: url.photo_ocr,
                            filePath: tempFilePaths[0],
                            name: 'file',
                            header: {// 设置请求的 header
                              'content-type': 'multipart/form-data',
                              //'Token': wx.getStorageSync('token')
                            },
                            formData: {
                                'upload': tempFilePaths[0],
                            },
                            
                            success: function (res) {
                                wx.hideLoading();
                                
                                console.log('图片匹配返回：', res);
                                if (res.statusCode != 200) {
                                  console.log('图片上传识别失败');
                                  wx.showModal({
                                    title: '提示',
                                    content: '图片上传识别失败',
                                  });
                                  return;
                                }

                                res.data = JSON.parse(res.data);
                                if (res.data.resultCode != 1) {
                                  wx.showModal({
                                    title: '提示',
                                    content: res.data.resultMsg,
                                  });
                                  return;
                                } else {
                                  that.setData({
                                    vin: res.data.result.vin,
                                  })
                                }

                                util.showToast("上传成功", "success", 800)
                            },
                            fail: function (res) {
                                wx.hideLoading();
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
            wx.navigateTo({
              url: "../my/my-rankings/my-rankings",
            });
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
  

    verification:function(e){
      console.log('时时', e.detail.value);
      var num = e.detail.value;
      num = e.detail.value.replace(/[^0-9a-zA-Z\u4e00-\u9fa5]/g, '');
      this.setData({
        'plate_num': num
      })
    },

  
    binput:function(e){
      console.log('e',e);
      var num = e.detail.value.toUpperCase();
      
      this.setData({
        plate_num:num
      })

     
    },
    binput1: function (e) {
      console.log('eeeeeeeee', e);
      var num = e.detail.value.toUpperCase();
      this.setData({
        vin: num
      })


    },
    
    //vin 变大写
    binput2: function (e) {
      console.log('eeeeeeeee', e);
      var num = e.detail.value.toUpperCase();
      this.setData({
        vin: num
      })
    },
    //vin 只能是数字和字母
    verification2: function (e) {
      console.log('时时', e.detail.value);
      var num = e.detail.value;
      num = e.detail.value.replace(/[^0-9a-zA-Z]/g, '');
      this.setData({
        vin: num
      })
    },

    //点击图片
    dianjitupian:function(e){
      var that = this;
      console.log('点击图片',e);
      
      if (e.currentTarget.dataset.index == '1'){
        wx.navigateTo({
          url: "/pages/my/task/task",
        })
      } else if (e.currentTarget.dataset.index == '2'){
        wx.switchTab({
          url: '/pages/market/market',
        })
      } else if (e.currentTarget.dataset.index == '3'){
        wx.navigateTo({
          url: '/pages/my/memberopening/memberopening',
        })
      }
    },
    //音乐停止播放

    //查看案例
    claim:function(){
      wx.navigateTo({
        url: '/pages/anli/claim/claim',
      })
    },

    //排行榜
    paihangbang:function(e){
      var that = this;
      console.log(wx.getStorageSync('isphone'));
      if (wx.getStorageSync('isphone')) {//数据库里有手机号 则不显示
        that.setData({
          flag: false,
        });
        wx.navigateTo({
          url: "../my/my-rankings/my-rankings",
        })
      } else {
        that.setData({//数据库里没有手机号 则显示
          flag: true,
        })
      }
    },



    //提交表单
    formSubmitVin: function (e) {
      console.log('formSubmit', e);
      var that = this;
      this.shanchutupian();
      var reg = /^[0-9a-zA-Z]+$/;//仅数字或字母或组合
      var reg_license = /^[\u4e00-\u9fa5]{1}[a-zA-Z]{1}[a-zA-Z0-9]{5,6}$/;

      var queryData = e.detail.value;
      var queryType = e.detail.target.id
      var queryUrl = ''
      var tipMoney = "提示语";
      var stype = '';
      var carType = that.data.cartype_id_arr[e.detail.value.cartype];
      

      switch (queryType) {
        case 'onQueryMaintainLog':
          if (queryData.vin.length < 17) {
            util.showToast('请输入17位车架号', 'error');
            return;
          }
          if (queryData.vin != '' && !reg.test(queryData.vin)) {
            util.showToast('车架号格式错误', 'error');
            return;
          }
          queryUrl = url.cbs
          tipMoney = '开通会员价(维保) 3.63元';
          that.queryStatePrice(url.queryMaintainPrice, e.detail, url.queryMaintainInfo);
          break;
        case 'onQueryAccidentLog':
          if (queryData.vin.length < 17) {
            util.showToast('请输入17位车架号', 'error');
            return;
          }
          if (queryData.vin != '' && !reg.test(queryData.vin)) {
            util.showToast('车架号格式错误', 'error');
            return;
          }
          queryUrl = url.claim2
          tipMoney = '开通会员价(定损) 11.99元';
          that.queryStatePrice(url.queryClaimPrice, e.detail, url.queryClaim);
          break;
        case 'onQueryinfoLog':
          if (queryData.license.length < 0 || queryData.license == "") {
            util.showToast("车牌号为空", 'error');
            return;
          }
          if (queryData.license != "" && !reg_license.test(queryData.license)) {
            util.showToast("车牌号格式错误", 'error');
            return;
          }
          queryUrl = url.infobaodan
          tipMoney = '开通会员价(状态在保) 8.25元'
          that.queryStatePrice(url.queryStatePrice, e.detail, url.queryVehicleState);
          break;
      }
    },
    //priceUrl:是请求查询价格的路径
    //detail：参数
    //interUrl :请求接口的路径
    queryStatePrice: function (priceUrl, detail,interUrl){
      var that = this;
      var carType = that.data.cartype_id_arr[detail.value.cartype];
      url.ajaxPost(false, priceUrl, {
        openId: app.globalData.openid,
        licenseNo: detail.value.license,
        carType: carType,
        vin: detail.value.vin
      }, function (data) {
        console.log("查询车辆状态价格回掉:", data);
        var balance = data.result.balance;//账户余额
        var price = data.result.price;//查询金额
        var modelCarCount = data.result.modelCarCount;//车模个数
        var modelCarCountCost = data.result.modelCarCountCost;//查询接口需要的车模数量
        var balancePrompt = 1;
        if (balance < price) {
          balancePrompt = 0.2;
        }
        var modelPrompt = 1;
        if (modelCarCount < modelCarCountCost){
          modelPrompt = 0.2;
        }
        that.setData({
          balance: balance,
          price: price,
          balancePrompt: balancePrompt,
          modelCarCount: modelCarCount,
          modelCarCountCost: modelCarCountCost,
          modelPrompt: modelPrompt,
          payflag:false,
          detail: detail,
          interUrl: interUrl
        });
        wx.hideTabBar();
        return;
      });
    },

    //微信获取用户信息
    bindGetUserInfo: function (e) {
      var that = this;
      that.setData({
        userflag: true,
      });
      console.log(e);
      if (e.detail.errMsg == 'getUserInfo:ok') {
        that.setData({
          avatarUrl: e.detail.userInfo.avatarUrl,
          nickName: e.detail.userInfo.nickName,
        });
        wx.request({
          url: url.user,
          data: {
            'openId': app.globalData.openid,
            'userInfo': e.detail.userInfo,
          },
          success: function (data3) {
            console.log('头像和昵称入库', data3);
            wx.setStorageSync('newUser', false)
          }
        })
      }
    },



    onGirls: function () {
      wx.navigateTo({
        url: '/pages/my/task/task',
      })
    },

    //关闭支付
    closePay:function(){
      var that = this;
      that.setData({
        payflag:true,
      });
      wx.showTabBar();
    },

    //选择支付类型(余额支付)
    onPayType1:function(){
      this.setData({
        priceType: true,
        modelType: false,
        payType:1,
      });
    },
    onPayType2: function () {
      if(this.data.modelPrompt == 0.2){
        return;
      }
      this.setData({
        priceType: false,
        modelType: true,
        payType:2,
      });
    },

    //支付
    onPay:function(){
      var that =this;
      var balancePrompt = that.data.balancePrompt;
      var payType = that.data.payType;
      if (balancePrompt == 0.2 && payType == 1){
        wx.showModal({
          title: '提示',
          content: '查询单价:' + that.data.price + '元 余额不足, 去充值?',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/my/memberopening/memberopening',
              })
            }
          }
        })
      }else{
        that.setData({
          payflag: true,
        });
        wx.showTabBar();
        var interUrl = that.data.interUrl;
        var detail = that.data.detail;
        var carType = that.data.cartype_id_arr[detail.value.cartype];
        var payType = that.data.payType;
        wx.showLoading({
          title: "提交中",
          mask: true
        });
        url.ajaxPost(false, interUrl, {
          openId: app.globalData.openid,
          location: JSON.stringify(app.globalData.location),
          licenseNo: detail.value.license,
          vin: detail.value.vin,
          carType: carType,
          formId: detail.formId,
          payType: payType
        }, function (data) {
          console.log("查询接口回掉:", data);
          wx.hideLoading();
          that.setData({
            priceType: true,
            modelType: false,
            payType: 1,
          });
          if (data.resultCode == 1) {
            wx.showModal({
              title: '提示',
              content: '支付成功！稍后记录会反馈到您的订单，请注意查收～',
              success: function (res) {
                wx.switchTab({
                  url: "/pages/order/order-list/order-list",
                })
              }
            })

          } else if (data.resultCode == 270) {
            wx.showModal({
              title: '提示',
              content: '该品牌可查询时间 9:00-18:00,，请您明天再来',
              success: function (res) {
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: data.resultMsg,
              success: function (res) {
              }
            })
          }
        });

      }
    },

    qiniuyunPic: function (tempFilePath){
      var that = this;
      url.ajaxGet(false, url.vehicle_gettoken, {
        openId: app.globalData.openid,
        'type': 1,
        count: 1,
        requestId: that.data.requestId
      }, function (data) {
          console.log("获取上传图片的token:", data);
          wx.showLoading({
            title: "上传中",
            mask: false
          });
          that.setData({
            requestId: data.result.requestId,
          });

          wx.uploadFile({
            url: 'https://up.qbox.me',
            filePath: tempFilePath,
            name: 'file',
            formData: {
              'key': data.result.tokens[0].fileName,
              'token': data.result.tokens[0].token
            },
            header: {// 设置请求的 header
              'content-type': 'multipart/form-data',
            },
            success: function (res) {
              console.log('res', res);
              wx.hideLoading();
              var data = JSON.parse(res.data);
              var vin_image = url.qiniu + data.key + '?imageView2/0/w/1440';
              var shanchutupian = [];
              shanchutupian.push(data.key);
              that.setData({
                vin_image: vin_image,
                shanchutupian: shanchutupian
              });
            },
            fail(error) {
              console.log(error)
            }
          });
      });
    },

    //删除图片
    shanchutupian: function () {
      var that = this;
      var shanchutupian = that.data.shanchutupian;
      if (shanchutupian.length<=0){
        return;
      }
      url.ajaxPost(false, url.vehicle_removeFile, {
        openId: app.globalData.openid,
        requestId: that.data.requestId,
        fileName: shanchutupian[0]
      }, function (data) {
        console.log("服务器返回:", data);
        shanchutupian.splice(0, 1)
        that.setData({
          vin_image: '',
          shanchutupian: shanchutupian
        });
      });
    },
    //canvas
    canvas:function(){
      wx.navigateTo({
        url: '/pages/market/canvas/canvas',
        //url: '/pages/warrant/warrant',
        //url: '/pages/warrant/warrant',
        //url: '/pages/my/task/task'
        //url:'/pages/market/fache/fache',
        //url: '/pages/banned/banned',
      })
      // wx.navigateToMiniProgram({
      //   appId: 'wx859b51eba0479db2',
      //   path: 'pages/index/index?id=123',
      //   extraData: {
      //     foo: 'bar'
      //   },
      //   envVersion: 'release',
      //   success(res) {
      //     // 打开成功
      //   }
      // })

    },


})