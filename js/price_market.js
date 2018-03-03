$(function() {
    // price_market.js 页面内部的 部分全局变量
    var MUTI = {
        mapDir: '../',
        starDot: '<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:',
        endDot: '"></span>',
        monitorUnite: '吨',
        slideCurrentTime: 2014,
        timeMonitor: 2017,
        timeAnaOne: 2017,
        timeAnaTwo: 2017,
        chartThreeUnite: '千吨', // 表3 季节性来源去向分布
        area1: '北京', // 主销区 默认地区
        area2: '山东' // 主产区 默认地区

    };

    // 地图描述
    function initMapDesc() {
        var flag = $(".stream-monitor").find(".time-tab li.active").text();
        var str = '';
        switch (flag) {
            case '主销区':
                str = '来源';
                break;
            case '主产区':
                str = '去向';
                break;
            default:
                str = '来源';
        }
        $(".direction").text(str);
        $(".destination").text($(".stream-monitor .sel-area").text());
    }


    /**
     * 公共函数 伴随着 主销区 与 主产区的切换，三个表的 一些 字段 跟随变换
     * @param  {dom} dom '.stream-monitor'
     * @return {obj}     {some: something, ...}
     */
    function switchArea(dom) {
        var whichArea = $(dom).find(".time-tab li.active").text();
        var areaObj = {};
        switch (whichArea) {
            case '主销区':
                areaObj.whichArea = '主销区： ';
                areaObj.lineStyle = 'solid';
                areaObj.dir = false;
                areaObj.yAxisOne = '来源排名';
                areaObj.yAxisTwo = '季节性来源分布';
                areaObj.selArea = MUTI.area1;
                areaObj.unite = MUTI.monitorUnite;
                break;
            case '主产区':
                areaObj.whichArea = '主产区： ';
                areaObj.dir = true;
                areaObj.lineStyle = 'dashed';
                areaObj.yAxisOne = '去向排名';
                areaObj.yAxisTwo = '季节性去向分布';
                areaObj.selArea = MUTI.area2;
                areaObj.unite = MUTI.monitorUnite;
                break;
            default:
        }
        return areaObj;
    }

    /**
     * ********************************************
     * ***********流向监测 ajax交互*********
     * ********************************************
     */
    // 假数据
    // echarts 图表初始化开始，无关后台数据交互
    var resData = [{
            "data": [
                [{
                        "name": "北京市"
                    },
                    {
                        "name": "山东省",
                        "value": 10.25
                    }
                ],
                [{
                        "name": "北京市"
                    },
                    {
                        "name": "陕西省",
                        "value": 17.67
                    }
                ],
                [{
                        "name": "北京市"
                    },
                    {
                        "name": "山西省",
                        "value": 8.66
                    }
                ],
                [{
                        "name": "北京市"
                    },
                    {
                        "name": "甘肃省",
                        "value": 5.98
                    }
                ],
                [{
                        "name": "北京市"
                    },
                    {
                        "name": "辽宁省",
                        "value": 3.99
                    }
                ],
                [{
                        "name": "北京市"
                    },
                    {
                        "name": "河北省",
                        "value": 2.73
                    }
                ],
                [{
                        "name": "北京市"
                    },
                    {
                        "name": "北京市",
                        "value": 0.73
                    }
                ]
            ],
            "name": "北京"
        },
        {
            "data": [
                [{
                        "name": "广西壮族自治区"
                    },
                    {
                        "name": "山东省",
                        "value": 10.25
                    }
                ],
                [{
                        "name": "广西壮族自治区"
                    },
                    {
                        "name": "重庆市",
                        "value": 10
                    }
                ],
                [{
                        "name": "广西壮族自治区"
                    },
                    {
                        "name": "广西壮族自治区",
                        "value": 10
                    }
                ]
            ],
            "name": "广西"
        }
    ]

    // 地图处理函数
    var convertData = function(data, areaObj) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            var fromCoord = geoCoordMap[dataItem[0].name];
            var toCoord = geoCoordMap[dataItem[1].name];
            if (fromCoord && toCoord) {
                if (areaObj.dir) {
                    res.push({
                        fromName: dataItem[0].name,
                        toName: dataItem[1].name,
                        coords: [fromCoord, toCoord],
                        value: dataItem[1].value
                    });
                } else {
                    res.push({
                        fromName: dataItem[0].name,
                        toName: dataItem[1].name,
                        coords: [toCoord, fromCoord],
                        value: dataItem[1].value
                    });
                }
            }
        }
        return res;
    };
    // 地图处理函数
    function handleResData(resData, areaObj, maxNum) {
        //定义传导机制和市场流通流向图中的空数组
        // var arr=[];
        var newAreaObj = areaObj;
        if (!areaObj) {
            newAreaObj = { 'lineStyle': 'solid', 'dir': true };
        }
        var color = 'aqua'; //'gold','lime'
        var series = [];
        resData.forEach(function(item, i) {
            series.push({ //线
                name: item.name,
                type: 'lines',
                zlevel: 1,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0.7,
                    color: '#fff',
                    symbolSize: 3
                },
                lineStyle: {
                    normal: {
                        color: color,
                        width: 1,
                        curveness: 0.2,
                        type: newAreaObj.lineStyle
                    }
                },
                data: convertData(item.data, newAreaObj)
            }, { //移动 点
                name: item.name,
                type: 'lines',
                zlevel: 2,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0,
                    // symbol: planePath,
                    symbolSize: 5
                },
                lineStyle: {
                    normal: {
                        color: color,
                        width: 1,
                        opacity: 0.4,
                        curveness: 0.2
                    }
                },
                data: convertData(item.data, newAreaObj)
            }, { //省份圆点
                name: item.name,
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: {
                    brushType: 'stroke',
                    scale: 6
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: function(params) {
                            if (params.name.indexOf(params.seriesName) != -1) return '';
                            return params.name + '： ' + params.value[2] + areaObj.unite;
                            // if (!areaObj) {
                            // } else {
                            //     return params.name;
                            // }
                        }
                    }
                },
                symbolSize: function(val) {
                    //return val[2];
                    // arr.push(val[2])
                    // var maxNum = Math.max.apply(null, arr);
                    return (val[2] / maxNum) * 30 > 10 ? (val[2] / maxNum) * 30 : 10;
                },
                //symbolSize: 15,
                itemStyle: {
                    normal: {
                        color: color
                    }
                },
                data: item.data.map(function(dataItem) {
                    return {
                        name: dataItem[1].name,
                        value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                    };
                })
            }, {
                name: '辅助颜色',
                type: 'map',
                // zoom: 1.25,
                mapType: 'china',
                markPoint: {
                    symbol: 'circle'
                },
                itemStyle: {
                    normal: {
                        borderColor: '#fff',
                        areaColor: 'rgba(72, 118, 255,0.9)'
                    },
                    emphasis: {
                        areaColor: '#3952ca'
                    }
                },
                data: [
                    { name: '山东', value: 0 },
                    { "name": "广西", value: 0}
                ],
                roam: true,
            });
        });
        return series;
    }

    streamMonitorOption = {
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow',
                shadowStyle: {
                    color: 'rgba(0,46, 115, 0.3)'
                }
            },
            textStyle: {
                align: 'left',
                color: '#5cc1ff',
                fontSize: '16'
            },
            backgroundColor: 'rgba(15, 52, 135, 0.5)',
            borderWidth: '1',
            borderColor: '#5cc1ff',
            extraCssText: 'box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);',
            formatter: function(params) {
                var flag = switchArea(".stream-monitor").dir;
                if (params.seriesType == 'effectScatter') {
                    if (flag) {
                        return params.seriesName + '>' + params.name + '<br>' + '交易量:<b style="color:#ffa600;font-weight:blod;font-size:18px;">' + params.data.value[2] + '</b>吨';
                    } else {
                        return params.name + '>' + params.seriesName + '<br>' + '交易量:<b style="color:#ffa600;font-weight:blod;font-size:18px;">' + params.data.value[2] + '</b>吨';
                    }
                }
            }
        },
        legend: {
            show: false,
            orient: 'vertical',
            top: 'bottom',
            left: 'right',
            data: ['北京', '山东'],
            textStyle: {
                color: '#fff'
            },
            selectedMode: 'single'
        },
        geo: {
            map: 'china',
            // zoom: 1.25,
            // label: {
            //     emphasis: {
            //         show: false
            //     }
            // },
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            roam: true,
            itemStyle: {
                normal: {
                    areaColor: 'rgba(72, 118, 255,0.9)'
                    // areaColor: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                    //     offset: 1,
                    //     color: 'rgba(66,117,222, 0.4)'
                    // }, {
                    //     offset: 0,
                    //     color: 'rgba(52,126,209, 0.8)'
                    // }]),
                    // borderColor: '#2a40a4'
                },
                emphasis: {
                    areaColor: '#3952ca'
                }
            }
        },
        dataRange: {
            type: 'continuous',
            min: 0,
            max: 100,
            text: ['交易量：吨'],
            textGap: 40,
            calculable: true,
            color: ['#ff3333', 'orange', 'yellow', 'lime', 'aqua', '#1E3FDE'],
            textStyle: {
                color: '#0e9cf1',
                fontSize: 16,
                align: 'center'
            }
        },
        series: handleResData(resData, { lineStyle: 'solid', unite: MUTI.monitorUnite }, 20)
    };
    var streamMonitor = echarts.init(document.getElementById('stream-monitor'));
    streamMonitor.setOption(streamMonitorOption);

    function streamMonitorInit(resData, areaObj, maxNum) {
        streamMonitor.setOption({
            series: handleResData(resData, areaObj, maxNum)
        });
    }
    // echarts 图表初始化完成，无关后台数据交互

    // 点击主销区时的 ajax 交互
    $(".stream-monitor .fake-ul").on("click", "li", function() {
        var streamMonitorObj = {
            areaObj: switchArea(".stream-monitor"), // 前台样式 无关交互
            whichArea: getPeriod(".stream-monitor"), // ajax 可能需要字段， 主销区 主产区哪个状态
            mainArea: getMainArea(".stream-monitor"), // ajax 可能需要字段， 单选按钮 地域获取
            timeMonitor: MUTI.timeMonitor || 2011
        };
        console.log(streamMonitorObj);

        // after you do something, for example.... Ajax
        streamMonitorInit(resData, streamMonitorObj.areaObj);
    });

    // 时间轴
    var streamMonitorTime = new scrollBar({
        dom: document.getElementById('strmon-tc'),
        height: 12,
        // width: 800,
        position: 'bottom',
        backgroundImage: MUTI.mapDir + 'images/scale-bg.png',
        withTime: true,
        slideStart: MUTI.slideCurrentTime,
        slideBgImage: MUTI.mapDir + 'images/scroll-icon.png',
        data: ['2017-01-01', '2017-02', '2017-03', '2017-04', '2017-05', '2017-06'],
        tooltipWidth: 95,
        tooltipHeight: 35,
        tooltipFontSize: 16,
        tooltipImage: MUTI.mapDir + 'images/tooltip.png'
    });
    streamMonitorTime.scrollChange(function(time) {
        var streamMonitorObj = {
            areaObj: switchArea(".stream-monitor"), // 样式需要，无关后台
            whichArea: getPeriod(".stream-monitor"), // ajax 可能需要字段， 主销区 主产区哪个状态
            mainArea: getMainArea(".stream-monitor"), // ajax 可能需要的 字段， 主销区 主产区 切换
            timeMonitor: time || MUTI.timeMonitor // 时间
        };
        if (time) { MUTI.timeMonitor = time; }
        console.log(streamMonitorObj);
        // after you do something, for example.... Ajax
        streamMonitorInit(resData, streamMonitorObj.areaObj);
    });

    /**
     * ********************************************
     * ***********流向分析 来源排名*********
     * ********************************************
     */
    // echarts 图表初始化开始，无关后台数据交互
    var strAnaOne = echarts.init(document.getElementById('stream-analyse1'));
    strAnaOneOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                shadowStyle: {
                    color: 'rgba(0,46, 115, 0.3)'
                }
            },
            textStyle: {
                align: 'left',
                color: '#5cc1ff',
                fontSize: '16'
            },
            backgroundColor: 'rgba(15, 52, 135, 0.5)',
            borderWidth: '1',
            borderColor: '#5cc1ff',
            extraCssText: 'box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);',
            formatter: function(params, ticket, callback) {
                var str = '北京' + '>' + params[0].name + "<br />" + "总交易量：" + "<span style='color:#ff8a00;font-weight:blod;font-size:18px;'>" + params[0].value + " </span>吨";
                return str;
            }

        },
        label: {
            normal: {
                textStyle: {
                    color: "#ff3b00"
                }
            },
            emphasis: {
                textStyle: {
                    color: "#ff3b00"
                }
            }
        },
        grid: {
            left: '1%',
            right: '17%',
            bottom: '1%',
            top: '30',
            containLabel: true
        },
        yAxis: {
            type: 'category',
            name: '来源排名',
            axisLine: {
                lineStyle: {
                    color: '#8ac7ff'
                }
            },
            axisTick: {
                show: false,
                interval: 0,
                alignWithLabel: true
            },
            axisLabel: {
                interval: 0,
                rotate: '0',
                textStyle: {
                    fontSize: 10,
                    color: '#8ac7ff'
                }
            },
            data: ['北京', "山西", "陜西", "河南", "河北"],
            splitLine: {
                show: false
            }
        },
        xAxis: {
            type: 'value',
            name: '',
            splitLine: {
                show: true,
                lineStyle: {
                    color: ['#2f46a1']
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false,
            },
            axisLine: {
                lineStyle: {
                    color: '#8ac7ff'
                }
            }
        },
        series: [{
            name: '数量',
            type: 'bar',
            stack: '总量',
            barWidth: 20,
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    formatter: "{c}千吨",
                    textStyle: {
                        fontSize: 16,
                        color: '#e47b2a'
                    }
                }
            },
            itemStyle: {
                normal: {
                    barBorderRadius: [10, 10, 10, 10],
                    barBorderColor: '#f97b00',
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 0,
                        color: 'rgba(255, 82, 22, 0.4)'
                    }, {
                        offset: 1,
                        color: 'rgb(255, 152, 52)'
                    }])
                },
                emphasis: {
                    barBorderColor: '#644424',
                    // color: 'rgba(26,177,98,.8)'
                }
            },
            // 顺序 从下向上 传入
            data: [370, 1250, 1600, 2335, 2210]
        }]
    };
    strAnaOne.setOption(strAnaOneOption);

    function strAnaOneInit(obj, data) {
        strAnaOne.setOption({
            tooltip: {
                formatter: function(params) {
                    var str = '山东' + '>' + params[0].name + "<br />" + "总交易量：" + "<span style='color:#ff8a00;font-weight:blod;font-size:18px;'>" + params[0].value + " </span>吨";
                    return str;
                }
            },
            yAxis: {
                name: obj.areaObj.yAxisOne,
                data: ['北京', "山西", "陜西", "河南", "河北"],
            },
            series: [{
                // 顺序 从下向上 传入
                data: data
            }]
        });
    }
    // echarts 图表初始化完成，无关后台数据交互

    // 时间轴
    var strAnaOneTime = new scrollBar({
        dom: document.getElementById('strmon-ana1'),
        height: 12,
        // width: 800,
        position: 'bottom',
        backgroundImage: MUTI.mapDir + 'images/scale-bg.png',
        withTime: true,
        slideStart: MUTI.slideCurrentTime,
        slideBgImage: MUTI.mapDir + 'images/scroll-icon.png',
        data: ['2000', '2001', '2002', '2003', '2004', '2005'],
        tooltipWidth: 95,
        tooltipHeight: 30,
        tooltipFontSize: 16,
        tooltipImage: MUTI.mapDir + 'images/tooltip.png'
    });
    strAnaOneTime.scrollChange(function(time) {
        var strAnaObj = {
            areaObj: switchArea(".stream-monitor"), // 样式需要，无关后台
            whichArea: getPeriod(".stream-monitor"), // ajax 可能需要字段， 主销区 主产区哪个状态
            mainArea: getMainArea(".stream-analyse"), // ajax 可能需要的 字段， 主销区 主产区 切换
            timeAnaOne: time || MUTI.timeAnaOne, // 时间
        };
        if (time) { MUTI.timeAnaOne = time; }

        // after you do something, for example.... Ajax
        strAnaOneInit(strAnaObj, [37, 1250, 1600, 2335, 2210]);
    });

    /**
     * ********************************************
     * ***********流向分析 季节性来源分析*********
     * ********************************************
     */
    // echarts 图表初始化开始，无关后台数据交互
    var strAnaTwo = echarts.init(document.getElementById('stream-analyse2'));
    strAnaTwoOption = {
        grid: {
            right: '8%',
            left: '15%',
            bottom: '10%',
            top: '10%'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                shadowStyle: {
                    color: 'rgba(0,46, 115, 0.3)'
                }
            },
            // formatter: '{a0}: {c0}吨<br />{a1}: {c1}吨<br />{a2}: {c2}吨<br />{a3}: {c3}吨',
            formatter: function(params) {
                console.log(params);
                var str = '';
                params.forEach(function(v, i) {
                    str += v.seriesName + "： " + v.data + MUTI.chartThreeUnite + "<br>";
                });
                return str;
            },
            textStyle: {
                align: 'left',
                color: '#5cc1ff',
                fontSize: '16'
            },
            backgroundColor: 'rgba(15, 52, 135, 0.5)',
            borderWidth: '1',
            borderColor: '#5cc1ff',
            extraCssText: 'box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);'
        },
        legend: {
            data: ['第一季度', '第二季度', '第三季度', '第四季度'],
            right: '60',
            //top: '35',
            textStyle: {
                color: '#8ac7ff'
            },
            itemGap: 20,
            itemHeight: 15,
            itemWidth: 15
        },
        calculable: true,
        xAxis: {
            type: 'category',
            axisLine: {
                lineStyle: {
                    color: '#8ac7ff'
                }
            },
            axisTick: {
                show: false,
                interval: 0,
                alignWithLabel: true
            },
            axisLabel: {
                interval: 0,
                rotate: '0',
                textStyle: {
                    fontSize: 10,
                    color: '#8ac7ff'
                }
            },
            data: ['北京', "山西", "陜西", "河南", "河北"],
            splitLine: {
                show: true,
                lineStyle: {
                    color: ['#2f46a1']
                }
            }
        },
        yAxis: {
            type: 'value',
            name: '季节性来源分布',
            splitLine: {
                show: true,
                lineStyle: {
                    color: ['#2f46a1']
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: true,
                textStyle: {
                    fontSize: 10,
                    color: '#8ac7ff'
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#8ac7ff'
                }
            }
        },
        series: [{
            name: '第一季度',
            type: 'bar',
            barMaxWidth: 20,
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1, [{
                            offset: 0,
                            color: '#00b8fe'
                        }, {
                            offset: 1,
                            color: '#1846a3'
                        }]
                    ),
                    opacity: 0.6,
                    barBorderRadius: 30,
                    barBorderColor: '#00b6fc'
                },
                emphasis: {
                    opacity: 1
                }
            },
            data: [200, 300, 100, 330, 350],
            zlevel: 9
        }, {
            name: '第二季度',
            type: 'bar',
            barMaxWidth: 20,
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1, [{
                            offset: 0,
                            color: '#d0bf44'
                        }, {
                            offset: 1,
                            color: '#d0bc44'
                        }]
                    ),
                    opacity: 0.6,
                    barBorderRadius: 30,
                    barBorderColor: '#fbde30'
                },
                emphasis: {
                    opacity: 1
                }
            },
            data: [500, 100, 400, 300, 600],
            zlevel: 9
        }, {
            name: '第三季度',
            type: 'bar',
            barMaxWidth: 20,
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1, [{
                            offset: 0,
                            color: '#d0bf44'
                        }, {
                            offset: 1,
                            color: '#6a3b63'
                        }]
                    ),
                    opacity: 0.6,
                    barBorderRadius: 30,
                    barBorderColor: '#fb9635'
                },
                emphasis: {
                    opacity: 1
                }
            },
            data: [400, 300, 100, 500, 300],
            zlevel: 9
        }, {
            name: '第四季度',
            type: 'bar',
            barMaxWidth: 20,
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1, [{
                            offset: 0,
                            color: '#39ab4f'
                        }, {
                            offset: 1,
                            color: '#595d71'
                        }]
                    ),
                    opacity: 0.6,
                    barBorderRadius: 30,
                    barBorderColor: '#2fee37'
                },
                emphasis: {
                    opacity: 1
                }
            },
            data: [470, 310, 340, 550, 480],
            zlevel: 9
        }]
    };
    strAnaTwo.setOption(strAnaTwoOption);

    function strAnaTwoInit(obj, data) {
        strAnaTwo.setOption({
            yAxis: {
                name: obj.areaObj.yAxisTwo,
            },
            series: data
        });
    }
    // echarts 图表初始化完成，无关后台数据交互

    var strAnaTwoTime = new scrollBar({
        dom: document.getElementById('strmon-ana2'),
        height: 12,
        // width: 800,
        position: 'bottom',
        backgroundImage: MUTI.mapDir + 'images/scale-bg.png',
        withTime: true,
        slideStart: MUTI.slideCurrentTime,
        slideBgImage: MUTI.mapDir + 'images/scroll-icon.png',
        data: ['2000', '2001', '2002', '2003', '2004', '2005'],
        tooltipWidth: 95,
        tooltipHeight: 30,
        tooltipFontSize: 16,
        tooltipImage: MUTI.mapDir + 'images/tooltip.png'
    });
    strAnaTwoTime.scrollChange(function(time) {
        var strAnaObj = {
            areaObj: switchArea(".stream-monitor"), // 样式需要，无关后台
            whichArea: getPeriod(".stream-monitor"), // ajax 可能需要字段， 主销区 主产区哪个状态
            mainArea: getMainArea(".stream-analyse"), // ajax 可能需要的 字段， 主销区 主产区 切换
            timeAnaTwo: time || MUTI.timeAnaTwo // 时间
        };
        if (time) { MUTI.timeAnaTwo = time }
        strAnaTwoInit(strAnaObj, [{
            name: '第一季度',
            data: [100, 300, 100, 330, 350],
        }, {
            name: '第二季度',
            data: [500, 100, 400, 300, 600],
        }, {
            name: '第三季度',
            data: [400, 300, 100, 500, 300],
        }, {
            name: '第四季度',
            data: [470, 310, 340, 550, 480],
        }]);
    });

    // 点击主销区时的 左右两表 ajax 交互，表一 与 表二
    $(".stream-analyse .fake-ul").on("click", "li", function() {
        var strAnaObj = {
            areaObj: switchArea(".stream-monitor"), // 样式需要，无关后台
            whichArea: getPeriod(".stream-monitor"), // ajax 可能需要字段， 主销区 主产区哪个状态
            mainArea: getMainArea(".stream-analyse"), // ajax 可能需要的 字段， 主销区 主产区 切换
            timeAnaOne: MUTI.timeAnaOne, // 时间
            timeAnaTwo: MUTI.timeAnaTwo // 时间
        };
        console.log(strAnaObj);
        // 左表 after you do something, for example.... Ajax
        strAnaOneInit(strAnaObj, [370, 1250, 1600, 2335, 2210]);

        // 右表 after you do something, for example.... Ajax
        strAnaTwoInit(strAnaObj, [{
            name: '第一季度',
            data: [10, 300, 100, 330, 350],
        }, {
            name: '第二季度',
            data: [500, 100, 400, 300, 600],
        }, {
            name: '第三季度',
            data: [400, 300, 100, 500, 300],
        }, {
            name: '第四季度',
            data: [470, 310, 340, 550, 480],
        }]);
    });


    /**
     * ********************************************
     * ***********点击 最上层的 主销区 主产区 时的
     * ********** 所有 echarts 表 的 交互*********
     * ********************************************
     */
    $(".stream-monitor .time-tab").on("click", "li", function() {
        // 主销区 主产区 状态更改时，其地名 跟随改变
        $(".sel-area").text(switchArea(".stream-monitor").selArea);
        initMapDesc();
        var obj = {
            areaObj: switchArea(".stream-monitor"), // 样式需要，无关后台
            whichArea: getPeriod(".stream-monitor"), // ajax 可能需要字段， 主销区 主产区哪个状态
            mainAreaTop: getMainArea(".stream-monitor"), // ajax 可能需要的 字段， 主销区 主产区 切换
            mainAreaBottom: getMainArea(".stream-analyse"), // ajax 可能需要的 字段， 主销区 主产区 切换
            timeMonitor: MUTI.timeMonitor, // 时间1
            timeAnaOne: MUTI.timeAnaOne, // 时间2
            timeAnaTwo: MUTI.timeAnaTwo // 时间3
        };
        $(".which-area").text(obj.areaObj.whichArea);

        console.log(obj);

        // after you do something, for example.... Ajax，表一
        streamMonitorInit(resData, obj.areaObj);

        // 左表 after you do something, for example.... Ajax, 表二
        strAnaOneInit(obj, [9971, 120, 1600, 2335, 2210]);

        // 右表 after you do something, for example.... Ajax， 表三
        strAnaTwoInit(obj, [{
            name: '第一季度',
            data: [10, 300, 100, 330, 300],
        }, {
            name: '第二季度',
            data: [100, 100, 400, 300, 600],
        }, {
            name: '第三季度',
            data: [100, 100, 100, 500, 300],
        }, {
            name: '第四季度',
            data: [470, 310, 340, 550, 480],
        }]);
    });

});
