$(function () {
    var MUTI = {
        mapDir: './../',
        mapJson: './../Lib/data/json/',
        starDot: '<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:',
        endDot: '"></span>',
        slideCurrentTime: null,
        notnum: '0',
        valueArea: '万亩',  // 种植面积
        yield: '万吨',     // 产量
        danchan: '公斤/亩' // 单产
    };

    // 地图描述
    function initMapDesc(data) {
        var common = {
            status: getDanwei(".space-distributed"),
            time: MUTI.currentTime || MUTI.slideCurrentTime
        };
        // var data = data.data;

        // 万吨 万亩 单位
        switch (common.status) {
            case '种植面积':
                common.unites = MUTI.valueArea;
                break;
            case '产量':
                common.unites = MUTI.yield;
                break;
            default:
                common.unites = MUTI.valueArea;
        }
        // 地区, 如果 没有地区，那么 就取前一次 存起来的 地区
        if (data) {
            common.region = data.name;
            localStorage.setItem('currentArea', common.region);
        } else {
            common.region = localStorage.getItem('currentArea');
        }
        // 多少数值
        if (data) {
            if (common.status === '种植面积') {
                common.value = data.valueArea;
            } else {
                common.value = data.value;
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

    // 单位说明
    function getUnite(params) {
        var unite = '';
        switch (params) {
            case '种植面积':
                unite = MUTI.valueArea;
                break;
            case '产量':
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
                areaColor = ['#FBFBFF', '#DDDDFF', '#B9B9FF', '#9393FF', '#6A6AFF', '#8600FF','#af00ff'];
                break;
            case '产量':
                areaColor = ['#FBFBFF', '#F5FFE8', '#CEFFCE', '#79FF79', '#28FF28', '#00bd2f','#009001']
                break;
            default:
                areaColor = ['#FBFBFF', '#DDDDFF', '#B9B9FF', '#9393FF', '#6A6AFF', '#8600FF','#af00ff'];
        }
        return areaColor;
    }

    var chart = new JusfounD3Charts.mapSelect();

    chart.init({
        dom: $(".map")[0],
        cityData: cityMap,
        VisualMapItemHeight: 40,
        VisualMapItemWidth: 20,
        VisualMapTextMargin: 10,
        VisualMapText: '我是一个单位说明',
        areaColor: ['#FBFBFF', '#DDDDFF', '#B9B9FF', '#9393FF', '#6A6AFF', '#8600FF','#af00ff'],
        jsonUrl: MUTI.mapJson, //json 路径
        nameMap: nameMap,
        tooltipFormatter: function (d) {
            var flag = d.data.labelShow;
            if (!flag) return;
            if (flag == 1)return d.data.name + '<br />种植面积： ' + parseFloat(d.data.value).toFixed(0).fontsize(5).fontcolor('#FAB407') + MUTI.valueArea;
            if (flag == 2)return d.data.name + '<br />产量： ' + parseFloat(d.data.value).toFixed(0).fontsize(5).fontcolor('#FAB407') + MUTI.yield;
        }
    });

    // 获取时间 初始化 时间轴
    ajaxGetDataCall("resources/appleglobe/allYears", '', spaceTimeCb);
    function spaceTimeCb(data) {
        var spaceTimeData = data.data.reverse();
        //console.log(spaceTimeData);
        // console.log(spaceTimeData)
        MUTI.slideCurrentTime = spaceTimeData[spaceTimeData.length - 1];
        // console.log(MUTI.slideCurrentTime)
        // 初始化时间轴
        //console.log(spaceTimeData);
        //console.log(MUTI.slideCurrentTime);
        var bar = new scrollBar({
            dom: document.getElementById('space-distributed-time'),
            height: 12,
            // width: 800,
            position: 'bottom',
            backgroundImage: MUTI.mapDir + 'images/scale-bg.png',
            withTime: true,
            slideStart: MUTI.slideCurrentTime,
            slideBgImage: MUTI.mapDir + 'images/scroll-icon.png',
            data: spaceTimeData,
            tooltipWidth: 48,
            tooltipHeight: 20,
            tooltipImage: MUTI.mapDir + 'images/tooltip.png'
        });
        bar.scrollChange(function(time) {
            MUTI.currentTime = time;
            ajaxGetDataCall("resources/appleglobe/spatial", 'TIME_ID=' + time, function(data) {
                // 地图描述
                initMapDesc(data.currentAreaData);
                // 处理只有一条数据时，以数组形式返回
                if (!(data.data instanceof Array)) {
                    var data = [data.data];
                } else {
                    var data = data.data;
                }
                var index = $(".space-distributed .pub-radio li.active").index() + 1;
                chart.render('world');
                chart.setData({
                    data: data,
                    labelShow: index,
                    areaColor: getColor(getDanwei('.space-distributed')),
                    VisualMapText: getUnite(getDanwei('.space-distributed')),
                    delayTime: 500
                });
            });
        });

        // 打开页面第一次初始化地图
        ajaxGetDataCall("resources/appleglobe/spatial", 'TIME_ID=' + MUTI.slideCurrentTime + "&PRODUCT_ID=" + encodeURI('公顷'), spaceAreaCb);
        function spaceAreaCb(data) {
            // 地图描述
            initMapDesc(data.currentAreaData);

            // 处理只有一条数据时，以数组形式返回
            if (!(data.data instanceof Array)) {
                var data = [data.data];
                // console.log(JSON.stringify(data));
            } else {
                var data = data.data;
            }

            var index = $(".space-distributed .pub-radio li.active").index() + 1;
            chart.render('world');
            chart.setData({
                data: data,
                labelShow: index,
                areaColor: getColor(getDanwei('.space-distributed')),
                VisualMapText: getUnite(getDanwei('.space-distributed')),
                delayTime: 0
            });
        }
    }

    // 种植面积 产量 切换
    $(".space-distributed .pub-radio").on("click", "li", function() {
        var index = $(this).index() + 1;
        if (!MUTI.currentTime) {
            MUTI.currentTime = MUTI.slideCurrentTime;
        }
        console.log(MUTI.currentTime)
        ajaxGetDataCall("resources/appleglobe/spatial", 'TIME_ID=' + MUTI.currentTime, function(data) {
            // 地图描述
            initMapDesc(data.currentAreaData);
            // 处理只有一条数据时，以数组形式返回
            if (!(data.data instanceof Array)) {
                var data = [data.data];
            } else {
                var data = data.data;
            }
            chart.render('world');
            chart.setData({
                data: data,
                labelShow: index,
                areaColor: getColor(getDanwei('.space-distributed')),
                VisualMapText: getUnite(getDanwei('.space-distributed')),
                delayTime: 100
            });
        });
    });



    /**
     * ********************************************
     * ***********历史演变处 ajax交互*********
     * ********************************************
     */
    function historyCb(data, historyObj) {
        var data = data.data;
        var units = '';
        var newDanwei = '';
        switch (historyObj.danwei) {
            case '121689':
                newDanwei = '种植面积';
                units = MUTI.valueArea;
                break;
            case '112716':
                newDanwei = '产量';
                units = MUTI.yield;
                break;
            case '单产':
                newDanwei = '单产';
                units = MUTI.danchan;
                break;
            default:
        }
        //console.log(historyObj.danwei);

        var obj = [],
            legend = [];
        console.log(data)
        for (key in data) {
            console.log(key)
            obj.push({
                name: key + newDanwei,
                type: 'bar',
                value: data[key],
                ctype: true
            }, {
                name: key + '变化率',
                type: 'line',
                value: data[key],
                ctype: false
            });
            legend.push(key + newDanwei);
            legend.push(key + "变化率");
            // console.log(legend);
        }
        obj.forEach(function(v) {
            v.data = [];
            v.value.forEach(function(k) {
                if (v.ctype) {
                    if (newDanwei === '种植面积') {
                        if (!k.sumData) {
                            v.data.push('-');
                        } else {
                            v.data.push(k.sumData);
                        }
                    } else {
                        // v.data.push(k.totalSumData);
                        if (!k.totalSumData) {
                            v.data.push('-');
                        } else {
                            v.data.push(k.totalSumData);
                        }
                    }
                } else {
                    // v.data.push(k.rate);
                    if (k.rate === '') {
                        v.data.push('-');
                    } else {
                        v.data.push(k.rate);
                    }
                }
            });
        });

        var barArr = [];
        var lineArr = [];

        obj.forEach(function (item, index) {
            if (item.type === 'bar') {
                // if ((index / 2) === 0) {
                // barArr = item.data
                // } else {
                barArr = barArr.concat(item.data);
                // }
            } else {
                // if (((index - 1) / 2) === 0) {
                // lineArr = item.data
                // } else {
                lineArr = lineArr.concat(item.data);
                // }
            }
        })

        // barArr.forEach(function (item, index) {
        //     if (isNaN(parseFloat(item))) {
        //         barArr.splice(index, 1)
        //     }
        // })
        // lineArr.forEach(function (item, index) {
        //     if (isNaN(parseFloat(item))) {
        //         lineArr.splice(index, 1)
        //     }
        // })

        var newBarArr = []
        barArr.forEach(function (v, i) {
            if (!isNaN(parseInt(v))) {
                newBarArr.push(v);
            }
        })
        var newLineArr = []
        lineArr.forEach(function (v, i) {
            if (!isNaN(parseInt(v))) {
                newLineArr.push(v);
            }
        })

        var barMin = getMin(Math.min.apply(null, newBarArr))
        var lineMin = getMin(Math.min.apply(null, newLineArr))

        var forxAxis = [];
        historyObj.time_while.split(",").forEach(function(v) {
            forxAxis.push(v + "年");
        });
        // 初始化 echarts 图表
        $("#history").css("width", $("#history").width());
        charts.init({
            id: 955,
            container: "history",
            option: {
                legend: {
                    data: legend
                },
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
                        var str = '';
                        params.forEach(function(v) {
                            if (v.seriesType === 'bar') {
                                str += MUTI.starDot + v.color.colorStops[0].color + MUTI.endDot + v.seriesName + ": " + v.value + " " + units + "<br>";
                            } else {
                                str += MUTI.starDot + v.color + MUTI.endDot + v.seriesName + ": " + v.value + "%<br>";
                            }
                        });
                        return params[0].axisValueLabel + "<br>" + str;
                    }
                },
                xAxis: {
                    data: forxAxis
                },
                yAxis: [{
                    name: newDanwei + '（' + units + '）',
                    min: 0
                }, {
                    name: '变化率（%）',
                    min: lineMin
                }],
                series: obj
            }
        });
    }
    // table 数据渲染
    function callBackFn(data, historyObj) {

        $(historyObj.dom + " table").html("");
        var obj = {};
        obj.arr = [];

        //判断表格第一列显示的名称
        var title = '';
        var title1 = '';
        switch (historyObj.danwei) {
            case '121689':
                title = '苹果园面积';
                break;
            case '112716':
                title = '苹果产量';
                break;
            case MUTI.danchan:
                title = '苹果园面积';
                title1 = '苹果产量';
                break;
            default:
        }

        for (key in data.data) {
            obj.arr.push({
                title: title,
                title1: title1,
                name: key,
                value: data.data[key]
            });

        }
        //在HTML循环里循环时间只判断是不是第一条数据
        obj.arr[0].flag = true;


        //如果点击单产，渲染不同的handlebars模板
        if (obj.arr[0].value[0].area && obj.arr[0].value[0].area !== "") {
            historyObj.handbarsDom = historyObj.handbarsDom + "1";
        }

        //console.log(JSON.stringify(obj))
        var theTemplate = Handlebars.compile($(historyObj.handbarsDom).html());
        //$("#historyTable").append(theTemplate(obj));
        $(historyObj.dom + " table").append(theTemplate(obj));
    }

    // description 描述 处
    function descCb(data, historyObj) {
        // console.log(historyObj)
        // var data = data.data[historyObj.scope];
        var keyArr = []
        for(var key in data.data) {
            keyArr.push(key)
        }
        var data = data.data[keyArr[0]]
        var newDanwei = '';
        var units = '';
        switch (historyObj.danwei) {
            case '121689':
                newDanwei = '种植面积';
                units = MUTI.valueArea;
                break;
            case '112716':
                newDanwei = '产量';
                units = MUTI.yield;
                break;
            case '单产':
                newDanwei = '单产';
                units = MUTI.danchan;
                break;
            default:
        }
        var descObj = {};
        // descObj.desYear = historyObj.time_while[0] + "-" + historyObj.time_while[historyObj.time_while.length - 1];
        // descObj.desLastYear = historyObj.time_while[historyObj.time_while.length - 1];
        // descObj.descRate = data[historyObj.scope].average;
        // descObj.descYield = data[historyObj.scope].sumData;
        // descObj.danWei = newDanwei;

        // 时间
        var timeYear = historyObj.time_while.split(',');
        descObj.desYear = timeYear[0] + "-" + timeYear[timeYear.length - 1];

        // 增长率
        var rateSum = 0;
        data.forEach(function (v, i) {
            rateSum += v.rate;
        });
        descObj.descRate = (rateSum / timeYear.length).toFixed(2);
        // 最后一年 时间
        descObj.desLastYear = timeYear[timeYear.length - 1];

        // 最后一年 单位 种植面积类
        descObj.danWei = newDanwei;

        // 最后一年 突破 N 万吨
        if (data[data.length - 1].time === descObj.desLastYear) {
            descObj.descYield = (data[data.length - 1].sumData).toFixed(0);
        } else {
            descObj.descYield = MUTI.notnum;
        }


        // 最后一年 单位 千公顷
        descObj.units = units;

        // 是哪个地区
        descObj.area = keyArr[0]

        $(historyObj.dom).find(".des-year").html(descObj.desYear);
        $(historyObj.dom).find(".desc-status").html(newDanwei);
        $(historyObj.dom).find(".desc-rate").html(descObj.descRate);
        $(historyObj.dom).find(".history-area").html(descObj.area);

        // $(historyObj.dom).find(".des-last-year").html(descObj.desLastYear);
        // $(historyObj.dom).find(".newdanwei").html(descObj.danWei);
        // $(historyObj.dom).find(".desc-yield").html(descObj.descYield);
        // $(historyObj.dom).find(".danwei").html(descObj.units);
    }
    // 将 echarts 图表渲染 与 table 表格渲染函数 封装进入 getData 函数
    function getData(historyObj) {
        // ajaxGetDataCall("resources/spatialDistribution/years", 'LIMIT=' + historyObj.year, function(data) {
        //     window.cbTimeArr = data.data.reverse();
        //     var cbTimeData;
        //     if (historyObj.timeSlot == null) {
        //         cbTimeData = window.cbTimeArr.join(",");
        //     } else {
        //         cbTimeData = historyObj.timeSlot.join(",");
        //     }
        /**
         * 历史演变处 ajax交互
         * 图表 与 table 表格
         */
        //初始化图表
        ajaxGetDataCall("resources/spatialDistribution/history", "AREA_ID=" + historyObj.areas + "&TIME_ID=" + historyObj.time_while + "&PRODUCT_ID=" + encodeURI(historyObj.danwei), function(data) {
            historyCb(data, historyObj);
            // callBackFn(data, historyObj);
        });

        /**
         * 历史演变处 ajax交互
         * description 描述
         */
        ajaxGetDataCall("resources/spatialDistribution/history2","AREA_ID=" + historyObj.areas + "&TIME_ID=" + historyObj.time_while + "&PRODUCT_ID=" + encodeURI(historyObj.danwei), function(data) {
            descCb(data, historyObj);
        });


        // });
    }

    /**
     * 第一次初始化时获取数据
     */
    var historyObj = {
        year: 5,
        time_while: getTime('.history'),
        areas: '00',
        danwei: '121689',
        scope: '全国',
        dom: ".history",
        handbarsDom: '#person',
        echartDom: 'history'
    };
    getData(historyObj);

    /**
     * 历史演变处 ajax 交互
     * 地区
     * 根据所选 地区 动态获取数据 渲染 echarts 图表 和 table 表格
     */

    $(".history").on("click", ".yes", function() {
        // 获取地区
        var forAjaxAreas = getAreas(".history");
        // 获取 单位 如 种植面积 单产 变化率
        var danwei = getDanwei(".history");
        var newDanwei = '';
        switch (danwei) {
            case '种植面积':
                newDanwei = '121689';
                break;
            case '产量':
                newDanwei = '112716';
                break;
            case '单产':
                newDanwei = '单产';
                break;
            default:
        }

        // 获取时间段
        var timeArr = getTime(".history");

        var newHistoryObj = {
            year: 10,
            areas: forAjaxAreas,
            danwei: newDanwei,
            time_while: timeArr,
            scope: '全国',
            dom: ".history",
            handbarsDom: '#person',
            echartDom: 'history'
        };
        getData(newHistoryObj);
    });

    /**
     * 历史演变处 ajax 交互
     * 种植面积 产量 变化率
     * 根据 种植面积 产量 变化率 单选按钮 渲染 echarts 图表 和 table 表格
     */
    $(".history .pub-radio").on('click', "li", function() {
        // 获取 种植面积 产量等 选中状态
        var text = getDanwei(".history");

        var newDanwei = "";
        switch (text) {
            case '种植面积':
                newDanwei = '121689';
                break;
            case '产量':
                newDanwei = '112716';
                break;
            case '单产':
                newDanwei = '单产';
                break;
            default:
        }

        // 获取 已勾选的地区
        var areas = getAreas(".history");
        //获取时间段
        var timeArr = getTime(".history");

        // 动态参数 拼接完成
        var newHistoryObj = {
            year: 10,
            time_while: timeArr,
            areas: areas,
            danwei: newDanwei,
            scope: '全国',
            dom: ".history",
            handbarsDom: '#person',
            echartDom: 'history'
        };
        getData(newHistoryObj);
    });

    /**
     * 历史演变处 ajax 交互
     * 2012－2017
     * 根据 时间 渲染 echarts 表
     */
    $(".history .pub-time").on("click", ".time-yes", function(e) {
        e.stopPropagation();
        // 获取 已勾选的地区
        var areas = getAreas(".history");

        // 获取 单位 如 种植面积 单产 变化率
        var text;
        $(".history .pub-radio li").each(function() {
            var flag = $(this).is(".active");
            if (flag) {
                text = $(this).text();
            }
        });

        var newDanwei = "";
        switch (text) {
            case '种植面积':
                newDanwei = '121689';
                break;
            case '产量':
                newDanwei = '112716';
                break;
            case '单产':
                newDanwei = '单产';
                break;
            default:
        }
        // 动态参数 拼接完成
        var newHistoryObj = {
            year: 10,
            time_while: getTime(".history"),
            areas: areas,
            danwei: newDanwei,
            scope: '全国',
            dom: ".history",
            handbarsDom: '#person',
            echartDom: 'history'
        };
        getData(newHistoryObj);

    });



    /**
     * **************生产占比处 ajax 交互************
     * occupy1 为左侧 echarts 表
     * occupy2 为右侧 echarts 表
     */

        // var occupy1 = charts.init({
        //     id: 953,
        //     container: "occupy1",
        //     option: {}
        // });

    var occupy1 = echarts.init(document.getElementById('occupy1'));
    occupy1Option = {
        title: {
            text: ''
        },
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
            // formatter: "{b}年: <br />全国果园面积：{c1}万亩 <br> 全国苹果园面积：{c0}万亩",
            textStyle: {
                color: '#fff',
                fontSize: 14
            }
        },
        legend: {
            data: ['苹果园', '果园'],
            right: 30,
            textStyle: { color: echartOpt.color }
        },
        grid: {
            left: '15',
            right: '50',
            bottom: '30',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            axisLabel:{
                textStyle:{
                    color:"#fff",
                    fontSize:15
                }

            },
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
            axisLabel:{
                textStyle:{
                    color:"#fff",
                    fontSize:15
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#3fa7dc'
                },
            },
            splitLine: { show: false },
            name: '          种植面积 (' + MUTI.valueArea +')',
            nameTextStyle: { color: "#fff" }
        },
        color: ['#bbbf43', '#05aef4', '#ffa626'],
        series: [{
            name: '',
            type: 'line',
            smooth: true,
            data: []
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
        }],
    };
    occupy1.setOption(occupy1Option);
    // 左侧 曲线图数据 渲染函数
    function occupyCb1(data, occupyObj) {
        var data = data.data;
        var units = '';
        var newDanwei = '';
        var newName1 = '苹果园';
        var newName2 = '果园';
        switch (occupyObj.danwei) {
            case '121689':
                // newDanwei = '种植面积';
                newName1 = '苹果园';
                newName2 = '果园';
                newName3 = '苹果园/果园';
                newDanwei = '占比'
                units = MUTI.valueArea;
                zbUnits = '%';
                break;
            case '112716':
                // newDanwei = '产量';
                units = '%';
                newName1 = '苹果';
                newName2 = '水果';
                newName3 = '苹果/水果';
                newDanwei = '占比';
                units = MUTI.yield;
                zbUnits = '%';
                break;
            default:
        }
        var resData = null;
        if (!$.isEmptyObject(data)) {
            for (key in data) {
                resData = data[key];
            }
        } else {
            resData = [{
                "name": "0",
                "time": "0",
                "sumData": 0,
                "totalSumData": 0,
                "accounted": 0
            }];
        }
        var obj = [];
        resData.forEach(function (v, i) {
            if (!v.sumData) {v.sumData = '-';}
            if (!v.totalSumData) {v.totalSumData = '-';}
            if (!v.accounted) {v.accounted = '-';} else {v.accounted = (v.accounted*100).toFixed(2)}
            obj.push({
                name: v.name,
                time: v.time,
                sumData: v.sumData,
                totalSumData: v.totalSumData,
                value: v.accounted
            });
        });
        var forxAxis = [];
        occupyObj.time_while.split(",").forEach(function(v) {
            forxAxis.push(v + "年");
        });
        var newArr = [];
        obj.forEach(function (v, i) {
            if (parseInt(v.value)) {
                newArr.push(Math.floor(v.value))
            }
        })
        // console.log(newArr);
        var yMin = Math.min.apply(null, newArr);
        // console.log(yMin);
        occupy1.setOption({
            legend: {
                show: false,
                data: [newName3]
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    var str = '';
                    params.forEach(function(v) {
                        if (v.data.name === '0') {return;}
                        // 只显示占比
                        // str += MUTI.starDot + v.color + MUTI.endDot + v.axisValue + ' ' + newDanwei +  '<br>' +
                        // MUTI.starDot + v.color + MUTI.endDot + v.seriesName + ": " + v.value + " " + units + "<br>";
                        str += v.axisValue + ' ' +  '<br>' +
                            MUTI.starDot + v.color + MUTI.endDot + v.seriesName + newDanwei + ": " + v.value + " " + zbUnits + "<br>" +
                            MUTI.starDot + v.color + MUTI.endDot + newName1 + ": " + v.data.sumData + " " + units + "<br>" +
                            MUTI.starDot + v.color + MUTI.endDot + newName2 + ": " + v.data.totalSumData + " " + units;
                    });
                    return str;
                }
            },
            xAxis: {
                data: forxAxis
            },
            yAxis: {
                name: '          ' + newDanwei + ' (' + zbUnits + ')',
                min: yMin,
            },
            series: {
                name: newName3,
                smooth: true,
                data: obj
            }
        });
    }

    // 右侧 饼图数据 渲染函数
    function occupyCb2(data, occupyObj, year) {
        var data = data.data;
        var newDanwei = '';
        var units = '';
        var newName1 = '苹果园';
        var newName2 = '果园';
        switch (occupyObj.danwei) {
            case '121689':
                newDanwei = '种植面积';
                units = MUTI.valueArea;
                newName1 = '苹果园';
                newName2 = '果园';
                break;
            case '112716':
                newDanwei = '产量';
                units = MUTI.yield;
                newName1 = '苹果';
                newName2 = '水果';
                break;
            default:
        }
        //alert(dat);
        var obj = [];
        for (key in data) {
            obj.push({
                forValue: data[key],
                name: newName1,
                flag: true,
            }, {
                forValue: data[key],
                name: "其它",
                flag: false,
            });
        }
        obj.forEach(function(v) {
            v.forValue.forEach(function(k) {
                if (v.flag) {
                    v.value = k.sumData;
                } else {
                    v.value = (k.totalSumData - k.sumData).toFixed(0);
                }

            });
        });
        charts.init({
            id: 954,
            container: "occupy2",
            option: {
                legend: {
                    data: ['苹果园', '其它'],
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
                    formatter: function(params) {
                        var str = '';
                        return MUTI.starDot + params.color + MUTI.endDot + params.name + ": " + params.value + " " + units;
                    }
                },
                series: [{
                    data: obj
                }]
            }
        });
        // echarts 表 上面描述内容 中 的 年份 更改
        $(".occupy .echart-year").html(year);
        $(".occupy .newdanwei").html(newDanwei);
        $(".occupy .new-name1").html(newName1);
        $(".occupy .new-name2").html(newName2);
    }

    function getZBData(occupyObj) {
        var lastYearArr = occupyObj.time_while.split(",");
        var lastYear = lastYearArr[lastYearArr.length - 1];
        // 初始化图表
        ajaxGetDataCall("resources/spatialDistribution/production2", "AREA_ID=" + occupyObj.currentArea + "&TIME_ID=" + occupyObj.time_while + "&PRODUCT_ID=" + occupyObj.danwei, function(data) {
            occupyCb1(data, occupyObj);
        });

        /**
         * 生产占比 ajax 交互
         * 第一次打开页面时 右侧 的 饼图 echarts 图表初始化
         * 默认获取 的 数据 是 获取 年份中的 第一年
         */
        ajaxGetDataCall("resources/spatialDistribution/production2", "AREA_ID=" + occupyObj.currentArea + "&TIME_ID=" + lastYear + "&PRODUCT_ID=" + occupyObj.danwei, function(data) {
            occupyCb2(data, occupyObj, lastYear);
        });


        // });
    }

    // 第一次打开页面时的初始化
    var occupyObj = {
        year: 5,
        time_while: getTime(".occupy"),
        currentArea: getCurrentArea(".occupy"),
        danwei: '121689',
        dom: "#production_status_生产占比",
        handbarsDom: '#zhanbi',
        echartDom: 'occupy'
    };
    getZBData(occupyObj);

    /**
     * 生产占比处 ajax 交互
     * 种植面积 产量 变化率
     * 根据 种植面积 产量 变化率 单选按钮 渲染 echarts 图表 和 table 表格
     */
    $(".occupy .pub-radio").on('click', "li", function() {
        //获取时间段
        var text = $(this).text();

        // if (!MUTI.timeFirstFlag && sessionStorage.getItem("nextFlag")) {
        //     console.log("fejaoijfeioawj")
        //     if (text === '种植面积') {
        //         $(".occupy .time-list").html(MUTI.timeArrOne).scrollbar()

        //         var endTime = $(".occupy .time-item:first-child").text().split('-')[1]
        //         var startTime = $(".occupy .time-item:last-child").text().split('-')[0]
        //         if ((endTime - startTime) > 15) {
        //             startTime = endTime - 15 + 1;
        //         }
        //         var completeTime = startTime + '-' + endTime;
        //         $('.occupy .time-txt').html(completeTime);

        //     } else {
        //         $(".occupy .time-list").html(MUTI.timeArrTwo).scrollbar()

        //         var endTime = $(".occupy .time-item:first-child").text().split('-')[1]
        //         var startTime = $(".occupy .time-item:last-child").text().split('-')[0]
        //         if ((endTime - startTime) > 15) {
        //             startTime = endTime - 15 + 1;
        //         }
        //         var completeTime = startTime + '-' + endTime;
        //         $('.occupy .time-txt').html(completeTime);
        //     }
        // }

        // if (MUTI.timeFirstFlag && text === '产量') {
        //     console.log("第一次初始化时获取数据")
        //     MUTI.timeArrOne = $(".occupy .time-list")[0].innerHTML;
        //     getNearTime(".occupy","/resources/spatialDistribution/getYearList");
        //     MUTI.timeArrTwo = $(".occupy .time-list")[0].innerHTML;

        //     MUTI.timeFirstFlag = false;

        //     sessionStorage.setItem("nextFlag", true)
        // }

        // console.log(MUTI.timeArrOne)
        // console.log(MUTI.timeArrTwo)

        if (text === '产量') {
            getNearTime(".occupy","http://192.168.15.213:9999/resources/spatialDistribution/getYearList");
        } else {
            getNearTime(".occupy","http://192.168.15.213:9999/resources/spatialDistribution/getYearList2");
        }


        var newDanwei = "";
        switch (text) {
            case '种植面积':
                newDanwei = '121689';
                break;
            case '产量':
                newDanwei = '112716';
                break;
            case '单产':
                newDanwei = '单产';
                break;
            default:
        }
        //console.log(newDanwei);
        var occupyObj = {
            year: 5,
            currentArea: getCurrentArea(".occupy"),
            time_while: getTime(".occupy"),
            danwei: newDanwei,
            dom: "#production_status_生产占比",
            handbarsDom: '#zhanbi',
            echartDom: 'occupy'
        };
        // console.log(JSON.stringify(occupyObj));
        getZBData(occupyObj);
    });


    $(".occupy .pub-time").on("click", ".time-yes", function(e) {
        e.stopPropagation();

        // 获取时间
        var timeArr = getTime(".occupy");
        //获取种植面积或产量值
        var text = getDanwei(".occupy");

        var newDanwei = "";
        switch (text) {
            case '种植面积':
                newDanwei = '121689';
                break;
            case '产量':
                newDanwei = '112716';
                break;
            case '单产':
                newDanwei = '单产';
                break;
            default:
        }

        var occupyObj = {
            year: 5,
            time_while: timeArr,
            currentArea: getCurrentArea(".occupy"),
            danwei: newDanwei,
            dom: "#globe_apple_生产占比",
            handbarsDom: '#zhanbi',
            echartDom: 'occupy'
        };
        getZBData(occupyObj);
    });

    /**
     * ************有关后台数据交互**********************
     * 点击左侧 echarts 图表不同年份时，右侧echarts 图表 灌入不同数据
     */
    occupy1.on("click", function(params) {
        var time = params.value;
        time = time.substr(0, time.length - 1);

        var newDanwei = getDanwei(".occupy");
        var danwei = null;
        switch (newDanwei) {
            case '种植面积':
                danwei = '121689';
                break;
            case '产量':
                danwei = '112716';
                break;
            default:
        }

        var newOccupyObj = {
            year: 5,
            time_while: getTime(".occupy"),
            currentArea: getCurrentArea(".occupy"),
            danwei: danwei,
            dom: "#production_status_生产占比",
            handbarsDom: '#zhanbi',
            echartDom: 'occupy'
        };
        // 判断点击的是 x 轴 而非其它 区域
        if (params.componentType === "xAxis") {
            ajaxGetDataCall("resources/spatialDistribution/production2", "AREA_ID=" + newOccupyObj.currentArea + "&TIME_ID=" + time + "&PRODUCT_ID=" + newOccupyObj.danwei, function(data) {
                occupyCb2(data, newOccupyObj, time);
            });
        }
    });

});
