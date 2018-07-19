//获取应用实例
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");
var code = {
    idtype: {//证件类型
        0: '没有取到', 1: '身份证', 2: '组织机构代码证', 3: '护照', 4: '军官证', 5: '港澳回乡证或台胞证', 6: '其他', 7: '港澳通行证', 8: '出生证', 9: '营业执照(社会统一信用代码)', 10: '税务登记证'
    },
    carusedtype: {//使用性质
        1: '家庭自用车(默认)', 2: '党政机关、事业团体', 3: '非营业企业客车', 4: '不区分营业非营业(仅支持人保报价)', 5: '出租租赁(仅支持人保报价)', 6: ' 营业货车(仅支持人保报价)', 7: '非营业货车(仅支持人保报价),', 8: '城市公交'
    },
    fueltype: {//燃料种类
        1: '汽油', 2: '柴油', 3: '电', 4: '混合油', 5: '天然气', 6: '液化石油气', 7: '甲醇', 8: '乙醇', 9: '太阳能', 10: '混合动力', 11: '无', 12: '其它'
    },
    prooftype: {//条款种类
        1: '非营业用汽车用品', 2: '家庭自用汽车产品', 3: '营业用汽车产品', 4: '摩托车产品', 5: '拖拉机产品', 6: '特种车产品'
    },
    licensecolor: {//号牌底色
        1: '蓝', 2: '黑', 3: '白', 4: '黄', 5: '其他'
    },
    runregion: {//行驶区域,
        1: '境内', 2: '本省内', 3: '其他'
    },
    clausetype: {//条款类型
        1: '销售发票', 2: '法院调解书', 3: '法院仲裁书', 4: '法院判决书', 5: '仲裁裁决书', 6: '相关文书', 7: '批准文件', 8: '调拨证明', 9: '修理发票'
    },
    insuredidtype: {//被保人证件类型
        0: '没有取到', 1: '身份证', 2: '组织机构代码证', 3: '护照', 4: '军官证', 5: '港澳回乡证或台胞证', 6: '其他', 7: '港澳通行证', 8: '出生证', 9: '营业执照(社会统一信用代码)', 10: '税务登记证'
    },
    holderidtype: {//投保人证件类型
        0: '没有取到', 1: '身份证', 2: '组织机构代码证', 3: '护照', 4: '军官证', 5: '港澳回乡证或台胞证', 6: '其他', 7: '港澳通行证', 8: '出生证', 9: '营业执照(社会统一信用代码)', 10: '税务登记证'
    },
    ispublic: {//
        0: '续保失败,无法获取该属性', 1: '公车', 2: '私车'
    },
    source: {//上年保险公司的枚举值
        1: '太平洋', 2: '平安', 4: '人保', 8: '国寿财', 16: '中华联合', 32: '大地', 64: '阳光', 128: '太平保险', 256: '华安', 512: '天安', 1024: '英大', 2048: '安盛天平'
    },
    boli: {//玻璃单独破碎险保额,0-不投保,1国产,2进口
        0: '不投保', 1: '国产', 2: '进口'
    },
    hcxiulichangtype: {//指定专修厂类型 
        '-1': '没有', '0': '国产', '1': '进口'
    },
    businessstatus: {//成功状态（
        1: '获取续保信息成功（车辆信息+险种）',
        3: '获取用户车辆信息成功(车架号,发动机号,品牌型号,初登日期可以取到),获取险种失败)'
    },
    citycode: {
        "1": "北京",
        "2": "重庆",
        "3": "天津",
        "4": "成都",
        "5": "昆明",
        "6": "上海",
        "7": "银川",
        "8": "南京",
        "9": "杭州",
        "10": "福州",
        "11": "深圳",
        "12": "石家庄",
        "13": "芜湖",
        "14": "广州",
        "15": "厦门",
        "16": "苏州",
        "17": "东莞",
        "18": "济南",
        "19": "武汉",
        "20": "佛山",
        "21": "无锡",
        "22": "烟台",
        "23": "泰州",
        "25": "长春",
        "27": "郑州",
        "28": "青岛",
        "29": "新疆",
        "32": "聊城",
        "33": "盐城",
        "34": "南通",
        "35": "常州",
        "36": "保定",
        "37": "沈阳",
        "38": "台州",
        "39": "盘锦",
        "40": "嘉兴"
    }
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id:'',
        car: {},
        // share_title: '4S保养报告详情',
        share_path: 'pages/order/order-detail-baodan/order-detail',
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
            console.log('保单1订单:', data);
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
        var that = this;
        console.log(car_data);
        car_data.result.userinfo.idtype = code.idtype[car_data.result.userinfo.idtype];
        car_data.result.userinfo.carusedtype = code.carusedtype[car_data.result.userinfo.carusedtype];
        car_data.result.userinfo.fueltype = code.fueltype[car_data.result.userinfo.fueltype];
        car_data.result.userinfo.prooftype = code.prooftype[car_data.result.userinfo.prooftype];
        car_data.result.userinfo.licensecolor = code.licensecolor[car_data.result.userinfo.licensecolor];
        car_data.result.userinfo.clausetype = code.clausetype[car_data.result.userinfo.clausetype];
        // car_data.result.userinfo.insuredidtype = code.insuredidtype[car_data.result.userinfo.insuredidtype];
        // car_data.result.userinfo.holderidtype = code.holderidtype[car_data.result.userinfo.holderidtype];
        car_data.result.userinfo.ispublic = code.ispublic[car_data.result.userinfo.ispublic];
        car_data.result.userinfo.runregion = code.runregion[car_data.result.userinfo.runregion];
        car_data.result.savequote.source = code.source[car_data.result.savequote.source];
        car_data.result.savequote.boli = code.boli[car_data.result.savequote.boli];
        car_data.result.savequote.hcxiulichangtype = code.hcxiulichangtype[car_data.result.savequote.hcxiulichangtype];
        car_data.result.userinfo.citycode = code.citycode[car_data.result.userinfo.citycode];
        // 金额
        // car_data.data.result.userinfo.purchaseprice = util.divide100(car_data.data.result.userinfo.purchaseprice);


        // 隐藏用户信息
        car_data.result.userinfo.credentislasnum = util.encryptionStr(car_data.result.userinfo.credentislasnum, 4);
        car_data.result.userinfo.insuredidcard = util.encryptionStr(car_data.result.userinfo.insuredidcard, 4);
        car_data.result.userinfo.holderidcard = util.encryptionStr(car_data.result.userinfo.holderidcard, 4);
        car_data.result.userinfo.licenseowner = util.encryptionStr(car_data.result.userinfo.licenseowner,1);
        car_data.result.userinfo.insuredname = util.encryptionStr(car_data.result.userinfo.insuredname,1);
        car_data.result.userinfo.postedname = util.encryptionStr(car_data.result.userinfo.postedname,1);

        that.setData({
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
            title: "车辆及去年投保信息报告详情",
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