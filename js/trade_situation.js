$(function() {
    // trade_situation 页面所需公共变量
    var MUTI = {
        timeDir: './../',
        mapJson: './../Lib/data/json/',
        starDot: '<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:',
        endDot: '"></span>',
        notnum: 0,
        compareTime: null, // 地区比较时间轴
        rankTime: null // 地区排名时间轴
    };

    //贸易趋势 时间下拉框 首先发请求取得月份和年份的下拉 填充到页面
    getNearTime(".trade-trend", 'http://dadasffsa.das')
    getNearTime(".trade-trend", 'http://dadasffsa.das', 'month')

    /**
     * 公共函数——初始化时间轴
     * 时间轴 初始化时间段，起始时间函数
     * @param  {number} dom 地区比较还是地区排名的时间函数
     * @return {array}
     */
    function initTimeControl(flag) {
        // after some ajax.....
        // arr 为 通过ajax 获取时间后的变量
        var url = flag === 1 ? 'aaa' : 'bbb';
        ajaxGetDataCall(url, '', timeCb);

        function timeCb(data) {
            // var arr = ['a', 'b', 'c', 'd'];
            var arr = data.data
            if (flag === 1) {
                tradeCompareTime.setData(arr);
                tradeCompareTime.setTime(arr[arr.length - 1]);
                MUTI.compareTime = arr[arr.length - 1];
            } else {
                tradeRankTime.setData(arr);
                tradeRankTime.setTime(arr[arr.length - 1]);
                MUTI.rankTime = arr[arr.length - 1];
            }
        }
    }



    /**
     * ********************************************
     * ***********贸易现状 贸易规模*********
     * ********************************************
     */
    /**
     * 贸易现状 贸易规模 echarts 图表函数封装
     */
    var tradeScale = echarts.init(document.getElementById('trade-scale'));

    function initTradeScale(data, obj) {
        var tradeScaleOption = {
            grid: {
                right: '5%',
                left: '5%',
                bottom: '10%',
                top: '15%'
            },
            "dataZoom": [{
                "show": true,
                "height": 15,
                "xAxisIndex": [0],
                left: '50',
                right: '50',
                bottom: 0,
                backgroundColor: '#1f2d70',
                dataBackground: {
                    areaStyle: {
                        color: 'rgba(79, 140, 210, 0.4)'
                    },
                    lineStyle: {
                        opacity: 0.8,
                        color: '#8392A5'
                    }
                },
                fillerColor: 'rgba(4, 175, 246, 0.6)',
                "start": 0,
                "end": 100,
                handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                handleSize: '110%',
                handleStyle: {
                    color: '#00ADFA',
                    shadowBlur: 0,
                    shadowColor: 'rgba(255, 0, 0, 1)',
                    shadowOffsetX: 0,
                    shadowOffsetY: 0
                },
                textStyle: {
                    color: "#11caff",
                    fontSize: '12'
                },
                borderColor: "#3458B4"
            }, {
                "type": "inside",
                "show": true,
                "height": 15,
                "start": 1,
                "end": 35
            }],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    shadowStyle: {
                        color: 'rgba(0,46, 115, 0.3)'
                    }
                },
                formatter: function(params) {
                    // console.log(params)
                    var str = params[0].name + "<br>";
                    params.forEach(function(v, i) {
                        str += v.seriesName + ": " + v.value + "吨" + "<br>";
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
                data: ['出口总额', '进口总额'],
                right: '60',
                top: '0',
                textStyle: {
                    color: echartOpt.color,
                    // fontSize: echartOpt.fz
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
                data: ['2007', "2008", "2009", "2010", "2011"],
            },
            yAxis: {
                type: 'value',
                name: '季节性去向分布',
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
                name: '进口总额',
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

            }]
        };
        var legend = obj.danwei === '贸易额' ? ['出口总额', '进口总额'] : ['出口总量', '进口总量']
        var yUnite = obj.danwei === '贸易额' ? '（万美元）' : '（万吨）'
        var newOption = {
            legend: {
                data: legend
            },
            xAxis: {
                data: obj.timeWhile.split(",")
            },
            yAxis: {
                name: yUnite,
            },
            series: [{
                name: legend[0],
                data: [200, 300, 100, 330, 350],
            }, {
                name: legend[1],
                data: [500, 100, 400, 300, 600],
            }]
        }
        $.extend(true, tradeScaleOption, newOption);
        tradeScale.setOption(tradeScaleOption, true);
    }
    // ajax 获取数据后调用 echarts 图表渲染函数
    function getScaleData() {
        var tradeScaleObj = {
            timeWhile: getTime(".trade-scale"), // ajax需要字段， 时间
            areas: getMainArea(".trade-scale"), // ajax需要的字段，苹果种类，鲜苹果
            danwei: getDanwei(".trade-scale"), // ajax需要的字段，单位 贸易额，贸易量
        };
        console.log(tradeScaleObj);
        // after ajax
        initTradeScale(0, tradeScaleObj)
    }

    /**
     * 贸易规模 ajax 交互
     * 第一次打开页面时初始化图表
     */
    getScaleData()

    /**
     * 贸易规模 ajax 交互
     * 2012－2017
     * 根据 时间 渲染 echarts 表
     */
    $(".trade-scale .pub-time").on("click", ".time-yes", function(e) {
        e.stopPropagation();
        getScaleData()
    });

    /**
     * 贸易规模 ajax 交互
     * 鲜苹果
     * 根据 苹果种类 渲染 echarts 表
     */
    $(".trade-scale .fake-ul").on("click", "li", function() {
        getScaleData()
    });

    /**
     * 贸易规模 ajax 交互
     * 贸易额 贸易量
     * 根据 贸易额 贸易量 单选按钮 渲染 echarts 图表
     */
    $(".trade-scale .pub-radio").on('click', "li", function() {
        getScaleData()
    });



    /**
     * ********************************************
     * ***********贸易现状 地区比较*********
     * ********************************************
     */
    var tradeCompare = echarts.init(document.getElementById('trade-compare'));

    function InitTradeCompareEchart(data, tradeCompareObj) {
        var tradeCompareOption = {
            // backgroundColor: '#1b237e',
            grid: {
                right: '10%',
                left: '5%',
                bottom: '10%',
                top: '10%'
            },
            legend: {
                right: '5%',
                textStyle: {
                    color: echartOpt.color,
                    // fontSize: echartOpt.fz
                },
                data: ['净进口', '净出口']
            },
            xAxis: {
                name: '出口金额（万美元）',
                splitLine: {
                    show: false,
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: echartOpt.color
                    }
                },
                axisLabel: {
                    interval: 0,
                    rotate: '0',
                    textStyle: {
                        fontSize: echartOpt.fz,
                        color: echartOpt.color
                    }
                },
            },
            yAxis: {
                name: '进口金额（万美元）',
                splitLine: {
                    show: false,
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: echartOpt.color
                    }
                },
                axisLabel: {
                    interval: 0,
                    rotate: '0',
                    textStyle: {
                        fontSize: echartOpt.fz,
                        color: echartOpt.color
                    }
                },
                scale: true
            },
            series: [{
                name: '净进口',
                data: [
                    // 净进口的数据
                    // [进口value1, 出口value2, 地名, 年份]
                    [100, 70, '红富士', 1990],
                    [200, 80, '国光', 1990],
                    [300, 90, '烟台苹果', 1990]
                ],
                type: 'scatter',
                symbolSize: function(data) {
                    var num = data[0] + data[1];
                    return Math.sqrt(num)
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: function(param) {
                            return param.data[2]
                        }
                    },
                    emphasis: {
                        show: true,
                        position: 'right',
                        textStyle: {
                            color: echartOpt.color,
                            fontSize: echartOpt.fz
                        },
                        formatter: function(param) {
                            var str = '';
                            str += param.data[2] + "\n" + "进口额: " + param.data[0] + '吨\n' + '出口额: ' + param.data[1] + '吨';
                            return str;
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(11, 86, 105, 0.5)',
                        shadowOffsetY: 5,
                        color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                            offset: 0,
                            color: 'rgb(183, 168, 15)'
                        }, {
                            offset: 1,
                            color: 'rgb(232, 298, 78)'
                        }])
                    }
                }
            }, {
                name: '净出口',
                data: [
                    // 净出口的数据
                    [150, 200, '红富士', 2015],
                    [106, 300, '国光', 2015],
                    [180, 400, '烟台苹果', 2015]
                ],
                type: 'scatter',
                symbolSize: function(data) {
                    var num = data[0] + data[1];
                    return Math.sqrt(num)
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: function(param) {
                            return param.data[2]
                        }
                    },
                    emphasis: {
                        show: true,
                        position: 'right',
                        textStyle: {
                            color: echartOpt.color,
                            fontSize: echartOpt.fz
                        },
                        formatter: function(param) {
                            var str = '';
                            str += param.data[2] + "\n" + "进口额: " + param.data[0] + '吨\n' + '出口额: ' + param.data[1] + '吨';
                            return str;
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(25, 100, 150, 0.5)',
                        shadowOffsetY: 5,
                        color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                            offset: 0,
                            color: 'rgb(129, 227, 238)'
                        }, {
                            offset: 1,
                            color: 'rgb(25, 183, 207)'
                        }])
                    }
                }
            }]
        };
        // 先将基本数据清空
        tradeCompareOption.series.forEach(function(v, i) {
            v.data = null;
        })

        if (tradeCompareObj.danwei === '贸易额') {
            var xUnite = '出口金额（万美元）';
            var yUnite = '进口金额（万美元）';
            var legend = ['贸易顺差', '贸易逆差'];
        } else {
            var xUnite = '出口总量（万吨）';
            var yUnite = '进口总量（万吨）';
            var legend = ['净进口', '净出口'];
        }
        var newOption = {
            legend: {
                data: legend
            },
            xAxis: {
                name: xUnite
            },
            yAxis: {
                name: yUnite
            },
            series: [{
                name: legend[0],
                data: [
                    // 净进口的数据
                    // [进口value1, 出口value2, 地名, 年份]
                    [100, 70, '红富士', 1990],
                    [200, 80, '国光', 1990],
                    [300, 90, '烟台苹果', 1990]
                ]
            }, {
                name: legend[1],
                data: [
                    // 净出口的数据
                    [150, 200, '红富士', 2015],
                    [106, 300, '国光', 2015],
                    [180, 400, '烟台苹果', 2015]
                ]
            }]
        }
        $.extend(true, tradeCompareOption, newOption);
        tradeCompare.setOption(tradeCompareOption, true);
    }

    function getCompareData() {
        var tradeCompareObj = {
            timeWhile: MUTI.compareTime, // ajax需要字段， 时间
            areas: getMainArea(".trade-compare"), // ajax需要的字段，苹果种类，鲜苹果
            danwei: getDanwei(".trade-compare"), // ajax需要的字段，单位 贸易额，贸易量
        };
        InitTradeCompareEchart(0, tradeCompareObj)
    }

    /**
     * 页面初始化时 渲染 地区比较echart图表
     */
    getCompareData();

    /**
     * 地区比较 ajax 交互
     * 鲜苹果
     * 根据 苹果种类 渲染 echarts 表
     */
    $(".trade-compare .fake-ul").on("click", "li", function() {
        getCompareData()
    });

    /**
     * 地区比较 ajax 交互
     * 贸易额 贸易量
     * 根据 贸易额 贸易量 单选按钮 渲染 echarts 图表
     */
    $(".trade-compare .pub-radio").on('click', "li", function() {
        getCompareData()
    });

    /**
     * 地区比较 ajax 交互
     * 时间
     * 根据 时间 渲染 echarts 图表
     */
    var tradeCompareTime = new scrollBar({
        dom: document.getElementById('trade-compare-time'),
        height: 12,
        // width: 800,
        position: 'bottom',
        backgroundImage: MUTI.timeDir + 'images/scale-bg.png',
        withTime: true,
        slideStart: 1,
        slideBgImage: MUTI.timeDir + 'images/scroll-icon.png',
        data: ['1', '2'],
        tooltipWidth: 48,
        tooltipHeight: 20,
        tooltipImage: MUTI.timeDir + 'images/tooltip.png'
    });
    // 时间轴 初始化时间段，起始时间函数
    initTimeControl(1)
    tradeCompareTime.scrollChange(function(time) {
        MUTI.compareTime = time;
        console.log(time);
    })



    /**
     * ********************************************
     * ***********贸易现状 贸易排名*********
     * ********************************************
     */
    var tradeRank = echarts.init(document.getElementById('trade-rank'));

    function initTradeRankEchart(data, tradeRankObj) {
        var tradeRankOption = {
            // backgroundColor: '#1b237e',
            grid: {
                left: '5%',
                right: '5%',
                bottom: '6%',
                containLabel: true
            },
            xAxis: {
                data: ['山东', '陜西', '河南', '河北', '甘肃', '新疆', '2016'],
                axisLine: {
                    lineStyle: {
                        color: echartOpt.color
                    }
                },
                axisLabel: {
                    interval: 0,
                    rotate: '0',
                    textStyle: {
                        fontSize: echartOpt.fz,
                        color: echartOpt.color
                    }
                },
            },
            yAxis: {
                name: '进口金额（万美元）',
                axisLabel: {
                    show: true,
                    textStyle: {
                        fontSize: echartOpt.fz,
                        color: echartOpt.color
                    }
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: ['#2f46a1']
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: echartOpt.color,
                        fontSize: echartOpt.fz
                    }
                },
                type: 'value'
            },
            series: [{
                name: '地区比较',
                type: 'pictorialBar',
                barCategoryGap: '0%',
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            fontSize: echartOpt.fz,
                            color: echartOpt.color
                        }
                    }
                },
                // symbol: 'path://M0,10 L10,10 L5,0 L0,10 z',
                symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
                itemStyle: {
                    normal: {
                        color: '#5196F6',
                        opacity: 0.5
                    },
                    emphasis: {
                        opacity: 1
                    }
                },
                data: [150, 160, 115, 170, 187, 188, 90],
                z: 10
            }]
        };
        // 数据置空
        tradeRankOption.series.forEach(function(v, i) {
            v.data = null;
        })
        if (tradeRankObj.danwei === '出口额') {
            var yUnite = '出口金额（万美元）';
        } else if(tradeRankObj.danwei === '进口额') {
            var yUnite = '进口金额（万美元）';
        } else if(tradeRankObj.danwei === '出口量')  {
            var yUnite = '出口总量（吨）';
        } else {
            var yUnite = '进口总量（吨）';
        }
        var newOption = {
            xAxis: {
                data: ['山东', '陜西', '河南', '河北', '甘肃', '新疆', '山西'],
            },
            yAxis: {
                name: yUnite
            },
            series: [{
                name: '地区比较',
                data: [1, 2, 3, 4,3,2,1]
            }]
        }
        $.extend(true, tradeRankOption, newOption);
        tradeRank.setOption(tradeRankOption, true);
    }

    function getRankData() {
        var tradeRankObj = {
            timeWhile: getTime(".trade-rank"), // ajax需要字段， 时间
            areas: getDanwei(".trade-rank"), // ajax需要的字段，苹果种类，鲜苹果
            danwei: getMainArea(".trade-rank"), // ajax需要的字段，单位 贸易额，贸易量
        };
        initTradeRankEchart(0, tradeRankObj)
        console.log(tradeRankObj)
    }

    /**
     * 贸易排名 ajax 交互
     * 第一次打开页面时初始化图表
     */
    getRankData()

    /**
     * 贸易排名 ajax 交互
     * 鲜苹果
     * 根据 苹果种类 渲染 echarts 表
     */
    $(".trade-rank .fake-ul").on("click", "li", function() {
        getRankData();
    });

    /**
     * 贸易排名 ajax 交互
     * 贸易额 贸易量
     * 根据 贸易额 贸易量 单选按钮 渲染 echarts 图表
     */
    $(".trade-rank .pub-radio").on('click', "li", function() {
        getRankData();
    });

    // 时间轴
    var tradeRankTime = new scrollBar({
        dom: document.getElementById('trade-rank-time'),
        height: 12,
        // width: 800,
        position: 'bottom',
        backgroundImage: MUTI.timeDir + 'images/scale-bg.png',
        withTime: true,
        slideStart: 1,
        slideBgImage: MUTI.timeDir + 'images/scroll-icon.png',
        data: ['1', '2'],
        tooltipWidth: 48,
        tooltipHeight: 20,
        tooltipImage: MUTI.timeDir + 'images/tooltip.png'
    });
    // 时间轴 初始化时间段，起始时间函数
    initTimeControl(2)
    tradeRankTime.scrollChange(function(time) {
        MUTI.rankTime = time;
        console.log(time);
    })


    /**
     * ********************************************
     * *********** 新增 贸易趋势 图表 *********
     * ***********贸易现状 贸易规模*********
     * ********************************************
     */
    var tradeTrend = echarts.init(document.getElementById('trade-trend'));

    function initTradeTrend(data, obj) {
        var tradeTrendOption = {
            grid: {
                right: '5%',
                left: '5%',
                bottom: '10%',
                top: '15%'
            },
            "dataZoom": [{
                "show": true,
                "height": 15,
                "xAxisIndex": [0],
                left: '50',
                right: '50',
                bottom: 0,
                backgroundColor: '#1f2d70',
                dataBackground: {
                    areaStyle: {
                        color: 'rgba(79, 140, 210, 0.4)'
                    },
                    lineStyle: {
                        opacity: 0.8,
                        color: '#8392A5'
                    }
                },
                fillerColor: 'rgba(4, 175, 246, 0.6)',
                "start": 0,
                "end": 100,
                handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                handleSize: '110%',
                handleStyle: {
                    color: '#00ADFA',
                    shadowBlur: 0,
                    shadowColor: 'rgba(255, 0, 0, 1)',
                    shadowOffsetX: 0,
                    shadowOffsetY: 0
                },
                textStyle: {
                    color: "#11caff",
                    fontSize: '12'
                },
                borderColor: "#3458B4"
            }, {
                "type": "inside",
                "show": true,
                "height": 15,
                "start": 1,
                "end": 35
            }],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    shadowStyle: {
                        color: 'rgba(0,46, 115, 0.3)'
                    }
                },
                formatter: function(params) {
                    // console.log(params)
                    var str = params[0].name + "<br>";
                    params.forEach(function(v, i) {
                        str += v.seriesName + ": " + v.value + "吨" + "<br>";
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
                data: ['贸易差额', '同比增速'],
                right: '60',
                top: '5',
                textStyle: {
                    color: echartOpt.color,
                    // fontSize: echartOpt.fz
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
                data: ['2007', "2008", "2009", "2010", "2011",'2012','2013','2014'],
            },
            yAxis: [{
                type: 'value',
                name: '吨',
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
            }, {
                type: 'value',
                name: '%',
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
            }],
            series: [{
                name: '吨',
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
                data: [200, 300, 100, 330, 350,270,220,198],
                zlevel: 9
            }, {
                name: '%',
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
                data: [1, 0.5, 0.8, 0.7, 0.7, 0.5, 0.8, 0.7],
                zlevel: 9
            }]
        };

        var tooltipUnite = obj.timeSwitch === '月度' ? '月' : '年'

        var newOption = {
            tooltip: {
                formatter: function(params) {
                    var str = params[0].name + tooltipUnite + "<br>";
                    params.forEach(function(v, i) {
                        var unite = v.seriesType === 'bar' ? '万美元' : '%'
                        str += v.seriesName + ": " + v.value + unite + "<br>";
                    });
                    return str
                }
            },
            xAxis: {
                data: ['2007-07', "2008", "2009", "2010", "2011"],
            },
            series: [{
                name: '贸易差额',
                data: [200, 300, 100, 330, 350,117,116,80],
            }, {
                name: '同比增速',
                data: [1, 0.5, 0.8, 0.7, 0.7,0.6,0.3,0.9],
            }]
        }

        $.extend(true, tradeTrendOption, newOption);
        tradeTrend.setOption(tradeTrendOption, true);
    }


    function getTrendData() {
        var tradeTrendObj = {
            timeWhile: getTime(".trade-trend"), // ajax需要字段， 时间
            timeSwitch: getDanwei(".trade-trend"), // ajax需要的字段，单位 月度，年度
            tradeSort: getMainArea(".trade-trend"), // ajax需要的字段，贸易额 贸易量
        };

        console.log(tradeTrendObj)

        initTradeTrend(0, tradeTrendObj);
    }

    // ajax 获取数据，需要在取得时间后使用
    getTrendData()

    /**
     * 贸易趋势 ajax 交互
     * 月度 年度 时间切换
     * 根据 月度 年度 渲染 echarts 表
     */
    $(".trade-trend .time-switch").on('click', "li", function() {
        // 年度月度时间切换函数，后台无关
        fillTime(".trade-trend");

        // after ajax...
        getTrendData()
    });

    /**
     * 贸易趋势 ajax 交互
     * 贸易额 贸易量
     * 根据 贸易额 贸易量 渲染 echarts 表
     */
    $(".trade-trend .fake-ul").on("click", "li", function() {
        // 年度月度时间切换函数，后台无关
        fillTime(".trade-trend");

        getTrendData()
    });


    /**
     * ********************************************
     * *********** 新增 净出口规律 图表 *********
     * *********** 贸易现状 净出口规律 *********
     * ********************************************
     */
    var tradeLaw = echarts.init(document.getElementById('trade-law'));

    function initTradeLaw(data, obj) {
        lawOption = {
            tooltip: {
                show: true,
                trigger: 'axis',
                textStyle: {
                    align: 'left',
                    color: '#fff',
                    fontSize: '16'
                },
                axisPointer: {
                    lineStyle: {
                        opacity: 0
                    }
                },
                // formatter: function(params) {
                //     // console.log(params)
                //     var str = params[0].name + "<br>";
                //     params.forEach(function(v, i) {
                //         str += v.seriesName + ": " + v.value + "吨" + "<br>";
                //     });
                //     return str
                // },
                backgroundColor: 'rgba(15, 52, 135, 0.5)',
                borderWidth: '1',
                borderColor: '#5cc1ff',
                extraCssText: 'box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);'
            },
            legend: {
                show: true,
                icon: 'line',
                itemWidth: 14,
                itemHeight: 4,
                itemGap: 13,
                data: ["单产（公斤/公顷）"],
                right: '60',
                y: 'top',
                textStyle: {
                    // fontSize: 14,
                    color: '#88c6ff'
                }
            },
            grid: {
                top: '50',
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
                data: ['10月', '11月', '12月', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', 'oth月']
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
                    show: true,
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
                itemStyle: {
                    normal: {
                        color: '#F20CF4',
                        borderWidth: 2
                    }
                },
                data: [24.8, 29.6, 24.1, 26.3, 26.4, 24.8, 29.6, 24.1, 26.3, 26.4, 12, 32]
            },{
                name: '单产（公斤/公顷）',
                type: 'line',
                symbolSize: 8,
                smooth: true,
                lineStyle: {
                    normal: {
                        width: 2
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#FF0000',
                        borderWidth: 2
                    }
                },
                data: [4.8, 29.6, 24.1, 26.3, 26.4, 4.8, 29.6, 24.1, 26.3, 26.4, 12, 32]
            },{
                name: '单产（公斤/公顷）',
                type: 'line',
                symbolSize: 8,
                smooth: true,
                lineStyle: {
                    normal: {
                        width: 2
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#EDF411',
                        borderWidth: 2
                    }
                },
                data: [24.8, 29.6, 24.1, 26.3, 26.4, 24.8, 2.6, 24.1, 26.3, 2.4, 12, 32]
            },{
                name: '单产（公斤/公顷）',
                type: 'line',
                symbolSize: 8,
                smooth: true,
                lineStyle: {
                    normal: {
                        width: 2
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#30F50F',
                        borderWidth: 2
                    }
                },
                data: [4.8, 29.6, 24.1, 26.3, 6.4, 2.8, 29.6, 24.1, 6.3, 26.4, 12, 32]
            }, {
                xAxisIndex: 1,
                // show: false,
                name: '辅助',
                type: 'line',
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

        var newOption = {
            series: [{
                name: '单产（公斤/公顷）',
                data: [24.8, 29.6, 24.1, 26.3, 26.4, 24.8, 29.6, 24.1, 26.3, 26.4, 12, 32]
            }]
        }

        $.extend(true, lawOption, newOption);

        tradeLaw.setOption(lawOption, true);
    }


    function getTradeLaw() {
        initTradeLaw(0);
    }

    // ajax 获取数据，需要在取得时间后使用
    getTradeLaw()

});
