// pages/market/details-audit/details-audit.js
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    putong: 0.3,
    jisu: 0,
    display: true,

    dates: '请选择上牌日期',
    dates1: '请选择出厂日期',
    region: ['选择省', '选择市'],
    array: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    index: 0,
    property: '1',//车辆性质：默认非营运
    yingyun: 0,
    feiyingyun: 0.3,//选中 
    diyache: 0,
    shiguche: 0,
    shoucangche: 0,

    cheliangxingzhi: [
      { id: 0, name: '抵押车', flag: 0 },
      { id: 1, name: '摩托车', flag: 0 },
      { id: 2, name: '事故车', flag: 0 },
    ],
    chekuang: [
      { id: 0, name: '精品全车原版螺丝未动', chekuang_flag: 0 },
      { id: 1, name: '零补漆，有划痕', chekuang_flag: 0 },
      { id: 2, name: '局部补漆', chekuang_flag: 0 },
      { id: 3, name: '前保更换', chekuang_flag: 0 },
      { id: 4, name: '大灯更换', chekuang_flag: 0 },
      { id: 5, name: '水箱框架有松动', chekuang_flag: 0 },
      { id: 6, name: '门有松动痕迹', chekuang_flag: 0 },
      { id: 7, name: '叶子板松动痕迹', chekuang_flag: 0 },
      { id: 8, name: '轻微钣金', chekuang_flag: 0 },
      { id: 9, name: '覆盖件切割', chekuang_flag: 0 },
      { id: 10, name: '结构件受损、事故车', chekuang_flag: 0 },
      { id: 11, name: '发动机渗油', chekuang_flag: 0 },
      { id: 12, name: '变速箱渗油', chekuang_flag: 0 },
      { id: 13, name: '发动机有拆卸', chekuang_flag: 0 },
      { id: 14, name: '变速箱有拆卸', chekuang_flag: 0 },

    ],
    show: false,//文本框
   
    provinceFlag:false,//
    provinceCodeFlag:false,//
    multiArray: [
      ['京', '津', '冀', '晋', '蒙', '辽', '吉',
        '黑', '沪', '苏', '浙', '皖', '闽', '赣',
        '鲁', '豫', '鄂', '湘', '粤', '桂', '琼',
        '川', '贵', '云', '渝', '藏', '陕', '甘',
        '青', '宁', '新', '港', '澳', '台'
      ],
      ['A', 'B', 'C', 'D', 'E', 'F', 'G',
        'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U',
        'V', 'W', 'X', 'Y', 'Z'
      ]
    ],
    multiIndex: [0, 0],
    yulan: [],//预览图片
    shanchutupian:[],//删除图片
    requestId: '',//请求上传图片 使用
    tupianconnt: 24,//上传图片的总数
    vehicle: '',//车辆信息的详情,
    removeFiles: [],//如果有删除图片，删除的文件名

    videos: [],
    videos_images: [],

    self_proof: [
      {
        'name': '维保记录和出险',
        'list_flag': false,
        'self_list':
        [
          { 'name': '有记录', 'self_list_flag': false, 'ratio': 0 },
          { 'name': '无记录', 'self_list_flag': false, 'ratio': 0 },
        ]
      },
      {
        'name': '油漆面',
        'list_flag': false,
        'self_list':
        [
          { 'name': '零补漆', 'self_list_flag': false, 'ratio': 0 },
          { 'name': '局部补漆', 'self_list_flag': false, 'ratio': 0 },
          { 'name': '需补漆', 'self_list_flag': false, 'ratio': 0 },
          { 'name': '有刮痕', 'self_list_flag': false, 'ratio': 0 },
        ]
      }

    ],

    self_proof_fei: [
      {
        'name': '钣金',
        'list_flag': false,
        'self_list':
        [
          { 'name': '无', 'self_list_flag': false, 'ratio': 0 },
          { 'name': '门', 'self_list_flag': false, 'ratio': 0 },
          { 'name': '叶子板', 'self_list_flag': false, 'ratio': 0 },
          { 'name': '后尾板', 'self_list_flag': false, 'ratio': 0 },
        ]
      }, {
        'name': '内饰',
        'list_flag': false,
        'self_list':
        [
          { 'name': '原装', 'self_list_flag': false, 'ratio': 0 },
          { 'name': '改装', 'self_list_flag': false, 'ratio': 0 },
          { 'name': '磨损', 'self_list_flag': false, 'ratio': 0 },
          { 'name': '需整备', 'self_list_flag': false, 'ratio': 0 },
        ]
      }, {
        'name': '骨架',
        'list_flag': false,
        'self_list':
        [
          { 'name': '正常', 'self_list_flag': false, 'ratio': 0 },
          { 'name': '切割', 'self_list_flag': false, 'ratio': 0 },
          { 'name': '钣金', 'self_list_flag': false, 'ratio': 0 },
        ]
      }, {
        'name': '底盘',
        'list_flag': false,
        'self_list':
        [
          { 'name': '正常', 'self_list_flag': false, 'ratio': 0 },
          { 'name': '异响', 'self_list_flag': false, 'ratio': 0 },
        ]
      }, {
        'name': '发动机',
        'list_flag': false,
        'self_list':
        [
          { 'name': '无拆修', 'self_list_flag': false, 'ratio': 0 },
          { 'name': '拆卸', 'self_list_flag': false, 'ratio': 0 },
          { 'name': '渗油', 'self_list_flag': false, 'ratio': 0 },
        ]
      }, {
        'name': '变速箱',
        'list_flag': false,
        'self_list':
        [
          { 'name': '无拆修', 'self_list_flag': false, 'ratio': 0 },
          { 'name': '拆卸', 'self_list_flag': false, 'ratio': 0 },
          { 'name': '渗油', 'self_list_flag': false, 'ratio': 0 },
        ]
      }, {
        'name': '疑似更换/松动',
        'list_flag': false,
        'self_list':
        [
          { 'name': '水箱框架', 'self_list_flag': false, 'ratio': 0 },
          { 'name': '保险杠', 'self_list_flag': false, 'ratio': 0 },
          { 'name': '大灯', 'self_list_flag': false, 'ratio': 0 },
          { 'name': '叶子板', 'self_list_flag': false, 'ratio': 0 },
          { 'name': '门', 'self_list_flag': false, 'ratio': 0 },
          { 'name': '玻璃', 'self_list_flag': false, 'ratio': 0 },
          { 'name': '后尾盖', 'self_list_flag': false, 'ratio': 0 },
          { 'name': '机盖', 'self_list_flag': false, 'ratio': 0 },
        ]
      },


    ],

    self_title_one: 0.3,
    self_title_two: 0,

    weizhiwidth:'40rpx',
    weizhiheight:'40rpx',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      phone: app.globalData.cellphoneNumber
    });
    this.weizhi();
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
  onShareAppMessage: function () {

  },
  
  //普通发车
  putongfache:function(){
    this.setData({
      putong: 0.3,
      jisu: 0,
      display: true,
    });
  },
  //急速发车
  jisufache: function () {
    this.setData({
      putong: 0,
      jisu: 0.3,
      display: false,
    });
  },



  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      dates: e.detail.value
    })
  },
  //  点击日期组件确定事件  
  bindDateChange1: function (e) {
    console.log(e.detail.value)
    this.setData({
      dates1: e.detail.value
    })
  },
  //多列选择器
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;

    this.setData(data);
  },
  // 城市选择器
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
    this.getregion(e.detail.value);
  },

  //选择过户次数
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  //车辆性质(营运)
  yingyun: function () {
    this.setData({
      yingyun: 0.3,
      feiyingyun: 0,
      property: '2'
    })
  },
  //车辆性质(非营运)
  feiyingyun: function () {
    this.setData({
      yingyun: 0,
      feiyingyun: 0.3,
      property: '1'
    })
  },
  //车辆性质(抵押车)
  diyache: function () {
    this.setData({
      diyache: 0.3,
      shiguche: 0,
      shoucangche: 0,
    })
  },
  //车辆性质(事故车)
  shiguche: function () {
    this.setData({
      diyache: 0,
      shiguche: 0.3,
      shoucangche: 0,
    })
  },
  //车辆性质(收藏车)
  shoucangche: function () {
    this.setData({
      diyache: 0,
      shiguche: 0,
      shoucangche: 0.3,
    })
  },
  //车辆性质 （抵押车，事故车，收藏车）
  xingzhi: function (e) {
    console.log(e);
    var that = this;
    var cheliangxingzhi = that.data.cheliangxingzhi;
    var flag = e.currentTarget.dataset.flag;
    if (flag == 0) {
      cheliangxingzhi[e.currentTarget.dataset.i].flag = 0.3;
      that.setData({
        cheliangxingzhi: cheliangxingzhi,
      })
    } else {
      cheliangxingzhi[e.currentTarget.dataset.i].flag = 0;
      that.setData({
        cheliangxingzhi: cheliangxingzhi,
      })
    }
  },
  //车况概要 多选
  chekuanggaiyao: function (e) {
    console.log(e);
    var that = this;
    var chekuang = that.data.chekuang;
    var chekuangflag = e.currentTarget.dataset.chekuangflag;
    if (chekuangflag == 0) {
      chekuang[e.currentTarget.dataset.i].chekuang_flag = 0.3;
      that.setData({
        chekuang: chekuang,
      })
    } else {
      chekuang[e.currentTarget.dataset.i].chekuang_flag = 0;
      that.setData({
        chekuang: chekuang,
      })
    }
  },

  //上传图片
  shangchuantupian: function (e) {
    var that = this;
    var tupianconnt = that.data.tupianconnt;
    if (tupianconnt <= 0) {
      wx.showModal({
        title: '提示',
        content: '最多可以上传9张图片',
      });
      return;
    }

    //从本地相册选择图片或使用相机拍照。
    wx.chooseImage({
      count: that.data.tupianconnt, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log("选择图片:", tempFilePaths, tempFilePaths.length);

        url.ajaxGet(false, url.vehicle_gettoken, {
          openId: app.globalData.openid,
          'type': 1,
          count: tempFilePaths.length,
          requestId: that.data.requestId
        }, function (data) {
          console.log("获取上传图片的token:", data);
          tupianconnt = tupianconnt - tempFilePaths.length;
          that.setData({
            requestId: data.result.requestId,
            tupianconnt: tupianconnt
          });
          wx.showLoading({
            title: "上传中",
            mask: false
          });
          for (var i = 0; i < tempFilePaths.length; i++) {
            wx.uploadFile({
              url: 'https://up.qbox.me',
              filePath: tempFilePaths[i],
              name: 'file',
              formData: {
                'key': data.result.tokens[i].fileName,
                'token': data.result.tokens[i].token
              },
              header: {// 设置请求的 header
                'content-type': 'multipart/form-data',
              },
              success: function (res) {
                console.log('res', res);
                var data = JSON.parse(res.data);
                var yulan = that.data.yulan;
                var shanchutupian = that.data.shanchutupian;
                console.log(url.qiniu + data.key + '?imageView2/0/w/100');
                yulan.push(url.qiniu + data.key+'?imageView2/0/w/100');
                shanchutupian.push(data.key);
                console.log(that.data.yulan);
                that.setData({
                  yulan: yulan,
                  shanchutupian:shanchutupian
                });
                setTimeout(function () {
                  wx.hideLoading();
                }, 2000);
              },
              fail(error) {
                console.log(error)
              }
            });
          }
        });
      }
    })

    
  },
  //删除图片
  shanchutupian:function(e){
    console.log(e);
    var that = this;
    var yulan = that.data.yulan
    var shanchutupian = that.data.shanchutupian;
    var i = e.currentTarget.dataset.i
    url.ajaxPost(false, url.vehicle_removeFile, {
      openId: app.globalData.openid,
      requestId: that.data.requestId,
      fileName: shanchutupian[i]
    }, function (data) {
      console.log("服务器返回:", data);
      yulan.splice(i, 1)
      shanchutupian.splice(i, 1)
      that.setData({
        yulan: yulan,
        shanchutupian: shanchutupian
      });
    });
  },

  //发布车辆 发布按钮
  formSubmitVin: function (e) {
    var that = this;
    var from_data = e.detail.value
    console.log(e, that.data, that.data.removeFiles);
    if (from_data.jiage > 1000) {
      util.showToast("超过1000万", 'error');
      return;
    }
    if (from_data.jiage == '' || from_data.jiage > 1000) {
      util.showToast("价格为空", 'error');
      return;
    }
    if (that.data.requestId == '') {
      util.showToast("没有上传图片", 'error');
      return;
    }
    if (that.data.region[0] == '选择省' || that.data.region[1] == '选择市') {
      util.showToast("请选择车辆所在地", 'error');
      return;
    }
    if (that.data.dates == '请选择上牌日期') {
      util.showToast("请选择上牌日期", 'error');
      return;
    }
    if (from_data.biaoti == '') {
      util.showToast("标题为空", 'error');
      return;
    }

    if (from_data.gonglishu == '') {
      util.showToast("公里数为空", 'error');
      return;
    }
    var licenseLocation = that.data.multiArray[0][that.data.multiIndex[0]] + that.data.multiArray[1][that.data.multiIndex[1]];//牌照辖区
    var dateOfManufacture = that.data.dates1;//出厂日期
    var transferTimes = that.data.index;//过户次数
    var property = that.data.property//1 非营运 2营运
    var cheliangxingzhi = that.data.cheliangxingzhi;
    var type = '';
    for (var i = 0; i < cheliangxingzhi.length; i++) {
      if (cheliangxingzhi[i].flag != 0) {
        if (i == (cheliangxingzhi.length - 1)) {
          type = type + cheliangxingzhi[i].name;
        } else {
          type = type + cheliangxingzhi[i].name + ',';
        }
      }
    }
    var chekuang = that.data.chekuang;
    var brief = '';

    if (dateOfManufacture == '请选择出厂日期') {
      dateOfManufacture = '';
    }
    console.log(type, brief, app.globalData.openid, that.data.requestId);
    if (e.detail.target.id == 'putongfache') {
      var self_title_one = that.data.self_title_one;//
      var self_proof = that.data.self_proof;
      var self_proof_fei = that.data.self_proof_fei;
      if (self_title_one == 0.3) {//非精品车
        brief = JSON.stringify(self_proof) + '#' + JSON.stringify(self_proof_fei);
      } else {
        brief = JSON.stringify(self_proof) + '#'
      }
    } else {
      licenseLocation = '';
      transferTimes = '';
      property = '';
      type = '';
      brief = '';
    }

    url.ajaxPost(false, url.fache, {
      removeFiles: that.data.removeFiles,
      vehicleId: that.data.vehicle.id,
      openId: app.globalData.openid,
      requestId: that.data.requestId,
      title: from_data.biaoti,
      price: from_data.jiage,
      mileage: from_data.gonglishu,
      licenseDate: that.data.dates,
      location: that.data.region[0] + ',' + that.data.region[1],
      licenseLocation: licenseLocation,
      dateOfManufacture: dateOfManufacture,
      transferTimes: transferTimes,
      cc: from_data.pailiang,
      vin: from_data.vin,
      property: property,
      type: type,
      brief: brief,
      description: from_data.jiansu,
      cellphoneNumber: from_data.cellphoneNumber,
    },
      function (data) {
        console.log('编辑车辆信息回掉', data);
        if (data.resultCode == 1) {
          that.setData({
            biaoti:'',
            jiage:'',
            yulan:'',
            videos:'',
            requestId:'',
            dates: '请选择上牌日期',
            gonglishu:'',
          });
          wx.navigateTo({
            url: '/pages/market/success/success?id_=' + that.data.vehicle.id,
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



  },


  //获取当前位置
  weizhi: function () {
    var that = this;
    //获取当前位置经纬度
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //console.log("获取当前经纬度：" + JSON.stringify(res));
        //发送请求通过经纬度反查地址信息
        var getAddressUrl = "https://apis.map.qq.com/ws/geocoder/v1/?location=" + res.latitude + "," + res.longitude + "&key=33SBZ-PE3WU-YUEVI-2NUGJ-QTWV6-DNFIN&get_poi=1";
        url.ajaxGet(false, getAddressUrl, {}, function (res) {
          console.log("发送请求通过经纬度反查地址信息:", res);
          var region = [];
          region.push(res.result.address_component.province );
          region.push(res.result.address_component.city);
          that.setData({
            region: region
          });
          that.getregion(region)
        });
      }
    })
  },
 

  weizhistart:function(){
    this.setData({
      weizhiwidth:'30rpx',
      weizhiheight:'30rpx'
    });
  },
  weizhiend: function () {
    this.setData({
      weizhiwidth: '40rpx',
      weizhiheight: '40rpx'
    });
  },

 
  //上传视频
  shangchuanshipin: function () {
    var that = this;
    var videos = that.data.videos;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: true,
      maxDuration: 60,
      success: function (res) {
        console.log(res);

        url.ajaxGet(false, url.vehicle_gettoken, {
          openId: app.globalData.openid,
          'type': 2,
          count: 1,
          requestId: that.data.requestId
        }, function (data) {
          console.log('请求token回掉', data);
          that.setData({
            requestId: data.result.requestId
          });
          wx.showLoading({
            title: '上传中',
            success: function () {
              wx.uploadFile({
                url: 'https://up.qbox.me',
                filePath: res.tempFilePath,
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
                  var data = JSON.parse(res.data);
                  var videos = that.data.videos;
                  var videos_images = that.data.videos_images;
                  console.log(url.qiniu + data.key);
                  videos.push(url.qiniu + data.key);
                  videos_images.push(data.key.replace('.mp4', '.jpg'));
                  that.setData({
                    videos: videos,
                    videos_images: videos_images,
                  })
                  //do something
                },
                fail(error) {
                  console.log(error)
                }
              });


              wx.hideLoading();

            }
          })
        })

      }
    })
  },

  //删除视频
  shanchushipin: function (e) {
    var that = this;
    var removeFiles = that.data.removeFiles;
    var videos = that.data.videos;
    //var videos1 = that.data.videos1;
    var videos_images = that.data.videos_images
    console.log(e);
    removeFiles.push(videos[e.currentTarget.dataset.i]);
    removeFiles.push(videos_images[e.currentTarget.dataset.i]);
    videos.splice(e.currentTarget.dataset.i, 1);
    //videos1.splice(e.currentTarget.dataset.i, 1);
    videos_images.splice(e.currentTarget.dataset.i, 1);
    that.setData({
      videos: videos,
      //videos1: videos1,
      videos_images: videos_images,
      removeFiles: removeFiles,
    });
  },
  //paizhaoxiaqu
  paizhaoxiaqu:function(){
    var that = this;
    var provinceFlag = that.data.provinceFlag;
    var provinceCodeFlag = that.data.provinceCodeFlag;
    if (provinceFlag || provinceCodeFlag){
      that.setData({
        provinceFlag: false,//
        provinceCodeFlag: false,//
      });
    }else{
      that.setData({
        provinceFlag: true,//
        provinceCodeFlag: false,//
      });
    }
    
  },
  //选择省份简称
  dianjishengfen:function(e){
    console.log(e)
    var that = this;
    var multiIndex = that.data.multiIndex;
    multiIndex[0] = e.currentTarget.dataset.i
    that.setData({
      multiIndex: multiIndex,
      provinceFlag: false,//
      provinceCodeFlag: true,//
    });
  },
  //选择A-Z
  dianjizimu:function(e){
    var that = this;
    var multiIndex = that.data.multiIndex;
    multiIndex[1] = e.currentTarget.dataset.i
    that.setData({
      multiIndex: multiIndex,
      provinceFlag: false,//
      provinceCodeFlag: false,//
    });
  },

  //非精品车
  onFeijingpin: function () {
    this.setData({
      self_title_one: 0.3,
      self_title_two: 0,
    });
  },
  //精品车
  onJinpin: function () {
    this.setData({
      self_title_one: 0,
      self_title_two: 0.3,
    });
  },
  //下拉显示， 上啦隐藏(精品)
  onXiaShangla: function (e) {
    var that = this;
    var self_proof = that.data.self_proof;
    var list_flag = self_proof[e.currentTarget.dataset.i].list_flag;
    if (list_flag) {
      self_proof[e.currentTarget.dataset.i].list_flag = false;
      that.setData({
        self_proof: self_proof,
      });
    } else {
      self_proof[e.currentTarget.dataset.i].list_flag = true;
      that.setData({
        self_proof: self_proof,
      });
    }

  },

  //选择(精品)
  onXuanze: function (e) {
    console.log(e);
    var that = this;
    var self_proof = that.data.self_proof;
    var i = e.currentTarget.dataset.i;
    var iii = e.currentTarget.dataset.iii;
    var self_list = self_proof[i].self_list;
    var array = self_list[iii];
    if (i == 0) {
      if (iii == 0) {
        self_proof[i].self_list[0].self_list_flag = true;
        self_proof[i].self_list[1].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0.3;
        self_proof[i].self_list[1].ratio = 0;
        that.setData({
          self_proof: self_proof,
        });
      } else {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[1].self_list_flag = true;
        self_proof[i].self_list[0].ratio = 0;
        self_proof[i].self_list[1].ratio = 0.3;
        that.setData({
          self_proof: self_proof,
        });

      }
    } else {
      // var self_list_flag = self_proof[i].self_list[iii].self_list_flag;
      // if (self_list_flag){
      //   self_proof[i].self_list[iii].self_list_flag = false;
      //   self_proof[i].self_list[iii].ratio = 0;
      //   that.setData({
      //     self_proof: self_proof,
      //   });
      // }else{
      //   self_proof[i].self_list[iii].self_list_flag = true;
      //   self_proof[i].self_list[iii].ratio = 0.3;
      //   that.setData({
      //     self_proof: self_proof,
      //   });
      // }
      if (iii == 0) {
        self_proof[i].self_list[0].self_list_flag = true;
        self_proof[i].self_list[1].self_list_flag = false;
        self_proof[i].self_list[2].self_list_flag = false;
        self_proof[i].self_list[3].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0.3;
        self_proof[i].self_list[1].ratio = 0;
        self_proof[i].self_list[2].ratio = 0;
        self_proof[i].self_list[3].ratio = 0;
        that.setData({
          self_proof: self_proof,
        });
      } else if (iii == 1) {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0;
        if (self_proof[i].self_list[1].self_list_flag) {
          self_proof[i].self_list[1].self_list_flag = false;
          self_proof[i].self_list[1].ratio = 0;
        } else {
          self_proof[i].self_list[1].self_list_flag = true;
          self_proof[i].self_list[1].ratio = 0.3;
        }
        that.setData({
          self_proof: self_proof,
        });
      } else if (iii == 2) {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0;
        if (self_proof[i].self_list[2].self_list_flag) {
          self_proof[i].self_list[2].self_list_flag = false;
          self_proof[i].self_list[2].ratio = 0;
        } else {
          self_proof[i].self_list[2].self_list_flag = true;
          self_proof[i].self_list[2].ratio = 0.3;
        }
        that.setData({
          self_proof: self_proof,
        });
      } else if (iii == 3) {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0;
        if (self_proof[i].self_list[3].self_list_flag) {
          self_proof[i].self_list[3].self_list_flag = false;
          self_proof[i].self_list[3].ratio = 0;
        } else {
          self_proof[i].self_list[3].self_list_flag = true;
          self_proof[i].self_list[3].ratio = 0.3;
        }
        that.setData({
          self_proof: self_proof,
        });
      }
    }
  },

  //下拉显示， 上啦隐藏(非精品)
  onXiaShanglafei: function (e) {
    var that = this;
    var self_proof = that.data.self_proof_fei;
    var list_flag = self_proof[e.currentTarget.dataset.i].list_flag;
    if (list_flag) {
      self_proof[e.currentTarget.dataset.i].list_flag = false;
      that.setData({
        self_proof_fei: self_proof,
      });
    } else {
      self_proof[e.currentTarget.dataset.i].list_flag = true;
      that.setData({
        self_proof_fei: self_proof,
      });
    }

  },
  //选择(非精品)
  onXuanzefei: function (e) {
    console.log(e);
    var that = this;
    var self_proof = that.data.self_proof_fei;
    var i = e.currentTarget.dataset.i;
    var iii = e.currentTarget.dataset.iii;
    var self_list = self_proof[i].self_list;
    var array = self_list[iii];
    if (i == 0) {
      if (iii == 0) {
        self_proof[i].self_list[0].self_list_flag = true;
        self_proof[i].self_list[1].self_list_flag = false;
        self_proof[i].self_list[2].self_list_flag = false;
        self_proof[i].self_list[3].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0.3;
        self_proof[i].self_list[1].ratio = 0;
        self_proof[i].self_list[2].ratio = 0;
        self_proof[i].self_list[3].ratio = 0;
        that.setData({
          self_proof_fei: self_proof,
        });
      } else if (iii == 1) {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0;
        if (self_proof[i].self_list[1].self_list_flag) {
          self_proof[i].self_list[1].self_list_flag = false;
          self_proof[i].self_list[1].ratio = 0;
        } else {
          self_proof[i].self_list[1].self_list_flag = true;
          self_proof[i].self_list[1].ratio = 0.3;
        }
        that.setData({
          self_proof_fei: self_proof,
        });
      } else if (iii == 2) {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0;
        if (self_proof[i].self_list[2].self_list_flag) {
          self_proof[i].self_list[2].self_list_flag = false;
          self_proof[i].self_list[2].ratio = 0;
        } else {
          self_proof[i].self_list[2].self_list_flag = true;
          self_proof[i].self_list[2].ratio = 0.3;
        }
        that.setData({
          self_proof_fei: self_proof,
        });
      } else if (iii == 3) {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0;
        if (self_proof[i].self_list[3].self_list_flag) {
          self_proof[i].self_list[3].self_list_flag = false;
          self_proof[i].self_list[3].ratio = 0;
        } else {
          self_proof[i].self_list[3].self_list_flag = true;
          self_proof[i].self_list[3].ratio = 0.3;
        }
        that.setData({
          self_proof_fei: self_proof,
        });
      }

    } else if (i == 1) { //内饰
      if (iii == 0) {
        self_proof[i].self_list[0].self_list_flag = true;
        self_proof[i].self_list[1].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0.3;
        self_proof[i].self_list[1].ratio = 0;
        that.setData({
          self_proof_fei: self_proof,
        });
      } else if (iii == 1) {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[1].self_list_flag = true;
        self_proof[i].self_list[0].ratio = 0;
        self_proof[i].self_list[1].ratio = 0.3;
        that.setData({
          self_proof_fei: self_proof,
        });
      } else if (iii == 2) {
        if (self_proof[i].self_list[2].self_list_flag) {
          self_proof[i].self_list[2].self_list_flag = false;
          self_proof[i].self_list[2].ratio = 0;
        } else {
          self_proof[i].self_list[2].self_list_flag = true;
          self_proof[i].self_list[2].ratio = 0.3;
        }
        that.setData({
          self_proof_fei: self_proof,
        });
      } else if (iii == 3) {
        if (self_proof[i].self_list[3].self_list_flag) {
          self_proof[i].self_list[3].self_list_flag = false;
          self_proof[i].self_list[3].ratio = 0;
        } else {
          self_proof[i].self_list[3].self_list_flag = true;
          self_proof[i].self_list[3].ratio = 0.3;
        }
        that.setData({
          self_proof_fei: self_proof,
        });
      }

    } else if (i == 2) {//骨架
      if (iii == 0) {
        self_proof[i].self_list[0].self_list_flag = true;
        self_proof[i].self_list[1].self_list_flag = false;
        self_proof[i].self_list[2].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0.3;
        self_proof[i].self_list[1].ratio = 0;
        self_proof[i].self_list[2].ratio = 0;
        that.setData({
          self_proof_fei: self_proof,
        });
      } else if (iii == 1) {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0;
        if (self_proof[i].self_list[1].self_list_flag) {
          self_proof[i].self_list[1].self_list_flag = false;
          self_proof[i].self_list[1].ratio = 0;
        } else {
          self_proof[i].self_list[1].self_list_flag = true;
          self_proof[i].self_list[1].ratio = 0.3;
        }
        that.setData({
          self_proof_fei: self_proof,
        });
      } else if (iii == 2) {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0;
        if (self_proof[i].self_list[2].self_list_flag) {
          self_proof[i].self_list[2].self_list_flag = false;
          self_proof[i].self_list[2].ratio = 0;
        } else {
          self_proof[i].self_list[2].self_list_flag = true;
          self_proof[i].self_list[2].ratio = 0.3;
        }
        that.setData({
          self_proof_fei: self_proof,
        });
      }
    } else if (i == 3) {//底盘
      if (iii == 0) {
        self_proof[i].self_list[0].self_list_flag = true;
        self_proof[i].self_list[0].ratio = 0.3;
        self_proof[i].self_list[1].self_list_flag = false;
        self_proof[i].self_list[1].ratio = 0;
        that.setData({
          self_proof_fei: self_proof,
        });
      } else {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0;
        self_proof[i].self_list[1].self_list_flag = true;
        self_proof[i].self_list[1].ratio = 0.3;
        that.setData({
          self_proof_fei: self_proof,
        });
      }
    } else if (i == 4) {//发动机
      if (iii == 0) {
        self_proof[i].self_list[0].self_list_flag = true;
        self_proof[i].self_list[0].ratio = 0.3;
        self_proof[i].self_list[1].self_list_flag = false;
        self_proof[i].self_list[1].ratio = 0;
        that.setData({
          self_proof_fei: self_proof,
        });
      } else if (iii == 1) {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0;
        self_proof[i].self_list[1].self_list_flag = true;
        self_proof[i].self_list[1].ratio = 0.3;
        that.setData({
          self_proof_fei: self_proof,
        });
      } else if (iii == 2) {
        if (self_proof[i].self_list[2].self_list_flag) {
          self_proof[i].self_list[2].self_list_flag = false;
          self_proof[i].self_list[2].ratio = 0;
          that.setData({
            self_proof_fei: self_proof,
          });
        } else {
          self_proof[i].self_list[2].self_list_flag = true;
          self_proof[i].self_list[2].ratio = 0.3;
          that.setData({
            self_proof_fei: self_proof,
          });
        }
      }
    } else if (i == 5) {//变速箱
      if (iii == 0) {
        self_proof[i].self_list[0].self_list_flag = true;
        self_proof[i].self_list[0].ratio = 0.3;
        self_proof[i].self_list[1].self_list_flag = false;
        self_proof[i].self_list[1].ratio = 0;
        that.setData({
          self_proof_fei: self_proof,
        });
      } else if (iii == 1) {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0;
        self_proof[i].self_list[1].self_list_flag = true;
        self_proof[i].self_list[1].ratio = 0.3;
        that.setData({
          self_proof_fei: self_proof,
        });
      } else if (iii == 2) {
        if (self_proof[i].self_list[2].self_list_flag) {
          self_proof[i].self_list[2].self_list_flag = false;
          self_proof[i].self_list[2].ratio = 0;
          that.setData({
            self_proof_fei: self_proof,
          });
        } else {
          self_proof[i].self_list[2].self_list_flag = true;
          self_proof[i].self_list[2].ratio = 0.3;
          that.setData({
            self_proof_fei: self_proof,
          });
        }
      }
    } else if (i == 6) {
      if (self_proof[i].self_list[iii].self_list_flag) {
        self_proof[i].self_list[iii].self_list_flag = false;
        self_proof[i].self_list[iii].ratio = 0;
        that.setData({
          self_proof_fei: self_proof,
        });
      } else {
        self_proof[i].self_list[iii].self_list_flag = true;
        self_proof[i].self_list[iii].ratio = 0.3;
        that.setData({
          self_proof_fei: self_proof,
        });
      }
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
              that.setData({
                phone: data.result.cellphoneNumber,
              });
            }
          })
        }
      })
    }
  },
  getregion: function (region) {
    console.log(region);
    var that = this;
    var multiIndex = that.data.multiIndex;
    switch (region[0]){
      case '北京市':
        multiIndex[0] = 0
        break
      case '天津市':
        multiIndex[0] = 1
        break
      case '河北省':
        multiIndex[0] = 2
        break
      case '山西省':
        multiIndex[0] = 3
        break
      case '内蒙古自治区':
        multiIndex[0] = 4
        break
      case '辽宁省':
        multiIndex[0] = 5
        break
      case '吉林省':
        multiIndex[0] = 6
        break
      case '黑龙江省':
        multiIndex[0] = 7
        break
      case '上海市':
        multiIndex[0] = 8
        break
      case '江苏省':
        multiIndex[0] = 9
        break
      case '浙江省':
        multiIndex[0] = 10
        break
      case '安徽省':
        multiIndex[0] = 11
        break
      case '福建省':
        multiIndex[0] = 12
        break
      case '江西省':
        multiIndex[0] = 13
        break
      case '山东省':
        multiIndex[0] = 14
        break
      case '河南省':
        multiIndex[0] = 15
        break
      case '湖北省':
        multiIndex[0] = 16
        break
      case '湖南省':
        multiIndex[0] = 17
        break
      case '广东省':
        multiIndex[0] = 18
        break
      case '广西壮族自治区':
        multiIndex[0] = 19
        break
      case '海南省':
        multiIndex[0] = 20
        break
      case '重庆市':
        multiIndex[0] = 21
        break
      case '四川省':
        multiIndex[0] = 22
        break
      case '贵州省':
        multiIndex[0] = 23
        break
      case '云南省':
        multiIndex[0] = 24
        break
      case '西藏自治区':
        multiIndex[0] = 25
        break
      case '陕西省':
        multiIndex[0] = 26
        break
      case '甘肃省':
        multiIndex[0] = 27
        break
      case '青海省':
        multiIndex[0] = 28
        break
      case '宁夏回族自治区':
        multiIndex[0] = 29
        break
      case '新疆维吾尔自治区':
        multiIndex[0] = 30
        break
      
        
    }
    that.setData({
      multiIndex: multiIndex
    });
    
  },

})