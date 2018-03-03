$(function () {
    // trade_influence 页面所需公共变量
    var MUTI = {
        timeDir: './../',
        mapJson: './../Lib/data/json/',
        starDot: '<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:',
        endDot: '"></span>',
        notnum: 0,
        compareTime: null, // 地区比较时间轴
        rankTime: null // 地区排名时间轴
    };


    /**
     * ********************************************
     * ***********贸易价格 价格趋势*********
     * ********************************************
     */
    var priceTrend = echarts.init(document.getElementById('price-trend'));
    function InitPriceTrendEchart(data, obj) {
        var priceTrendOption = {
            // backgroundColor: '#263c9f',
            tooltip: {
                    trigger: 'axis',
                    textStyle: {
                        align: 'left',
                        color: '#fff',
                        fontSize: '16'
                    },
                    backgroundColor: 'rgba(15, 52, 135, 0.5)',
                    borderWidth: '1',
                    borderColor: '#5cc1ff',
                    extraCssText: 'box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);'
                },
                grid: {
                    left: '5%',
                    right: '10%',
                    bottom: '0',
                    containLabel: true
                },
                legend: {
                    // left: 'right',
                    right: '5%',
                    data: ['进口价格', '出口价格', '批发价格'],
                    textStyle: {
                        color: echartOpt.color,
                        fontSize: echartOpt.fz
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {
                        lineStyle: {
                            color: '#8ac7ff'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: echartOpt.color,
                            fontSize: echartOpt.fz
                        }
                    },
                    data: ['2006', '2007', '2008', '2009', '2010']
                },
                yAxis: {
                    type: 'value',
                    name: '（元/吨）',
                    show: true,
                    min: 'dataMin',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: echartOpt.color,
                            fontSize: echartOpt.fz
                        }
                    },
                    axisLabel: {
                        margin: 10,
                        textStyle: {
                            color: '#fff',
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
                    name: '进口单位价格',
                    type: 'line',
                    smooth: true,
                    symbolSize: 15,
                    itemStyle: {
                        normal: {
                            color: '#3ed1a2',
                            borderWidth: 2
                        },
                        emphasis: {
                            borderColor: '#3ed1a2'
                        }
                    },
                    data: [70, 110, 145, 165, 135],
                }, {
                    name: '出口单位价格',
                    type: 'line',
                    symbolSize: 15,
                    itemStyle: {
                        normal: {
                            color: '#0f86cc',
                            borderWidth: 2
                        },
                        emphasis: {
                            borderColor: '#0f86cc'
                        }
                    },
                    smooth: true,
                    data: [30, 60, 80, 125, 70],
                }, {
                    name: '批发单位价格',
                    type: 'line',
                    symbolSize: 15,
                    itemStyle: {
                        normal: {
                            color: '#edbf28',
                            borderWidth: 2
                        },
                        emphasis: {
                            borderColor: '#edbf28'
                        }
                    },
                    smooth: true,
                    data: [50, 70, 80, 90, 70],
                }]
        };
        priceTrendOption.series.forEach(function (v, i) {
            v.data = null;
        })

        // handle some style
        var legend = obj.danwei === '鲜苹果' ? ['进口价格','出口价格','批发价格'] : ['进口价格','出口价格']
        var xAxis = obj.timeWhile.split(',');
        var yAxis = obj.money === 'rmb' ? '（元/吨）' : '（美元/吨）'

        var newOption = {
            legend: {
                data: legend
            },
            xAxis:  {
                data: xAxis
            },
            yAxis: {
                name: yAxis,
            },
            series: [{
                name: '进口价格',
                data: [70, 110, 145, 165, 135],
            }, {
                name: '出口价格',
                data: [30, 60, 80, 125, 70],
            }, {
                name: '批发价格',
                data: [50, 70, 80, 90, 70],
            }]
        }
        $.extend(true, priceTrendOption, newOption);

        priceTrend.setOption(priceTrendOption);
    }

    /**
     * ajax 获取数据
     * @return {[type]} [description]
     */
    function getPriceTrendData() {
        var priceTrendObj = {
            timeWhile: getTime(".price-trend"), // ajax需要字段， 时间
            money: getMainArea(".price-trend"), // ajax需要的字段，苹果种类，鲜苹果
            danwei: getDanwei(".price-trend"), // ajax需要的字段，单位 贸易额，贸易量
        };
        console.log(priceTrendObj);
        InitPriceTrendEchart(0, priceTrendObj)
    }

    /**
     * 页面打开初始化页面
     * 应当在获取时间后进行初始化
     */
    getPriceTrendData();


    /**
     * 价格趋势 ajax 交互
     * 时间
     * 根据 时间 渲染 echarts 表
     */
    $(".price-trend .pub-time").on("click", ".time-yes", function(e) {
        e.stopPropagation();
        getPriceTrendData()
    });

    /**
     * 价格趋势 ajax 交互
     * 鲜苹果 苹果汁 苹果干
     * 根据 鲜苹果 苹果汁 苹果干 单选按钮 渲染 echarts 图表
     */
    $(".price-trend .pub-radio").on('click', "li", function() {
        getPriceTrendData();
    });


    /**
     * ********************************************
     * ***********影响因素 出口贸易*********
     * ********************************************
     */
    var tradeExport = echarts.init(document.getElementById('trade-export'));
    function InitTradeExportchart(data) {
        var tradeExportOption = {
            // backgroundColor: '#1b237e',
            grid: {
                right: '1%',
                left: '1%',
                bottom: '10%',
                top: '10%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    shadowStyle: {
                        color: 'rgba(0,46, 115, 0.3)'
                    }
                },
                formatter: function(params) {
                    var str = '';
                    params.forEach(function(v, i) {
                        str += '苹果出口量对国内' + '<br>' + '生产总值的弹性： ' + '<span style="color: ff3b00;">' + params[0].data + '</span>';
                    });
                    return str
                },
                textStyle: {
                    align: 'left',
                    color: '#fff',
                    fontSize: '16'
                },
                backgroundColor: 'rgba(15, 52, 135, 0.5)',
                borderWidth: '1',
                borderColor: '#5cc1ff',
                extraCssText: 'box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);'
            },
            legend: {
                show: false,
                data: ['弹性系数'],
                right: '60',
                top: '35',
                textStyle: {
                    color: echartOpt.color,
                    fontSize: echartOpt.fz
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
                        color: echartOpt.color
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
                        fontSize: echartOpt.fz,
                        color: echartOpt.color
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#2f46a1']
                    }
                },
                data: ['美元对人民币汇率', "居民鲜果消费指数", "国内生产总值", "鲜苹果出口价格", "苹果汁出口价格", "国内苹果价格"],
            },
            yAxis: {
                type: 'value',
                name: '弹性系数',
                splitLine: {
                    show: false,
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
                        fontSize: echartOpt.fz,
                        color: echartOpt.color
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: echartOpt.color,
                        fontSize: echartOpt.fz
                    }
                }
            },
            series: [{
                name: '出口总额',
                type: 'bar',
                barMaxWidth: 50,
                itemStyle: {
                    normal: {
                        color: function(d) {
                            if (d.data > 0) {
                                return new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1, [{
                                        offset: 0,
                                        color: '#00b8fe'
                                    }, {
                                        offset: 1,
                                        color: '#1846a3'
                                    }]
                                )
                            } else {
                                return new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1, [{
                                        offset: 0,
                                        color: '#d0bf44'
                                    }, {
                                        offset: 1,
                                        color: '#d0bc44'
                                    }]
                                )
                            }
                        },
                        opacity: 0.6,
                        barBorderRadius: 10,
                        // barBorderColor: function(d) {
                        //     console.log(d)
                        //     if (d.data > 0) {
                        //         return '#00b6fc'
                        //     } else {
                        //         return '#fbde30'
                        //     }
                        // }
                    },
                    emphasis: {
                        opacity: 1
                    }
                },
                data: [200, 300, 100, 330, 350, -110],
                zlevel: 9
            }]
        };
        tradeExportOption.series.forEach(function (v, i) {
            v.data = null;
        })

        var newOption = {
            tooltip: {
                formatter: function(params) {
                    var str = '';
                    params.forEach(function(v, i) {
                        str += '苹果出口量对' + '<br>' + params[0].name + '的弹性：' + '<span style="color:#FF8F00;font-size:20px;font-weight:bold">' + params[0].data + '</span>';
                    });
                    return str
                }
            },
            series: [{
                name: '弹性系数',
                data: [200, 300, 100, 330, 350, -110],
            }]
        }
        $.extend(true, tradeExportOption, newOption);

        tradeExport.setOption(tradeExportOption);
    }

    function getTradeExportData() {
        InitTradeExportchart(0)
    }
    getTradeExportData();


    /**
     * ********************************************
     * ***********影响因素 进口贸易*********
     * ********************************************
     */
    var tradeImport = echarts.init(document.getElementById('trade-import'));
    function InitTradeImportchart(data) {
        var tradeImportOption = {
            // backgroundColor: '#1b237e',
            grid: {
                right: '1%',
                left: '1%',
                bottom: '10%',
                top: '10%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    shadowStyle: {
                        color: 'rgba(0,46, 115, 0.3)'
                    }
                },
                formatter: function(params) {
                    var str = '';
                    params.forEach(function(v, i) {
                        str += '苹果进口量对鲜苹果' + '<br>' + '进口价格的弹性： ' + params[0].data;
                    });
                    return str

                },
                textStyle: {
                    align: 'left',
                    color: '#fff',
                    fontSize: '16'
                },
                backgroundColor: 'rgba(15, 52, 135, 0.5)',
                borderWidth: '1',
                borderColor: '#5cc1ff',
                extraCssText: 'box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);'
            },
            legend: {
                show: false,
                data: ['弹性系数'],
                right: '60',
                top: '35',
                textStyle: {
                    color: echartOpt.color,
                    fontSize: echartOpt.fz
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
                        color: echartOpt.color
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
                        fontSize: echartOpt.fz,
                        color: echartOpt.color
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#2f46a1']
                    }
                },
                data: ['鲜苹果进口价格', "苹果汁进口价格", "国内生产总值", "苹果产量", "美元对人民币汇率"],
            },
            yAxis: {
                type: 'value',
                name: '弹性系数',
                splitLine: {
                    show: false,
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
                        fontSize: echartOpt.fz,
                        color: echartOpt.color
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: echartOpt.color,
                        fontSize: echartOpt.fz
                    }
                }
            },
            series: [{
                name: '出口总额',
                type: 'bar',
                barMaxWidth: 50,
                itemStyle: {
                    normal: {
                        color: function(d) {
                            if (d.data > 0) {
                                return new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1, [{
                                        offset: 0,
                                        color: '#00b8fe'
                                    }, {
                                        offset: 1,
                                        color: '#1846a3'
                                    }]
                                )
                            } else {
                                return new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1, [{
                                        offset: 0,
                                        color: '#d0bf44'
                                    }, {
                                        offset: 1,
                                        color: '#d0bc44'
                                    }]
                                )
                            }
                        },
                        opacity: 0.6,
                        barBorderRadius: 10,
                        // barBorderColor: function(d) {
                        //     console.log(d)
                        //     if (d.data > 0) {
                        //         return '#00b6fc'
                        //     } else {
                        //         return '#fbde30'
                        //     }
                        // }
                    },
                    emphasis: {
                        opacity: 1
                    }
                },
                data: [200, 300, 100, 330, -350],
                zlevel: 9
            }]
        };
        tradeImportOption.series.forEach(function (v, i) {
            v.data = null;
        })

        var newOption = {
            tooltip: {
                formatter: function(params) {
                    var str = '';
                    params.forEach(function(v, i) {
                        str += '苹果进口量对' + '<br>' + params[0].name + '的弹性： ' + '<span style="color:#FF8F00;font-size:20px;font-weight:bold">' + params[0].data + '</span>';
                    });
                    return str
                }
            },
            series: [{
                name: '弹性系数',
                data: [200, 300, 100, 330, -350],
            }]
        }
        $.extend(true, tradeImportOption, newOption);

        tradeImport.setOption(tradeImportOption);
    }

    function getTradeImportData() {
        InitTradeImportchart(0)
    }
    getTradeImportData();


    /**
     * ********************************************
     * *********** 新增 echarts 图标 *********
     * *********** 贸易价格 影响因素 *********
     * ********************************************
     */

    var tradeInfluence = echarts.init(document.getElementById('trade-influence'));
    function initTradeInfluence(data) {
        var tradeInfluenceOption = {
            // backgroundColor: '#1b237e',
            grid: {
                right: '1%',
                left: '1%',
                bottom: '10%',
                top: '10%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                // axisPointer: {
                //     type: 'shadow',
                //     shadowStyle: {
                //         color: 'rgba(0,46, 115, 0.3)'
                //     }
                // },
                formatter: function(params) {
                    var str = '';
                    params.forEach(function(v, i) {
                        str += '苹果进口量对鲜苹果' + '<br>' + '进口价格的弹性： ' + params[0].data;
                    });
                    return str

                },
                textStyle: {
                    align: 'left',
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
                data: ['鲜苹果出口价格', '苹果汁出口价格', '国内苹果产量', '人民币对美元汇率'],
                right: '60',
                top: '0',
                textStyle: {
                    color: echartOpt.color,
                    fontSize: echartOpt.fz
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
                        color: echartOpt.color
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
                        fontSize: echartOpt.fz,
                        color: echartOpt.color
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#2f46a1']
                    }
                },
                data: ['1995/96年度-2003/04年度', "2004/05年度-2015/16年度"],
            },
            yAxis: {
                type: 'value',
                name: '弹性系数',
                splitLine: {
                    show: false,
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
                        fontSize: echartOpt.fz,
                        color: echartOpt.color
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: echartOpt.color,
                        fontSize: echartOpt.fz
                    }
                }
            },
            series: [{
                name: '鲜苹果出口价格',
                type: 'bar',
                barMaxWidth: 20,
                itemStyle: {
                    normal: {
                        color: '#00e6f2',
                        opacity: 0.6,
                        barBorderRadius: 10
                    },
                    emphasis: {
                        opacity: 1
                    }
                },
                data: [200, 300, 100, 330, -350],
                zlevel: 9
            },{
                name: '苹果汁出口价格',
                type: 'bar',
                barMaxWidth: 20,
                itemStyle: {
                    normal: {
                        color: '#e7ea00',
                        opacity: 0.6,
                        barBorderRadius: 10
                    },
                    emphasis: {
                        opacity: 1
                    }
                },
                data: [20, 300, 100, 330, -350],
                zlevel: 9
            },{
                name: '国内苹果产量',
                type: 'bar',
                barMaxWidth: 20,
                itemStyle: {
                    normal: {
                        color: '#ffa91a',
                        opacity: 0.6,
                        barBorderRadius: 10
                    },
                    emphasis: {
                        opacity: 1
                    }
                },
                data: [200, 300, 100, 330, -350],
                zlevel: 9
            },{
                name: '人民币对美元汇率',
                type: 'bar',
                barMaxWidth: 20,
                itemStyle: {
                    normal: {
                        color: '#C7A3ED',
                        opacity: 0.6,
                        barBorderRadius: 10
                    },
                    emphasis: {
                        opacity: 1
                    }
                },
                data: [200, 300, 100, 330, -350],
                zlevel: 9
            },]
        };
        tradeInfluenceOption.series.forEach(function (v, i) {
            v.data = null;
        })

        var newOption = {
            tooltip: {
                formatter: function(params) {
                    var str = params[0].axisValue + '<br>';
                    params.forEach(function(v, i) {
                        str += v.seriesName + '对国内苹果产量的弹性: ' + '<span style="color:#FF8F00;font-size:20px;font-weight:bold">' + v.value + '</span><br>'
                    });
                    return str
                }
            },
            series: [{
                name: '鲜苹果出口价格',
                data: [200, 300],
            },{
                name: '苹果汁出口价格',
                data: [100, 30],
            },{
                name: '国内苹果产量',
                data: [200, 300],
            },{
                name: '人民币对美元汇率',
                data: [20, 300],
            }]
        }
        $.extend(true, tradeInfluenceOption, newOption);

        tradeInfluence.setOption(tradeInfluenceOption);
    }

    function getTradeInfluence() {
        initTradeInfluence(0)
    }
    getTradeInfluence();

});
