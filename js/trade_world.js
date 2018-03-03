$(function() {
    // trade_world 页面所需公共变量
    var MUTI = {
        timeDir: './../',
        mapJson: './../Lib/data/json/',
        starDot: '<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:',
        endDot: '"></span>',
        notnum: 0,
        distributeTime: null, // 贸易分布时间轴
        degreeTime: null, // 地区排名时间轴
        leftArea: '华北地区'
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
                distributeTime.setData(arr);
                distributeTime.setTime(arr[arr.length - 1]);
                MUTI.compareTime = arr[arr.length - 1];
            } else {
                degreeTime.setData(arr);
                degreeTime.setTime(arr[arr.length - 1]);
                MUTI.rankTime = arr[arr.length - 1];
            }
        }
    }


    /**
     * ********************************************
     * ***********全球贸易 贸易分布*********
     * ********************************************
     */
    var worldData = [
        {
            name: "中国",
            value: '3450'
        }, {
            name: "俄罗斯",
            value: '587'
        }, {
            name: "印度",
            value: '359'
        }, {
            name: "伊朗",
            value: '298'
        }, {
            name: "埃及",
            value: '875'
        }, {
            name: "波兰",
            value: '657'
        }, {
            name: "巴西",
            value: '1567'
        }, {
            name: "美国",
            value: '875'
        }, {
            name: "加拿大",
            value: '397'
        }];

    /**
     * 渲染 世界地图函数
     */
    var chart = new JusfounD3Charts.mapSelect();
    chart.init({
        dom: $(".map")[0],
        cityData: worldData,
        VisualMapItemHeight: 40,
        VisualMapItemWidth: 20,
        VisualMapTextMargin: 10,
        VisualMapText: '我是一个单位说明',
        areaColor: ['#FBFBFF', '#DDDDFF', '#B9B9FF', '#9393FF', '#6A6AFF', '#8600FF'],
        jsonUrl: MUTI.mapJson, //json 路径
        nameMap: nameMap,
        tooltipFormatter: function (d) {
            var flag = d.data.labelShow;
            if (!flag) return;
            str = MUTI.distributeTime + '年&nbsp;';
            if (flag == 1) {
                str += d.data.name + '<br />出口量： ' + parseFloat(d.data.value).toFixed(0).fontsize(5).fontcolor('#FAB407') + MUTI.valueArea;
                return str;
            }
            if (flag == 2) {
                str += d.data.name + '<br />进口量： ' + parseFloat(d.data.value).toFixed(0).fontsize(5).fontcolor('#FAB407') + "吨";
                return str;
            }
        }
    });

    function getTradeDistributeData() {
        var tradeDistributeObj = {
            time: MUTI.distributeTime,              // ajax需要字段， 时间
            danwei: getDanwei(".trade-distribute") // ajax需要的字段，单位 贸易额，贸易量
        }

        var labelFlag = tradeDistributeObj.danwei === '出口' ? 1 : 2
        // after ajax
        chart.render('world');
        chart.setData({
    //        data: data1,
            data: worldData,
            labelShow: labelFlag,
            VisualMapText: '我是一个单位说明二',
            delayTime: 300
        });
    }

    /**
     * 第一次初始化页面
     * 需要在获取时间后进行初始化
     */
    getTradeDistributeData();

    /**
     * 贸易分布 ajax 交互
     * 出口 进口
     * 根据 出口 进口 单选按钮 渲染 echarts 图表
     */
    $(".trade-distribute .pub-radio").on('click', "li", function() {
        getTradeDistributeData();
    });

    /**
     * 贸易分布 ajax 交互
     * 滑动时间轴 两个echarts图表的联动
     * @type {scrollBar}
     */
    var tradeDistributeTime = new scrollBar({
        dom: document.getElementById('trade-distributed-time'),
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
    tradeDistributeTime.scrollChange(function(time) {
        MUTI.distributeTime = time;
        console.log(time);
        getTradeDistributeData();
    })

    /**
     * ********************************************
     * ***********全球贸易 国际地位*********
     * ********************************************
     */

    /**
     * 全球贸易——国际地位 左侧echarts
     * 渲染函数
     */
    var internalDegree = echarts.init(document.getElementById('internal-degree'));

    function initInternalDegreeEchart(data, obj) {
        var internalDegreeOption = {
            title: {
                show: true,
                text: '2016年全球主要贸易国贸易量占比',
                left: 'left',
                top: 30,
                textStyle: {
                    fontSize: 15,
                    fontWeight: 'normal',
                    color: '#fff'
                },
                x: 'center',
                y: 'center'
            },
            grid: {
                left: '5%',
                right: '5%',
                bottom: '5%',
                containLabel: true
            },
            tooltip: {
                // trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    shadowStyle: {
                        color: 'rgba(0,46, 115, 0.3)'
                    }
                },
                formatter: function(params) {
                    var str = params.value + '万吨'
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
                right: '0',
                textStyle: { color: "#82bcff" },
                data: ['', '', '', '', '', '', '']
            },
            series: [{
                type: 'pie',
                radius: ['20%', '60%'],
                center: ['50%', '50%'],
                // roseType : 'radius',
                data: [{
                    value: 1500,
                    name: '华北地区',
                    label: {
                        normal: {
                            textStyle: {
                                color: "#fff",
                            },
                            formatter: function(params) {
                                return params.percent + '%' + '\n' + params.name;
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
                        }
                    }
                }, {
                    value: 1500,
                    name: '西北地区',
                    label: {
                        normal: {
                            textStyle: {
                                color: "#fff",
                            },
                            formatter: function(params) {
                                return params.percent + '%' + '\n' + params.name;
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            barBorderRadius: 20,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#fff'
                            }, {
                                offset: 1,
                                color: '#27eeef'
                            }]),
                            shadowColor: 'rgba(0, 0, 0, 0.4)',
                        }
                    }
                }, {
                    value: 1500,
                    name: '东北地区',
                    label: {
                        normal: {
                            textStyle: {
                                color: "#fff",
                            },
                            formatter: function(params) {
                                return params.percent + '%' + '\n' + params.name;
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
                        }
                    }
                }, {
                    value: 1500,
                    name: '中南地区',
                    label: {
                        normal: {
                            textStyle: {
                                color: "#fff",
                            },
                            formatter: function(params) {
                                return params.percent + '%' + '\n' + params.name;
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            barBorderRadius: 20,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#FFF51A'
                            }, {
                                offset: 1,
                                color: '#ADA715'
                            }]),
                            shadowColor: 'rgba(0, 0, 0, 0.4)',
                        }
                    }
                }, {
                    value: 1500,
                    name: '西南地区',
                    label: {
                        normal: {
                            textStyle: {
                                color: "#fff",
                            },
                            formatter: function(params) {
                                return params.percent + '%' + '\n' + params.name;
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
                        }
                    }
                }, {
                    value: 5000,
                    name: '东北地区',
                    label: {
                        normal: {
                            textStyle: {
                                color: "#fff",
                            },
                            formatter: function(params) {
                                return params.percent + '%' + '\n' + params.name;
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
                        }
                    }
                }, {
                    value: 1500,
                    name: '东北地区',
                    label: {
                        normal: {
                            textStyle: {
                                color: "#fff",
                            },
                            formatter: function(params) {
                                return params.percent + '%' + '\n' + params.name;
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            barBorderRadius: 20,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#4D61F6'
                            }, {
                                offset: 1,
                                color: '#551EF2'
                            }]),
                            shadowColor: 'rgba(0, 0, 0, 0.4)',
                        }
                    }
                }, {
                    value: 1500,
                    name: '中南地区',
                    label: {
                        normal: {
                            textStyle: {
                                color: "#fff",
                            },
                            formatter: function(params) {
                                return params.percent + '%' + '\n' + params.name;
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            barBorderRadius: 20,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#FA2E36'
                            }, {
                                offset: 1,
                                color: '#F21414'
                            }]),
                            shadowColor: 'rgba(0, 0, 0, 0.4)',
                        }
                    }
                }, {
                    value: 1500,
                    name: '西南地区',
                    label: {
                        normal: {
                            textStyle: {
                                color: "#fff",
                            },
                            formatter: function(params) {
                                return params.percent + '%' + '\n' + params.name;
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            barBorderRadius: 20,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#C9F081'
                            }, {
                                offset: 1,
                                color: '#B1E256'
                            }]),
                            shadowColor: 'rgba(0, 0, 0, 0.4)',
                        }
                    }
                }, {
                    value: 5000,
                    name: '东北地区',
                    label: {
                        normal: {
                            textStyle: {
                                color: "#fff",
                            },
                            formatter: function(params) {
                                return params.percent + '%' + '\n' + params.name;
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            barBorderRadius: 20,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#E13FF9'
                            }, {
                                offset: 1,
                                color: '#D20FEA'
                            }]),
                            shadowColor: 'rgba(0, 0, 0, 0.4)',
                        }
                    }
                }]
            }]
        };

        var newOption = {
            title: {
                text: obj.timeWhile + '年全球主要贸易国' + obj.danwei + '量占比',
            },
            series: [{
                data: [{
                    value: 1500,
                    name: '华北地区',
                }, {
                    value: 1500,
                    name: '西北地区',
                }, {
                    value: 1500,
                    name: '东北地区',
                }, {
                    value: 1500,
                    name: '中南地区',
                }, {
                    value: 1500,
                    name: '西南地区',
                }, {
                    value: 5000,
                    name: '东北地区',
                }, {
                    value: 1500,
                    name: 'aaa',
                }, {
                    value: 1500,
                    name: 'bbb',
                }, {
                    value: 1500,
                    name: 'ccc',
                }, {
                    value: 5000,
                    name: 'dddd',
                }]
            }]
        }
        $.extend(true, internalDegreeOption, newOption);

        internalDegree.setOption(internalDegreeOption)
    }


    /**
     * 全球贸易——国际地位 右侧echarts
     * 渲染函数
     */
    var tradeRank = echarts.init(document.getElementById('trade-rank'));

    function initTradeRankEchart(data, obj) {
        var tradeRankOption = {
            // backgroundColor: '#1B2971',
            grid: {
                left: 10,
                top: 5,
                bottom: 5,
                containLabel: true
            },
            axisLabel: {
                textStyle: {
                    fontSize: echartOpt.fz,
                    align: 'left',
                    color: function(value, index) {
                        return index >= 7 ? '#EDDE32' : '#6797D2';
                    }
                }
            },
            yAxis: [{
                data: ['美国', '俄罗斯', '越南', '印度', '菲律宾', '缅甸', '韩国', '日本', '英国', '法国'],
                offset: 0,
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                }
            }],
            xAxis: {
                max: 100,
                show: false,
                axisLine: {
                    show: false
                }
            },
            series: [{
                type: 'bar',
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        formatter: function ({data}) {
                            var str = data.value
                            return str
                        },
                        textStyle: {
                            fontSize: 16,
                            color: echartOpt.color
                        }
                    }
                },
                barWidth: 12,
                itemStyle: {
                    normal: {
                        barBorderRadius: 6,
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
                            offset: 0,
                            color: 'rgba(0, 82, 222, 1)'
                        }, {
                            offset: 1,
                            color: 'rgba(234, 227, 69, 1)'
                        }]),
                        shadowColor: 'rgba(0, 0, 0, 0.4)',
                        shadowBlur: 6
                    }
                },
                data: [{
                    value: 20
                },{
                    value: 20
                },{
                    value: 20
                },{
                    value: 20
                },{
                    value: 20
                },{
                    value: 20
                },{
                    value: 20
                },{
                    value: 20
                },{
                    value: 20
                },{
                    value: 20
                }]
            }]
        };
        var newOption = {
            yAxis: [{
                data: ['美国', '俄罗斯', '越南', '印度', '菲律宾', '缅甸', '韩国', '日本', '英国', '法国'],
            }],
            series: [{
                name: '华北地区',
                data: [{
                    value: 20,
                    rate: 10
                },{
                    value: 20,
                    rate: 10
                },{
                    value: 20,
                    rate: 10
                },{
                    value: 20,
                    rate: 10
                },{
                    value: 20,
                    rate: 10
                },{
                    value: 20,
                    rate: 10
                },{
                    value: 20,
                    rate: 10
                },{
                    value: 20,
                    rate: 10
                },{
                    value: 20,
                    rate: 10
                },{
                    value: 20,
                    rate: 10
                }]
            }]
        }
        $.extend(true, tradeRankOption, newOption);
        tradeRank.setOption(tradeRankOption);

        // 文字描述处内容
        // console.log(distributeObj);
        var dir = obj.danwei === '出口' ? '出口量' : '进口量';
        $(".internal-degree .year").html(obj.timeWhile);
        $(".internal-degree .flow").html(dir);
    }

    // ajax 调用后台接口
    function getTradeRankData() {
        var tradeRankObj = {
            timeWhile: MUTI.degreeTime, // ajax需要字段， 时间
            danwei: getDanwei(".internal-degree"), // ajax需要的字段，单位 进口 出口
        };
        console.log(tradeRankObj);
        initInternalDegreeEchart(0, tradeRankObj);
        initTradeRankEchart(0, tradeRankObj);
    }

    /**
     * 打开页面第一次初始化页面时
     * 需在返回时间后调取，地域回调函数
     */
    getTradeRankData();

    /**
     * 地区流向 ajax 交互
     * 滑动时间轴 两个echarts图表的联动
     * @type {scrollBar}
     */
    var internalDegreeTime = new scrollBar({
        dom: document.getElementById('internal-degree-time'),
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
    internalDegreeTime.scrollChange(function(time) {
        MUTI.degreeTime = time;
        console.log(time);
        getTradeRankData();
    })


    /**
     * 地区流向 ajax 交互
     * 进口 出口
     * 根据 进口 出口 单选按钮 渲染 echarts 图表
     */
    $(".internal-degree .pub-radio").on('click', "li", function() {
        getTradeRankData();
    });


    /**
     * ********************************************
     * ***********全球贸易 历史演变*********
     * ********************************************
     */

    var tradeHistory = echarts.init(document.getElementById('trade-history'));
    function InitTradeHistory(data, obj) {
        var tradeHistoryOption = {
            grid: {
                right: '10%',
                left: '5%',
                bottom: '10%',
                top: '25%'
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
                    var str = params[0].name + "<br>";
                    params.forEach(function(v, i) {
                        str += v.seriesName + ": " + v.value + "万吨" + "<br>";
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
                data: ['A', 'a', 'B', 'b', 'C', 'c', 'D', 'd', 'E', 'e'],
                right: '5%',
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
                data: ['2007', "2008", "2009", "2010", "2011"],
            },
            yAxis: [{
                type: 'value',
                name: '贸易量（万吨）',
                min: 0,
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
                name: '变化率（%）',
                min:'dataMin',
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
            color: ["#3fa7dc", "#ffea38", "#f9852d", "#F10F0F", "#14EE10"],
        };
        var seriesStyle = [{
                barMaxWidth: 20,
                itemStyle: {
                    normal: {
                        barBorderRadius: 10,
                        borderColor: '#3fa7dc',
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 1,
                            color: 'rgba(63,167,220,.8)'
                        }, {
                            offset: 0,
                            color: 'rgba(63,167,220,.4)'
                        }])
                    }
                },
                zlevel: 9
            }, {
                yAxisIndex: 1,
                symbolSize: 13,
                smooth: true,
                zlevel: 9,
                markLine: {
                    data: [{
                        name: '',
                        yAxis: 0
                    }],
                    symbolSize: 0,
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    lineStyle: {
                        normal: {
                            type: "dashed"
                        }
                    }
                }
            }, {
                barMaxWidth: 20,
                itemStyle: {
                    normal: {
                        barBorderRadius: 10,
                        borderColor: '#ffea38',
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 1,
                            color: 'rgba(255,234,56, 0.8)'
                        }, {
                            offset: 0,
                            color: 'rgba(255,234,56, 0.4)'
                        }])

                    }
                },
                zlevel: 9
            }, {
                yAxisIndex: 1,
                symbolSize: 13,
                smooth: true,
                zlevel: 9
            }, {
                barMaxWidth: 20,
                itemStyle: {
                    normal: {
                        barBorderRadius: 10,
                        borderColor: '#f9852d',
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 1,
                            color: 'rgba(249,133,45, 0.8)'
                        }, {
                            offset: 0,
                            color: 'rgba(249,133,45, 0.4)'
                        }])
                    }
                },
                zlevel: 9
            }, {
                yAxisIndex: 1,
                symbolSize: 13,
                smooth: true,
                zlevel: 9
            }, {
                barMaxWidth: 20,
                itemStyle: {
                    normal: {
                        barBorderRadius: 10,
                        borderColor: '#F10F0F',
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 1,
                            color: 'rgba(241, 15, 15,.8)'
                        }, {
                            offset: 0,
                            color: 'rgba(241, 15, 15 ,.4)'
                        }])
                    }
                },
                zlevel: 9
            }, {
                yAxisIndex: 1,
                symbolSize: 13,
                smooth: true,
                zlevel: 9
            }, {
                barMaxWidth: 20,
                itemStyle: {
                    normal: {
                        barBorderRadius: 10,
                        borderColor: '#14EE10',
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 1,
                            color: 'rgba(20, 238, 16, 0.8)'
                        }, {
                            offset: 0,
                            color: 'rgba(20, 238, 16, 0.4)'
                        }])

                    }
                },
                zlevel: 9
            }, {
                yAxisIndex: 1,
                symbolSize: 13,
                smooth: true,
                zlevel: 9
            }]

        var legend = [];
        var seriesName = [];
        obj.areas.split(",").forEach(function (v, i) {
            legend.push((v + "出口量"));
            legend.push((v + "变化率"));
            seriesName.push({name: v + "出口量"}, {name: v + "变化率"});
        })
        var newOption = {
            tooltip: {
                formatter: function(params) {
                    var str = params[0].name + "<br>";
                    params.forEach(function(v, i) {
                        var unite = params[i].seriesType === "bar" ? "万吨" : "%"
                        str += v.seriesName + ": " + v.value + unite + "<br>";
                    });
                    return str
                }
            },
            xAxis: {
                data: obj.timeWhile.split(","),
            },
            legend: {
                data: legend
            },
            series: [{
                name: 'A',
                type: 'bar',
                data: [200, 300, 100, 330, 350],
            }, {
                name: 'a',
                type: 'line',
                data: [-100, 200, 300, 300, 100],
            }, {
                name: 'B',
                type: 'bar',
                data: [500, 100, 400, 300, 600],
            }, {
                name: 'b',
                type: 'line',
                data: [234, 43, 243, 12, 543],
            }, {
                name: 'C',
                type: 'bar',
                data: [500, 100, 400, 300, 600],
            }, {
                name: 'c',
                type: 'line',
                data: [341, 43, 234, 43, 432],
            }, {
                name: 'D',
                type: 'bar',
                data: [500, 100, 400, 300, 600],
            }, {
                name: 'd',
                type: 'line',
                data: [654, 635, 654, 356, 65],
            }, {
                name: 'E',
                type: 'bar',
                data: [452, 432, 54, 54, 600],
            }, {
                name: 'e',
                type: 'line',
                data: [121, 12, 321, 231, 45],
            }]
        }

        newOption.series.forEach(function (v, i) {
            $.extend(true, v, seriesStyle[i], seriesName[i])
        });

        $.extend(true, tradeHistoryOption, newOption)
        tradeHistory.setOption(tradeHistoryOption);
    }
    // InitTradeHistory();

    /**
     * ajax 调用后台接口 渲染 历史演变echarts图表
     * @return {[type]} [description]
     */
    function getTradeHistoryData() {
        var tradeHistoryObj = {
            timeWhile: getTime(".trade-history"), // ajax需要字段， 时间
            areas: getAreas(".trade-history"), // ajax需要的字段，苹果种类，鲜苹果
            danwei: getDanwei(".trade-history"), // ajax需要的字段，单位 贸易额，贸易量
        };
        console.log(tradeHistoryObj);
        InitTradeHistory(0, tradeHistoryObj);
    }

    /**
     * 第一次初始化页面后 渲染echarts图表
     */
    getTradeHistoryData();

    /**
     * 历史演变 ajax 交互
     * 2012－2017
     * 根据 时间 渲染 echarts 表
     */
    $(".trade-history .pub-time").on("click", ".time-yes", function(e) {
        e.stopPropagation();
        getTradeHistoryData()
    });

    /**
     * 历史演变 ajax 交互
     * 全球 中国 美国
     * 根据 地区 渲染 echarts 表
     */
    $(".trade-history").on("click", ".yes", function() {
        getTradeHistoryData()
    });


    /**
     * 历史演变 ajax 交互
     * 进口 出口
     * 根据 进口 出口 单选按钮 渲染 echarts 图表
     */
    $(".trade-history .pub-radio").on('click', "li", function() {
        getTradeHistoryData()
    });

    $(".trade-history .pub-time").on("click", ".month-item", function (e) {
        getTime(".trade-history")
    })


    /**
     * ********************************************
     * *********** 新需求 ****************
     * ***********全球贸易 历史演变*********
     * ********************************************
     */
    /**
     * 贸易流向——全国流向 右侧echarts
     * 渲染函数
     */
    var frontTen = echarts.init(document.getElementById('front-ten'));
    function initFrontTenEchart(data, tradeFlowObj) {
        var frontTenOption = {
            // backgroundColor: '#1B2971',
            grid: {
                left: 10,
                top: 5,
                bottom: 5,
                containLabel: true
            },
            axisLabel: {
                textStyle: {
                    fontSize: echartOpt.fz,
                    align: 'left',
                    color: function(value, index) {
                        return index >= 7 ? '#EDDE32' : '#6797D2';
                    }
                }
            },
            yAxis: [{
                data: ['美国', '俄罗斯', '越南', '印度', '菲律宾', '缅甸', '韩国', '日本', '英国', '法国'],
                offset: 0,
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                }
            }],
            xAxis: {
                max: 100,
                show: false,
                axisLine: {
                    show: false
                }
            },
            series: [{
                type: 'bar',
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        formatter: "{c}千吨",
                        textStyle: {
                            fontSize: 16,
                            color: echartOpt.color
                        }
                    }
                },
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                barWidth: 12,
                itemStyle: {
                    normal: {
                        barBorderRadius: 6,
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
                            offset: 0,
                            color: 'rgba(0, 82, 222, 1)'
                        }, {
                            offset: 1,
                            color: 'rgba(234, 227, 69, 1)'
                        }]),
                        shadowColor: 'rgba(0, 0, 0, 0.4)',
                        shadowBlur: 6
                    }
                }
            }]
        };
        var newOption = {
            series: [{
                name: '前十',
                data: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            }]
        }
        $.extend(true, frontTenOption, newOption);
        frontTen.setOption(frontTenOption);

        // 文字描述处内容
        // console.log(tradeFlowObj);
        // $(".country-flow .year").html(tradeFlowObj.timeWhile);
        // $(".country-flow .flow").html(tradeFlowObj.danwei);
    }

    function getFlowData() {
        initFrontTenEchart(0, )
    }

    getFlowData();

});
