$(function() {
    // price_monitor.js 页面内部的 部分全局变量
    var MUTI = {
        mapDir: '../',
        imagesDir: './../images/',
        jsonDir: './../Lib/data/monitor_json/',
        starDot: '<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:',
        endDot: '"></span>',
        slideCurrentTime: 2012, // MUTI.spaceTimeData[MUTI.spaceTimeData.length - 1]
        notnum: '暂无数据',
        trendUnits: '元/公斤'
    };

    // 随机数组生成函数
    function fakeData(len, times) {
        var mockData = [];
        for (var i = 0; i < len; i++) {
            mockData.push(Math.floor(Math.random()*times))
        };
        mockData.sort(function (a, b) {
            return b-a;
        })
        return mockData;
    }

    // 图例颜色
    function getColor(params) {
        var areaColor = [];
        switch (params) {
            case '日度':
                areaColor = ['#FBFBFF', '#DDDDFF', '#B9B9FF', '#9393FF', '#6A6AFF', '#8600FF'];
                break;
            case '周度':
                areaColor = ['#FBFBFF', '#F5FFE8', '#CEFFCE', '#79FF79', '#28FF28', '#00DB00']
                break;
            case '月度':
                areaColor = ['#86006F', '#6A6A6F', '#93936F', '#B9B96F', '#DDDD6F', '#FBFB3F']
                break;
            case '年度':
                areaColor = ['#86056F', '#6A5A6F', '#93956F', '#B9B56F', '#DDD56F', '#FBF56F']
                break;
            default:
                areaColor = ['#FBFBFF', '#DDDDFF', '#B9B9FF', '#9393FF', '#6A6AFF', '#8600FF'];
        }
        return areaColor;
    }
    // 模拟数据
    var fakeData1 = {
        areaData: [
            {name: '陕西',value: 1057,valueAreapm: 1, itemStyle: {normal: {areaColor: '#8600FF'}}},
            {name: '山东',value: 452,valueAreapm: 2, itemStyle: {normal: {areaColor: '#6A6AFF'}}},
            {name: '甘肃',value: 441,valueAreapm: 3, itemStyle: {normal: {areaColor: '#9393FF'}}},
            {name: '河北',value: 363,valueAreapm: 4, itemStyle: {normal: {areaColor: '#B9B9FF'}}},
            {name: '河南',value: 235,valueAreapm: 5, itemStyle: {normal: {areaColor: '#DDDDFF'}}},
            {name: '辽宁',value: 233,valueAreapm: 6, itemStyle: {normal: {areaColor: '#FBFBFF'}}},
            {name: '山西',value: 225,valueAreapm: 7, itemStyle: {normal: {areaColor: '#fffbff'}}}
        ],
        pieces: [
            {min: 453, max: 1057},
            {min: 442, max: 452},
            {min: 364, max: 441},
            {min: 236, max: 363},
            {min: 234, max: 235},
            {min: 226, max: 233},
            {min: 0, max: 225}
        ],
        dis: '周度'
    };
    var fakeData2 = {
        areaData: [
            {name: '陕西',value: 2057,valueAreapm: 1, itemStyle: {normal: {areaColor: '#8600FF'}}},
            {name: '山东',value: 1572,valueAreapm: 2, itemStyle: {normal: {areaColor: '#6A6AFF'}}},
            {name: '甘肃',value: 1421,valueAreapm: 3, itemStyle: {normal: {areaColor: '#9393FF'}}},
            {name: '河北',value: 1102,valueAreapm: 4, itemStyle: {normal: {areaColor: '#B9B9FF'}}},
            {name: '河南',value: 899,valueAreapm: 5, itemStyle: {normal: {areaColor: '#DDDDFF'}}},
            {name: '辽宁',value: 789,valueAreapm: 6, itemStyle: {normal: {areaColor: '#FBFBFF'}}},
            {name: '山西',value: 502,valueAreapm: 7, itemStyle: {normal: {areaColor: '#fffbff'}}}
        ],
        pieces: [
            {min: 1573, max: 2057},
            {min: 1422, max: 1572},
            {min: 1103, max: 1421},
            {min: 900, max: 1102},
            {min: 790, max: 899},
            {min: 503, max: 789},
            {min: 0, max: 502}
        ],
        dis: '日度'
    };
    var fakeData3 = {
        areaData: [
            {name: '陕西',value: 20157,valueAreapm: 1, itemStyle: {normal: {areaColor: '#86006F'}}},
            {name: '山东',value: 11572,valueAreapm: 2, itemStyle: {normal: {areaColor: '#6A6A6F'}}},
            {name: '甘肃',value: 11421,valueAreapm: 3, itemStyle: {normal: {areaColor: '#93936F'}}},
            {name: '河北',value: 11102,valueAreapm: 4, itemStyle: {normal: {areaColor: '#B9B96F'}}},
            {name: '河南',value: 8199,valueAreapm: 5, itemStyle: {normal: {areaColor: '#DDDD6F'}}},
            {name: '辽宁',value: 7189,valueAreapm: 6, itemStyle: {normal: {areaColor: '#FBFB6F'}}},
            {name: '山西',value: 5102,valueAreapm: 7, itemStyle: {normal: {areaColor: '#fffb6f'}}}
        ],
        pieces: [
            {min: 11573, max: 21057},
            {min: 11422, max: 11572},
            {min: 11103, max: 11421},
            {min: 9100, max: 11102},
            {min: 7190, max: 8199},
            {min: 5103, max: 7189},
            {min: 0, max: 5102}
        ],
        dis: '月度'
    };
    var fakeData4 = {
        areaData: [
            {name: '陕西',value: 25057,valueAreapm: 1, itemStyle: {normal: {areaColor: '#86003F'}}},
            {name: '山东',value: 15572,valueAreapm: 2, itemStyle: {normal: {areaColor: '#6A6A3F'}}},
            {name: '甘肃',value: 15421,valueAreapm: 3, itemStyle: {normal: {areaColor: '#93933F'}}},
            {name: '河北',value: 15102,valueAreapm: 4, itemStyle: {normal: {areaColor: '#B9B93F'}}},
            {name: '河南',value: 8599,valueAreapm: 5, itemStyle: {normal: {areaColor: '#DDDD3F'}}},
            {name: '辽宁',value: 7589,valueAreapm: 6, itemStyle: {normal: {areaColor: '#FBFB3F'}}},
            {name: '山西',value: 5502,valueAreapm: 7, itemStyle: {normal: {areaColor: '#fffb3f'}}}
        ],
        pieces: [
            {min: 15573, max: 25057},
            {min: 15422, max: 15572},
            {min: 15103, max: 15421},
            {min: 9500, max: 15102},
            {min: 7590, max: 8599},
            {min: 5503, max: 7589},
            {min: 0, max: 5502}
        ],
        dis: '年度'
    };
    var myChart_map = echarts.init(document.getElementById('map'));
    function mapToggle(data) {
        var myChart_map_option = {
            title: {},
            tooltip: {
                trigger: 'item'
            },
            visualMap: [{
                left: 'left',
                bottom: '100',
                type: 'piecewise',
                pieces: data.pieces,
                itemHeight: 30,
                itemGap: 0,
                inRange: {
                    symbol: 'rect',
                    color: getColor(data.dis)
                },
                textStyle: {
                    color: ['#5cc1ff'],
                    fontWeight: 'bold'
                }
            }],
            series: [
                {
                    name: '',
                    type: 'map',
                    mapType: 'china',
                    roam: true,
                    zoom: 1.2,
                    scaleLimit: {
                        min:0.2,
                        max: 2,
                    },
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    tooltip: {
                        textStyle: {
                            align: 'left',
                            color: '#5cc1ff',
                            fontSize: '16'
                        },
                        backgroundColor: 'rgba(15, 52, 135, 0.5)',
                        borderWidth: '1',
                        borderColor: '#5cc1ff',
                        extraCssText: 'box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);',
                        formatter: function (params) {
                            return params.data.name + '<br/>实时价格：' + parseFloat(params.data.value || 0).toFixed(0).fontsize(5).fontcolor('#FAB407')+
                                MUTI.trendUnits +
                                '<br/>排名：' + (!!params.data.valueAreapm?params.data.valueAreapm:0) +
                                '<br/>占比：' + (((!!params.data.value?params.data.value:0)/3006)*100).toFixed(2) + '%';
                        }
                    },
                    data: data.areaData
                }
            ]
        };
        myChart_map.setOption(myChart_map_option);
    }
    mapToggle(fakeData1)

    // 实时监控交互
    $($('.time-tab')[0]).on('click', 'li', function (e) {
        console.log($(this).html())
        if($(this).html() === '日度'){
            mapToggle(fakeData2)
        } else if($(this).html() === '周度'){
            mapToggle(fakeData1)
        } else if($(this).html() === '月度'){
            mapToggle(fakeData3)
        } else if($(this).html() === '年度'){
            mapToggle(fakeData4)
        }
    })

    /**
     * ********************************************
     * ***********实时监测 ajax 交互***************
     * ********************************************
     */
    /*
     * 模拟的数据
     * */
    /*var dataC = new CreateData();

    /!*
     * 实例地图
     * *!/
    var map = new jusfounChartMap.ChartMap();
    /!*
     * 地图配置项
     * dom 必传  如果dom为维数组  取第一个
     * areaColor 地图区域 颜色  由低到高
     * shadowColor 地图区域 径向渐变颜色 由低到高
     * *!/
    map.mapOption({
        dom: $('#map'),
        VisualMapItemHeight: 20,
        VisualMapItemWidth: 20,
        VisualMapTextMargin: 10,
        VisualMapText: '价格( 元/公斤 )',
        areaColor: ['#FBFBFF', '#DDDDFF', '#B9B9FF', '#9393FF', '#6A6AFF', '#8600FF'],
        jsonWay: MUTI.jsonDir,
        tooltipFormatter: function(d) {
            var param = d.data;
            if (!param) return;
            if (param.value && param.name) {
                return param.name + '<br />苹果平均价格 : ' + parseFloat(param.value).toFixed(2).fontsize(5).fontcolor('#FAB407') + ' 元/公斤';
            }
        }
    });


    /!*
     * 模拟数据
     *  data 格式
     {
     areaValue:16.6,   *** 每个省份的数据
     id:"710000",
     name:"台湾"
     }
     *  内部解析 要求 键名相同 areaValue、id、name
     * *!/

    dataC.getData('china', function(data) {
        /!*
         * 设置地图类型
         * param 【0】  json 文件名
         * param 【1】  对应的中文名称  会在tooltip中用到 若不传 则替换成 param【0】
         * *!/
        map.setMapType('china', '中国');
        /!*
         * 填充地图数据
         * *!/
        map.setData({
            data: data
        });
    });

    /!*
     * 跳转 全国
     * *!/
    $('#clickBtn').on('click', function() {
        map.setMapType('china', '中国');
        dataC.getData('china', function(data) {
            map.setData({
                data: data
            });
        });
    });

    //  监听地图点击事件
    map.on('click', function(e) {
        //        map.setMapType('gansu', '山东');
        //        map.setData([]);
        if (e.name == '山东') {
            dataC.getData('shandong', function(data) {
                map.setMapType('shandong', '山东');
                map.setData({
                    data: data
                });
            });
        }
    });*/


    /**
     * ********************************************
     * ***********涨跌幅排名 ajax 交互*********
     * ********************************************
     */
    // echarts 图表初始化开始，无关后台数据交互
    var rank1 = echarts.init(document.getElementById('rank1'));
    var rank2 = echarts.init(document.getElementById('rank2'));
    var rankOption1 = {
        tooltip: {
            trigger: 'axis',
            textStyle: {
                align: 'left',
                color: '#5cc1ff',
                // color: '#fff',
                fontSize: '16'
            },
            backgroundColor: 'rgba(15, 52, 135, 0.5)',
            borderWidth: '1',
            borderColor: '#5cc1ff',
            extraCssText: 'box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);',
            formatter: function(params) {
                return "<span>" + params[0].name + "</span>" + "<br />" + "<span>苹果批发价格涨跌幅: </span>" + "<span>" + params[0].value + "%</span>";
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
            right: '7%',
            bottom: '1%',
            top: '30',
            containLabel: true
        },
        yAxis: {
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
                    color: '#cee8ff'
                }
            },
            data: ['宁夏', '四川', "内蒙古", '新疆', "江苏", "山西", "陜西", "河南", "河北", "山东"],
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
                    color: ['rgba(138, 199, 255, .2)']
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#01c2db'
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
                    formatter: "{c}%"
                }
            },
            itemStyle: {
                normal: {
                    barBorderWidth: '0',
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
                    barBorderWidth: '1'
                    // color: 'rgba(26,177,98,.8)'
                }
            },
            // 顺序 从下向上 传入
            data: [370, 1250, 1600, 2335, 1278, 550, 700, 1820, 450, 790]
        }]
    };
    var rankOption2 = {
        tooltip: {
            trigger: 'axis',
            textStyle: {
                align: 'left',
                color: '#5cc1ff',
                // color: '#fff',
                fontSize: '16'
            },
            backgroundColor: 'rgba(15, 52, 135, 0.5)',
            borderWidth: '1',
            borderColor: '#5cc1ff',
            extraCssText: 'box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);',
            formatter: function(params) {
                return params[0].name + "<br />" + "<span>苹果批发价格涨跌幅: </span>" + "<span>" + params[0].value + "%</span>";
            }
        },
        label: {
            normal: {
                textStyle: {
                    color: "rgb(0,255,132)"
                }
            },
            emphasis: {
                textStyle: {
                    color: "rgb(0,255,132)"
                }
            }
        },
        grid: {
            left: '1%',
            right: '7%',
            bottom: '1%',
            top: '30',
            containLabel: true
        },
        yAxis: {
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
                    color: '#cee8ff'
                }
            },
            data: ['宁夏', '四川', "内蒙古", '新疆', "江苏", "山西", "陜西", "河南", "河北", "山东"],
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
                    color: ['rgba(138, 199, 255, .2)']
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#01c2db'
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
                    formatter: "{c}%"
                }
            },
            itemStyle: {
                normal: {
                    barBorderWidth: '0',
                    barBorderRadius: [10, 10, 10, 10],
                    barBorderColor: 'rgb(0,255,132)',
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 0,
                        color: 'rgba(0,255,132, .4)'
                    }, {
                        offset: 1,
                        color: 'rgb(0,255,132)'
                    }])
                },
                emphasis: {
                    barBorderWidth: '1',
                    barBorderColor: 'rgb(0,255,132)'
                    // color: 'rgba(26,177,98,.8)'
                }
            },
            // 顺序 从下向上 传入
            data: [370, 1250, 1600, 2335, 1278, 550, 700, 1820, 450, 790]
        }]
    };
    rank1.setOption(rankOption1);
    rank2.setOption(rankOption2);
    // echarts 图表初始化完成，无关后台数据交互
    function rankInit(upData, DownData) {
        rank1.setOption({
            yAxis: {
                data: ['宁夏', '四川', "内蒙古", '新疆', "江苏", "山西", "陜西", "河南", "河北", "山东"],
            },
            series: [{
                // 顺序 从下向上 传入
                data: upData
            }]
        });
        rank2.setOption({
            yAxis: {
                data: ['西藏', '黑龙江', "河北", '陜西', "山东", "武汉", "天津", "内蒙", "河南", "云南"],
            },
            series: [{
                // 顺序 从下向上 传入
                data: DownData
            }]
        });
    }

    // 页面初始化
    rankInit(fakeData(10, 100), fakeData(10, 100));

    // 点击年度时的 ajax 交互
    $(".rank .time-tab").on("click", "li", function() {
        var rankObj = {
            mainTime: getPeriod(".rank")
        };
        if(rankObj.mainTime === '日度'){
            rankInit(fakeData(10, 100), fakeData(10, 100));
        } else if(rankObj.mainTime === '月度'){
            rankInit(fakeData(10, 100), fakeData(10, 100));
        } else if(rankObj.mainTime === '周度'){
            rankInit(fakeData(10, 100), fakeData(10, 100));
        } else if(rankObj.mainTime === '年度'){
            rankInit(fakeData(10, 100), fakeData(10, 100));
        }
    });

    /**
     * ********************************************
     * ***********价格走势 ajax 交互*********
     * ********************************************
     */
    // echarts 图表初始化开始，无关后台数据交互
    var trend = echarts.init(document.getElementById('trend'));
    var trendOption = {

        tooltip: {
            trigger: 'axis',
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
                var str = "<span>" + params[0].axisValue + '</span><br>';
                params.forEach(function(v, i) {
                    str += "<span>" + v.seriesName + '： </span>' + "<span>" + v.value + ' ' + MUTI.trendUnits + '</span><br>';
                });
                return str;
            }
        },
        grid: {
            left: '20',
            right: '70',
            bottom: '0',
            containLabel: true
        },
        legend: {
            right: '70',
            data: ['全国均价', '山东均价'],
            icon: 'line',
            textStyle: {
                color: echartOpt.color
            }
        },
        color: ["#fc7303", "#75f908", "#ffaa3d", "#0130fb", "#0130fb"],
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#8ac7ff'
                }
            },
            data: ['2016-01', '2016-02', '2016-03', '2016-04', '2016-05', '2016-06', '2016-07', '2016-08']
        },
        yAxis: {
            type: 'value',
            show: true,
            axisTick: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#88c6ff'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 14
                }
            },
            splitLine: {
                show: true,
                formatter: '{value}',
                lineStyle: {
                    color: 'rgba(138, 199, 255, .2)'
                }
            }
        },
        series: [{
            name: '全国均价',
            type: 'line',
            smooth: true,
            symbolSize: 15,
            itemStyle: {
                normal: {
                    color: 'rgb(222,119,53)',
                    borderWidth: 2
                },
                emphasis: {
                    borderColor: '#fc7303'
                }
            },
            data: [70, 110, 145, 165, 135, 120],
        }, {
            name: '山东均价',
            type: 'line',
            symbolSize: 15,
            itemStyle: {
                normal: {
                    color: 'rgb(94,247,82)',
                    borderWidth: 2
                },
                emphasis: {
                    borderColor: '#75f908'
                }
            },
            smooth: true,
            data: [30, 60, 120, 80, 125, 70, 100, 150, ],
        }]
    };
    trend.setOption(trendOption);

    function trendInit(timeData, data) {
        trend.setOption({
            legend: {

                data: ['全国均价', '山东均价'],
            },
            xAxis: {
                data: timeData
            },
            series: data
        });
    }
    // echarts 图表初始化完成，无关后台数据交互

    // 第一次初始化页面
    trendInit(
         ['2017-05-14', '2017-05-21', '2017-05-28', '2017-06-03', '2017-06-10', '2017-06-17', '2017-06-24', '2017-07-01', '2017-07-08'],
        [{
            name: '全国均价',
            data: fakeData(9, 100)
        }, {
            name: '山东均价',
            data: fakeData(9, 100)
        }]);

    // 点击年度时的 ajax 交互
    $(".trend .time-tab").on("click", "li", function() {
        // 创建 价格走势 所需字段
        var trendObj = {
            mainTime: getPeriod(".trend"), // 年度时间
            areas: getAreas(".trend") // 地区
        };
        console.log(trendObj);


        //假数据，时间，后台亦可以使用此格式，将 日度 周度 阅读 年度 的 时间 一次性全部 调取过来
        var timeData = [{
                name: '日度',
                data: ['2017-05-14', '2017-05-15', '2017-05-16', '2017-05-17', '2017-05-18', '2017-05-19', '2017-05-20', '2017-05-21', '2017-05-22']
            },
            {
                name: '周度',
                data: ['2017-05-14', '2017-05-21', '2017-05-28', '2017-06-03', '2017-06-10', '2017-06-17', '2017-06-24', '2017-07-01', '2017-07-08']
            },
            {
                name: '月度',
                data: ['2017-04', '2017-05', '2017-06', '2017-07', '2017-08', '2017-09', '2017-10', '2017-11', '2017-12']
            },
            {
                name: '年度',
                data: ['2015', '2016', '2017']
            }
        ];
        var realTime = [];
        switch (trendObj.mainTime) {
            case '日度':
                realTime = timeData[0].data;
                break;
            case '周度':
                realTime = timeData[1].data;
                break;
            case '月度':
                realTime = timeData[2].data;
                break;
            case '年度':
                realTime = timeData[3].data;
                break;
            default:
                realTime = timeData[0].data;
        }
        // after you do something, for example.... Ajax
        trendInit(
            realTime, [{
                name: '全国均价',
                data: fakeData(9, 100)
            }, {
                name: '山东均价',
                data: fakeData(9, 100)
            }]
        );
    });

    /**
     * 价格走势 ajax 交互
     * 地区
     * 根据所选 地区 动态获取数据 渲染 echarts 图表 和 table 表格
     */
    $(".trend").on("click", ".yes", function() {
        // 创建 价格走势 所需字段
        var trendObj = {
            mainTime: getPeriod(".trend"), // 年度时间
            areas: getAreas(".trend") // 地区
        };
        console.log(trendObj);

        trendInit(
            ['2017-05-14', '2017-05-15', '2017-05-16', '2017-05-17', '2017-05-18', '2017-05-19', '2017-05-20', '2017-05-21', '2017-05-22'], [{
                name: '全国均价',
                data: [90, 110, 50, 165, 135, 120, 30, 60, 120]
            }, {
                name: '山东某批发市场均价',
                data: [30, 60, 120, 80, 125, 70, 100, 150, 12]
            }]);
    });

    /**
     * ********************************************
     * ***********季节性规律 ajax 交互*********
     * ********************************************
     */
    // echarts 图表初始化开始，无关后台数据交互
    var law = echarts.init(document.getElementById('law'));
    var lawOption = {
        tooltip: {
            // show: true,
            trigger: 'axis',
            textStyle: {
                align: 'left',
                //color: '#5cc1ff',
                color: '#fff',
                fontSize: '16'
            },
            backgroundColor: 'rgba(15, 52, 135, 0.5)',
            borderWidth: '1',
            borderColor: '#5cc1ff',
            extraCssText: 'box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);'
        },
        legend: {
            show: true,
            icon: 'line',
            // itemWidth: 14,
            // itemHeight: 4,
            // itemGap: 13,
            data: ["单产（公斤/公顷）"],
            right: 60,
            top: 0,
            textStyle: {
                color: echartOpt.color
            }
        },
        grid: {
            top: '40',
            left: '10',
            right: '70',
            bottom: '50',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#8ac7ff'
                }
            },
            data: ['10月', '11月', '12月', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月']
        }, {
            show: false,
            name: 'fuzhu',
            boundaryGap: false,
            data: ['10月', '11月', '12月', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月']
        }],
        yAxis: [{
            type: 'value',
            name: '',
            show: true,
            axisTick: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#88c6ff'
                }
            },
            axisLabel: {
                show: false,
                margin: 10,
                textStyle: {
                    fontSize: 14
                }
            },
            splitLine: {
                show: true,
                formatter: '{value}',
                lineStyle: {
                    color: 'rgba(138, 199, 255, .2)'
                }
            }
        }],
        series: [{
            name: '单产（公斤/公顷）',
            type: 'line',
            symbolSize: 8,
            smooth: true,
            lineStyle: {
                normal: {
                    width: 2
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(52,241,150,.7)'
                    }, {
                        offset: 1,
                        color: 'rgba(52,241,150,.1)'
                    }])
                }
            },
            itemStyle: {
                normal: {
                    color: 'rgb(0,255,132)',
                    borderWidth: 2
                },
                emphasis: {
                    borderColor: '#fc7303'
                }
            },
            data: [24.8, 29.6, 24.1, 26.3, 26.4, 24.8, 29.6, 24.1, 26.3, 26.4, 12, 32]
        }, {
            xAxisIndex: 1,
            name: '辅助',
            type: 'bar',
            data: [],
            markArea: {
                silent: true,
                data: [
                    [{
                        name: '第四季度',
                        coord: [0],
                        label: {
                            normal: {
                                offset: [0, -10],
                                textStyle: {
                                    color: echartOpt.color,
                                    fontSize: echartOpt.fz
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: 'rgba(50, 190, 255, 0.8)'
                            }
                        }
                    }, {
                        coord: [3]
                    }],
                    [{
                        name: '第一季度',
                        coord: [3],
                        label: {
                            normal: {
                                offset: [0, -10],
                                textStyle: {
                                    color: echartOpt.color,
                                    fontSize: echartOpt.fz
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: 'rgba(50, 190, 255, 0.5)'
                            }
                        }
                    }, {
                        coord: [6]
                    }],
                    [{
                        name: '第二季度',
                        coord: [6],
                        label: {
                            normal: {
                                offset: [0, -10],
                                textStyle: {
                                    color: echartOpt.color,
                                    fontSize: echartOpt.fz
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: 'rgba(50, 190, 255, 0.3)'
                            }
                        }
                    }, {
                        coord: [9]
                    }],
                    [{
                        name: '第三季度',
                        coord: [9],
                        label: {
                            normal: {
                                offset: [0, -10],
                                textStyle: {
                                    color: echartOpt.color,
                                    fontSize: echartOpt.fz
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: 'rgba(50, 190, 255, 0.1)'
                            }
                        }
                    }, {
                        coord: [12]
                    }]
                ]
            },
        }]
    };
    law.setOption(lawOption);

    function lawInit(data) {
        law.setOption({
            // 固定的 写死
            series: [{
                data: data
            }]
        });
    }
    // echarts 图表初始化完成，无关后台数据交互

    // after you do something, for example.... Ajax
    lawInit([24.8, 29.6, 24.1, 26.3, 26.4, 24.8, 29.6, 24.1, 26.3, 26.4, 12, 32]);
});
