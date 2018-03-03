$(function() {
    // index.js 页面内部的 部分全局变量
    /**
     * 渲染生产现状 历史演变 生产占比 时间接口
     */
    // getNearTime(".history","http://192.168.15.213:9999/resources/spatialDistribution/getYearList");
    // getNearTime(".occupy","http://192.168.15.213:9999/resources/spatialDistribution/getYearList2");

    var MUTI = {
        mapDir: './../',
        mapJson: './../Lib/data/json/',
        starDot: '<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:',
        endDot: '"></span>',
        eventID: 'china',
        mapName: null,
        mapIndex: 0,
        slideCurrentTime: null,  // MUTI.spaceTimeData[MUTI.spaceTimeData.length - 1]
        notnum: 0,
        valueArea: '万亩',  // 种植面积
        yield: '万吨',     // 产量
        danchan: '公斤/亩', // 单产
        timeFirstFlag: true,
        time1: '',
        time2: ''
    };


    /**
     * 地区多选 交互
     * index 页面 的
     */
    ajaxGetDataCall("resources/spatialDistribution/region", '', areasCb);
    function areasCb(data) {
        var data = data.data;
        var str = '';
        for (var i = 0; i < data.length; i++) {
            if (data[i].area_ID === '0') {data[i].area_ID = '00';}
            str += '<li class="area-item">' +
                '<label>' +
                '<input type="checkbox">' +
                '<i class="checkbox iconfont"></i>' +
                '<span data-areaid=' + data[i].area_ID + '>' + data[i].area_NAME + '</span>' +
                // '<var hidden>' + data[i].area_ID + '</var>' +
                '</label>' +
                '</li>';
        }
        $("ul.areas").html(str);
    }

    /**
     * ********************************************
     * ***********空间分布 ajax交互*********
     * ********************************************
     */
    // 基础样式 修正
    // $(".space-distributed .maptab-ct div:nth-child(2)").css("width", $(".space-distributed .maptab-ct div:nth-child(1)"));

    // 地图描述
    function initMapDesc(data) {
        // console.log(JSON.stringify(data))
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

        console.log(data)

        if (data.value) {
            if (common.status === '产量') {
                common.value = parseInt(data.value).toFixed(0);
            }
        } else {
            if (common.status === '产量') {
                common.value = MUTI.notnum;
            }
        }

        if (data.valueArea) {
            if (common.status === '种植面积') {
                common.value = parseInt(data.valueArea).toFixed(0);
            }
        } else {
            if (common.status === '种植面积') {
                common.value = MUTI.notnum;
            }
        }

        $(".map-year").text(common.time);
        $(".map-region").text(common.region);
        $(".map-status").text(common.status);
        $(".map-data").text(common.value);
        $(".map-unites").text(common.unites);
    }

    /**
     * 中国地图 世界地图
     * 两者 的 单位
     * @return {[type]}        [description]
     */
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
    // 模拟数据
    var fakeData1 = {
        areaData: [
            {name: '陕西',value: 1057,valueAreapm: 1, itemStyle: {normal: {areaColor: '#8600FF'}}},
            {name: '山东',value: 452,valueAreapm: 2, itemStyle: {normal: {areaColor: '#6A6AFF'}}},
            {name: '甘肃',value: 441,valueAreapm: 3, itemStyle: {normal: {areaColor: '#9393FF'}}},
            {name: '河北',value: 363,valueAreapm: 4, itemStyle: {normal: {areaColor: '#B9B9FF'}}},
            {name: '河南',value: 235,valueAreapm: 5, itemStyle: {normal: {areaColor: '#DDDDFF'}}},
            {name: '辽宁',value: 233,valueAreapm: 6, itemStyle: {normal: {areaColor: '#FBFBFF'}}},
            {name: '山西',value: 225,valueAreapm: 7, itemStyle: {normal: {areaColor: '#fffbff'}}}
        ],
        pieces: [
            {min: 453, max: 1057},
            {min: 442, max: 452},
            {min: 364, max: 441},
            {min: 236, max: 363},
            {min: 234, max: 235},
            {min: 226, max: 233},
            {min: 0, max: 225}
        ],
        dis: '种植面积'
    };
    var fakeData2 = {
        areaData: [
            {name: '陕西',value: 2057,valueAreapm: 1, itemStyle: {normal: {areaColor: '#8600FF'}}},
            {name: '山东',value: 1572,valueAreapm: 2, itemStyle: {normal: {areaColor: '#6A6AFF'}}},
            {name: '甘肃',value: 1421,valueAreapm: 3, itemStyle: {normal: {areaColor: '#9393FF'}}},
            {name: '河北',value: 1102,valueAreapm: 4, itemStyle: {normal: {areaColor: '#B9B9FF'}}},
            {name: '河南',value: 899,valueAreapm: 5, itemStyle: {normal: {areaColor: '#DDDDFF'}}},
            {name: '辽宁',value: 789,valueAreapm: 6, itemStyle: {normal: {areaColor: '#FBFBFF'}}},
            {name: '山西',value: 502,valueAreapm: 7, itemStyle: {normal: {areaColor: '#fffbff'}}}
        ],
        pieces: [
            {min: 1573, max: 2057},
            {min: 1422, max: 1572},
            {min: 1103, max: 1421},
            {min: 900, max: 1102},
            {min: 790, max: 899},
            {min: 503, max: 789},
            {min: 0, max: 502}
        ],
        dis: '产量'
    };
    var myChart_map = echarts.init(document.getElementsByClassName('map')[0]);
    function mapToggle(data) {
        var myChart_map_option = {
            title: {},
            tooltip: {
                trigger: 'item'
            },
            visualMap: [{
                left: 'left',
                bottom: '100',
                type: 'piecewise',
                pieces: data.pieces,
                itemHeight: 30,
                itemGap: 0,
                inRange: {
                    symbol: 'rect',
                    color: getColor(data.dis)
                },
                textStyle: {
                    color: ['#5cc1ff'],
                    fontWeight: 'bold'
                }
            }],
            series: [
                {
                    name: '',
                    type: 'map',
                    mapType: 'china',
                    roam: true,
                    zoom: 1.2,
                    scaleLimit: {
                        min:0.2,
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
                            return params.data.name + '<br/>'+data.dis+'：' + parseFloat(params.data.value || 0).toFixed(0).fontsize(5).fontcolor('#FAB407')+
                                (data.dis==='种植面积'?MUTI.valueArea:MUTI.yield) +
                                '<br/>排名：' + (!!params.data.valueAreapm?params.data.valueAreapm:0) +
                                '<br/>占比：' + (((!!params.data.value?params.data.value:0)/3006)*100).toFixed(2) + '%';
                        }
                    },
                    data: data.areaData
                }
            ]
        };
        myChart_map.setOption(myChart_map_option);
    }
    mapToggle(fakeData1)


    /*var chart = new JusfounD3Charts.mapSelect();
    chart.init({
        dom: $(".map")[0],
        cityData: cityMap,
        VisualMapItemHeight: 40,
        VisualMapItemWidth: 20,
        VisualMapTextMargin: 10,
        VisualMapText: getUnite(getDanwei('.space-distributed')),
        areaColor: ['#FBFBFF', '#DDDDFF', '#B9B9FF', '#9393FF', '#6A6AFF', '#8600FF'],
        jsonUrl: MUTI.mapJson, //json 路径
        nameMap: nameMap,
        tooltipFormatter: function (d) {
            if (!d.data) return;
            // if(!d.data.value) return;
            var flag = d.data.labelShow;
            // var d = params;
            // console.log(d)

            // d.newDate = {
            //     value : null,
            //     valueAreapm : null,
            //     valueAreazb : null,
            //     valuepm : null,
            //     valuezb : null
            // };

            // params.data.value ? d.newData.value = params.data.value : d.newData.value = MUTI.notnum

            // if (params.data.value) {
            //     console.log("aa")
            //     console.log(params.data.value)
            //     d.newData.value = params.data.value
            // } else {
            //     console.log("bb")
            //     d.newData.value = MUTI.notnum
            // }

            // params.data.valueAreapm ? d.newData.valueAreapm = params.data.valueAreapm : d.newData.valueAreapm = MUTI.notnum
            // params.data.valueAreazb ? d.newData.valueAreazb = (params.data.valueAreazb) : d.newData.valueAreazb = MUTI.notnum
            // params.data.valuepm ? d.newData.valuepm = params.data.valuepm : d.newData.valuepm = MUTI.notnum
            // params.data.valuezb ? d.newData.valuezb = (params.data.valuezb) : d.newData.valuezb = MUTI.notnum

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


    var _timer = {};
    function delay_till_last(id, fn, wait) {
        if (_timer[id]) {
            window.clearTimeout(_timer[id]);
            delete _timer[id];
        }

        return _timer[id] = window.setTimeout(function() {
            fn();
            delete _timer[id];
        }, wait);
    }

    // 渲染 所有 地图的 函数，为 下钻和 上钻使用
    function renderAllCharts(name, flag, index) {

     //    delay_till_last('id', function() {//注意 id 是唯一的
     //    if (flag) {
     //            $(".space-distributed .topName").append('<span>&gt;&nbsp;</span>' + '<div>' + name + '</div>');
     //            } else {
     //                $(".space-distributed .topName :gt("+ index +")").remove();
     //        }
     // }, 300);

        if (flag) {
            if (index <=2) {
                $(".space-distributed .topName").append('<span>&gt;&nbsp;</span>' + '<div>' + name + '</div>');
            }
        } else {
            $(".space-distributed .topName :gt("+ index +")").remove();
        }
        var floorIndex = parseInt($(".space-distributed .topName").children('div').length) - 1;
        var cengjiIndex = index;

        MUTI.areaname = name;
        if (name === '中国') { name = '全国'; }
        if (!MUTI.currentTime) { MUTI.currentTime = MUTI.slideCurrentTime; }
        ajaxGetDataCall("resources/spatialDistribution/spatial2", 'TIME_ID=' + MUTI.currentTime + "&AREANAME=" + encodeURI(name), function(data) {
            // 地图标题描述
            // console.log(cengjiIndex);
            // if (cengjiIndex) {
                initMapDesc(data.data.currentAreaData[0]);
            // }

            // 处理只有一条数据时，以数组形式返回
            if (!(data.data.areasData instanceof Array)) {
                var data = [data.data.areasData];
            } else {
                var data = data.data.areasData;
            }
            var index = $(".space-distributed .pub-radio li.active").index() + 1;
            // 没有数据时候的处理
            // console.log(event.id)
            // 全局变量 渲染地图时 传送 id
            var idName = name;
            if (idName === '全国') {idName = '中国'}
            MUTI.eventID = getId(idName);
            if (!MUTI.eventID) {return;}
            /*chart.render(MUTI.eventID);
            chart.setData({
                data: data,
                labelShow: index,
                areaColor: getColor(getDanwei('.space-distributed')),
                VisualMapText: getUnite(getDanwei('.space-distributed')),
                delayTime: 500
            });*/
        });

        /**
         * 地图下钻时，重新渲染 选择的地区区域
         */
        switch (parseInt(floorIndex)) {
            case 0:
                $(".for-pop").text("分省");
                break;
            case 1:
                $(".for-pop").text("分市");
                break;
            case 2:
                $(".for-pop").text("分县");
                break;
            default:
                $(".for-pop").text("分省");
        }

        var idName = name;
        if (idName === '全国') {idName = '中国'}
        var id = getId(idName);
        if (id === 'china') {id = '000000';}
        // 如果 id 前四位是 0000，则说明其在点击 中国 或者 省级
        // var flag = id.substr(-4);
        // 地区渲染
        if (parseInt(floorIndex) <= 2) {
            ajaxGetDataCall("resources/spatialDistribution/region3", 'AREANAME=' + encodeURI(name), function(data) {
                var data = data.data;
                var str = '';
                for (var i = 0; i < data.length; i++) {
                    str += '<li class="area-item">' +
                        '<label>' +
                        '<input type="checkbox">' +
                        '<i class="checkbox iconfont"></i>' +
                        '<span data-areaid=' + data[i].areaId + '>' + data[i].name + '</span>' +
                        '</label>' +
                        '</li>';
                }
                $("ul.areas").html(str);
            });
        }

        /**
         * 地图下钻时，页面其余 echarts 图标跟随 切换 不同的 区域md！！！
         * 历史演变
         */
        var areaid = id;
        if (parseInt(floorIndex) <= 1) {
            areaid = id.substr(0, 2);
        }
        var str = '<span data-areaid=' + areaid + '>' + name + '</span>';
        $(".history .locations").html(str);
        var units = getDanwei((".history"));
        switch (units) {
            case '种植面积':
                units = '121689';
                break;
            case '产量':
                units = '112716';
                break;
            default:
        }
        var historyObj = {
            year: 5,
            time_while: getTime('.history'),
            areas: areaid,
            danwei: units,
            scope: '全国',
            dom: ".history",
            handbarsDom: '#person',
            echartDom: 'history'
        };
        getData(historyObj);

        /**
         * 地图下钻时，页面其余 echarts 图标跟随 切换 不同的 区域md！！！
         * 生产占比
         */
        $(".occupy .current-area").text(name).data("areaid", areaid);
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
        getZBData(newOccupyObj);
    }
    // 地图下钻
    /*chart.on("drill", function (event) {
        // console.log(event);
        // console.log('MUTI.mapIndex: '+MUTI.mapIndex);
        if (event.name !== MUTI.mapName) {
            if (event.index !== MUTI.mapIndex && event.index <= 2) {
                renderAllCharts(event.name, true, event.index);
                console.log(event)
                MUTI.mapName = event.name;
                MUTI.mapIndex = event.index;
                // console.log(JSON.stringify(event));
                // console.log('MUTI.mapIndex: '+MUTI.mapIndex);
            }
        }
    });*/

    // 地图上钻
    $(".space-distributed .topName").on("click", "div", function () {
        var name = $(this).text();
        var index = $(this).index();
        MUTI.mapIndex = index;
        renderAllCharts(name, false, index);
    });
    // 获取时间 初始化 时间轴
    // ajaxGetDataCall("resources/spatialDistribution/years2", '', spaceTimeCb);
    function spaceTimeCb(data) {
        MUTI.spaceTimeData = data.data.reverse();
        // MUTI.spaceTimeData = MUTI.spaceTimeData.slice(0, -1);
        // 初始化 时间轴 起始时间
        MUTI.slideCurrentTime = MUTI.spaceTimeData[MUTI.spaceTimeData.length - 1];
        // console.log(MUTI.spaceTimeData)
        // console.log(MUTI.slideCurrentTime)
        // 初始化时间轴
        var bar = new scrollBar({
            dom: document.getElementById('space-distributed-time'),
            height: 12,
            // width: 800,
            position: 'bottom',
            backgroundImage: MUTI.mapDir + 'images/scale-bg.png',
            withTime: true,
            slideStart: MUTI.slideCurrentTime,
            slideBgImage: MUTI.mapDir + 'images/scroll-icon.png',
            data: MUTI.spaceTimeData,
            tooltipWidth: 48,
            tooltipHeight: 20,
            tooltipImage: MUTI.mapDir + 'images/tooltip.png'
        });
        bar.scrollChange(function(time) {
            MUTI.currentTime = time;
            if (!MUTI.areaname) {
                MUTI.areaname = '全国';
            } else if (MUTI.areaname === '中国') {
                MUTI.areaname = '全国';
            }
            ajaxGetDataCall("resources/spatialDistribution/spatial2", 'TIME_ID=' + time + "&AREANAME=" + encodeURI(MUTI.areaname), function(data) {
                // 地图标题描述
                initMapDesc(data.data.currentAreaData[0]);

                // 处理只有一条数据时，以数组形式返回
                if (!(data.data.areasData instanceof Array)) {
                    var data = [data.data.areasData];
                } else {
                    var data = data.data.areasData;
                }
                // console.log(JSON.stringify(data));
                var index = $(".space-distributed .pub-radio li.active").index() + 1;
                // 没有数据时候的处理
                /*chart.render(MUTI.eventID);
                chart.setData({
                    data: data,
                    labelShow: index,
                    areaColor: getColor(getDanwei('.space-distributed')),
                    VisualMapText: getUnite(getDanwei('.space-distributed')),
                    delayTime: 200
                });*/
            });
        });

        // 打开页面第一次初始化地图
        ajaxGetDataCall("resources/spatialDistribution/spatial2", 'TIME_ID=' + MUTI.slideCurrentTime + "&AREANAME=" + encodeURI('全国'), spaceAreaCb);
        function spaceAreaCb(data) {
            // 地图标题描述
            initMapDesc(data.data.currentAreaData[0]);
            // console.log(JSON.stringify(data.data));
            // 处理只有一条数据时，以数组形式返回
            if (!(data.data.areasData instanceof Array)) {
                var data = [data.data.areasData];
            } else {
                var data = data.data.areasData;
            }
            // index = $(".space-distributed .pub-radio li.active").index() + 1;
            /*chart.render(MUTI.eventID);
            chart.setData({
                data: data,
                labelShow: 1,
                areaColor: getColor(getDanwei('.space-distributed')),
                VisualMapText: getUnite(getDanwei('.space-distributed')),
                delayTime: 0
            });*/
        }
    }

    // 种植面积 产量 切换
    $(".space-distributed .pub-radio").on("click", "li", function() {
        var index = $(this).index() + 1;
        if (!MUTI.areaname) {
            MUTI.areaname = '全国';
        } else if (MUTI.areaname === '中国') {
            MUTI.areaname = '全国';
        }
        if (!MUTI.currentTime) {
            MUTI.currentTime = MUTI.slideCurrentTime;
        }
        if($(this).html() === '种植面积'){
            mapToggle(fakeData1);
        } else if($(this).html() === '产量'){
            mapToggle(fakeData2);
        }

        var fakeData = {
            "arankVale": [
                "1057",
                "452",
                "441",
                "363",
                "235",
                "233",
                "225",
                "103",
                "76",
                "58"
            ],
            "rankVale": [
                "1100.78",
                "978.13",
                "438.58",
                "428.62",
                "365.58",
                "360.11",
                "256.6",
                "136.58",
                "57.17",
                "42.09"
            ],
            "areasData": [
                {
                    "name": "内蒙古",
                    "value": "",
                    "valueArea": "",
                    "geoCoord": [
                        111.670799,
                        40.81831
                    ],
                    "valuezb": "",
                    "valueAreazb": "",
                    "valuepm": 0,
                    "valueAreapm": 0
                },
                {
                    "name": "重庆",
                    "value": "",
                    "valueArea": "",
                    "geoCoord": [
                        106.504959,
                        29.533155
                    ],
                    "valuezb": "",
                    "valueAreazb": "",
                    "valuepm": 0,
                    "valueAreapm": 0
                },
                {
                    "name": "台湾",
                    "value": "",
                    "valueArea": "",
                    "geoCoord": [
                        121.509064,
                        25.044333
                    ],
                    "valuezb": "",
                    "valueAreazb": "",
                    "valuepm": 0,
                    "valueAreapm": 0
                },
                {
                    "name": "海南",
                    "value": "",
                    "valueArea": "",
                    "geoCoord": [
                        110.331192,
                        20.031971
                    ],
                    "valuezb": "",
                    "valueAreazb": "",
                    "valuepm": 0,
                    "valueAreapm": 0
                },
                {
                    "name": "吉林",
                    "value": "",
                    "valueArea": "",
                    "geoCoord": [
                        125.324501,
                        43.886841
                    ],
                    "valuezb": "",
                    "valueAreazb": "",
                    "valuepm": 0,
                    "valueAreapm": 0
                },
                {
                    "name": "香港",
                    "value": "",
                    "valueArea": "",
                    "geoCoord": [
                        114.173355,
                        22.320047
                    ],
                    "valuezb": "",
                    "valueAreazb": "",
                    "valuepm": 0,
                    "valueAreapm": 0
                },
                {
                    "name": "西藏",
                    "value": "",
                    "valueArea": "",
                    "geoCoord": [
                        91.13221,
                        29.66036
                    ],
                    "valuezb": "",
                    "valueAreazb": "",
                    "valuepm": 0,
                    "valueAreapm": 0
                },
                {
                    "name": "天津",
                    "value": "",
                    "valueArea": "",
                    "geoCoord": [
                        117.190186,
                        39.125595
                    ],
                    "valuezb": "",
                    "valueAreazb": "",
                    "valuepm": 0,
                    "valueAreapm": 0
                },
                {
                    "name": "黑龙江",
                    "value": "",
                    "valueArea": "",
                    "geoCoord": [
                        126.642464,
                        45.756966
                    ],
                    "valuezb": "",
                    "valueAreazb": "",
                    "valuepm": 0,
                    "valueAreapm": 0
                },
                {
                    "name": "贵州",
                    "value": "",
                    "valueArea": "",
                    "geoCoord": [
                        106.713478,
                        26.578342
                    ],
                    "valuezb": "",
                    "valueAreazb": "",
                    "valuepm": 0,
                    "valueAreapm": 0
                },
                {
                    "name": "安徽",
                    "value": "",
                    "valueArea": "",
                    "geoCoord": [
                        117.283043,
                        31.861191
                    ],
                    "valuezb": "",
                    "valueAreazb": "",
                    "valuepm": 0,
                    "valueAreapm": 0
                },
                {
                    "name": "广东",
                    "value": "",
                    "valueArea": "",
                    "geoCoord": [
                        113.28064,
                        23.125177
                    ],
                    "valuezb": "",
                    "valueAreazb": "",
                    "valuepm": 0,
                    "valueAreapm": 0
                },
                {
                    "name": "青海",
                    "value": "",
                    "valueArea": "",
                    "geoCoord": [
                        101.778915,
                        36.623177
                    ],
                    "valuezb": "",
                    "valueAreazb": "",
                    "valuepm": 0,
                    "valueAreapm": 0
                },
                {
                    "name": "广西",
                    "value": "",
                    "valueArea": "",
                    "geoCoord": [
                        108.320007,
                        22.82402
                    ],
                    "valuezb": "",
                    "valueAreazb": "",
                    "valuepm": 0,
                    "valueAreapm": 0
                },
                {
                    "name": "湖北",
                    "value": "",
                    "valueArea": "",
                    "geoCoord": [
                        114.298569,
                        30.584354
                    ],
                    "valuezb": "",
                    "valueAreazb": "",
                    "valuepm": 0,
                    "valueAreapm": 0
                },
                {
                    "name": "四川",
                    "value": "",
                    "valueArea": "",
                    "geoCoord": [
                        104.065735,
                        30.659462
                    ],
                    "valuezb": "",
                    "valueAreazb": "",
                    "valuepm": 0,
                    "valueAreapm": 0
                },
                {
                    "name": "上海",
                    "value": "",
                    "valueArea": "",
                    "geoCoord": [
                        121.472641,
                        31.231707
                    ],
                    "valuezb": "",
                    "valueAreazb": "",
                    "valuepm": 0,
                    "valueAreapm": 0
                },
                {
                    "name": "浙江",
                    "value": "",
                    "valueArea": "",
                    "geoCoord": [
                        120.15358,
                        30.287458
                    ],
                    "valuezb": "",
                    "valueAreazb": "",
                    "valuepm": 0,
                    "valueAreapm": 0
                },
                {
                    "name": "江西",
                    "value": "",
                    "valueArea": "",
                    "geoCoord": [
                        115.892151,
                        28.676493
                    ],
                    "valuezb": "",
                    "valueAreazb": "",
                    "valuepm": 0,
                    "valueAreapm": 0
                },
                {
                    "name": "湖南",
                    "value": "",
                    "valueArea": "",
                    "geoCoord": [
                        112.982277,
                        28.19409
                    ],
                    "valuezb": "",
                    "valueAreazb": "",
                    "valuepm": 0,
                    "valueAreapm": 0
                },
                {
                    "name": "福建",
                    "value": "",
                    "valueArea": "",
                    "geoCoord": [
                        119.306236,
                        26.075302
                    ],
                    "valuezb": "",
                    "valueAreazb": "",
                    "valuepm": 0,
                    "valueAreapm": 0
                },
                {
                    "name": "澳门",
                    "value": "",
                    "valueArea": "",
                    "geoCoord": [
                        113.549088,
                        22.198952
                    ],
                    "valuezb": "",
                    "valueAreazb": "",
                    "valuepm": 0,
                    "valueAreapm": 0
                },
                {
                    "name": "北京",
                    "value": "",
                    "valueArea": "",
                    "geoCoord": [
                        116.405289,
                        39.904987
                    ],
                    "valuezb": "",
                    "valueAreazb": "",
                    "valuepm": 0,
                    "valueAreapm": 0
                },
                {
                    "name": "江苏",
                    "value": "",
                    "valueArea": "",
                    "geoCoord": [
                        118.76741,
                        32.041546
                    ],
                    "valuezb": "",
                    "valueAreazb": "",
                    "valuepm": 0,
                    "valueAreapm": 0
                },
                {
                    "name": "陕西",
                    "value": 1100,
                    "valueArea": 1057,
                    "geoCoord": [
                        108.948021,
                        34.263161
                    ],
                    "valuezb": 0.2507,
                    "valueAreazb": 0.3259,
                    "valuepm": 1,
                    "valueAreapm": 1
                },
                {
                    "name": "山东",
                    "value": 978,
                    "valueArea": 452,
                    "geoCoord": [
                        117.000923,
                        36.675808
                    ],
                    "valuezb": 0.2229,
                    "valueAreazb": 0.1394,
                    "valuepm": 2,
                    "valueAreapm": 2
                },
                {
                    "name": "河南",
                    "value": 438,
                    "valueArea": 235,
                    "geoCoord": [
                        113.665413,
                        34.757977
                    ],
                    "valuezb": 0.0998,
                    "valueAreazb": 0.0725,
                    "valuepm": 3,
                    "valueAreapm": 5
                },
                {
                    "name": "山西",
                    "value": 428,
                    "valueArea": 225,
                    "geoCoord": [
                        112.549248,
                        37.857014
                    ],
                    "valuezb": 0.0975,
                    "valueAreazb": 0.0694,
                    "valuepm": 4,
                    "valueAreapm": 7
                },
                {
                    "name": "河北",
                    "value": 365,
                    "valueArea": 363,
                    "geoCoord": [
                        114.502464,
                        38.045475
                    ],
                    "valuezb": 0.0832,
                    "valueAreazb": 0.1119,
                    "valuepm": 5,
                    "valueAreapm": 4
                },
                {
                    "name": "甘肃",
                    "value": 360,
                    "valueArea": 441,
                    "geoCoord": [
                        103.823555,
                        36.058041
                    ],
                    "valuezb": 0.082,
                    "valueAreazb": 0.136,
                    "valuepm": 6,
                    "valueAreapm": 3
                },
                {
                    "name": "辽宁",
                    "value": 256,
                    "valueArea": 233,
                    "geoCoord": [
                        123.429092,
                        41.796768
                    ],
                    "valuezb": 0.0583,
                    "valueAreazb": 0.0718,
                    "valuepm": 7,
                    "valueAreapm": 6
                },
                {
                    "name": "新疆",
                    "value": 136,
                    "valueArea": 103,
                    "geoCoord": [
                        87.617729,
                        43.792816
                    ],
                    "valuezb": 0.031,
                    "valueAreazb": 0.0318,
                    "valuepm": 8,
                    "valueAreapm": 8
                },
                {
                    "name": "宁夏",
                    "value": 57,
                    "valueArea": 58,
                    "geoCoord": [
                        106.278175,
                        38.46637
                    ],
                    "valuezb": 0.013,
                    "valueAreazb": 0.0179,
                    "valuepm": 9,
                    "valueAreapm": 10
                },
                {
                    "name": "云南",
                    "value": 42,
                    "valueArea": 76,
                    "geoCoord": [
                        102.71225,
                        25.040609
                    ],
                    "valuezb": 0.0096,
                    "valueAreazb": 0.0234,
                    "valuepm": 10,
                    "valueAreapm": 9
                }
            ],
            "arankName": [
                "陕西",
                "山东",
                "甘肃",
                "河北",
                "河南",
                "辽宁",
                "山西",
                "新疆",
                "云南",
                "宁夏"
            ],
            "rankName": [
                "陕西",
                "山东",
                "河南",
                "山西",
                "河北",
                "甘肃",
                "辽宁",
                "新疆",
                "宁夏",
                "云南"
            ],
            "currentAreaData": [
                {
                    "name": "全国",
                    "value": 4388,
                    "valueArea": 3243,
                    "geoCoord": [],
                    "valuezb": "",
                    "valueAreazb": "",
                    "valuepm": 1,
                    "valueAreapm": 1
                }
            ]
        };
        initMapDesc(fakeData.currentAreaData[0])
        /*ajaxGetDataCall("resources/spatialDistribution/spatial2", 'TIME_ID=' + MUTI.currentTime + "&AREANAME=" + encodeURI(MUTI.areaname), function(data) {
            // 地图标题描述
            console.log(data)
            initMapDesc(data.data.currentAreaData[0]);

            // 处理只有一条数据时，以数组形式返回
            if (!(data.data.areasData instanceof Array)) {
                var data = [data.data.areasData];
            } else {
                var data = data.data.areasData;
            }
            /!*chart.render(MUTI.eventID);
            chart.setData({
                data: data,
                labelShow: index,
                areaColor: getColor(getDanwei('.space-distributed')),
                VisualMapText: getUnite(getDanwei('.space-distributed')),
                delayTime: 100
            });*!/
        });*/
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
        for (key in data) {
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
            // min:'dataMin',
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
        // console.log(JSON.stringify(data));
        // var yMin = data.ymin;
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
        // var obj = [];
        // for (key in data) {
        //     obj.push({
        //         trueName: newName1,
        //         value: data[key],
        //         flag: 0,
        //         data: []
        //     }, {
        //         trueName: newName2,
        //         value: data[key],
        //         flag: 1,
        //         data: []
        //     },{
        //         name: newName3,
        //         value: data[key],
        //         flag: 3,
        //         data: []
        //     });
        // }
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
        // console.log(obj)
        // obj.forEach(function(v) {
        //     v.value.forEach(function(k) {
        //         // v.data.push((k.accounted*100).toFixed(2))
        //         if (v.flag === 0) {
        //             v.data.push(k.sumData);
        //         } else if (v.flag === 1) {
        //             v.data.push(k.totalSumData);
        //         } else {
        //             v.data.push((k.accounted*100).toFixed(2))
        //         }
        //     });
        // });
        var forxAxis = [];
        occupyObj.time_while.split(",").forEach(function(v) {
            forxAxis.push(v + "年");
        });

        // if (obj.length === 0) {
        //     obj = [{
        //         name: '苹果园',
        //         data: []
        //     }, {
        //         name: '果园',
        //         data: []
        //     }];
        // }
        // console.log(JSON.stringify(obj));
        // var newArr = obj.map(function (v, i) {
        //     if (parseInt(v.value)) {
        //         return Math.floor(v.value);
        //     }
        // })
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
        // ajaxGetDataCall("resources/spatialDistribution/years", 'LIMIT=' + historyObj.year, function(data) {
        // if (occupyObj.timeSlot == null) {
        //     window.cbTimeArrOccupy = data.data.reverse();
        // } else {
        //     window.cbTimeArrOccupy = occupyObj.timeSlot;
        // }
        // var cbTimeData = window.cbTimeArrOccupy.join(",");
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
