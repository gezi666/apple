$(function () {
    // trade_price 页面所需公共变量
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
                    trigger: 'axis'
                },
                grid: {
                    left: '15px',
                    right: '20px',
                    bottom: '0',
                    containLabel: true
                },
                legend: {
                    left: 'right',
                    data: ['进口单位价格', '出口单位价格', '批发单位价格'],
                    textStyle: {
                        color: '#fff'
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
                            color: '#fff'
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
                            color: '#88c6ff'
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
        var legend = obj.danwei === '鲜苹果' ? ['进口单位价格','出口单位价格','批发单位价格'] : ['进口单位价格','出口单位价格']
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
                name: '进口单位价格',
                data: [70, 110, 145, 165, 135],
            }, {
                name: '出口单位价格',
                data: [30, 60, 80, 125, 70],
            }, {
                name: '批发单位价格',
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

    // /**
    //  * 价格趋势 ajax 交互
    //  * 金钱种类
    //  * 根据 金钱种类 渲染 echarts 表
    //  */
    // $(".price-trend .fake-ul").on("click", "li", function() {
    //     getPriceTrendData();
    // });

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
     * ***********贸易价格 国内价格与贸易价格关系**
     * ********************************************
     */
    var priceRelation = echarts.init(document.getElementById('price-relation'));
    function InitPriceRelationchart(data) {
        var priceRelationOption = {
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
                        str += '国内价格对鲜苹果' + '<br>' + '出口价格的弹性： ' + params[0].data;
                    });
                    return str

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
                data: ['鲜苹果出口价格', "苹果汁出口价格", "苹果汁出口量", "鲜苹果出口量", "鲜苹果进口价格", "鲜苹果进口量"],
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
        priceRelationOption.series.forEach(function (v, i) {
            v.data = null;
        })

        var newOption = {
            series: [{
                name: '弹性系数',
                data: [200, 300, 100, 330, 350, -110],
            }]
        }
        $.extend(true, priceRelationOption, newOption);

        priceRelation.setOption(priceRelationOption);
    }

    function getPriceRelationData() {
        InitPriceRelationchart(0)
    }
    getPriceRelationData();



});
