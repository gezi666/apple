var spaceDistributed = new JusfounD3Charts.mapSelect();
spaceDistributed.init(mapDom, exitDom);
spaceDistributed.setMap({
    symbol: '', //地图气泡图标
    isDown: true, //是否下钻
    // labelShow: 1, //0:全选，1:地图，2:气泡
    visualMax: 100000,
    upColor: "#EEF1FF", //左侧颜色控制
    downColor: "#101BCC", //左侧颜色控制
    minSize: 25,
    mapItemStyle: {       //地图样式
        normal: {
            borderColor: '#1F42AB',
            borderWidth: 1.2,
            areaColor: '#EEF1FF'
            // areaColor: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
            //     offset: 0,
            //     color: '#3A6BD9'
            // }, {
            //     offset: 1,
            //     color: '#2C80E7'
            // }]),
            // shadowColor: '#266DD5',
            // shadowOffsetY: 4,
            // shadowOffsetX: 4,
            // shadowBlur: 5
        },
        emphasis: {
            areaColor: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                offset: 0,
                color: '#FFFB00'
            }, {
                offset: 1,
                color: '#C4BE89'
            }])
        }
    },
    jsonUrl: MUTI.mapDir + "Lib/data/json/", //json 路径
    defaultMap: "china", //  world/china  世界地图暂时不支持下钻
    drillCallBack: currentArea
});

// 下钻函数
function currentArea(event) {
    MUTI.areaname = event.name;
    if (event.name === '中国') { event.name = '全国'; }
    if (!MUTI.currentTime) { MUTI.currentTime = MUTI.slideCurrentTime; }
    ajaxGetDataCall("resources/spatialDistribution/spatial2", 'TIME_ID=' + MUTI.currentTime + "&AREANAME=" + encodeURI(event.name), function(data) {
        // 处理只有一条数据时，以数组形式返回
        if (!(data.data instanceof Array)) {
            var data = [data.data];
        } else {
            var data = data.data;
        }
        var index = $(".space-distributed .pub-radio li.active").index() + 1;
        // 没有数据时候的处理
        // console.log(event.id)
        // 全局变量 渲染地图时 传送 id
        MUTI.eventID = event.id;
        if (index === 1) {
            spaceDistributed.render(event.id);
            spaceDistributed.setData({
                data: data,
                labelShow: index,
                visualMapShow: true,
                legendShow: false,
                over: function (params) {
                    var index = $(".space-distributed .pub-radio li.active").index() + 1;
                    if (!params.data) {return;}
                    var d = params;
                    d.newData = {};
                    // 无数据时的处理
                    if (!params.data) {return;}
                    params.data.value ? d.newData.value = params.data.value : d.newData.value = MUTI.notnum
                    params.data.valueAreapm ? d.newData.valueAreapm = params.data.valueAreapm : d.newData.valueAreapm = MUTI.notnum
                    params.data.valueAreazb ? d.newData.valueAreazb = (params.data.valueAreazb*100).toFixed(2) : d.newData.valueAreazb = MUTI.notnum
                    params.data.valuepm ? d.newData.valuepm = params.data.valuepm : d.newData.valuepm = MUTI.notnum
                    params.data.valuezb ? d.newData.valuezb = (params.data.valuezb*100).toFixed(2) : d.newData.valuezb = MUTI.notnum

                    if (d.componentType === "series" && index === 1) {
                        $('.tooltip')
                            .show()
                            .css({
                                left: d.event.offsetX,
                                top: d.event.offsetY
                            })
                            .html(d.name + "<br>" +
                                "<span style='color:#43AADE'>" + '种植面积： ' + "</span>" + d.newData.value + MUTI.valueArea + '<br>' +
                                "<span style='color:#43AADE'>" + '种植面积排名： ' + "</span>" + d.newData.valueAreapm + '<br>' +
                                "<span style='color:#43AADE'>" + '种植面积占比： ' + "</span>" + d.newData.valueAreazb + "%"
                                );
                    }
                },
                out: function (d) {
                    $(".tooltip").hide();
                }
            });
        } else {
            spaceDistributed.render(event.id);
            spaceDistributed.setData({
                data: data,
                labelShow: index,
                visualMapShow: false,
                legendShow: true,
                over: function (params) {
                    var index = $(".space-distributed .pub-radio li.active").index() + 1;

                    if (!params.data) {return;}
                    var d = params;
                    d.newData = {};
                    // 无数据时的处理
                    if (!params.data) {return;}
                    params.data.value ? d.newData.value = params.data.value : d.newData.value = MUTI.notnum
                    params.data.valueAreapm ? d.newData.valueAreapm = params.data.valueAreapm : d.newData.valueAreapm = MUTI.notnum
                    params.data.valueAreazb ? d.newData.valueAreazb = (params.data.valueAreazb*100).toFixed(2) : d.newData.valueAreazb = MUTI.notnum
                    params.data.valuepm ? d.newData.valuepm = params.data.valuepm : d.newData.valuepm = MUTI.notnum
                    params.data.valuezb ? d.newData.valuezb = (params.data.valuezb*100).toFixed(2) : d.newData.valuezb = MUTI.notnum

                    if (d.componentType === "markPoint" && index === 2) {
                        $('.tooltip')
                            .show()
                            .css({
                                left: d.event.offsetX,
                                top: d.event.offsetY
                            })
                            .html(d.name + "<br>" +
                                "<span style='color:#43AADE'>" + '产量： ' + "</span>" + d.newData.value + MUTI.yield + '<br>' +
                                "<span style='color:#43AADE'>" + '产量排名： ' + "</span>" + d.newData.valuepm + '<br>' +
                                "<span style='color:#43AADE'>" + '产量占比： ' + "</span>" + d.newData.valuezb + "%"
                                );
                    }
                },
                out: function (d) {
                    $(".tooltip").hide();
                }
            });
        }
    });

    /**
     * 地图下钻时，重新渲染 选择的地区区域
     */
    switch (parseInt(event.index)) {
        case 0:
            $(".for-pop").text("分省");
            break;
        case 1:
            $(".for-pop").text("分市");
            break;
        case 2:
            $(".for-pop").text("分县");
            break;
        default:
            $(".for-pop").text("分省");
    }

    var id = event.id;
    if (id === 'china') {id = '000000';}
    // 如果 id 前四位是 0000，则说明其在点击 中国 或者 省级
    var flag = id.substr(-4);

    if (parseInt(event.index) <= 2) {
        ajaxGetDataCall("resources/spatialDistribution/region3", 'AREANAME=' + encodeURI(event.name), function(data) {
            var data = data.data;
            var str = '';
            for (var i = 0; i < data.length; i++) {
                str += '<li class="area-item">' +
                    '<label>' +
                    '<input type="checkbox">' +
                    '<i class="checkbox iconfont"></i>' +
                    '<span data-areaid=' + data[i].areaId + '>' + data[i].name + '</span>' +
                    '</label>' +
                    '</li>';
            }
            $("ul.areas").html(str);
        });
    }
    /**
     * 地图下钻时，页面其余 echarts 图标跟随 切换 不同的 区域md！！！
     * 历史演变
     */
    var areaid = id;
    if (flag === '0000') {
        areaid = id.substr(0, 2);
    }
    var str = '<span data-areaid=' + areaid + '>' + event.name + '</span>';
    $(".history .locations").html(str);
    var units = getDanwei((".history"));
    switch (units) {
        case '种植面积':
            units = '121689';
            break;
        case '产量':
            units = '112716';
            break;
        default:
    }
    var historyObj = {
        year: 5,
        time_while: getTime('.history'),
        areas: areaid,
        danwei: units,
        scope: '全国',
        dom: ".history",
        handbarsDom: '#person',
        echartDom: 'history'
    };
    getData(historyObj);

    /**
     * 地图下钻时，页面其余 echarts 图标跟随 切换 不同的 区域md！！！
     * 生产占比
     */
    $(".occupy .current-area").text(event.name).data("areaid", areaid);
    var newDanwei = getDanwei(".occupy");
    var danwei = null;
    switch (newDanwei) {
        case '种植面积':
            danwei = '121689';
            break;
        case '产量':
            danwei = '112716';
            break;
        default:
    }

    var newOccupyObj = {
        year: 5,
        time_while: getTime(".occupy"),
        currentArea: getCurrentArea(".occupy"),
        danwei: danwei,
        dom: "#production_status_生产占比",
        handbarsDom: '#zhanbi',
        echartDom: 'occupy'
    };
    getZBData(newOccupyObj);

}

var spaceObj = {
    years: 36,
    area: '全国'
};

// 获取时间 初始化 时间轴
ajaxGetDataCall("resources/spatialDistribution/years2", '', spaceTimeCb);
function spaceTimeCb(data) {
    MUTI.spaceTimeData = data.data.reverse();
    // 初始化时间轴
    var bar = new scrollBar({
        dom: document.getElementById('space-distributed-time'),
        height: 12,
        // width: 800,
        position: 'bottom',
        backgroundImage: MUTI.mapDir + 'images/scale-bg.png',
        withTime: true,
        slideStart: MUTI.slideCurrentTime,
        slideBgImage: MUTI.mapDir + 'images/scroll-icon.png',
        data: MUTI.spaceTimeData,
        tooltipWidth: 48,
        tooltipHeight: 20,
        tooltipImage: MUTI.mapDir + 'images/tooltip.png'
    });
    bar.scrollChange(function(time) {
        MUTI.currentTime = time;
        if (!MUTI.areaname) {
            MUTI.areaname = '全国';
        } else if (MUTI.areaname === '中国') {
            MUTI.areaname = '全国';
        }
        ajaxGetDataCall("resources/spatialDistribution/spatial2", 'TIME_ID=' + time + "&AREANAME=" + encodeURI(MUTI.areaname), function(data) {
            // 处理只有一条数据时，以数组形式返回
            if (!(data.data instanceof Array)) {
                var data = [data.data];
            } else {
                var data = data.data;
            }
            // console.log(JSON.stringify(data));
            var index = $(".space-distributed .pub-radio li.active").index() + 1;
            // 没有数据时候的处理
            if (index === 1) {
                spaceDistributed.render(MUTI.eventID);
                spaceDistributed.setData({
                    data: data,
                    labelShow: index,
                    visualMapShow: true,
                    legendShow: false,
                    over: function (params) {
                        var index = $(".space-distributed .pub-radio li.active").index() + 1;
                        if (!params.data) {return;}
                        var d = params;
                        d.newData = {};
                        // 无数据时的处理
                        if (!params.data) {return;}
                        params.data.value ? d.newData.value = params.data.value : d.newData.value = MUTI.notnum
                        params.data.valueAreapm ? d.newData.valueAreapm = params.data.valueAreapm : d.newData.valueAreapm = MUTI.notnum
                        params.data.valueAreazb ? d.newData.valueAreazb = (params.data.valueAreazb*100).toFixed(2) : d.newData.valueAreazb = MUTI.notnum
                        params.data.valuepm ? d.newData.valuepm = params.data.valuepm : d.newData.valuepm = MUTI.notnum
                        params.data.valuezb ? d.newData.valuezb = (params.data.valuezb*100).toFixed(2) : d.newData.valuezb = MUTI.notnum

                        if (d.componentType === "series" && index === 1) {
                            $('.tooltip')
                                .show()
                                .css({
                                    left: d.event.offsetX,
                                    top: d.event.offsetY
                                })
                                .html(d.name + "<br>" +
                                    "<span style='color:#43AADE'>" + '种植面积： ' + "</span>" + d.newData.value + MUTI.valueArea + '<br>' +
                                    "<span style='color:#43AADE'>" + '种植面积排名： ' + "</span>" + d.newData.valueAreapm + '<br>' +
                                    "<span style='color:#43AADE'>" + '种植面积占比： ' + "</span>" + d.newData.valueAreazb + "%"
                                    );
                        }
                    },
                    out: function (d) {
                        $(".tooltip").hide();
                    }
                });
            } else {
                spaceDistributed.render(MUTI.eventID);
                spaceDistributed.setData({
                    data: data,
                    labelShow: index,
                    visualMapShow: false,
                    legendShow: true,
                    over: function (params) {
                        var index = $(".space-distributed .pub-radio li.active").index() + 1;

                        if (!params.data) {return;}
                        var d = params;
                        d.newData = {};
                        // 无数据时的处理
                        if (!params.data) {return;}
                        params.data.value ? d.newData.value = params.data.value : d.newData.value = MUTI.notnum
                        params.data.valueAreapm ? d.newData.valueAreapm = params.data.valueAreapm : d.newData.valueAreapm = MUTI.notnum
                        params.data.valueAreazb ? d.newData.valueAreazb = (params.data.valueAreazb*100).toFixed(2) : d.newData.valueAreazb = MUTI.notnum
                        params.data.valuepm ? d.newData.valuepm = params.data.valuepm : d.newData.valuepm = MUTI.notnum
                        params.data.valuezb ? d.newData.valuezb = (params.data.valuezb*100).toFixed(2) : d.newData.valuezb = MUTI.notnum

                        if (d.componentType === "markPoint" && index === 2) {
                            $('.tooltip')
                                .show()
                                .css({
                                    left: d.event.offsetX,
                                    top: d.event.offsetY
                                })
                                .html(d.name + "<br>" +
                                    "<span style='color:#43AADE'>" + '产量： ' + "</span>" + d.newData.value + MUTI.yield + '<br>' +
                                    "<span style='color:#43AADE'>" + '产量排名： ' + "</span>" + d.newData.valuepm + '<br>' +
                                    "<span style='color:#43AADE'>" + '产量占比： ' + "</span>" + d.newData.valuezb + "%"
                                    );
                        }
                    },
                    out: function (d) {
                        $(".tooltip").hide();
                    }
                });
            }
        });
    });

    // 打开页面第一次初始化地图
    ajaxGetDataCall("resources/spatialDistribution/spatial2", 'TIME_ID=' + MUTI.slideCurrentTime + "&AREANAME=" + encodeURI(spaceObj.area), spaceAreaCb);
    function spaceAreaCb(data) {
        // console.log(JSON.stringify(data.data));
        // 处理只有一条数据时，以数组形式返回
        if (!(data.data instanceof Array)) {
            var data = [data.data];
            // console.log(JSON.stringify(data));
        } else {
            var data = data.data;
        }
        var index = $(".space-distributed .pub-radio li.active").index() + 1;
        // 没有数据时候的处理
        if (index === 1) {
            spaceDistributed.render('china');
            spaceDistributed.setData({
                data: data,
                labelShow: index,
                visualMapShow: true,
                legendShow: false,
                over: function (params) {
                    var index = $(".space-distributed .pub-radio li.active").index() + 1;
                    if (!params.data) {return;}
                    var d = params;
                    d.newData = {};
                    // 无数据时的处理
                    if (!params.data) {return;}
                    params.data.value ? d.newData.value = params.data.value : d.newData.value = MUTI.notnum
                    params.data.valueAreapm ? d.newData.valueAreapm = params.data.valueAreapm : d.newData.valueAreapm = MUTI.notnum
                    params.data.valueAreazb ? d.newData.valueAreazb = (params.data.valueAreazb*100).toFixed(2) : d.newData.valueAreazb = MUTI.notnum
                    params.data.valuepm ? d.newData.valuepm = params.data.valuepm : d.newData.valuepm = MUTI.notnum
                    params.data.valuezb ? d.newData.valuezb = (params.data.valuezb*100).toFixed(2) : d.newData.valuezb = MUTI.notnum

                    if (d.componentType === "series" && index === 1) {
                        $('.tooltip')
                            .show()
                            .css({
                                left: d.event.offsetX,
                                top: d.event.offsetY
                            })
                            .html(d.name + "<br>" +
                                "<span style='color:#43AADE'>" + '种植面积： ' + "</span>" + d.newData.value + MUTI.valueArea + '<br>' +
                                "<span style='color:#43AADE'>" + '种植面积排名： ' + "</span>" + d.newData.valueAreapm + '<br>' +
                                "<span style='color:#43AADE'>" + '种植面积占比： ' + "</span>" + d.newData.valueAreazb + "%"
                                );
                    }
                },
                out: function (d) {
                    $(".tooltip").hide();
                }
            });
        } else {
            spaceDistributed.render('china');
            spaceDistributed.setData({
                data: data,
                labelShow: index,
                visualMapShow: false,
                legendShow: true,
                over: function (params) {
                    var index = $(".space-distributed .pub-radio li.active").index() + 1;

                    if (!params.data) {return;}
                    var d = params;
                    d.newData = {};
                    // 无数据时的处理
                    if (!params.data) {return;}
                    params.data.value ? d.newData.value = params.data.value : d.newData.value = MUTI.notnum
                    params.data.valueAreapm ? d.newData.valueAreapm = params.data.valueAreapm : d.newData.valueAreapm = MUTI.notnum
                    params.data.valueAreazb ? d.newData.valueAreazb = (params.data.valueAreazb*100).toFixed(2) : d.newData.valueAreazb = MUTI.notnum
                    params.data.valuepm ? d.newData.valuepm = params.data.valuepm : d.newData.valuepm = MUTI.notnum
                    params.data.valuezb ? d.newData.valuezb = (params.data.valuezb*100).toFixed(2) : d.newData.valuezb = MUTI.notnum

                    if (d.componentType === "markPoint" && index === 2) {
                        $('.tooltip')
                            .show()
                            .css({
                                left: d.event.offsetX,
                                top: d.event.offsetY
                            })
                            .html(d.name + "<br>" +
                                "<span style='color:#43AADE'>" + '产量： ' + "</span>" + d.newData.value + MUTI.yield + '<br>' +
                                "<span style='color:#43AADE'>" + '产量排名： ' + "</span>" + d.newData.valuepm + '<br>' +
                                "<span style='color:#43AADE'>" + '产量占比： ' + "</span>" + d.newData.valuezb + "%"
                                );
                    }
                },
                out: function (d) {
                    $(".tooltip").hide();
                }
            });
        }
    }
}

// 种植面积 产量 切换
$(".space-distributed .pub-radio").on("click", "li", function() {
    var index = $(this).index() + 1;
    if (!MUTI.areaname) {
        MUTI.areaname = '全国';
    } else if (MUTI.areaname === '中国') {
        MUTI.areaname = '全国';
    }
    if (!MUTI.currentTime) {
        MUTI.currentTime = MUTI.slideCurrentTime;
    }

    ajaxGetDataCall("resources/spatialDistribution/spatial2", 'TIME_ID=' + MUTI.currentTime + "&AREANAME=" + encodeURI(MUTI.areaname), function(data) {
        // 处理只有一条数据时，以数组形式返回
        if (!(data.data instanceof Array)) {
            var data = [data.data];
        } else {
            var data = data.data;
        }
        // index = $(".space-distributed .pub-radio li.active").index() + 1;
        // 没有数据时候的处理
        if (index === 1) {
            spaceDistributed.render(MUTI.eventID);
            spaceDistributed.setData({
                data: data,
                labelShow: index,
                visualMapShow: true,
                legendShow: false,
                over: function (params) {
                    var index = $(".space-distributed .pub-radio li.active").index() + 1;
                    if (!params.data) {return;}
                    var d = params;
                    d.newData = {};
                    // 无数据时的处理
                    if (!params.data) {return;}
                    params.data.value ? d.newData.value = params.data.value : d.newData.value = MUTI.notnum
                    params.data.valueAreapm ? d.newData.valueAreapm = params.data.valueAreapm : d.newData.valueAreapm = MUTI.notnum
                    params.data.valueAreazb ? d.newData.valueAreazb = (params.data.valueAreazb*100).toFixed(2) : d.newData.valueAreazb = MUTI.notnum
                    params.data.valuepm ? d.newData.valuepm = params.data.valuepm : d.newData.valuepm = MUTI.notnum
                    params.data.valuezb ? d.newData.valuezb = (params.data.valuezb*100).toFixed(2) : d.newData.valuezb = MUTI.notnum

                    if (d.componentType === "series" && index === 1) {
                        $('.tooltip')
                            .show()
                            .css({
                                left: d.event.offsetX,
                                top: d.event.offsetY
                            })
                            .html(d.name + "<br>" +
                                "<span style='color:#43AADE'>" + '种植面积： ' + "</span>" + d.newData.value + MUTI.valueArea + '<br>' +
                                "<span style='color:#43AADE'>" + '种植面积排名： ' + "</span>" + d.newData.valueAreapm + '<br>' +
                                "<span style='color:#43AADE'>" + '种植面积占比： ' + "</span>" + d.newData.valueAreazb + "%"
                                );
                    }
                },
                out: function (d) {
                    $(".tooltip").hide();
                }
            });
        } else {
            spaceDistributed.render(MUTI.eventID);
            spaceDistributed.setData({
                data: data,
                labelShow: index,
                visualMapShow: false,
                legendShow: true,
                over: function (params) {
                    var index = $(".space-distributed .pub-radio li.active").index() + 1;

                    if (!params.data) {return;}
                    var d = params;
                    d.newData = {};
                    // 无数据时的处理
                    if (!params.data) {return;}
                    params.data.value ? d.newData.value = params.data.value : d.newData.value = MUTI.notnum
                    params.data.valueAreapm ? d.newData.valueAreapm = params.data.valueAreapm : d.newData.valueAreapm = MUTI.notnum
                    params.data.valueAreazb ? d.newData.valueAreazb = (params.data.valueAreazb*100).toFixed(2) : d.newData.valueAreazb = MUTI.notnum
                    params.data.valuepm ? d.newData.valuepm = params.data.valuepm : d.newData.valuepm = MUTI.notnum
                    params.data.valuezb ? d.newData.valuezb = (params.data.valuezb*100).toFixed(2) : d.newData.valuezb = MUTI.notnum

                    if (d.componentType === "markPoint" && index === 2) {
                        $('.tooltip')
                            .show()
                            .css({
                                left: d.event.offsetX,
                                top: d.event.offsetY
                            })
                            .html(d.name + "<br>" +
                                "<span style='color:#43AADE'>" + '产量： ' + "</span>" + d.newData.value + MUTI.yield + '<br>' +
                                "<span style='color:#43AADE'>" + '产量排名： ' + "</span>" + d.newData.valuepm + '<br>' +
                                "<span style='color:#43AADE'>" + '产量占比： ' + "</span>" + d.newData.valuezb + "%"
                                );
                    }
                },
                out: function (d) {
                    $(".tooltip").hide();
                }
            });
        }
    });
});
