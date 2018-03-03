$(function() {
    // true_index 页面所需公共变量
    var MUTI = {
        timeDir: './../',
        mapJson: './../Lib/data/json/',
        starDot: '<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:',
        endDot: '"></span>',
        notnum: 0,
        slideCurrentTime: null,  // MUTI.spaceTimeData[MUTI.spaceTimeData.length - 1]
        valueArea: '万亩',  // 种植面积
        yield: '万吨',     // 产量
        danchan: '公斤/亩' // 单产
    };

    var echartOpt = {
        fz: '10',
        color: '#fff'
    };


    // 单位切换功能
    new PubSelRadio({
        par: $(".switch-menu"),
        son: ".switch-item"
    }).selRadio();

    /**
     * 公共函数
     * 获取单位
     * @param  {object} dom 作用范围
     * @return {string}     '种植面积', '产量'
     */
    function getSwitch(dom) {
        var danwei = $(dom + " .switch-menu .switch-item.active").text();
        // $(dom + " .switch-menu .switch-item").each(function() {
        //     var flag = $(this).is(".active");
        //     if (flag) {
        //         danwei = $(this).text();
        //     }
        // });
        return danwei;
    }

    /**
     * 中国地图
     * 两者 的 单位
     * @return {[type]}        [description]
     */
    function getUnite(params) {
        var unite = '';
        switch (params) {
            case '种植面积':
                unite = MUTI.valueArea;
                break;
            case '苹果产量':
                unite = MUTI.yield;
                break;
            default:
                unite = MUTI.valueArea;
        }
        return unite;
    }

    // 图例颜色
    function getColor(params) {
        var areaColor = [];
        switch (params) {
            case '种植面积':
                areaColor = ['#FBFBFF', '#DDDDFF', '#B9B9FF', '#9393FF', '#6A6AFF', '#8600FF'];
                break;
            case '产量':
                areaColor = ['#FBFBFF', '#F5FFE8', '#CEFFCE', '#79FF79', '#28FF28', '#00DB00']
                break;
            default:
                areaColor = ['#FBFBFF', '#DDDDFF', '#B9B9FF', '#9393FF', '#6A6AFF', '#8600FF'];
        }
        return areaColor;
    }

    // 地图描述
    function initMapDesc(data) {
        var common = {
            status: getSwitch(".lt"),
            time: MUTI.currentTime || MUTI.slideCurrentTime
        };
        // var data = data.data;

        // 万吨 万亩 单位
        switch (common.status) {
            case '种植面积':
                common.unites = MUTI.valueArea;
                break;
            case '苹果产量':
                common.unites = MUTI.yield;
                break;
            default:
                common.unites = MUTI.valueArea;
        }
        // 地区, 如果 没有地区，那么 就取前一次 存起来的 地区
        common.region = "全国";

        if (data.value) {
            if (common.status === '种植面积') {
                common.value = parseInt(data.valueArea).toFixed(0);
            } else {
                common.value = parseInt(data.value).toFixed(0);
            }
        } else {
            common.value = MUTI.notnum;
        }

        if (data.valueArea) {
            if (common.status === '种植面积') {
                common.value = parseInt(data.valueArea).toFixed(0);
            } else {
                common.value = parseInt(data.value).toFixed(0);
            }
        } else {
            common.value = MUTI.notnum;
        }

        $(".map-year").text(common.time);
        $(".map-region").text(common.region);
        $(".map-status").text(common.status);
        $(".map-data").text(common.value);
        $(".map-unites").text(common.unites);
    }

    /**
     * ********************************************
     * ***********左侧 最上的 左边的*********
     * ********************************************
     */
    var myChart_map = echarts.init(document.getElementById('crop-left'));
    var myChart_map_option = {
        title: {},
        tooltip: {
            trigger: 'item'
        },
        series: [
            {
                name: '',
                type: 'map',
                mapType: 'china',
                roam: true,
                zoom: 1,
                scaleLimit: {
                    min:0.5,
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
                        return params.data.name + '<br/>种植面积：' + parseFloat(params.data.value || 0).toFixed(0).fontsize(5).fontcolor('#FAB407') + MUTI.valueArea +
                            '<br/>排名：' + (!!params.data.valueAreapm?params.data.valueAreapm:0) +
                            '<br/>占比：' + (((!!params.data.value?params.data.value:0)/3006)*100).toFixed(2) + '%';
                    }
                },
                data:[
                    {name: '陕西',value: 1057,valueAreapm: 1, itemStyle: {
                        normal: {areaColor: '#8600FF'}
                        }
                    },
                    {name: '山东',value: 452,valueAreapm: 2, itemStyle: {
                        normal: {areaColor: '#6A6AFF'}
                        }
                    },
                    {name: '甘肃',value: 441,valueAreapm: 3, itemStyle: {
                        normal: {areaColor: '#9393FF'}
                        }
                    },
                    {name: '河北',value: 363,valueAreapm: 4, itemStyle: {
                        normal: {areaColor: '#B9B9FF'}
                        }
                    },
                    {name: '河南',value: 235,valueAreapm: 5, itemStyle: {
                        normal: {areaColor: '#DDDDFF'}
                        }
                    },
                    {name: '辽宁',value: 233,valueAreapm: 6, itemStyle: {
                        normal: {areaColor: '#FBFBFF'}
                        }
                    },
                    {name: '山西',value: 225,valueAreapm: 7, itemStyle: {
                        normal: {areaColor: '#fffbff'}
                        }
                    }
                ]
            }
        ]
    };
    myChart_map.setOption(myChart_map_option);


    /*var chart = new JusfounD3Charts.mapSelect();
    chart.init({
        dom: $("#crop-left")[0],
        cityData: cityMap,
        showVisualMap: false,
        VisualMapItemHeight: 40,
        VisualMapItemWidth: 20,
        VisualMapTextMargin: 10,
        VisualMapText: getUnite(getSwitch('.lt')),
        areaColor: ['#FBFBFF', '#DDDDFF', '#B9B9FF', '#9393FF', '#6A6AFF', '#8600FF'],
        jsonUrl: MUTI.mapJson, //json 路径
        nameMap: nameMap,
        tooltipFormatter: function (d) {
            console.log(d)
            if (!d.data) return;
            var flag = d.data.labelShow;
            if (flag == 1) {
                var str = '';
                str = d.data.name + '<br/>种植面积：' + parseFloat(d.data.value || 0).toFixed(0).fontsize(5).fontcolor('#FAB407') + MUTI.valueArea +
                                    '<br/>排名：' + d.data.valueAreapm +
                                    '<br/>占比：' + (d.data.valueAreazb*100).toFixed(2) + '%';
                return str;
            }
            if (flag == 2) {
                var str = '';
                str = d.data.name + '<br/>产量' + parseFloat(d.data.value || 0).toFixed(0).fontsize(5).fontcolor('#FAB407') + MUTI.yield +
                                    '<br/>排名：' + d.data.valuepm +
                                    '<br/>占比：' + (d.data.valuezb*100).toFixed(2) + '%';
                return str;
            }
        }
    });*/

    //pqk 0907 原方法需要请求数据，修改为mock数据
    /*$.get('../Lib/data/json/mock.json', function (data) {
        MUTI.spaceTimeData = data.date.reverse();
        // 初始化 时间轴 起始时间
        MUTI.slideCurrentTime = MUTI.spaceTimeData[MUTI.spaceTimeData.length - 1];
        // 地图标题描述
        initMapDesc(data.data.currentAreaData[0]);
        // 处理只有一条数据时，以数组形式返回
        if (!(data.data.areasData instanceof Array)) {
            var data2 = [data.data.areasData];
        } else {
            var data2 = data.data.areasData;
        }
        console.log(data2)
        chart.render('china');
        chart.setData({
            data: data2,
            labelShow: 1,
            areaColor: getColor(getSwitch('.lt')),
            VisualMapText: getUnite(getSwitch('.lt')),
            delayTime: 0
        });
    })*/



    /*ajaxGetDataCall("resources/spatialDistribution/years2", '', spaceTimeCb);
    function spaceTimeCb(data) {
        MUTI.spaceTimeData = data.data.reverse();
        // 初始化 时间轴 起始时间
        MUTI.slideCurrentTime = MUTI.spaceTimeData[MUTI.spaceTimeData.length - 1];
        // 打开页面第一次初始化地图
        ajaxGetDataCall("resources/spatialDistribution/spatial2", 'TIME_ID=' + MUTI.slideCurrentTime + "&AREANAME=" + encodeURI('全国'), spaceAreaCb);
        function spaceAreaCb(data) {
            console.log(data)

            // 地图标题描述
            initMapDesc(data.data.currentAreaData[0]);
            // 处理只有一条数据时，以数组形式返回
            if (!(data.data.areasData instanceof Array)) {
                var data = [data.data.areasData];
            } else {
                var data = data.data.areasData;
            }
            // index = $(".space-distributed .pub-radio li.active").index() + 1;
            chart.render('china');
            chart.setData({
                data: data,
                labelShow: 1,
                areaColor: getColor(getSwitch('.lt')),
                VisualMapText: getUnite(getSwitch('.lt')),
                delayTime: 0
            });
        }
    }*/

    // 种植面积 产量 切换
    $(".lt .switch-menu").on("click", ".switch-item", function() {
        var index = $(this).index() + 1;
        if (!MUTI.areaname) {
            MUTI.areaname = '全国';
        } else if (MUTI.areaname === '中国') {
            MUTI.areaname = '全国';
        }
        if (!MUTI.currentTime) {
            MUTI.currentTime = MUTI.slideCurrentTime;
        }

        ajaxGetDataCall("resources/spatialDistribution/spatial2", 'TIME_ID=' + MUTI.currentTime + "&AREANAME=" + encodeURI(MUTI.areaname), function(data) {
            // 地图标题描述
            initMapDesc(data.data.currentAreaData[0]);

            // 处理只有一条数据时，以数组形式返回
            if (!(data.data.areasData instanceof Array)) {
                var data = [data.data.areasData];
            } else {
                var data = data.data.areasData;
            }
            // index = $(".space-distributed .pub-radio li.active").index() + 1;
            chart.render('china');
            chart.setData({
                data: data,
                labelShow: index,
                areaColor: getColor(getSwitch('.lt')),
                VisualMapText: getUnite(getSwitch('.lt')),
                delayTime: 100
            });
        });
    });

    /**
     * ********************************************
     * ***********左侧 最上的 右边的*********
     * ********************************************
     */
    var cropRight = echarts.init(document.getElementById('crop-right'));

    function initcropRight(data, obj) {
        var cropRightOption = {
            // backgroundColor: '#1B2971',
            grid: {
                left: 10,
                right: '25%',
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
                },
                axisLabel: {
                    textStyle: {
                        fontSize:  echartOpt.fz,
                        color: echartOpt.color
                    }
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
                        formatter: "{c}",
                        textStyle: {
                            fontSize:  echartOpt.fz,
                            color: echartOpt.color
                        }
                    }
                },
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                barWidth: 'auto',
                barMaxWidth: '4',
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
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            }]
        }
        $.extend(true, cropRightOption, newOption);
        cropRight.setOption(cropRightOption, true);
    }
    initcropRight();


    /**
     * ********************************************
     * ***********左侧 中间的 *********
     * ********************************************
     */
    var affectAnalyse = echarts.init(document.getElementById('affect-analyse'));

    function initAffectAnalyse(data, obj) {
        var affectAnalyseOption = {
            // backgroundColor: '#1b237e',
            grid: {
                right: '5%',
                left: '10%',
                bottom: '20%',
                //pqk 0906 原值为15%
                top: '18%'
            },
            tooltip: {
                trigger: 'axis',
                // axisPointer: {
                //     type: 'shadow',
                //     shadowStyle: {
                //         color: 'rgba(0,46, 115, 0.3)'
                //     }
                // },
                axisPointer: {
                    type: 'none',
                    shadowStyle: {
                        color: 'rgba(0,46, 115, 0.3)'
                    }
                },
                formatter: function(params) {
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
                show: false,
                data: ['A'],
                right: '0',
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
            xAxis: [{
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
                data: ['低温', "干旱", "连阴雨", '低温', "干旱", "连阴雨", '低温', "干旱", "连阴雨"],
            },{
                show: false,
                name: 'fuzhu',
                boundaryGap: false,
                data: ['低温', "干旱", "连阴雨", '低温', "干旱", "连阴雨", '低温', "干旱", "连阴雨", 'oth月']
            }],
            yAxis: [{
                type: 'value',
                name: '指数',
                min: 'dataMin',
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: ['#2f46a1']
                    }
                },
                axisTick: {
                    show: false
                },
                nameTextStyle: {
                    fontSize: echartOpt.fz,
                    color: echartOpt.color
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
                name: 'A',
                type: 'bar',
                barWidth: 'auto',
                barMaxWidth: 7,
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
                data: [],
                zlevel: 9
            },{
                xAxisIndex: 1,
                // show: false,
                name: '辅助',
                type: 'line',
                data: [],
                markArea: {
                    silent: true,
                    data: [
                        [{
                            name: '开花幼期 4-5月',
                            coord: [0],
                            label: {
                                normal: {
                                    //pqk 0906
                                    // offset: [0, -10],
                                    offset: [0, 0],
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
                            coord: [3]
                        }],
                        [{
                            name: '果实膨胀期 6-8月',
                            coord: [3],
                            label: {
                                normal: {
                                    offset: [0, 0],
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
                            coord: [6]
                        }],
                        [{
                            name: '果实成熟期 9-10月',
                            coord: [6],
                            label: {
                                normal: {
                                    offset: [0, 0],
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
                            coord: [9]
                        }]
                    ]
                },
            }]
        };
        var newOption = {
            series: [{
                name: 'A',
                type: 'bar',
                data: [1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.2, 2.4],
            }]
        }
        $.extend(true, affectAnalyseOption, newOption);
        affectAnalyse.setOption(affectAnalyseOption, true);
    }
    initAffectAnalyse();


    /**
     * ********************************************
     * ***********左侧 下面的 *********
     * ********************************************
     */
    var profit = echarts.init(document.getElementById('profit'));

    function initProfit(data, obj) {
        var profitOption = {
            /*grid: {
                right: '10%',
                left: '10%',
                bottom: '10%',
                top: '25%'
            },*/
            //pqk 0906
            grid: {
                right: '11%',
                left: '10%',
                bottom: '13%',
                top: '18%'
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
                data: ['单产值', '单位利润', '投入产出比'],
                //pqk 0906 right: '0', top: '0'
                left: 'center',
                top: '5%',
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
                data: ['2007', "2008", "2009", "2010", "2011"]
            },
            yAxis: [{
                type: 'value',
                name: '(元/50公斤)',
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: ['#2f46a1']
                    }
                },
                axisTick: {
                    show: false
                },
                nameTextStyle: {
                    fontSize: echartOpt.fz,
                    color: echartOpt.color
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
                name: '(元/50公斤)',
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: ['#2f46a1']
                    }
                },
                axisTick: {
                    show: false
                },
                nameTextStyle: {
                    fontSize: echartOpt.fz,
                    color: echartOpt.color
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
                name: '单产值',
                type: 'bar',
                barWidth: 'auto',
                barMaxWidth: 10,
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
                name: '单位利润',
                type: 'bar',
                barWidth: 'auto',
                barMaxWidth: 10,
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
                name: '投入产出比',
                type: 'line',
                yAxisIndex: 1,
                symbolSize: 0,
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

        var newOption = {
            xAxis: {
                data: ['2007', "2008", "2009", "2010", "2011"]
            },
            series: [{
                name: '单产值',
                data: [200, 300, 100, 330, 350],
            }, {
                name: '单位利润',
                data: [500, 100, 400, 300, 600],
            }, {
                name: '投入产出比',
                data: [500, 100, 400, 300, 900],
            }]
        }
        $.extend(true, profitOption, newOption);
        profit.setOption(profitOption, true);
    }
    initProfit();



    /**
     * ********************************************
     * ***********右侧 右上角 *********
     * ********************************************
     */
    var forecast = echarts.init(document.getElementById('forecast'));

    function initForecast(data, obj) {
        var forecastOption = {
            /*grid: {
                right: '5%',
                left: '10%',
                bottom: '10%',
                top: '15%'
            },*/
            grid: {
                right: '5%',
                left: '10%',
                bottom: '13%',
                top: '18%'
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
                        color: echartOpt.color,
                        fontSize: echartOpt.fz
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
                nameTextStyle: {
                    fontSize: echartOpt.fz,
                    color: echartOpt.color
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
                barMaxWidth: 7,
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
                barMaxWidth: 7,
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

        var newOption = {
            xAxis: {
                data: ['2007', "2008", "2009", "2010", "2011"],
            },
            series: [{
                name: '出口总额',
                data: [200, 300, 100, 330, 350],
            }, {
                name: '进口总额',
                data: [500, 100, 400, 300, 600],
            }]
        }
        $.extend(true, forecastOption, newOption);
        forecast.setOption(forecastOption, true);
    }
    initForecast();


    /**
     * ********************************************
     * ***********右侧 中间的 *********
     * ********************************************
     */
    // var flexibility = echarts.init(document.getElementById('flexibility'));

    // function initFlexibility(data, obj) {
    //     var flexibilityOption = {
    //         grid: {
    //             right: '5%',
    //             left: '10%',
    //             bottom: '10%',
    //             top: '15%'
    //         },
    //         tooltip: {
    //             trigger: 'axis',
    //             axisPointer: {
    //                 type: 'shadow',
    //                 shadowStyle: {
    //                     color: 'rgba(0,46, 115, 0.3)'
    //                 }
    //             },
    //             formatter: function(params) {
    //                 var str = '';
    //                 params.forEach(function(v, i) {
    //                     str += '苹果出口量对国内' + '<br>' + '生产总值的弹性： ' + params[0].data;
    //                 });
    //                 return str
    //             },
    //             textStyle: {
    //                 align: 'left',
    //                 color: '#5cc1ff',
    //                 fontSize: '16'
    //             },
    //             backgroundColor: 'rgba(15, 52, 135, 0.5)',
    //             borderWidth: '1',
    //             borderColor: '#5cc1ff',
    //             extraCssText: 'box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);'
    //         },
    //         legend: {
    //             show: false,
    //             data: ['弹性系数'],
    //             right: '60',
    //             top: '35',
    //             textStyle: {
    //                 color: echartOpt.color,
    //                 fontSize: echartOpt.fz
    //             },
    //             itemGap: 20,
    //             itemHeight: 15,
    //             itemWidth: 15
    //         },
    //         calculable: true,
    //         xAxis: {
    //             type: 'category',
    //             axisLine: {
    //                 lineStyle: {
    //                     fontSize: echartOpt.fz,
    //                     color: echartOpt.color
    //                 }
    //             },
    //             axisTick: {
    //                 show: false,
    //                 interval: 0,
    //                 alignWithLabel: true
    //             },
    //             axisLabel: {
    //                 interval: 0,
    //                 rotate: '0',
    //                 textStyle: {
    //                     fontSize: echartOpt.fz,
    //                     color: echartOpt.color
    //                 }
    //             },
    //             splitLine: {
    //                 show: true,
    //                 lineStyle: {
    //                     color: ['#2f46a1']
    //                 }
    //             },
    //             data: ['城乡居民收入', "柑橘的价格", "梨的价格", "凤梨的价格", "苹果的价格"],
    //         },
    //         yAxis: {
    //             type: 'value',
    //             name: '弹性系数',
    //             splitLine: {
    //                 show: false,
    //                 lineStyle: {
    //                     color: ['#2f46a1']
    //                 }
    //             },
    //             axisTick: {
    //                 show: false
    //             },
    //             axisLabel: {
    //                 show: true,
    //                 textStyle: {
    //                     fontSize: echartOpt.fz,
    //                     color: echartOpt.color
    //                 }
    //             },
    //             nameTextStyle: {
    //                 fontSize: echartOpt.fz,
    //                 color: echartOpt.color
    //             },
    //             axisLine: {
    //                 lineStyle: {
    //                     color: echartOpt.color,
    //                     fontSize: echartOpt.fz
    //                 }
    //             }
    //         },
    //         series: [{
    //             name: '弹性系数',
    //             type: 'bar',
    //             barMaxWidth: 17,
    //             itemStyle: {
    //                 normal: {
    //                     color: function(d) {
    //                         if (d.data > 0) {
    //                             return new echarts.graphic.LinearGradient(
    //                                 0, 0, 0, 1, [{
    //                                     offset: 0,
    //                                     color: '#00b8fe'
    //                                 }, {
    //                                     offset: 1,
    //                                     color: '#1846a3'
    //                                 }]
    //                             )
    //                         } else {
    //                             return new echarts.graphic.LinearGradient(
    //                                 0, 0, 0, 1, [{
    //                                     offset: 0,
    //                                     color: '#d0bf44'
    //                                 }, {
    //                                     offset: 1,
    //                                     color: '#d0bc44'
    //                                 }]
    //                             )
    //                         }
    //                     },
    //                     opacity: 0.6,
    //                     barBorderRadius: 10,
    //                 },
    //                 emphasis: {
    //                     opacity: 1
    //                 }
    //             },
    //             data: [200, 300, 100, 330, 350],
    //             zlevel: 9
    //         }]
    //     };

    //     var newOption = {
    //         xAxis: {
    //             data: ['城乡居民收入', "柑橘的价格", "梨的价格", "凤梨的价格", "苹果的价格"],
    //         },
    //         series: [{
    //             name: '弹性系数',
    //             data: [200, 300, 100, 330, 350],
    //         }]
    //     }
    //     $.extend(true, flexibilityOption, newOption);
    //     flexibility.setOption(flexibilityOption, true);
    // }
    // initFlexibility();

    /**
     * ********************************************
     * *********** 新增 echarts 图标 *********
     * *********** 贸易价格 影响因素 *********
     * ********************************************
     */

    var tradeInfluence = echarts.init(document.getElementById('flexibility'));
    function initTradeInfluence(data) {
        var tradeInfluenceOption = {
            // backgroundColor: '#1b237e',
            grid: {
                right: '1%',
                left: '1%',
                bottom: '10%',
                //pqk 0906
                // top: '15%',
                top: '18%',
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
                barMaxWidth: 10,
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
                barMaxWidth: 10,
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
                barMaxWidth: 10,
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
                barMaxWidth: 10,
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
                        str += v.seriesName + ': ' + v.value + '<br>'
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


    /**
     * ********************************************
     * ***********右侧 下面的 *********
     * ********* 地图函数 放到 上面了已经 *******
     * ********************************************
     */
    // 假数据
    var resData = [{
        "data": [
            [{
                "name": "北京市"
            }, {
                "name": "山东省",
                "value": 60.25
            }],
            [{
                "name": "北京市"
            }, {
                "name": "陕西省",
                "value": 17.67
            }],
            [{
                "name": "北京市"
            }, {
                "name": "山西省",
                "value": 8.66
            }],
            [{
                "name": "北京市"
            }, {
                "name": "甘肃省",
                "value": 5.98
            }],
            [{
                "name": "北京市"
            }, {
                "name": "辽宁省",
                "value": 3.99
            }],
            [{
                "name": "北京市"
            }, {
                "name": "河北省",
                "value": 2.73
            }],
            [{
                "name": "北京市"
            }, {
                "name": "北京市",
                "value": 0.73
            }]
        ],
        "name": "北京市"
    }, {
        "data": [
            [{
                "name": "山东省"
            }, {
                "name": "河北省",
                "value": 60.25
            }],
            [{
                "name": "山东省"
            }, {
                "name": "重庆市",
                "value": 10
            }]
        ],
        "name": "山东省"
    }]

    // 辅助函数
    var convertData = function(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            var fromCoord = geoCoordMap[dataItem[0].name];
            var toCoord = geoCoordMap[dataItem[1].name];
            if (fromCoord && toCoord) {
                res.push({
                    fromName: dataItem[0].name,
                    toName: dataItem[1].name,
                    coords: [fromCoord, toCoord],
                    value: dataItem[1].value
                });
            }
        }
        return res;
    };
    // 辅助函数
    function handleResData(resData) {
        var color = ['#a6c84c', '#ffa022'];
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
                        width: 0,
                        curveness: 0.2
                    }
                },
                data: convertData(item.data)
            }, { //移动 点
                name: item.name,
                type: 'lines',
                zlevel: 2,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0,
                    //symbol: planePath,
                    symbolSize: 5
                },
                lineStyle: {
                    normal: {
                        color: color[i],
                        width: 1,
                        opacity: 0.4,
                        curveness: 0.2
                    }
                },
                data: convertData(item.data)
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
                    scale: 3
                },
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        formatter: '{b}'
                    }
                },
                symbolSize: 2,
                itemStyle: {
                    normal: {
                        color: color[i]
                    }
                },
                data: item.data.map(function(dataItem) {
                    return {
                        name: dataItem[1].name,
                        value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                    };
                })
            });
        });
        return series
    }

    var market = echarts.init(document.getElementById('market'));

    function initMarket(data, obj) {
        var marketOption = {
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    if (params.seriesType == 'effectScatter') {
                        return params.name + '>' + params.seriesName + '<br>' + '交易量:<b style="color:#ffa600;font-weight:blod;font-size:18px;">' + params.data.value[2] + '</b>吨';
                    }
                }
            },
            legend: {
                orient: 'vertical',
                top: 'bottom',
                left: 'right',
                data: ['北京', '山东'],
                textStyle: {
                    color: '#fff'
                },
            },
            geo: {
                map: 'china',
                zoom: 1.25,
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
                    },
                    emphasis: {
                        areaColor: '#3952ca'
                    }
                }
            },
            color: ['gold', 'aqua', 'lime'],
            visualMap: {
                type: 'continuous',
                min: 0,
                max: 100,
                itemWidth: 10,
                itemHeight: '90%',
                left: 0,
                bottom: 0,
                textGap: 0,
                padding: 0,
                text: ['交易量：吨'],
                textGap: 40,
                calculable: true,
                color: ['#ff3333', 'orange', 'yellow', 'lime', 'aqua'],
                textStyle: {
                    color: '#0e9cf1',
                    fontSize: 12,
                    align: 'bottom'
                }
            },
            series: handleResData(resData)
        };
        // 填充样式 与数据
        market.setOption(marketOption, true);
    }
    initMarket();


    /**
     * ********************************************
     * ***********中间部份 下面 左侧的 *********
     * ********************************************
     */
    var importQuantity = echarts.init(document.getElementById('import-quantity'));
    function initImport(data, obj) {
        var importOption = {
            // backgroundColor: '#1b237e',
            /*grid: {
             left: '10%',
             right: '10%',
             bottom: '10%',
             top: "15%",
             // containLabel: true
             },*/
            //pqk 0906
            grid: {
                right: '0',
                left: '10%',
                bottom: '13%',
                top: '18%'
            },
            xAxis: {
                data: ['山东', '陜西', '河南', '河北', '甘肃', '新疆', '2016'],
                axisLine: {
                    lineStyle: {
                        fontSize: echartOpt.fz,
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
                name: '万美元',
                axisLabel: {
                    show: true,
                    textStyle: {
                        fontSize: echartOpt.fz,
                        color: echartOpt.color
                    }
                },
                nameTextStyle: {
                    fontSize: echartOpt.fz,
                    color: echartOpt.color
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
                        textStyle:{
                            fontSize: echartOpt.fz,
                            color: echartOpt.color
                        }
                    }
                },
                // symbol: 'path://M0,10 L10,10 L5,0 L0,10 z',
                symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
                color: '#fff',
                itemStyle: {
                    normal: {
                        color: '#0748A2',
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
        var newOption = {
            xAxis: {
                data: ['山东', '陜西', '河南', '河北', '甘肃', '新疆', '2016'],
            },
            series: [{
                name: '地区比较',
                data: [150, 160, 115, 170, 187, 188, 90],
            }]
        }
        $.extend(true, importOption, newOption);
        importQuantity.setOption(importOption, true);
    }
    initImport();


    /**
     * ********************************************
     * ***********中间部份 下面 右侧的 *********
     * ********************************************
     */
    var exportQuantity = echarts.init(document.getElementById('export-quantity'));
    function initExport(data, obj) {
        var exportOption = {
            // backgroundColor: '#1b237e',
            /*grid: {
                left: '10%',
                right: '10%',
                bottom: '10%',
                top: "15%",
                // containLabel: true
            },*/
            //pqk 0906
            grid: {
                right: '0',
                left: '10%',
                bottom: '13%',
                top: '18%'
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
                name: '万美元',
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
                nameTextStyle: {
                    fontSize: echartOpt.fz,
                    color: echartOpt.color
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
                        textStyle:{
                            fontSize: echartOpt.fz,
                            color: echartOpt.color
                        }
                    }
                },
                // symbol: 'path://M0,10 L10,10 L5,0 L0,10 z',
                symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
                itemStyle: {
                    normal: {
                        // color: new echarts.graphic.LinearGradient(0,0, 1, 0, [{
                        //         offset: 0,
                        //         color: 'rgba(255, 82, 22, 0.4)'
                        //     }, {
                        //         offset: 1,
                        //         color: 'rgb(255, 152, 52)'
                        //     }]),
                        color: '#AEA438',
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
        var newOption = {
            xAxis: {
                data: ['山东', '陜西', '河南', '河北', '甘肃', '新疆', '2016'],
            },
            series: [{
                name: '地区比较',
                data: [150, 160, 115, 170, 187, 188, 90],
            }]
        }
        $.extend(true, exportOption, newOption);
        exportQuantity.setOption(exportOption, true);
    }
    initExport();



    /**
     * ********************************************
     * ***********中间部份 可视化组件 仪表盘 *********
     * ********************************************
     */

   //
    /**
     * 参数说明：
     * width/height：所传dom盒子的宽、高
     * dom:所传dom盒子的类名
     * valBigData:传入当前图表数据最大值
     * seriesDaat:传入value值
     * */
    var createchart=LibraryName.createChart;
    var tickvals=LibraryName.tickVals;
    //图一
    var front_dataSet = {
        name: '月均价',
        width: 134,
        height: 134,
        dom: 'frontChart',
        valBigData: 90,
        seriesData: 5
    };
    createchart(front_dataSet);
    /*依次为domId,最小值,最大值,宽,高*/
    tickvals('speedometer_f', 0, 90, 132, 134);

    //中间图
    var mid_dataSet = {
        name: '日均价',
        width: 150,
        height: 150,
        dom: 'middleChart',
        valBigData: 300,
        seriesData: 70
    };
    createchart(mid_dataSet);
    /*依次为domId,最小值,最大值,宽,高*/
    tickvals('speedometer_m', 0, 300, 213, 211);
    //图三
    var last_dataSet = {
        name: '年均价',
        width: 134,
        height: 134,
        dom: 'lastChart',
        valBigData: 100,
        seriesData: 30
    };
    createchart(last_dataSet);
    /*依次为domId,最小值,最大值,宽,高*/
    tickvals('speedometer_b', 0, 100, 132, 134);


    /**
     * ********************************************
     * ***********中间部份 可视化组件 波浪纹 *********
     * ********************************************
     */
    var SWlefter=LibraryWave.waveLeft;

    var SWleft = new SWlefter({
        dom: 'myCanvasLeft',
        width: 430,
        height: 30,
        value1:1000,   //总产量值
        valuemax1:6000,  //总产量最大值
        years:2015,
        percent:0.5
    });
    SWleft.setSpeed(0.1);
    SWleft.start();
    setInterval(function () {
        SWleft.setNoise(0.8);
    }, 0);

    var SWrighter=LibraryWave.waveRight;
    var SWright = new SWrighter({
        dom: 'myCanvasRight',
        width: 430,
        height: 30,
        value2:3000,   //总产量值
        valuemax2:6000,  //总产量最大值
        years:2015,
        percent:-0.5
    });
    SWright.setSpeed(0.1);
    SWright.start();
    setInterval(function () {
        SWright.setNoise(0.8);
    }, 0);






    // window resize 事件，echarts 自动适应
    window.onresize = function () {
        cropRight.resize();
        affectAnalyse.resize();
        profit.resize();
        forecast.resize();
        // flexibility.resize();
        market.resize();
        importQuantity.resize();
        exportQuantity.resize();
    }

});
