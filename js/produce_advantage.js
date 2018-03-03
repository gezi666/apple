$(function () {
    // produce_advantage.js 页面内部的 部分全局变量
    var MUTI = {
        mapDir: '../',
        time: null,
        starDot: '<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:',
        endDot: '"></span>'
    };

    // 规模优势  /*气泡图*/
    var scaleAdvantage = new JusfounD3Charts.scatterChart();
    var scaleAdvantageData = [
        {id: "陕西", value: 9529},
        {id: "甘肃", value: 8938},
        {id: "山东", value: 7480},
        {id: "河北", value: 6221},
        {id: "河南", value: 4999},
        {id: "辽宁", value: 3870},
        {id: "山西", value: 2699},
        {id: "青海", value: 1200},
        {id: "新疆", value: 1447},
        {id: "宁夏", value: 1100},
        {id: "湖北", value: 1210},
        {id: "安徽", value: 899},
        {id: "重庆", value: 714},
        {id: "贵州", value: 618}
    ];

//封装排名的图表

    function rankingEcharts(dom,data) {
        var ranking = echarts.init(document.getElementById(dom));
        var rankingoption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function (params) {
                    if (params[0].value === 0 || isNaN(params[0].value)) {
                        return '暂无数据'
                    } else {
                        return params[0].name + ":" + params[0].value;
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
                extraCssText: 'box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);'
            },
            grid: {
                left: '10',
                top: '10',
                bottom: '20',
                containLabel: true
            },
            yAxis: {
                type: 'category',
                data: data.yAxis,
                boundaryGap: true,
                axisLabel: {
                    textStyle: {
                        fontSize: 16,
                        color: "#82bcff",
                        fontFamily: "微软雅黑"
                    },
                    margin: 10
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#ccc',
                        width: 2,

                    }
                }
            },
            xAxis: {
                type: 'value',
                show: false,
            },
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    textStyle: {
                        color: '#000'
                    }
                }
            },
            series: [
                {
                    name: '',
                    type: 'bar',
                    barWidth: '20%',
                    barGap: '80%',
                    itemStyle: {
                        normal: {
                            barBorderRadius: 20,
                            color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                                offset: 0,
                                color: '#f5e44a'
                            }, {
                                offset: 1,
                                color: '#3fa7dc'
                            }])

                        }
                    },
                    label: {
                        normal: {
                            textStyle: {
                                color: '#82bcff'
                            }
                        }
                    },
                    data: data.rankData
                }
            ]
        };
        ranking.setOption(rankingoption);
    }


    scaleAdvantage.init({
        "domEle": document.getElementById("scale-advantage"),
        "width": 500,
        "height": 400
    });
    scaleAdvantage.setData({
        data: scaleAdvantageData,
        zoom: 0.9,
        shape: "circle" //polygon、circle
    });

    scaleAdvantage.on('click', function (e) {
        console.log(e);
    });

    // 规模优势 －右侧 两个 echarts 图表
    $(".scale-advantage .charts-tab .tab-nav li").on("click", function () {
        var dataArray = {
            yAxis:['山西', '辽宁', '河南', '河北', '山东', '甘肃', '陕西'],
            rankData:[{
                value: '10',
                name: '山西'
            }, {
                value: '20',
                name: '辽宁'
            }, {
                value: '30',
                name: '河南'
            }, {
                value: '40',
                name: '河北'
            }, {
                value: '50',
                name: '山东'
            }, {
                value: '60',
                name: '甘肃'
            }, {
                value: '70',
                name: '陕西'
            }]
        }
        rankingEcharts('rank',dataArray)



        /*var index = $(this).index();
        if (index == '0') {
            // 排名占比
            charts.init({
                id: 956,
                container: "rank",
                option: {
                    yAxis: {
                        data: ['山西', '辽宁', '河南', '河北', '山东', '甘肃', '陕西']
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
                        extraCssText: 'box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);'
                    },
                    series: [{
                        data: [{
                            value: '10',
                            name: '山西'
                        }, {
                            value: '20',
                            name: '辽宁'
                        }, {
                            value: '30',
                            name: '河南'
                        }, {
                            value: '40',
                            name: '河北'
                        }, {
                            value: '50',
                            name: '山东'
                        }, {
                            value: '60',
                            name: '甘肃'
                        }, {
                            value: '70',
                            name: '陕西'
                        }]
                    }]
                }
            });
        } else {
            charts.init({
                id: 963,
                container: "proportion",
                option: {
                    series: [{
                        data: [{
                            value: 10,
                            name: '元帅苹果',
                        }, {
                            value: 5,
                        }, {
                            value: 15,
                            name: '富士苹果',
                        }, {
                            value: 12,
                            name: '富士苹果',
                        }, {
                            value: 32,
                            name: '富士苹果',
                        }, {
                            value: 42,
                            name: '富士苹果',
                        }, {
                            value: 12,
                            name: '富士苹果',
                        }]
                    }]
                }
            });
        }*/
    });
    $(".scale-advantage .charts-tab .tab-nav li:first-child").trigger("click");

    // 规模优势 时间轴控制
    var scaleAdvantageTimeData = ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'];

    var scaleAdvantageBar = new scrollBar({
        dom: document.getElementById('scale-advantage-time'),
        height: 12,
        width: 1100,
        position: 'bottom',
        backgroundImage: MUTI.mapDir + 'images/scale-bg.png',
        slideStart: '2013',
        slideBgImage: MUTI.mapDir + 'images/scroll-icon.png',
        data: scaleAdvantageTimeData,
        tooltipWidth: 48,
        tooltipHeight: 20,
        tooltipImage: MUTI.mapDir + 'images/tooltip.png'
    });
    scaleAdvantageBar.scrollChange(function (e) {
        console.log(e);
    });

    // 效率优势  /*气泡图*/
    var efficiencyAdvantage = new JusfounD3Charts.scatterChart();
    var efficiencyAdvantageData = [
        {id: "陕西", value: 8529},
        {id: "甘肃", value: 8438},
        {id: "山东", value: 7480},
        {id: "河北", value: 6221},
        {id: "河南", value: 4999},
        {id: "辽宁", value: 3870},
        {id: "山西", value: 2699},
        {id: "青海", value: 1200},
        {id: "新疆", value: 1447},
        {id: "宁夏", value: 1100},
        {id: "湖北", value: 1210},
        {id: "安徽", value: 1199},
        {id: "重庆", value: 998},
        {id: "贵州", value: 919}
    ];

    efficiencyAdvantage.init({
        "domEle": document.getElementById("efficiency-advantage"),
        "width": 500,
        "height": 400
    });
    efficiencyAdvantage.setData({
        data: efficiencyAdvantageData,
        zoom: 0.9,
        shape: "circle" //polygon、circle
    });

    efficiencyAdvantage.on('click', function (e) {
        console.log(e);
    });


    // 效率优势 右侧两个 echarts 图表
    $(".efficiency-advantage .charts-tab .tab-nav li").on("click", function () {
        var dataArray = {
            yAxis:['山西', '辽宁', '河南', '河北', '山东', '甘肃', '陕西'],
            rankData:[{
                value: '10',
                name: '山西'
            }, {
                value: '20',
                name: '辽宁'
            }, {
                value: '30',
                name: '河南'
            }, {
                value: '40',
                name: '河北'
            }, {
                value: '50',
                name: '山东'
            }, {
                value: '60',
                name: '甘肃'
            }, {
                value: '70',
                name: '陕西'
            }]
        }
        rankingEcharts('efficiency-rank',dataArray)

        /*var index = $(this).index();
        if (index == '0') {
            // 排名占比
            charts.init({
                id: 956,
                container: "efficiency-rank",
                option: {
                    yAxis: {
                        data: ['山西', '辽宁', '河南', '河北', '山东', '甘肃', '陕西']
                    },
                    //pqk 0908
                    tooltip: {
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
                    series: [{
                        data: [{
                            value: '10',
                            name: '山西'
                        }, {
                            value: '20',
                            name: '辽宁'
                        }, {
                            value: '30',
                            name: '河南'
                        }, {
                            value: '40',
                            name: '河北'
                        }, {
                            value: '50',
                            name: '山东'
                        }, {
                            value: '60',
                            name: '甘肃'
                        }, {
                            value: '70',
                            name: '陕西'
                        }]
                    }]
                }
            });
        } else {
            charts.init({
                id: 963,
                container: "efficiency-proportion",
                option: {
                    series: [{
                        data: [{
                            value: 10,
                            name: '元帅苹果',
                        }, {
                            value: 5,
                        }, {
                            value: 15,
                            name: '富士苹果',
                        }, {
                            value: 12,
                            name: '富士苹果',
                        }, {
                            value: 32,
                            name: '富士苹果',
                        }, {
                            value: 42,
                            name: '富士苹果',
                        }, {
                            value: 12,
                            name: '富士苹果',
                        }]
                    }]
                }
            });
        }*/
    });
    $(".efficiency-advantage .charts-tab .tab-nav li:first-child").trigger("click");

    // 效率优势 时间轴控制
    var efficiencyAdvantageTimeData = ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'];

    var efficiencyAdvantageBar = new scrollBar({
        dom: document.getElementById('efficiency-advantage-time'),
        height: 12,
        width: 1100,
        position: 'bottom',
        backgroundImage: MUTI.mapDir + 'images/scale-bg.png',
        slideStart: '2013',
        slideBgImage: MUTI.mapDir + 'images/scroll-icon.png',
        data: efficiencyAdvantageTimeData,
        tooltipWidth: 48,
        tooltipHeight: 20,
        tooltipImage: MUTI.mapDir + 'images/tooltip.png'
    });
    efficiencyAdvantageBar.scrollChange(function (e) {
        console.log(e);
    });


    // 效益优势 左侧 气泡图
    // 效率优势  /*气泡图*/
    var benefitAdvantage = new JusfounD3Charts.scatterChart();
    var benefitAdvantageData = [
        {id: "陕西", value: 8229},
        {id: "甘肃", value: 8038},
        {id: "山东", value: 7180},
        {id: "河北", value: 6001},
        {id: "河南", value: 4699},
        {id: "辽宁", value: 3470},
        {id: "山西", value: 2619},
        {id: "青海", value: 1120},
        {id: "新疆", value: 1347},
        {id: "宁夏", value: 1100},
        {id: "湖北", value: 1210},
        {id: "安徽", value: 800},
        {id: "重庆", value: 714},
        {id: "贵州", value: 612}
    ];

    benefitAdvantage.init({
        "domEle": document.getElementById("benefit-advantage"),
        "width": 500,
        "height": 400
    });
    benefitAdvantage.setData({
        data: benefitAdvantageData,
        zoom: 0.9,
        shape: "circle" //polygon、circle
    });


    benefitAdvantage.on('click', function (e) {
        console.log(e);
    });

    // 效益优势
    $(".benefit-advantage .charts-tab .tab-nav li").on("click", function () {
        var dataArray = {
            yAxis:['山西', '辽宁', '河南', '河北', '山东', '甘肃', '陕西'],
            rankData:[{
                value: '10',
                name: '山西'
            }, {
                value: '20',
                name: '辽宁'
            }, {
                value: '30',
                name: '河南'
            }, {
                value: '40',
                name: '河北'
            }, {
                value: '50',
                name: '山东'
            }, {
                value: '60',
                name: '甘肃'
            }, {
                value: '70',
                name: '陕西'
            }]
        }
        rankingEcharts('benefit-rank',dataArray)


        /*var index = $(this).index();
        if (index == '0') {
            // 排名占比
            charts.init({
                id: 956,
                container: "benefit-rank",
                option: {
                    yAxis: {
                        data: ['山西', '辽宁', '河南', '河北', '山东', '甘肃', '陕西']
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
                        extraCssText: 'box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);'
                    },
                    series: [{
                        data: [{
                            value: '10',
                            name: '山西'
                        }, {
                            value: '20',
                            name: '辽宁'
                        }, {
                            value: '30',
                            name: '河南'
                        }, {
                            value: '40',
                            name: '河北'
                        }, {
                            value: '50',
                            name: '山东'
                        }, {
                            value: '60',
                            name: '甘肃'
                        }, {
                            value: '70',
                            name: '陕西'
                        }]
                    }]
                }
            });
        } else {
            charts.init({
                id: 963,
                container: "benefit-proportion",
                option: {
                    series: [{
                        data: [{
                            value: 10,
                            name: '元帅苹果',
                        }, {
                            value: 5,
                        }, {
                            value: 15,
                            name: '富士苹果',
                        }, {
                            value: 12,
                            name: '富士苹果',
                        }, {
                            value: 32,
                            name: '富士苹果',
                        }, {
                            value: 42,
                            name: '富士苹果',
                        }, {
                            value: 12,
                            name: '富士苹果',
                        }]
                    }]
                }
            });
        }*/
    });
    $(".benefit-advantage .charts-tab .tab-nav li:first-child").trigger("click");

    // 效益优势 时间轴控制
    var benefitAdvantageTimeData = ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'];

    var benefitAdvantageBar = new scrollBar({
        dom: document.getElementById('benefit-advantage-time'),
        height: 12,
        width: 1100,
        position: 'bottom',
        backgroundImage: MUTI.mapDir + 'images/scale-bg.png',
        slideStart: '2013',
        slideBgImage: MUTI.mapDir + 'images/scroll-icon.png',
        data: benefitAdvantageTimeData,
        tooltipWidth: 48,
        tooltipHeight: 20,
        tooltipImage: MUTI.mapDir + 'images/tooltip.png'
    });
    benefitAdvantageBar.scrollChange(function (e) {
        console.log(e);
    });


    /**
     * ********************************************
     * ***********产区优势历史演变 ajax交互*********
     * ********************************************
     */


    /**
     * 产区优势历史演变
     * 柱状图
     * 柱状图 需要 在点击 相应图标时初始化，不然 获取不到 宽度
     */
    // $(".history-advnatage-tab-nav ").on("click", ".icon-btn", function() {
    //     var index = $(this).index();
    //     if (index === 1) {
    //     }
    // });

    /**
     * 地区多选 交互
     * global apple 页面 的
     */
    ajaxGetDataCall("resources/produceHistorical/region", '', areasCb);

    function areasCb(data) {
        var data = data.data;
        var str = '';
        for (var i = 0; i < data.length; i++) {
            str += '<li class="area-item">' +
                '<label>' +
                '<input type="checkbox">' +
                '<i class="checkbox iconfont"></i>' +
                '<span>' + data[i] + '</span>' +
                '</label>' +
                '</li>';
        }
        $("ul.areas").html(str);
    }


    /**
     * 产区优势历史演变  数据渲染函数
     */
    // 曲线图 数据渲染函数
    /*var historyCurve = echarts.init(document.getElementById('history-curve'));
    historyCurveOption = {
        title: {
            text: ''
        },
        tooltip: {
            trigger: 'axis',
            // formatter: "{b}年: <br />全国果园面积：{c1}万亩 <br> 全国苹果园面积：{c0}万亩",
            textStyle: {
                color: '#fff',
                fontSize: 14
            }
        },
        legend: {
            data: ['', '', '', '', ''],
            right: 30,
            textStyle: { color: "#82bcff" }
        },

        grid: {
            left: '15',
            right: '50',
            bottom: '30',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            axisLine: {
                lineStyle: {
                    color: '#3fa7dc'
                }
            },
            splitLine: { show: false },
            boundaryGap: false,
            triggerEvent: true,
            data: ['', '', '', '', '']
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#3fa7dc'
                },

            },
            splitLine: { show: false },
            name: '种植面积 (公顷)'
        },
        color: ['#bbbf43', '#05aef4', '#ffa626'],
        series: [{
            name: '',
            smooth: true,
            type: 'line',
            data: []
        }, {
            name: '',
            type: 'line',
            smooth: true,
            data: []
        }, {
            name: '',
            type: 'line',
            smooth: true,
            data: []
        }, {
            name: '',
            type: 'line',
            smooth: true,
            data: []
        }, {
            name: '',
            type: 'line',
            smooth: true,
            data: []
        }, {
            name: '指数1',
            type: 'line',
            symbolSize: 0,
            data: [1],
            lineStyle: {
                normal: {
                    type: "dashed"
                }
            },
            markLine: {
                data: [{
                    yAxis: 1,
                    name: '预警值',
                }, ]
            }
        }],
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
        }]
    };
    historyCurve.setOption(historyCurveOption);*/

    function curveCb(data, historyObj) {
        var forxAxis = [];
        MUTI.time.forEach(function (v) {
            forxAxis.push(v + "年");
        });
        $("#history-curve").css("width", $("#history-curve").width());

        // 处理只有一条数据时，以数组形式返回
        if (!(data.data instanceof Array)) {
            var data = [data.data];
        } else {
            var data = data.data;
        }
        var legend = [];
        data.forEach(function (v, i) {
            legend.push(v.name);
        });

        // 获取最小值
        var minArr = []
        data.forEach(function (v, i) {
            var item = v.data;
            minArr = minArr.concat(item)
        })

        var newMinArr = []
        minArr.forEach(function (v, i) {
            if (!isNaN(parseInt(v))) {
                newMinArr.push(v);
            }
        })
        var minNum = getMin(Math.min.apply(null, newMinArr))

        // console.log(minNum)

        // 产区优势历史演变 曲线图
        var historyCurve = charts.init({
            id: 1039,
            container: historyObj.curveEchartDom,
            option: {
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
                    formatter: function (params) {
                        var str = '';
                        params.forEach(function (v, i) {
                            if (v.seriesName === '指数1') {
                                return;
                            }
                            str += MUTI.starDot + v.color + MUTI.endDot + v.seriesName + "： " + v.value + '<br>';
                        });
                        return str;
                    }
                },
                xAxis: {
                    data: forxAxis
                },
                yAxis: {
                    name: '指数',
                    min: minNum
                },
                legend: {
                    data: legend,
                    right: '0'
                },
                series: data
            }
        });
    }

    // 柱状图 数据渲染函数
    function pillarCb(data, historyObj) {
        var forxAxis = [];
        MUTI.time.forEach(function (v) {
            forxAxis.push(v + "年");
        });
        $("#history-pillar").css("width", $("#history-curve").width());

        // 处理只有一条数据时，以数组形式返回
        if (!(data.data instanceof Array)) {
            var data = [data.data];
        } else {
            var data = data.data;
        }
        var legend = [];
        data.forEach(function (v, i) {
            legend.push(v.name);
        });
        var historyPillar = charts.init({
            id: 1001,
            container: historyObj.pillarEchartDom,
            option: {
                tooltip: {
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
                xAxis: {
                    data: forxAxis
                },
                yAxis: {
                    name: ''
                },
                legend: {
                    data: legend,
                    x: 'right'
                },
                series: data
            }
        });
    }

    // 将 echarts 图表渲染 与 table 表格渲染函数 封装进入 getData 函数
    function getData(historyObj) {
        ajaxGetDataCall("resources/spatialDistribution/years", 'LIMIT=' + historyObj.year, function (data) {
            MUTI.time = data.data.reverse();
            var cbTimeData = MUTI.time.join(",");
            /**
             * 历史演变处 ajax交互
             * 第一次打开页面时的初始化
             * 图表 与 table 表格
             */
            ajaxGetDataCall("resources/produceHistorical/" + historyObj.danwei, "AREA_ID=" + historyObj.areas + "&TIME_ID=" + cbTimeData, function (data) {
                // 渲染曲线图函数
                curveCb(data, historyObj);
                // 渲染柱状图函数
                pillarCb(data, historyObj);
            });
        });
    }

    /**
     * 第一次初始化时获取数据
     */
    var historyObj = {
        year: 10,
        areas: '山西省,山东省',
        danwei: 'scaleZline',
        curveEchartDom: 'history-curve',
        pillarEchartDom: 'history-pillar',
    };
    getData(historyObj);

    /**
     * 历史演变处 ajax 交互
     * 地区
     * 根据所选 地区 动态获取数据 渲染 echarts 图表 和 table 表格
     */
    $(".history-advantage .yes").on("click", function () {
        // 获取 选择的地区数据
        var areas = [],
            danwei = '';
        var target = $(this).parents(".pop-areas").find(".area-item");
        target.each(function () {
            var flag = $(this).find("input").is(":checked");
            if (flag) {
                areas.push($(this).find("span").text());
            }
        });
        if (areas.length > 5) {
            return;
        }
        var forAjaxAreas = areas.join(",");


        // 获取 规模优势 效率优势 效益优势
        $(".history-advantage .pub-radio li").each(function () {
            var flag = $(this).is(".active");
            if (flag) {
                danwei = $(this).text();
            }
        });

        var newDanwei = '';
        switch (danwei) {
            case '规模优势':
                newDanwei = 'scaleZline';
                break;
            case '效率优势':
                newDanwei = 'efficientZline';
                break;
            case '效益优势':
                newDanwei = 'benefitZline';
                break;
            default:
        }

        var newHistoryObj = {
            year: 10,
            areas: forAjaxAreas,
            danwei: newDanwei,
            curveEchartDom: 'history-curve',
            pillarEchartDom: 'history-pillar',
        };


        getData(newHistoryObj);
    });


    /**
     * 历史演变处 ajax 交互
     * 规模优势 效率优势 效益优势
     * 根据 规模优势 效率优势 效益优势  渲染 echarts 图表 和 table 表格
     */
    $(".history-advantage .pub-radio li").on('click', function () {
        // 获取 规模优势 效率优势 效益优势
        var text = $(this).text();
        var newDanwei = '';
        switch (text) {
            case '规模优势':
                newDanwei = 'scaleZline';
                break;
            case '效率优势':
                newDanwei = 'efficientZline';
                break;
            case '效益优势':
                newDanwei = 'benefitZline';
                break;
            default:
        }

        // 获取 已勾选的地区
        var areas = [];
        $(".history-advantage .locations").find("span").each(function (i, item) {
            areas.push($(item).text());
        });

        // 动态参数 拼接完成
        var newHistoryObj = {
            year: 10,
            areas: areas.join(','),
            danwei: newDanwei,
            curveEchartDom: 'history-curve',
            pillarEchartDom: 'history-pillar',
        };
        getData(newHistoryObj);
    });

    $("#page1").myPagination({
        currPage: 1,
        pageCount: 100,
        pageSize: 5,
        cssStyle: 'page_diy',
        info: {
            first: '首页',
            first_on: true,
            last: '尾页',
            last_on: true,
            prev: '上一页',
            prev_on: true,
            next: '下一页',
            next_on: true,
            msg_on: false, //为false 可以关闭 跳转栏
            link: 'javascript:void(0);',
            msg: "<span>&nbsp;&nbsp;&nbsp;跳到{curr}/{sum}页</span>"
        }
    });


});
