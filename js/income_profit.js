$(function () {
    // trade_situation 页面所需公共变量
    var MUTI = {
        timeDir: './../',
        mapJson: './../Lib/data/json/',
        starDot: '<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:',
        endDot: '"></span>',
        notnum: 0,
        structTime: null, // 地区比较时间轴
    };


    /**
     * ********************************************
     * ***********净利分析 趋势变化*********
     * ********************************************
     */

    /**
     * 净利分析 趋势变化 echarts 图表函数封装
     */
    var costTrendChange = echarts.init(document.getElementById('cost-trendChange'));

    function initCostCompare(data, obj) {
        var echartOpt = {
            color: '#fff'
        };
        var costgetCostTrendChange = {
            grid: {
                right: '5%',
                left: '5%',
                bottom: '8%',
                top: '15%'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    shadowStyle: {
                        color: 'rgba(0,46, 115, 0.3)'
                    }
                },
                formatter: function (params) {
                    //console.log(params)
                    var str = params[0].name + "<br>";
                    params.forEach(function (v, i) {
                        str += v.seriesName + ": " + v.value + "<br>";
                    });
                    return str
                },
                textStyle: {
                    align: 'left',
                    color: '#fff',
                },
                backgroundColor: 'rgba(15, 52, 135, 0.5)',
                borderWidth: '1',
                borderColor: '#5cc1ff',
                extraCssText: 'box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);'
            },
            legend: {
                data: ['总产值（元/亩）', '净利润（元/亩）', '投入产出比（%）'],
                right: '5%',
                top: '0',
                textStyle: {
                    color: echartOpt.color
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
                        fontSize: 16,
                        color: echartOpt.color
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#2f46a1']
                    }
                },
                data: ['2007', "2008", "2009", "2010", "2011"],
            },
            yAxis: [{
                type: 'value',
                name: '( % )',
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
                        fontSize: 16,
                        color: echartOpt.color
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: echartOpt.color,
                        fontSize: echartOpt.fz
                    }
                }
            }, {
                type: 'value',
                name: '( % )',
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
                        fontSize: 16,
                        color: echartOpt.color
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: echartOpt.color,
                        fontSize: echartOpt.fz
                    }
                }
            }],
            series: [{
                name: '总产值（元/亩）',
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
                name: '净利润（元/亩）',
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
                name: '投入产出比（%）',
                type: 'line',
                yAxisIndex: 1,
                symbolSize: 13,
                itemStyle: {
                    normal: {
                        color: '#ff9c31',
                        borderWidth: 2,
                        backgroundColor: 'red'
                    },
                    emphasis: {
                        borderColor: '#ff9c31'
                    }
                },
                smooth: true,
                data: [500, 100, 400, 300, 900],
                zlevel: 9

            }]
        };
        var Tooltip = obj.danwei === "单位面积" ? "{a}: {c}元/亩" : "{a}: {c}元/公斤"
        var yUnite = obj.danwei === "单位面积" ? "（元/亩）" : "（元/公斤）"
        var legend = obj.danwei === '单位面积' ? ['总产值', '净利润', '投入产出比'] : ['收购价', '净利润', '投入产出比']

        var newOption = {
            legend: {
                data: legend
            },
            tooltip: {
                formatter: function (params) {
                    var str = params[0].name + "<br>";
                    params.forEach(function (v, i) {
                        if (v.seriesType == "line") {
                            str += v.seriesName + ": " + v.value + "%" + "<br>"
                        } else {
                            str += v.seriesName + ": " + v.value + "元/亩" + "<br>"
                        }
                    });
                    return str
                }
            },
            xAxis: {
                data: obj.timeWhile.split(",")
            },
            yAxis: [{
                name: yUnite
            }],
            series: [{
                data: [200, 300, 100, 330, 350],
            }, {
                data: [500, 100, 400, 300, 600],
            }, {
                data: [500, 100, 400, 300, 900]
            }]
        }

        costgetCostTrendChange.series.forEach(function(v, i) {
            v.name = legend[i]
        })
        $.extend(true, costgetCostTrendChange, newOption);
        costTrendChange.setOption(costgetCostTrendChange, true);
    }

    // ajax 获取数据后调用 echarts 图表渲染函数
    function getCostTrendChange() {
        var initCostStruct = {

            timeWhile: getTime(".cost-trendChange"), // ajax需要字段， 时间
            danwei: getDanwei(".cost-trendChange") // ajax需要的字段，单位
        };
        console.log(initCostStruct);
        // after ajax
        initCostCompare(0, initCostStruct)
    }

    /**
     * 趋势变化 ajax 交互
     * 第一次打开页面时初始化图表
     */
    getCostTrendChange()

    /**
     * 趋势变化 ajax 交互
     * 单位面积 单位产品
     * 根据 单位面积 单位产品 渲染 echarts 图表
     */
    $(".cost-trendChange .pub-radio").on('click', "li", function () {
        getCostTrendChange();
    });

    /**
     * 趋势变化 ajax 交互
     * 2012－2017
     * 根据 时间 渲染 echarts 表
     */
    $(".cost-trendChange .pub-time").on("click", ".time-yes", function (e) {
        e.stopPropagation();
        getCostTrendChange();
    });


    /**
     * ********************************************
     * ***********地区比较 单位面积*********
     * ********************************************
     */

    /**
     * 净利分析 地区比较 echarts 图表函数封装
     */
    var costRegional = echarts.init(document.getElementById('cost-regional'));

    function initCostRegional(data, obj) {
        var costgetCostRegional = {
            title: {
                text: '单位面积',
                y:'0',
                textStyle:{
                    color:'#fff',
                    fontSize:'14px'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    shadowStyle: {
                        color: 'rgba(0,46, 115, 0.3)'
                    }
                },
                formatter: function (params) {
                    //console.log(params)
                    var str = params[0].name + "<br>";
                    params.forEach(function (v, i) {
                        str += v.seriesName + ": " + v.value + "<br>";
                    });
                    return str
                },
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
            grid: {
                left: '1%',
                right: '3%',
                top: '95px',
                bottom:'0px',
                containLabel: true
            },
            legend: {
                right: '5%',
                top:'65px',
                data: ['陕西', '山东', '甘肃'],
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
                        color: '#fff',
                        fontSize: '16px'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#254495',
                        type: 'dashed'
                    }
                },
                data: ['2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015']
            },
            yAxis: [{
                name: "元/亩",
                type: 'value',
                min: 'dataMin',
                nameTextStyle:{
                    color:"#fff"
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#88c6ff'
                    }
                },
                axisLabel: {
                    margin: 10,
                    textStyle: {
                        color: "#fff",
                        fontSize: 16
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#254495',
                        type: 'dashed'
                    }
                }
            }],
            series: [
                {
                    name: '陕西',
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
                    data: [70, 110, 145, 165, 135, 150, 160, 90, 70, 110]
                },
                {
                    name: '山东',
                    type: 'line',
                    symbolSize: 15,
                    itemStyle: {
                        normal: {
                            color: '#f55cff',
                            borderWidth: 2
                        },
                        emphasis: {
                            borderColor: '#f55cff'
                        }
                    },
                    smooth: true,
                    data: [30, 60, 80, 125, 70, 100, 150, 60, 70, 110]
                },
                {
                    name: '甘肃',
                    type: 'line',
                    symbolSize: 15,
                    itemStyle: {
                        normal: {
                            color: '#2fcffd',
                            borderWidth: 2
                        },
                        emphasis: {
                            borderColor: '#2fcffd'
                        }
                    },
                    smooth: true,
                    data: [50, 70, 80, 90, 70, 120, 100, 80, 70, 110]
                }
            ]
        };
        // var Tooltip = obj.danwei === "单位面积" ? "{a}: {c}元/亩" : "{a}: {c}元/公斤"
        var yUnite = obj.danwei === "成本利润率" ? "%" : "（元/亩）"
        var tooltipUnite = '';
        if (obj.danwei === '总产值') {
            tooltipUnite = '元/亩'
        } else if (obj.danwei === '成本利润率') {
            tooltipUnite = '%'
        } else {
            tooltipUnite = '元/亩'
        }
        var newOption = {
            tooltip: {
                formatter: function (params) {
                    var str = params[0].name + "<br>";
                    params.forEach(function (v, i) {
                        str += v.seriesName + ": " + v.value + tooltipUnite + "<br>";
                    });
                    return str
                }
            },
            xAxis: {
                data: obj.timeWhile.split(",")
            },
            yAxis: [{
                name: yUnite
            }],
            series: [{
                data: [1050, 1000, 1000, 235, 1278, 150, 700, 1800, 450, 700]
            }]
        }
        $.extend(true, costgetCostRegional, newOption);
        costRegional.setOption(costgetCostRegional, true);
    }

    // ajax 获取数据后调用 echarts 图表渲染函数
    function getCostRegional() {
        var initCostStruct = {
            timeWhile: getTime(".cost-regional"), // ajax需要字段， 时间
            area: getAreas(".cost-regional"), // ajax需要的字段，地区
            danwei: getDanwei(".cost-regional") // ajax需要的字段，单位
        };
        console.log(initCostStruct);
        // after ajax
        initCostRegional(0, initCostStruct)
    }

    /**
     * 单位面积 ajax 交互
     * 第一次打开页面时初始化图表
     */
    getCostRegional()

    /**
     * 单位面积 ajax 交互
     * 单位产值 投入产出比 单位净利润
     * 根据 单位面积 单位产品 渲染 echarts 图表
     */
    $(".cost-regional .pub-radio").on('click', "li", function () {
        getCostRegional();
    });

    /**
     * 单位面积 ajax 交互
     * 2012－2017
     * 根据 时间 渲染 echarts 表
     */
    $(".cost-regional .pub-time").on("click", ".time-yes", function (e) {
        e.stopPropagation();
        getCostRegional();
    });

    /**
     * 单位面积 ajax 交互
     * 地区
     * 根据 区域 渲染 echarts 表
     */
    $(".cost-regional").on("click", ".yes", function () {
        // 获取地区
        getCostRegional();
    });


    /**
     * ********************************************
     * ***********地区比较 单位产品*********
     * ********************************************
     */

    /**
     * 地区比较 单位产品 echarts 图表函数封装
     */
    var costUnitProduct = echarts.init(document.getElementById('cost-unitProduct'));

    function initCostUnitProduct(data, obj) {
        var costgetCostRegional = {
            title: {
                text: '单位产品',
                y:'0',
                textStyle:{
                    color:'#fff',
                    fontSize:'14px'
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '1%',
                right: '2%',
                top: '95px',
                bottom:'0px',
                containLabel: true
            },
            legend: {
                right: '5%',
                top:'65px',
                data: ['陕西', '山东', '甘肃'],
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
                        color: '#fff',
                        fontSize: '16px'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#254495',
                        type: 'dashed'
                    }
                },
                data: ['2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015']
            },
            yAxis: [{
                name: "(元/50公斤)",
                type: 'value',
                min: 'dataMin',
                nameTextStyle:{
                    color:"#fff"
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#88c6ff'
                    }
                },
                axisLabel: {
                    margin: 10,
                    textStyle: {
                        color: "#fff",
                        fontSize: 16
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#254495',
                        type: 'dashed'
                    }
                }
            }],
            series: [
                {
                    name: '陕西',
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
                    data: [70, 110, 145, 165, 135, 150, 160, 90, 70, 110]
                },
                {
                    name: '山东',
                    type: 'line',
                    symbolSize: 15,
                    itemStyle: {
                        normal: {
                            color: '#f55cff',
                            borderWidth: 2
                        },
                        emphasis: {
                            borderColor: '#f55cff'
                        }
                    },
                    smooth: true,
                    data: [30, 60, 80, 125, 70, 100, 150, 60, 70, 110]
                },
                {
                    name: '甘肃',
                    type: 'line',
                    symbolSize: 15,
                    itemStyle: {
                        normal: {
                            color: '#2fcffd',
                            borderWidth: 2
                        },
                        emphasis: {
                            borderColor: '#2fcffd'
                        }
                    },
                    smooth: true,
                    data: [50, 70, 80, 90, 70, 120, 100, 80, 70, 110]
                }
            ]
        };
        var Tooltip = obj.danwei === "单位面积" ? "{a}: {c}元/亩" : "{a}: {c}元/公斤"
        //var yUnite = obj.danwei === "单位面积" ? "总成本（元/亩）" : "总成本（元/公斤）"
        var yUnite = obj.danwei === "成本利润率" ? "%" : "（元/公斤）"
        var tooltipUnite = '';
        if (obj.danwei === '总产值') {
            tooltipUnite = '元/公斤'
        } else if (obj.danwei === '成本利润率') {
            tooltipUnite = '%'
        } else {
            tooltipUnite = '元/公斤'
        }
        var newOption = {
            xAxis: {
                data: obj.timeWhile.split(",")
            },
            yAxis: [{
                name: yUnite
            }],
            tooltip: {
                formatter: function (params) {
                    var str = params[0].name + "<br>";
                    params.forEach(function (v, i) {
                        str += v.seriesName + ": " + v.value + tooltipUnite + "<br>";
                    });
                    return str
                }
            },
            series: [{
                data: [1050, 1000, 1000, 235, 1278, 150, 700, 1800, 450, 700]
            }]
        }
        $.extend(true, costgetCostRegional, newOption);
        costUnitProduct.setOption(costgetCostRegional, true);
    }

    // ajax 获取数据后调用 echarts 图表渲染函数
    function getinitCostUnitProduct() {
        var initCostStruct = {
            timeWhile: getTime(".cost-unitProduct"), // ajax需要字段， 时间
            area: getAreas(".cost-unitProduct"), // ajax需要的字段，地区
            danwei: getDanwei(".cost-unitProduct") // ajax需要的字段，单位
        };
        console.log(initCostStruct);
        // after ajax
        initCostUnitProduct(0, initCostStruct)
    }

    /**
     * 单位产品 ajax 交互
     * 第一次打开页面时初始化图表
     */
    getinitCostUnitProduct()

    /**
     * 单位产品 ajax 交互
     * 单位产值 投入产出比 单位净利润
     * 根据 单位面积 单位产品 渲染 echarts 图表
     */
    $(".cost-unitProduct .pub-radio").on('click', "li", function () {
        getinitCostUnitProduct();
    });

    /**
     * 单位产品 ajax 交互
     * 2012－2017
     * 根据 时间 渲染 echarts 表
     */
    $(".cost-unitProduct .pub-time").on("click", ".time-yes", function (e) {
        e.stopPropagation();
        getinitCostUnitProduct();
    });

    /**
     * 单位产品 ajax 交互
     * 地区
     * 根据 区域 渲染 echarts 表
     */
    $(".cost-unitProduct").on("click", ".yes", function () {
        // 获取地区
        getinitCostUnitProduct();
    });

})


