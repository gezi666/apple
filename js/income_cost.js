$(function() {
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
     * 公共函数——初始化时间轴
     * 时间轴 初始化时间段，起始时间函数
     * @param  {number} dom 地区比较还是地区排名的时间函数
     * @return {array}
     */
    function initTimeControl(dom) {
        // after some ajax.....
        // arr 为 通过ajax 获取时间后的变量
        var url = dom === 1 ? 'aaa' : 'bbb';
        ajaxGetDataCall(url, '', timeCb);

        function timeCb(data) {
            // var arr = ['a', 'b', 'c', 'd'];
            var arr = data.data
            if (dom === 1) {
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
     * ***********成本收益 成本结构*********
     * ********************************************
     */
    /**
     * 成本收益 成本结构 echarts 图表函数封装
     */
    var costStructLeft = echarts.init(document.getElementById('cost-totalcost'));

    function initCostStructLeft(data, obj) {
        var yUnite = obj.danwei === '单位面积' ? '元/亩' : '元/公斤'
        var costStructLeftOption = {
            title: {
                text: '总成本结构',
                left: 'center',
                top: 30,
                bottom:40,
                textStyle: {
                    fontSize: 15,
                    color: '#fff'
                },
                x: 'center',
                y: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    console.log(params)
                    return params.value + yUnite;
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
            legend: {
                show: false,
                right: '0',
                textStyle: { color: "#82bcff" },
                data: ['', '', '', '', '', '', '']
            },

            series: [{
                name: ' ',
                label: {
                    normal: {
                        formatter: '{b}',
                        textStyle: {
                            fontSize: 18
                        }
                    }
                },
                type: 'pie',
                labelLine: {
                    normal: {
                        length: 10,
                        length2: 25
                    }
                },
                radius: ['20%', '50%'],
                center: ['50%', '60%'],
                color: ['#1b8c53', '#166d9c', '#7d5831', '#742a2f', '#9a8e34', 'pink'],
                data: [{
                    value: 1500,
                    name: '土地成本',
                    label: {
                        normal: {
                            textStyle: {
                                //color: "#fc712e"
                                color: '#fff',
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            barBorderRadius: 20,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#eb8f56'
                            }, {
                                offset: 1,
                                color: '#f38d43'
                            }]),
                            shadowColor: 'rgba(0, 0, 0, 0.4)',
                            //shadowBlur: 20
                        }
                    }
                }, {
                    value: 4000,
                    name: '物质与服务费用',
                    label: {
                        normal: {
                            textStyle: {
                                //color: "#0589ea",
                                color: '#fff',
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            barBorderRadius: 20,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#01bade'
                            }, {
                                offset: 1,
                                color: '#0589ea'
                            }]),
                            shadowColor: 'rgba(0, 0, 0, 0.4)',
                            //shadowBlur: 20
                        }
                    }
                }, {
                    value: 4000,
                    name: '人工成本',
                    label: {
                        normal: {
                            textStyle: {
                                //color: "#3c9d3e"
                                color: '#fff',
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            barBorderRadius: 20,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#53d644'
                            }, {
                                offset: 1,
                                color: '#3da63b'
                            }]),
                            shadowColor: 'rgba(0, 0, 0, 0.4)',
                            //shadowBlur: 20
                        }
                    }
                }]
            }]
        };
        var title = "总成本结构";
        var _temp ={
            normal: {
                formatter: function(params) {
                    if(obj.danwei === "单位面积"){
                        //return params.value + '元/亩' + '\n' + params.percent + '%' + '\n' + params.name;
                        return params.name + '\n' + params.percent + '%';
                    }else {
                        //return params.value + '元/公斤' + '\n' + params.percent + '%' + '\n' + params.name;
                        return params.name  + '\n' + params.percent + '%';
                    }
                }
            }
        };
        var newOption = {
            title: {
                text: title
            },
            series: [{
                // name: 'efa',
                data: [{
                    value: 1500,
                    name: '土地成本',
                    label: _temp
                }, {
                    value: 4000,
                    name: '物质与服务费用',
                    label: _temp
                }, {
                    value: 4000,
                    name: '人工成本',
                    label: _temp
                }]
            }]
        }
        $.extend(true, costStructLeftOption, newOption);
        costStructLeft.setOption(costStructLeftOption, true);
    }

    /**
     * 成本收益 物质与服务费用 echarts 图表函数封装
     */
    var costStructRight = echarts.init(document.getElementById('cost-matterserve'));

    function initCostStructRight(data, obj) {
        var yUnite = obj.danwei === '单位面积' ? '元/亩' : '元/公斤'
        var costStructRightOption = {
            title: {
                text: '物质与服务费用',
                left: 'center',
                top: 45,
                bottom:40,
                textStyle: {
                    fontSize: 15,
                    color: '#fff'
                },
                x: 'center',
                y: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    console.log(params)
                    return params.value + yUnite;
                    //return '占比：' + params.percent + '%';
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
            legend: {
                show: false,
                right: '0',
                textStyle: { color: "#82bcff" }
            },
            series: [{
                label: {
                    normal: {
                        formatter: '{b}',
                        textStyle: {
                            fontSize: 18
                        }
                    }
                },
                type: 'pie',
                labelLine: {
                    normal: {
                        length: 10,
                        length2: 25

                    }
                },
                radius: ['20%', '50%'],
                center: ['50%', '60%'],
                color: ['#1b8c53', '#166d9c', '#7d5831', '#742a2f', '#9a8e34', 'pink'],
                data: [{
                        value: 1500,
                        name: '农药',
                        label: {
                            normal: {
                                textStyle: {
                                    //color: "#fc712e"
                                    color: "#fff"
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: 20,
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#35cf74'
                                }, {
                                    offset: 1,
                                    color: '#3eda62'
                                }]),
                                shadowColor: 'rgba(0, 0, 0, 0.4)',
                                //shadowBlur: 20
                            }
                        }
                    }, {
                        value: 1500,
                        name: '农膜',
                        label: {
                            normal: {
                                textStyle: {
                                    //color: "#fce940"
                                    color: "#fff"
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: 20,
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#19c6dc'
                                }, {
                                    offset: 1,
                                    color: '#27eeef'
                                }]),
                                shadowColor: 'rgba(0, 0, 0, 0.4)',
                                //shadowBlur: 20
                            }
                        }
                    }, {
                        value: 1500,
                        name: '化肥7',
                        label: {
                            normal: {
                                textStyle: {
                                    //color: "#3fa7dc"
                                    color: "#fff"
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: 20,
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#079eed'
                                }, {
                                    offset: 1,
                                    color: '#02c8f6'
                                }]),
                                shadowColor: 'rgba(0, 0, 0, 0.4)',
                                //shadowBlur: 20
                            }
                        }
                    }, {
                        value: 1500,
                        name: '化肥6',
                        label: {
                            normal: {
                                textStyle: {
                                    //color: "#3fa7dc"
                                    color: "#fff"
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: 20,
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#0089ec'
                                }, {
                                    offset: 1,
                                    color: '#0180eb'
                                }]),
                                shadowColor: 'rgba(0, 0, 0, 0.4)',
                                //shadowBlur: 20
                            }
                        }
                    }, {
                        value: 1500,
                        name: '管理费',
                        label: {
                            normal: {
                                textStyle: {
                                    //color: "#3fa7dc"
                                    color:'#fff'
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: 20,
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#117ce2'
                                }, {
                                    offset: 1,
                                    color: '#165fe1'
                                }]),
                                shadowColor: 'rgba(0, 0, 0, 0.4)',
                                //shadowBlur: 20
                            }
                        }
                    }, {
                        value: 5000,
                        name: '化肥4',
                        label: {
                            normal: {
                                textStyle: {
                                    //color: "#3fa7dc"
                                    color: "#fff"
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: 20,
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#ee8821'
                                }, {
                                    offset: 1,
                                    color: '#d85f1d'
                                }]),
                                shadowColor: 'rgba(0, 0, 0, 0.4)',
                                //shadowBlur: 20
                            }
                        }
                    }, {
                        value: 1500,
                        name: '化肥3',
                        label: {
                            normal: {
                                textStyle: {
                                    //color: "#3fa7dc"
                                    color: "#fff"
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: 20,
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#deda02'
                                }, {
                                    offset: 1,
                                    color: '#ccc500'
                                }]),
                                shadowColor: 'rgba(0, 0, 0, 0.4)',
                                //shadowBlur: 20
                            }
                        }
                    }

                ]
            }]
        };
        var title = "物质与服务费用";
        var _temp ={
            normal: {
                formatter: function(params) {
                    if(obj.danwei === "单位面积"){
                        //return params.value + '元/亩' + '\n' + params.percent + '%' + '\n' + params.name;
                        return params.name + '\n' + params.percent + '%';
                    }else {
                        //return params.value + '元/公斤' + '\n' + params.percent + '%' + '\n' + params.name;
                        return params.name  + '\n' + params.percent + '%';
                    }
                }
            }
        };
        var newOption = {
            series: [{
                data: [{
                    value: 1500,
                    name: '农药',
                    label: _temp
                }, {
                    value: 1500,
                    name: '农膜',
                    label: _temp
                }, {
                    value: 1500,
                    name: '化肥7',
                    label: _temp
                }, {
                    value: 1500,
                    name: '化肥6',
                    label: _temp
                }, {
                    value: 1500,
                    name: '管理费',
                    label: _temp
                }, {
                    value: 5000,
                    name: '化肥4',
                    label: _temp
                }, {
                    value: 1500,
                    name: '化肥3',
                    label: _temp
                }]
            }]
        }
        $.extend(true, costStructRightOption, newOption);
        costStructRight.setOption(costStructRightOption, true);
    }

    // ajax 获取数据后调用 echarts 图表渲染函数
    function getCostStructData() {
        var initCostStruct = {
            danwei: getDanwei(".cost-struct"), // ajax需要的字段，单位
            time: MUTI.structTime
        };
        console.log(initCostStruct);
        // after ajax
        initCostStructLeft(0, initCostStruct)
        initCostStructRight(0, initCostStruct)
    }

    /**
     * 成本结构 ajax 交互
     * 第一次打开页面时初始化图表
     */
    function loadpage() {
        // ajax cb
        MUTI.structTime = 2017;
        getCostStructData()

    }
    loadpage();

    /**
     * 成本结构 ajax 交互
     * 单位面积 单位产品
     * 根据 单位面积 单位产品 渲染 echarts 图表
     */
    $(".cost-struct .pub-radio").on('click', "li", function() {
        getCostStructData();
    });

    /**
     * 地区比较 ajax 交互
     * 时间
     * 根据 时间 渲染 echarts 图表
     */
    var costStructTime = new scrollBar({
        dom: document.getElementById('cost-struct-time'),
        height: 12,
        // width: 800,
        position: 'bottom',
        backgroundImage: MUTI.timeDir + 'images/scale-bg.png',
        withTime: true,
        slideStart: null,
        slideBgImage: MUTI.timeDir + 'images/scroll-icon.png',
        data: ['1', '2'],
        tooltipWidth: 48,
        tooltipHeight: 20,
        tooltipImage: MUTI.timeDir + 'images/tooltip.png'
    });
    // 时间轴 初始化时间段，起始时间函数
    // initTimeControl(1)
    costStructTime.scrollChange(function(time) {
        MUTI.structTime = time;
        getCostStructData();
    })

    /**
     * 点击左侧echarts图表 右侧echarts 图表联动
     *
     */
    costStructLeft.on("click", function(params) {
        console.log(params)

        // after ajax
        initCostStructRight(0, initCostStruct)
    })

    /**
     * ********************************************
     * ***********成本收益 历史变化*********
     * ********************************************
     */
    /**
     * 成本收益 历史变化 echarts 图表函数封装
     */
    var costHistory = echarts.init(document.getElementById('cost-history'));

    function initCostHistory(data, obj) {
        var tradeHistoryOption = {
            // backgroundColor: '#1b237e',
            grid: {
                right: '5%',
                left: '5%'
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
                    //shadowBlur: 0,
                    shadowColor: 'rgba(255, 0, 0, 1)',
                    shadowOffsetX: 0,
                    shadowOffsetY: 0
                },
                textStyle: {
                    color: "#11caff",
                    fontSize: '16'
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
                        str += v.seriesName + ": " + v.value + "元/亩" + "<br>";
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
            legend: {
                data: ['总成本'],
                right: '60',
                top: '0',
                textStyle: {
                    color: echartOpt.color,
                    //fontSize: echartOpt.fz
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
            yAxis: {
                type: 'value',
                name: '（万元）',
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
            series: []
        };
        var legend = obj.cost
        var yUnite = obj.danwei === '单位面积' ? '（元/亩）' : '（元/公斤）'
        var seriesStyle = [{
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
            zlevel: 9
        }, {
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
            zlevel: 9
        }]

        //var _show = obj.cost === '总成本' ? true : false
        var seriesName = [{
            name: legend
        }];
        // console.log(seriesName)
        //console.log(obj.cost)
        var newOption = {
            legend: {
               // show: _show,
                data: [legend]
            },
            tooltip: {
                formatter: function(params) {
                    var str = params[0].name + "<br>";
                    params.forEach(function(v, i) {
                        str += v.seriesName + ": " + v.value + yUnite + "<br>"
                    });
                    return str
                }
            },
            yAxis: {
                name: yUnite,
            },
            series: [{
                data: [200, 300, 100, 330, 350]
            }]
        }

        newOption.series.forEach(function(v, i) {
            $.extend(true, v, seriesStyle[i], seriesName[i])
        })

        $.extend(true, tradeHistoryOption, newOption);
        costHistory.setOption(tradeHistoryOption, true);

    }

    // ajax 获取数据后调用 echarts 图表渲染函数
    function getHistoricalChange() {
        var initCostStruct = {
            cost: getMainArea(".cost-history"),  //ajax需要字段
            timeWhile: getTime(".cost-history"), // ajax需要字段， 时间
            danwei: getDanwei(".cost-history") // ajax需要的字段，单位
        };
        // after ajax
        initCostHistory(0, initCostStruct)
    }

    /**
     * 历史变化 ajax 交互
     * 第一次打开页面时初始化图表
     */
    getHistoricalChange()

    /**
     * 历史变化 ajax 交互
     * 单位面积 单位产品
     * 根据 单位面积 单位产品 渲染 echarts 图表
     */
    $(".cost-history .pub-radio").on('click', "li", function() {
        getHistoricalChange();
    });

    /**
     * 历史变化 ajax 交互
     * 2012－2017
     * 根据 时间 渲染 echarts 表
     */
    $(".cost-history .pub-time").on("click", ".time-yes", function(e) {
        e.stopPropagation();
        getHistoricalChange();
    });

    /**
     * 历史变化 ajax 交互
     * 总成本
     * 根据 成本类 渲染 echarts 表
     */
    $(".cost-history .sel-areas").on("click", "li", function() {
        getHistoricalChange();
    });




    /**
     * ********************************************
     * ***********成本收益 地区比较*********
     * ********************************************
     */
    /**
     * 成本收益 地区比较 echarts 图表函数封装
     */
    var costCostCompare = echarts.init(document.getElementById('cost-compare'));

    function initCostCompare(data, obj) {
        var costgetCostCompare = {
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
                left: '3%',
                right: '5%',
                bottom: '0',
                containLabel: true
            },
            legend: {
                right: '45px',
                data: ['陕西', '山东', '甘肃'],
                textStyle: {
                    color: '#fff',
                    //fontSize: '16'
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
                        fontSize: 16,
                        color: '#fff'
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
                        fontSize: 14
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
            series: [{
                name: 'a',
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
                data: [70, 110, 145, 165, 135, 150, 160, 90, 70, 110],
            }, {
                name: 'b',
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
                data: [30, 60, 80, 125, 70, 100, 150, 60, 70, 110],
            }, {
                name: 'c',
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
                data: [50, 123, 80, 90, 70, 120, 100, 80, 70, 110],
            }, {
                name: 'd',
                type: 'line',
                symbolSize: 15,
                itemStyle: {
                    normal: {
                        color: '#E51717',
                        borderWidth: 2
                    },
                    emphasis: {
                        borderColor: '#E51717'
                    }
                },
                smooth: true,
                data: [50, 12, 80, 90, 70, 120, 100, 21, 70, 110],
            }, {
                name: 'e',
                type: 'line',
                symbolSize: 15,
                itemStyle: {
                    normal: {
                        color: '#F0F711',
                        borderWidth: 2
                    },
                    emphasis: {
                        borderColor: '#F0F711'
                    }
                },
                smooth: true,
                data: [50, 30, 80, 90, 70, 120, 100, 80, 10, 110],
            }]
        };
        var tooltip = obj.danwei === "单位面积" ? "元/亩" : "元/公斤"
        var yUnite = obj.danwei === "单位面积" ? "总成本（元/亩）" : "总成本（元/公斤）"
            // var legend = data.map(function (v, i) {
            //     return v.name;
            // })
        var newOption = {
            legend: {
                data: ['陕西', '山东', '甘肃']
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    var str = params[0].name + '年<br>';
                    params.forEach(function(v, i) {
                        str += v.seriesName + "： " + v.data + tooltip + "<br>"
                    })
                    return str;
                }
            },
            yAxis: [{
                name: yUnite
            }],
            series: [{
                name: '陕西',
                data: [70, 110, 145, 165, 135, 150, 160, 90, 70, 110],
            }, {
                name: '山东',
                data: [30, 60, 80, 125, 70, 100, 150, 60, 70, 110],
            }, {
                name: '甘肃',
                data: [50, 70, 80, 90, 70, 120, 100, 80, 70, 110],
            }]

        }
        $.extend(true, costgetCostCompare, newOption);
        costCostCompare.setOption(costgetCostCompare, true);
    }
    // ajax 获取数据后调用 echarts 图表渲染函数
    function getCostCompare() {
        var initCostStruct = {
            time: getTime(".cost-compare"), // ajax 需要的字段，时间
            cost: getMainArea(".cost-compare"), // ajax需要的字段，地区
            areas: getAreas(".cost-compare"), // ajax需要的字段，单位
            danwei: getDanwei(".cost-compare"), // ajax需要的字段，单位
        };
        // after ajax
        // var resArr = [];
        // for(var key in resData) {
        //     var item = resData[key];
        //     resArr.push({
        //         name: key,
        //         value: item,
        //         data: []
        //     })
        // }
        // resArr.forEach(function (v, i) {
        //     v.value.forEach(function (item, index) {
        //         v.data.push(item.value)
        //     })
        // })

        initCostCompare(0, initCostStruct)
    }

    /**
     * 地区比较 ajax 交互
     * 第一次打开页面时初始化图表
     */
    getCostCompare()

    /**
     * 地区比较 ajax 交互
     * 单位面积 单位产品
     * 根据 单位面积 单位产品 渲染 echarts 图表
     */
    $(".cost-compare .pub-radio").on('click', "li", function() {
        getCostCompare();
    });

    /**
     * 地区比较 ajax 交互
     * 地区
     * 根据 区域种类 渲染 echarts 表
     */
    $(".cost-compare .fake-ul").on("click", "li", function() {
        getCostCompare();
    });

    /**
     * 地区比较 ajax 交互
     * 2012－2017
     * 根据 时间 渲染 echarts 表
     */
    $(".cost-compare .pub-time").on("click", ".time-yes", function(e) {
        e.stopPropagation();
        getCostCompare();
    });

    /**
     * 地区比较 ajax 交互
     * 地区
     * 根据所选 地区 动态获取数据 渲染 echarts 图表 和 table 表格
     */
    $(".cost-compare").on("click", ".yes", function() {
        getCostCompare();
    });

});
