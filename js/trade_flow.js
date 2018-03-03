$(function () {
    // trade_flow 页面所需公共变量
    var MUTI = {
        timeDir: './../',
        mapJson: './../Lib/data/json/',
        starDot: '<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:',
        endDot: '"></span>',
        notnum: 0,
        countryTime: null, // 地区比较时间轴
        areasTime: null, // 地区排名时间轴
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
                tradeFlowTime.setData(arr);
                tradeFlowTime.setTime(arr[arr.length - 1]);
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
     * ***********贸易流向 全国流向*********
     * ********************************************
     */
    var resData = [{
        name: '北京',
        data: [
            [{
                name: '北京市'
            }, {
                name: '阿富汗',
                value: [90, '20%'],
                rate: '20%'
            }],
            [{
                name: '北京市'
            }, {
                name: '阿尔巴尼亚',
                value: [1500, '25%'],
            }]
        ]
    }];
    // 地图处理函数
    var convertData = function(data, tradeFlowObj) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            var fromCoord = worldGeoCoordMap[dataItem[0].name];
            var toCoord = worldGeoCoordMap[dataItem[1].name];
            if (fromCoord && toCoord) {
                if (tradeFlowObj.danwei === '出口') {
                    res.push({
                        fromName: dataItem[0].name,
                        toName: dataItem[1].name,
                        coords: [fromCoord, toCoord],
                        // value: '#00f'
                    });
                } else {
                    res.push({
                        fromName: dataItem[0].name,
                        toName: dataItem[1].name,
                        coords: [toCoord, fromCoord],
                        // value: dataItem[1].value
                    });
                }
            }
        }
        return res;
    };

    // 地图处理函数
    function handleResData(resData, tradeFlowObj) {
        var color1 = ['#0f0', '#0f0'];
        var color2 = ['#EB6100', '#EB6100'];
        var color = tradeFlowObj.danwei === '出口' ? color1 : color2
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
                        color: color[i],
                        width: 1,
                        curveness: 0.2
                    }
                },
                data: convertData(item.data, tradeFlowObj)
            }, { //移动 点
                name: item.name,
                type: 'lines',
                zlevel: 2,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0,
                    symbol: 'arrow',
                    symbolSize: 15
                },
                lineStyle: {
                    normal: {
                        color: color[i],
                        width: 1,
                        opacity: 0.4,
                        curveness: 0.2
                    }
                },
                data: convertData(item.data, tradeFlowObj)
            }, { //省份圆点
                name: item.name,
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                effectScatter: {
                    symbol: 'diamond'
                },
                rippleEffect: {
                    brushType: 'stroke',
                    scale: 6
                },
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        formatter: '{b}',
                        textStyle: {
                            color: '#fff',
                            fontSize: echartOpt.fz
                        }
                    }
                },
                symbolSize: 10,
                itemStyle: {
                    normal: {
                        color: color[i]
                    }
                },
                data: item.data.map(function(dataItem) {
                    return {
                        name: dataItem[1].name,
                        value: worldGeoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                    };
                })
            });
        });
        return series
    }

    var countryFlow = echarts.init(document.getElementById('country-flow'));
    /**
     * 贸易流向——全国流向 左侧echarts
     * 渲染函数
     */
    function initCountryFlow(data, tradeFlowObj) {
        var countryFlowOption = {
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    if (params.seriesType == 'effectScatter') {
                        if (tradeFlowObj.danwei === "进口") {
                            return params.name + '>' + params.seriesName + '<br>' + '交易量:<b style="color:#ffa600;font-weight:blod;font-size:18px;">' + params.data.value[2][0] + '</b>吨';
                        } else {
                            return params.seriesName + '>' + params.name + '<br>' + '交易量:<b style="color:#ffa600;font-weight:blod;font-size:18px;">' + params.data.value[2][0] + '</b>吨';
                        }
                    }
                }
            },
            legend: {
                show: false,
                orient: 'vertical',
                top: 'bottom',
                left: 'right',
                data: ['北京'],
                textStyle: {
                    color: '#fff'
                },
                selectedMode: 'single'
            },
            geo: {
                map: 'world',
                zoom: 1.25,
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: 'rgba(72, 118, 255,0.9)',
                        borderColor: '#fff'
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
            color: ['gold', 'aqua', 'lime'],
            dataRange: {
                show: false,
                type: 'continuous',
                min: 0,
                max: 100,
                text: ['交易量：万吨'],
                textGap: 40,
                calculable: true,
                color: ['#ff3333', 'orange', 'yellow', 'lime', 'aqua'],
                textStyle: {
                    color: '#0e9cf1',
                    fontSize: 16,
                    align: 'center'
                }
            },
            series: handleResData(data, tradeFlowObj)
        };
        countryFlow.setOption(countryFlowOption);
    }
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
        console.log(tradeFlowObj);
        $(".country-flow .year").html(tradeFlowObj.timeWhile);
        $(".country-flow .flow").html(tradeFlowObj.danwei);
    }

    /**
     * ajax 获取数据
     * @param  {document} tradeFlowObj 后台所需参数
     */
    function getFlowData() {
        var tradeFlowObj = {
            timeWhile: MUTI.countryTime, // ajax需要字段， 时间
            areas: getMainArea(".country-flow"), // ajax需要的字段，苹果种类，鲜苹果
            danwei: getDanwei(".country-flow"), // ajax需要的字段，单位 贸易额，贸易量
        };

        initCountryFlow(resData, tradeFlowObj)
        initFrontTenEchart(0, tradeFlowObj)
    }

    /**
     * 页面初始化第一次加载echarts图表
     * 应该在 获取时间后 进行页面的第一次初始化！！！！！！！！！！！！！！
     * 贸易流向——全国流向
     */
    getFlowData();

    /**
     * 全国流向 ajax 交互
     * 鲜苹果
     * 根据 苹果种类 渲染 echarts 表
     */
    $(".country-flow .fake-ul").on("click", "li", function() {
        getFlowData();
    });


    /**
     * 全国流向 ajax 交互
     * 进口 出口
     * 根据 进口 出口 单选按钮 渲染 echarts 图表
     */
    $(".country-flow .pub-radio").on('click', "li", function() {
        getFlowData();
    });

    /**
     * 地区比较 ajax 交互
     * 时间
     * 根据 时间 渲染 echarts 图表
     */
    var tradeFlowTime = new scrollBar({
        dom: document.getElementById('country-flow-time'),
        height: 12,
        // width: 800,
        position: 'bottom',
        backgroundImage: MUTI.timeDir + 'images/scale-bg.png',
        withTime: true,
        slideStart: 2,
        slideBgImage: MUTI.timeDir + 'images/scroll-icon.png',
        data: ['1', '2'],
        tooltipWidth: 48,
        tooltipHeight: 20,
        tooltipImage: MUTI.timeDir + 'images/tooltip.png'
    });
    // 时间轴 初始化时间段，起始时间函数
    initTimeControl(1)
    tradeFlowTime.scrollChange(function(time) {
        MUTI.countryTime = time;
        console.log(time);
    })



    /**
     * ********************************************
     * ***********贸易流向 大区流向 *********
     * ********************************************
     */

    /**
     * 贸易流向——大区流向 左侧echarts
     * 渲染函数
     */
    var areasFlow = echarts.init(document.getElementById('areas-flow'));
    function initAreasFlowEchart(data, obj) {
        var areasFlowOption = {
            title: {
                show: false,
                text: '大区流向',
                left: 'center',
                top: 30,
                textStyle: {
                    fontSize: 24,
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
                radius: ['20%', '65%'],
                center: ['50%', '50%'],
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
                            shadowBlur: 20,
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
                                color: '#19c6dc'
                            }, {
                                offset: 1,
                                color: '#27eeef'
                            }]),
                            shadowColor: 'rgba(0, 0, 0, 0.4)',
                            shadowBlur: 20,
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
                            shadowBlur: 20,
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
                            shadowBlur: 20,
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
                            shadowBlur: 20,
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
                            shadowBlur: 20,
                        }
                    }
                }]
            }]
        };
        var newOption = {
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
                }]
            }]
        }
        $.extend(true, areasFlowOption, newOption);

        areasFlow.setOption(areasFlowOption)
    }


    /**
     * 贸易流向——全国流向 右侧echarts
     * 渲染函数
     */
    var detailAreaFlow = echarts.init(document.getElementById('detail-area-flow'));
    function initdetailAreaEchart(data, obj) {
        var detailAreaFlowOption = {
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
                max: 'auto',
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
            yAxis: [{
                data: ['美国', '俄罗斯', '越南', '印度', '菲律宾', '缅甸', '韩国', '日本', '英国', '法国'],
            }],
            series: [{
                name: '华北地区',
                data: [100, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            }]
        }
        $.extend(true, detailAreaFlowOption, newOption);
        detailAreaFlow.setOption(detailAreaFlowOption, true);

        // 文字描述处内容
        // console.log(tradeFlowObj);
        var dir = obj.danwei === '出口' ? '出口去向' : '进口来源';
        $(".areas-flow .area").html(obj.leftArea);
        $(".areas-flow .flow").html(dir);
    }

    // ajax 调用后台接口
    function getAreasFlowData() {
        var tradeCompareObj = {
            timeWhile: MUTI.areasTime, // ajax需要字段， 时间
            areas: getMainArea(".areas-flow"), // ajax需要的字段，苹果种类，鲜苹果
            danwei: getDanwei(".areas-flow"), // ajax需要的字段，单位 贸易额，贸易量
            leftArea: MUTI.leftArea
        };
        console.log(tradeCompareObj);
        initAreasFlowEchart(0, tradeCompareObj);
        initdetailAreaEchart(0, tradeCompareObj);
    }

    /**
     * 打开页面第一次初始化页面时
     * 需在返回时间后调取，地域回调函数
     */
    getAreasFlowData();
    /**
     * 地区流向 ajax 交互
     * 时间
     * 根据 时间 渲染 echarts 图表
     */

    /**
     * 点击左侧echarts图表右侧echarts图表联动
     */
    areasFlow.on("click", function (params) {
        console.log(params);
        MUTI.leftArea = params.name;
        getAreasFlowData();
    })


    /**
     * 地区流向 ajax 交互
     * 滑动时间轴 两个echarts图表的联动
     * @type {scrollBar}
     */
    var areasFlowTime = new scrollBar({
        dom: document.getElementById('areas-flow-time'),
        height: 12,
        // width: 800,
        position: 'bottom',
        backgroundImage: MUTI.timeDir + 'images/scale-bg.png',
        withTime: true,
        slideStart: 2,
        slideBgImage: MUTI.timeDir + 'images/scroll-icon.png',
        data: ['1', '2'],
        tooltipWidth: 48,
        tooltipHeight: 20,
        tooltipImage: MUTI.timeDir + 'images/tooltip.png'
    });
    // 时间轴 初始化时间段，起始时间函数
    initTimeControl(2)
    areasFlowTime.scrollChange(function(time) {
        MUTI.areasTime = time;
        console.log(time);
        getAreasFlowData();
    })

    /**
     * 地区流向 ajax 交互
     * 鲜苹果
     * 根据 苹果种类 渲染 echarts 表
     */
    $(".areas-flow .fake-ul").on("click", "li", function() {
        getAreasFlowData();
    });


    /**
     * 地区流向 ajax 交互
     * 进口 出口
     * 根据 进口 出口 单选按钮 渲染 echarts 图表
     */
    $(".areas-flow .pub-radio").on('click', "li", function() {
        getAreasFlowData();
    });


})
