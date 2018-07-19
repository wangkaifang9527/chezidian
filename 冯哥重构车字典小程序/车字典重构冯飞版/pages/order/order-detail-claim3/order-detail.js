//获取应用实例
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        car: {
            data: {
                "reason": "success",
                "result": {
                    "summarydata": {
                        "claimmoney": 923600,
                        "repairmoney": 520000,
                        "claimcount": 3,
                        "repaircount": 10,
                        "renewcount": 1,
                        "renewmoney": 403600
                    },
                    "carclaimrecords": [
                        {
                            "claimdetails": [
                                {
                                    "itemname": "后保险杠(全喷)",
                                    "itemtype": "维修",
                                    "itemamount": "70000"
                                },
                                {
                                    "itemname": "后保险杠修复(小)",
                                    "itemtype": "维修",
                                    "itemamount": "20000"
                                }
                            ],
                            "licenseno": "闽a****",
                            "vehiclemodel": "奔驰benz s300l轿车",
                            "frameno": "**************1415",
                            "otheramount": "0",
                            "repairamount": "90000",
                            "renewalamount": "0",
                            "dangertime": "2017-01-24 14:14:00",
                            "damagemoney": "90000"
                        },
                        {
                            "claimdetails": [
                                {
                                    "itemname": "右前门(全喷)",
                                    "itemtype": "维修",
                                    "itemamount": "70000"
                                },
                                {
                                    "itemname": "右后门(全喷)",
                                    "itemtype": "维修",
                                    "itemamount": "70000"
                                },
                                {
                                    "itemname": "右前叶子板(全喷)",
                                    "itemtype": "维修",
                                    "itemamount": "70000"
                                },
                                {
                                    "itemname": "右后叶子板(全喷)",
                                    "itemtype": "维修",
                                    "itemamount": "70000"
                                },
                                {
                                    "itemname": "右前车门壳拆装",
                                    "itemtype": "维修",
                                    "itemamount": "5000"
                                },
                                {
                                    "itemname": "右后车门壳拆装",
                                    "itemtype": "维修",
                                    "itemamount": "5000"
                                }
                            ],
                            "licenseno": "闽*****",
                            "vehiclemodel": "奔驰benz s300l轿车",
                            "frameno": "**************1415",
                            "otheramount": "0",
                            "repairamount": "290000",
                            "renewalamount": "0",
                            "dangertime": "2017-01-14 13:29:00",
                            "damagemoney": "290000"
                        },
                        {
                            "claimdetails": [
                                {
                                    "itemname": "前杠喷漆",
                                    "itemtype": "维修",
                                    "itemamount": "70000"
                                },
                                {
                                    "itemname": "机盖喷漆",
                                    "itemtype": "维修",
                                    "itemamount": "70000"
                                },
                                {
                                    "itemname": "中网（中）",
                                    "itemtype": "换件",
                                    "itemamount": "403600"
                                }
                            ],
                            "licenseno": "闽******",
                            "vehiclemodel": "奔驰benz s300l轿车",
                            "frameno": "**************1415",
                            "otheramount": "0",
                            "repairamount": "140000",
                            "renewalamount": "403600",
                            "dangertime": "2017-01-14 12:43:00",
                            "damagemoney": "543600"
                        }
                    ]
                },
                "error_code": 0
            }

        },
        // share_title: '保险理赔报告详情',
        share_path: 'pages/order/order-detail-claim2/order-detail',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;

        // if (options.id) {
        //     console.log("是否有用户信息", app.globalData.isGetUserInfo);
        //     if (!app.globalData.isGetUserInfo) {
        //         //获取用户登陆身份
        //         wx.showLoading({ title: "初始化", mask: true });
        //         app.getUserId(function (data) {
        //             // that.callBackgetUserId(data)
        //             wx.hideLoading()
        //             console.log('身份获取完毕');

        //             // 请求订单数据
        //             url.ajaxPost('needtoken', url.order_detail, { Id_: options.id }, function (data) {
        //                 console.log('服务器返回order:');
        //                 var car_data = data.order
        //                 that.callback(car_data);
        //             })
        //         });
        //     } else {
        //         // 请求订单数据
        //         url.ajaxPost('needtoken', url.order_detail, { Id_: options.id }, function (data) {
        //             console.log('服务器返回order:');
        //             var car_data = data.order
        //             that.callback(car_data);
        //         })
        //     }
        //     return;
        // }
        // if (wx.getStorageSync('order_detail')) {
        //     var car_data = wx.getStorageSync('order_detail')
        //     console.log('缓存数据:', car_data);
        //     this.callback(car_data);
        //     return;
        // }

        this.callback(this.data.car);
    },

    //处理数据
    callback: function (car_data) {
        var that = this;
        console.log(car_data);
        //金额分转换元------
        //理赔总金额
        car_data.data.result.summarydata.claimmoney = util.divide100(car_data.data.result.summarydata.claimmoney);
        //换件总金额
        car_data.data.result.summarydata.renewmoney = util.divide100(car_data.data.result.summarydata.renewmoney);
        //维修总金额
        car_data.data.result.summarydata.repairmoney = util.divide100(car_data.data.result.summarydata.repairmoney);
        //其他金额
        car_data.data.result.summarydata.othermoney = util.divide100(car_data.data.result.summarydata.othermoney);

        //出险报告
        for (var i = 0; i < car_data.data.result.carclaimrecords.length; i++) {
            //理赔金额
            car_data.data.result.carclaimrecords[i].damagemoney = util.divide100(car_data.data.result.carclaimrecords[i].damagemoney)
            //维修金额
            car_data.data.result.carclaimrecords[i].repairamount = util.divide100(car_data.data.result.carclaimrecords[i].repairamount)
            //换件金额
            car_data.data.result.carclaimrecords[i].renewalamount = util.divide100(car_data.data.result.carclaimrecords[i].renewalamount)
            //其他金额
            car_data.data.result.carclaimrecords[i].otheramount = util.divide100(car_data.data.result.carclaimrecords[i].otheramount)
            //理赔项金额
            for (var j = 0; j < car_data.data.result.carclaimrecords[i].claimdetails.length; j++) {
                car_data.data.result.carclaimrecords[i].claimdetails[j].itemamount = util.divide100(car_data.data.result.carclaimrecords[i].claimdetails[j].itemamount)
            }
        }
        this.setData({
            car: car_data
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function (car_data) {

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
            title: "保险理赔报告详情",
            path: that.data.share_path + '?id=' + that.data.car.Id_,
            // imageUrl: that.data.share.imageUrl,
            success: function (res) {
                console.log(app.globalData.openid);
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }
})