$(function () {
    var MUTI = {
        mapDir: '../'
    };
    //切换显示隐藏时间轴的方法
    function cutTimeline(dom) {
        $(dom + " .pub-radio").on('click', "li", function () {
            if ($(this).text() === '月度') {
                $(dom + ' .time-control').css('visibility', 'visible');
            } else {
                $(dom + ' .time-control').css('visibility', 'hidden');
            }
        });
    }

    cutTimeline('.category-heat'); //特产品类热度
    cutTimeline('.cross-over'); //交叉偏好
    cutTimeline('.area-preference'); //产地偏好
    cutTimeline('.brand-heat'); //产品品牌热度
    cutTimeline('.format-preference'); //档次偏好


    //获取当前区域的方法

    function getNowArea(dom) {
        var target = $(dom);
            return target.text();
    }

    /**
     *
     * 产地偏好 模拟数据 & 调用
     *
     * */
    var cdPHData = {
        data: [3600, 1200, 300, 200, 900, 1000],
        x: ['全国总销量', '陕西', '山东', '新疆', '浙江', '其他']
    };
    var cdPHData2 = {
        data: [3300, 500, 900, 1200, 400, 300],
        x: ['全国总销量', '河南', '陕西', '山西', '江苏', '其他']
    };
    //图表初始化默认加载的数据
    var cdPHcharts = new cdPH("areaPreference", cdPHData);
    cdPHcharts.init(cdPHData)

    //时间选择
    $(".area-preference .pub-time").on("click", ".month-item", function (e) {
        //e.stopPropagation();
        // 获取 已勾选的时间段
        var times = getTime(".area-preference");
        //console.log(times)
        //取得选择的时间
        var timesArr = times.split(',');
        bar.setData(timesArr);
        cdPHcharts.init(cdPHData2);
    });

    //切换月和年的
    $(".area-preference .pub-radio").on('click', "li", function () {
        if ($(this).text() === '月度') {
            cdPHcharts.init(cdPHData);
        } else if ($(this).text() === '年度') {
            cdPHcharts.init(cdPHData2);
        }
    });

    // 产地偏好的时间轴
    var data = ['2017-1月', '2017-2月', '2017-3月', '2017-4月', '2017-5月', '2017-6月', '2017-7月', '2017-8月', '2017-9月', '2017-10月', '2017-11月', '2017-12月'];
    var bar = new scrollBar({
        dom: document.getElementById('analyze-timeCDPH'),
        height: 12,
        //width: 600,
        position: 'bottom',
        backgroundImage: MUTI.mapDir + 'images/scale-bg.png',
        withTime: true,
        slideStart: '2017-1',
        slideBgImage: MUTI.mapDir + 'images/scroll-icon.png',
        data: data,
        tooltipWidth: 100,
        tooltipHeight: 35,
        tooltipFontSize: 16,
        tooltipImage: MUTI.mapDir + 'images/tooltip.png'
    });
    bar.scrollChange(function (e) {
        console.log(e);
    })
    bar.setData(data);
    // bar.setTime('2');

    /**
     *
     * 档次偏好 模拟数据 & 调用俩饼图
     *
     * */

    var levelCharts1 = new levelPH('level1');
    var levelCharts2 = new levelPH('level2');
    var data1 = [{
        name: '5元/公斤以下',
        value: 5
    }, {
        name: '5-10元/公斤以下',
        value: 7
    }, {
        name: '10-15元/公斤以下',
        value: 9
    }, {
        name: '15-20元/公斤',
        value: 15
    }, {
        name: '20-30元/公斤',
        value: 1200
    }, {
        name: '30-40元/公斤',
        value: 100
    }, {
        name: '40-50元/公斤',
        value: 150
    }, {
        name: '50元/公斤以上',
        value: 200
    }]
    var data2 = [{
        name: '60mm以下',
        value: 150
    },
        {
            name: '60-65mm',
            value: 110
        },
        {
            name: '65-70mm',
            value: 600
        },
        {
            name: '70-75mm',
            value: 300
        },
        {
            name: '75-80mm',
            value: 270
        }, {
            name: '80-85mm',
            value: 180
        },
        {
            name: '85-90mm',
            value: 120
        },
        {
            name: '90-95mm',
            value: 200
        },
        {
            name: '95mm以上',
            value: 60
        }
    ];
    var data11 = [{
        name: '5元/公斤以下',
        value: 150
    }, {
        name: '5-10元/公斤以下',
        value: 170
    }, {
        name: '10-15元/公斤以下',
        value: 190
    }, {
        name: '15-20元/公斤',
        value: 150
    }, {
        name: '20-30元/公斤',
        value: 800
    }, {
        name: '30-40元/公斤',
        value: 120
    }, {
        name: '40-50元/公斤',
        value: 110
    }, {
        name: '50元/公斤以上',
        value: 220
    }]
    var data21 = [{
        name: '60mm以下',
        value: 50
    },
        {
            name: '60-65mm',
            value: 10
        },
        {
            name: '65-70mm',
            value: 60
        },
        {
            name: '70-75mm',
            value: 30
        },
        {
            name: '75-80mm',
            value: 27
        }, {
            name: '80-85mm',
            value: 18
        },
        {
            name: '85-90mm',
            value: 12
        },
        {
            name: '90-95mm',
            value: 20
        },
        {
            name: '95mm以上',
            value: 60
        }
    ];

    levelCharts1.init(data1, 1);
    levelCharts2.init(data2, 2);

    //规格偏好 时间选择
    $(".format-preference .pub-time").on("click", ".month-item", function (e) {
        //e.stopPropagation();
        // 获取 已勾选的时间段
        var times = getTime(".format-preference"); //取得选择的时间
        var areas = getMainArea(".format-preference") //取得选择的地区
        //获取数据后执行渲染图表方法
        levelCharts1.init(data11, 1);
        levelCharts2.init(data21, 2);
    });
    //切换月和年的
    $(".format-preference .pub-radio").on('click', "li", function () {
        if ($(this).text() === '月度') {
            levelCharts1.init(data1, 1);
            levelCharts2.init(data2, 2);
        } else if ($(this).text() === '年度') {
            levelCharts1.init(data11, 1);
            levelCharts2.init(data21, 2);
        }
    });

    // 档次偏好的时间轴
    var XtimeData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    var beyondtfBar = new scrollBar({
        dom: document.getElementById('analyze-timeDCPH'),
        height: 12,
        //width: 600,
        position: 'bottom',
        backgroundImage: MUTI.mapDir + 'images/scale-bg.png',
        withTime: true,
        slideStart: '2017-1',
        slideBgImage: MUTI.mapDir + 'images/scroll-icon.png',
        data: data,
        tooltipWidth: 100,
        tooltipHeight: 35,
        tooltipFontSize: 16,
        tooltipImage: MUTI.mapDir + 'images/tooltip.png'
    });
    bar.scrollChange(function (e) {
        console.log(e);
    })
    bar.setData(data);
    // bar.setTime('2');

    // 规格偏好 地区选择
    $(".format-preference .fake-ul").on("click", "li", function (e) {
        // 获取 已勾选的时间段
        var times = getTime(".format-preference"); //取得选择的时间
        var areas = getMainArea(".format-preference") //取得选择的地区
        console.log(times, areas)
        //获取数据后执行渲染图表方法
        levelCharts1.init(data1, 1);
        levelCharts2.init(data2, 2);
    });

    /**
     *
     * 特产品类热度部分数据处理
     *
     * ***/
        //切换特产品类热度区域

    var QGdays = ['*烟台苹果', '*栖霞苹果', '*洛川苹果', '*吉县苹果', '*盐源苹果'/*, '*静宁苹果', '*昭通苹果', '*万荣苹果', '*烟台观水苹果', '*沂源苹果', '*阿克苏苹果', '*庆阳苹果', '*蒙阴苹果', '侯马红富士苹果', '荣成苹果', '运城红星苹果', '辽中寒富苹果', '芮城苹果', '耀州苹果', '铜川苹果', '大连富士苹果', '*平凉苹果', '*平阴玫瑰红苹果', '槐下苹果', '阿克苏金冠苹果', '天水花牛苹果', '通许苹果', '五莲苹果', '烟台嘎啦苹果', '伊犁嘎啦苹果', '沂水苹果', '阿坝苹果', '隰县苹果'*/];
    var BJdays = [ '烟台嘎啦苹果', '伊犁嘎啦苹果', '沂水苹果', '阿坝苹果', '隰县苹果'];
    var TJdays = ['槐下苹果', '阿克苏金冠苹果', '天水花牛苹果', '通许苹果', '五莲苹果'];
    var HNdays = [ '耀州苹果', '铜川苹果', '大连富士苹果', '*平凉苹果', '*平阴玫瑰红苹果'];
    var SDdays = ['侯马红富士苹果', '荣成苹果', '运城红星苹果', '辽中寒富苹果', '芮城苹果'];
    var ZJdays = ['*烟台观水苹果', '*沂源苹果', '*阿克苏苹果', '*庆阳苹果', '*蒙阴苹果']
    var TCPRDaxisData = {
        hours: ['5元/公斤以下', '5～10元/公斤', '10～15元/公斤', '15～20元/公斤', '20～30元/公斤', '30～40元/公斤', '40～50元/公斤', '50元/公斤以上'],
        days: QGdays
    };
    $(".category-heat .fake-ul").on('click', "li", function () {
        var areas = getMainArea(".category-heat") //取得选择的地区
        switch (areas) {
            case '北京':
                TCPRDaxisData.days = BJdays;
                break;
            case '天津':
                TCPRDaxisData.days = TJdays;
                break;
            case '河南':
                TCPRDaxisData.days = HNdays;
                break;
            case '山东':
                TCPRDaxisData.days = SDdays;
                break;
            case '浙江':
                TCPRDaxisData.days = ZJdays;
                break;
            default:
                TCPRDaxisData.days = QGdays;
        }
        initHotEchart("categoryHeat", categoryHeatData, TCPRDaxisData);
    });

    //时间选择
    $(".category-heat .pub-time").on("click", ".month-item", function (e) {
        //e.stopPropagation();
        // 获取 已勾选的时间段
        var times = getTime(".category-heat");
        //console.log(times)
        //取得选择的时间
        var timesArr = times.split(',');
        bar.setData(timesArr);
        initHotEchart("categoryHeat", categoryHeatData, TCPRDaxisData);
    });

    //切换月和年的
    $(".category-heat .pub-radio").on('click', "li", function () {
        if ($(this).text() === '月度') {
            initHotEchart("categoryHeat", categoryHeatData, TCPRDaxisData);
        } else if ($(this).text() === '年度') {
            initHotEchart("categoryHeat", categoryHeatData, TCPRDaxisData);
        }
    });
    //模拟的数据
    var categoryHeatData = [
        [0, 0, 5], //第一个数为y轴index,第二个为x轴index,第三个数为展示数值,index从零开始
        [4, 1, 10],
        [3, 2, 30],
        [2, 3, 40],
        [1, 4, 70],
        [4, 5, 60],
        [0, 7, 40],
        [2, 0, 55],
        [3, 1, 10],
        [1, 2, 80],
        [4, 3, 50],
        [3, 4, 70],
        [2, 5, 20],
        [1, 7, 40],
        [0, 0, 55],
        [4, 1, 80],
        [3, 2, 30],
        [2, 3, 50],
        [1, 4, 70],
        [0, 5, 20],
        [4, 6, 60],
        [3, 7, 40],
        [2, 0, 85],
        [1, 5, 10],
        [0, 2, 30]
    ];

    // 特产品类热度的时间轴
    var data = ['2017-1月', '2017-2月', '2017-3月', '2017-4月', '2017-5月', '2017-6月', '2017-7月', '2017-8月', '2017-9月', '2017-10月', '2017-11月', '2017-12月'];
    var bar = new scrollBar({
        dom: document.getElementById('analyze-timePLRD'),
        height: 12,
        //width: 600,
        position: 'bottom',
        backgroundImage: MUTI.mapDir + 'images/scale-bg.png',
        withTime: true,
        slideStart: '2017-1月',
        slideBgImage: MUTI.mapDir + 'images/scroll-icon.png',
        data: data,
        tooltipWidth: 100,
        tooltipHeight: 35,
        tooltipFontSize: 16,
        tooltipImage: MUTI.mapDir + 'images/tooltip.png'
    });
    bar.scrollChange(function (e) {
        console.log(e);
    })
    bar.setData(data);
    // bar.setTime('2');

    //特产品类热度初始化调用图表展示内容
    initHotEchart("categoryHeat", categoryHeatData, TCPRDaxisData);

    /**
     *
     * 交叉组合偏好部分数据处理
     *
     * ***/

        //切换交叉偏好类型切换

    var DJhours = ['5元(含)/公斤以下(不含)', '5～10元(含)/公斤(不含)', '10～15元(含)/公斤(不含)', '15～20元(含)/公斤(不含)', '20～30元/公斤', '30～40元/公斤', '40～50元/公斤', '50元/公斤以上'];
    function chengeStr(val){
        val = val.replace("(含)" ,"");
        val = val.replace("(不含)","");
        return val;
    }
    var newDjhours = Array.from(DJhours,x=>chengeStr(x))
    //console.log(newDjhours);

    var ZLhours = ['1公斤以下', '1～2公斤', '2～4公斤', '4～6公斤', '6公斤以上'];
    var JCZHPHaxisData = {
        hours: ZLhours,
        days: ['75以下', '75～80', '80～85', '85～90', '90～95', '95以上']
    };
    $(".cross-over .cross-type").on('click', "li", function () {
        var crossType = $(this).text();
        switch (crossType) {
            case '单价与果径交叉分析':
                JCZHPHaxisData.hours = DJhours;
                break;
            case '单件重量与果径交叉分析':
                JCZHPHaxisData.hours = ZLhours;
                break;
            default:
                JCZHPHaxisData.hours = ZLhours;
        }
        initHotEchart("crossOver", preferenceData, JCZHPHaxisData);
    });
    //时间选择
    $(".cross-over .pub-time").on("click", ".month-item", function (e) {
        //e.stopPropagation();
        // 获取 已勾选的时间段
        var times = getTime(".cross-over");
        //console.log(times)
        //取得选择的时间
        var timesArr = times.split(',');
        bar.setData(timesArr);
        initHotEchart("crossOver", preferenceData, JCZHPHaxisData);
    });
    //切换交叉偏好区域
    $(".cross-over .cross-area").on('click', "li", function () {
        var crossArea = $(this).text();

        initHotEchart("crossOver", preferenceData, JCZHPHaxisData);
    });
    //切换月和年的
    $(".cross-over .pub-radio").on('click', "li", function () {
        if ($(this).text() === '月度') {
            initHotEchart("crossOver", preferenceData, JCZHPHaxisData);
        } else if ($(this).text() === '年度') {
            initHotEchart("crossOver", preferenceData, JCZHPHaxisData);
        }
    });

    //模拟的数据
    var preferenceData = [
        [0, 0, 5], //第一个数为y轴index,第二个为x轴index,第三个数为展示数值,index从零开始
        [5, 3, 90],
        [0, 4, 70],
        [0, 2, 90],
        [4, 0, 60],
        [0, 7, 40],
        [2, 3, 55],
        [3, 1, 33],
        [2, 0, 50],
        [3, 4, 70],
        [4, 2, 20],
        [5, 6, 60]
    ];

    //交叉组合偏好初始化调用图表展示内容
    initHotEchart("crossOver", preferenceData, JCZHPHaxisData);

    // 交叉组合偏好的时间轴
    var data = ['2017-1月', '2017-2月', '2017-3月', '2017-4月', '2017-5月', '2017-6月', '2017-7月', '2017-8月', '2017-9月', '2017-10月', '2017-11月', '2017-12月'];
    var bar = new scrollBar({
        dom: document.getElementById('analyze-timeJCPH'),
        height: 12,
        //width: 600,
        position: 'bottom',
        backgroundImage: MUTI.mapDir + 'images/scale-bg.png',
        withTime: true,
        slideStart: '2017-1月',
        slideBgImage: MUTI.mapDir + 'images/scroll-icon.png',
        data: data,
        tooltipWidth: 100,
        tooltipHeight: 35,
        tooltipFontSize: 16,
        tooltipImage: MUTI.mapDir + 'images/tooltip.png'
    });
    bar.scrollChange(function (e) {
        console.log(e);
    })
    bar.setData(data);
    // bar.setTime('2');

    //特产品类热度和交叉组合偏好公用的 一个图表配置
    function initHotEchart(dom, data, axisData) {
        var data = data;
        var echartOpt = {
            fz: '15',
            color: '#fff'
        };
        var newArr = [];
        for(var i = 0;i<data.length; i++){
            newArr.push(data[i][2]);
        }
        Array.prototype.max = function(){
            return Math.max.apply({},this)
        };
        Array.prototype.min = function(){
            return Math.min.apply({},this)
        }
        var maxData = newArr.max();
        var minData = newArr.min();

        data = data.map(function (item) {
            return [item[1], item[0], item[2] || '-'];
        });
        var yAxisname = '';
        switch (dom){
            case 'categoryHeat':
                yAxisname = '';
                break;
            case 'crossOver':
                yAxisname = '单位：mm';
                break;
        }
        var myChart = echarts.init(document.getElementById(dom));
        option = {
            animation: false,
            tooltip: {
                formatter: function (params, ticket, callback) {
                    return axisData.days[params.value[1]] + '  ' + axisData.hours[params.value[0]] + '<br/>' + ' 销量： ' + params.value[2] + "吨";
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
                height: '70%',
                top:50,
                width: '90%',
                y: '1%',
                left: '10%'
            },
            xAxis: {
                type: 'category',
                data: axisData.hours,
                splitArea: {
                    show: true
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: "#fff",
                        fontSize: 14
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff',
                        fontSize: 14
                    }
                }
            },
            yAxis: {
                type: 'category',
                name: yAxisname,
                data: axisData.days,
                splitArea: {
                    show: true
                },
                axisLabel: {
                    textStyle: {
                        color: "#fff",
                        fontSize: 12
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: ['#2f46a1']
                    }
                },
                axisTick: {
                    show: false
                }
            },

            visualMap: {
                color: ['orangered', 'gold'],
                textStyle: {
                    color: '#88c6ff',
                    fontSize: '12'
                },
                //textGap: 30,
                min: minData,
                max: maxData,
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                top: '91%',
            },
            series: [{
                name: 'Punch Card',
                type: 'heatmap',
                data: data,
                label: {
                    normal: {
                        show: true
                    }
                },
                itemStyle: {
                    emphasis: {
                        //shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
        myChart.setOption(option);
    }

    /**
     * *
     * *产品品牌热度
     * *
     * **/

    //时间选择
    $(".brand-heat .pub-time").on("click", ".month-item", function (e) {
        //e.stopPropagation();
        // 获取 已勾选的时间段
        var times = getTime(".brand-heat");
        //console.log(times)
        //取得选择的时间
        var timesArr = times.split(',');
        bar.setData(timesArr);
        brandHeat("brandHeat", brandHeatdata);
    });

    //切换月和年的
    $(".brand-heat .pub-radio").on('click', "li", function () {
        if ($(this).text() === '月度') {
            brandHeat("brandHeat", brandHeatdata);
        } else if ($(this).text() === '年度') {
            brandHeat("brandHeat", brandHeatdata);
        }
    });
    var brandHeatdata = [{
        value: 20,
        name: '陕西',
    }, {
        value: 15,
        name: '山东',
    }, {
        value: 13,
        name: '甘肃',
    }, {
        name: '山西',
        value: 4,

    }, {
        name: '辽宁',
        value: 3,

    }, {
        name: '河北',
        value: 3,

    }, {
        name: '河南',
        value: 4,
    }]
    //初始化调用图表展示内容
    brandHeat("brandHeat", brandHeatdata);

    function brandHeat(dom, data) {
        var data = data;
        var echartOpt = {
            fz: '15',
            color: '#fff'
        };
        var myChart = echarts.init(document.getElementById(dom));
        option = {
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    if (params.value === 0) {
                        return '暂无数据'
                    } else {
                        return params.name + ":" + params.value;
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
            color: "",
            series: [{
                left: 30,
                name: '',
                type: 'treemap',
                width: '90%',
                height: '90%',
                roam: false, //是否开启拖拽漫游（移动和缩放）
                nodeClick: false, //点击节点后的行为,false无反应
                label: {
                    normal: {
                        textStyle: {
                            fontWeight: 'bold',
                            fontSize: '24',
                            ellipsis: false
                        },
                        position: 'inside'
                    }
                },
                breadcrumb: { //关闭面包屑路径
                    show: false
                },
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: "{b}"
                        },
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 1,
                            color: 'rgba(59,147,229, 0.8)'
                        }, {
                            offset: 0,
                            color: 'rgba(59,147,229, 0.4)'
                        }]),
                        borderWidth: 0.51,
                        borderColor: '#ccc'
                    },
                    emphasis: {
                        label: {
                            show: true
                        },
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 1,
                            color: 'rgba(225,204,42, 0.8)'
                        }, {
                            offset: 0,
                            color: 'rgba(225,204,42,  0.4)'
                        }]),
                        borderWidth: 3,
                        borderColor: 'rgb(225,204,42)'
                    }
                },
                data: data
            }]
        };
        myChart.setOption(option);
    }

    // 产品品牌热度的时间轴
    var data = ['2017-1月', '2017-2月', '2017-3月', '2017-4月', '2017-5月', '2017-6月', '2017-7月', '2017-8月', '2017-9月', '2017-10月', '2017-11月', '2017-12月'];
    var bar = new scrollBar({
        dom: document.getElementById('analyze-timePPRD'),
        height: 12,
        //width: 600,
        position: 'bottom',
        backgroundImage: MUTI.mapDir + 'images/scale-bg.png',
        withTime: true,
        slideStart: '2017-1月',
        slideBgImage: MUTI.mapDir + 'images/scroll-icon.png',
        data: data,
        tooltipWidth: 100,
        tooltipHeight: 35,
        tooltipFontSize: 16,
        tooltipImage: MUTI.mapDir + 'images/tooltip.png'
    });
    bar.scrollChange(function (e) {
        console.log(e);
    })
    bar.setData(data);
    // bar.setTime('2');

})

//产地偏好的辅助函数

function fuzhuData(data) {
    var ret = [];
    var sumData = data[0];
    data.forEach(function (v, i, a) {
        ret[0] = 0;
        ret[1] = sumData - a[1];
        if (i > data.length - 3) {
            return
        }
        ret[i + 2] = ret[i + 1] - a[i + 2]
    })
    //console.log(ret)
    return ret
}
//产地偏好的图表
function cdPH(dom) {
    this.dom = dom;
    this.myChart = echarts.init(document.getElementById(dom));
    this.opts = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
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
            right: '4%',
            bottom: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            name: '',

            axisTick: {
                show: false
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: "#fff",
                    fontSize: 15
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#fff',
                    fontSize: 15
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: ['#2f46a1']
                }
            },
            data: []
        },
        yAxis: {
            type: 'value',
            name: '电商销量（吨）',
            axisLabel: {

                textStyle: {
                    color: "#fff",
                    fontSize: 15
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: ['#2f46a1']
                }
            },
            axisTick: {
                show: false
            },
        },
        series: /*{
            name: '辅助',
            type: 'bar',
            stack: '总量',
            itemStyle: {
                normal: {
                    barBorderColor: 'rgba(0,0,0,0)',
                    color: 'rgba(0,0,0,0)'
                },
                emphasis: {
                    barBorderColor: 'rgba(0,0,0,0)',
                    color: 'rgba(0,0,0,0)'
                }
            },
            data: []
        },*/
            {
                name: '电商销量',
                type: 'bar',
                //stack: '总量',
                barMaxWidth: 40,
                label: {
                    normal: {
                        show: false,
                        position: 'inside'
                    }
                },
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, [{
                                offset: 0,
                                color: '#1846a3'
                            }, {
                                offset: 1,
                                color: '#00b8fe'
                            }]
                        ),
                        opacity: 0.9,
                        barBorderRadius: 30,
                        barBorderColor: '#00b6fc'
                    },
                    emphasis: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, [{
                                offset: 0,
                                color: '#d0bf44'
                            }, {
                                offset: 1,
                                color: '#d0bc44'
                            }]
                        ),
                        opacity: 0.9,
                        barBorderColor: '#d0bc44'
                    }
                },
                data: []
            }

    }
}

cdPH.prototype.init = function (data) {
    //this.opts.series[0].data = fuzhuData(data.data)
    var sumQG = data.data[0];
    this.opts.series.data = data.data;
    this.opts.xAxis.data = data.x;
    this.opts.tooltip.formatter = function (params) {
        var point = params[0].seriesName == '全国' ? '100.00%' : (((params[0].data / sumQG) * 100).toFixed(2) + '%');
        return params[0].name + '<br/>' + params[0].seriesName + ' : ' + params[0].data +
            '<br/>' + point;
    }
    this.myChart.setOption(this.opts)
}

// 饼图函数 2个饼图公用
function levelPH(dom) {
    this.dom = dom;
    this.myChart = echarts.init(document.getElementById(dom));
    this.opts = {
        title: {
            show: true,
            text: '',
            left: 'center',
            //top: 0,
            textStyle: {
                fontSize: 14,
                color: '#fff'
            },
            x: 'center',
            y: '57%'
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                return params.value + '吨 占比：' + params.percent + '%';
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
            left: '5%',
            right: '5%',
            bottom: '5%',
            containLabel: true
        },
        legend: {
            show: false,
            right: '0',
            textStyle: {
                color: "#82bcff"
            },
            data: ['', '', '', '', '', '', '']
        },
        series: [{
            type: 'pie',
            label:{
                normal:{
                    textStyle:{
                        fontSize:14,
                        color:'#fff'
                    }
                }
            },
            radius: ['25%', '55%'],
            center: ['50%', '60%'],
            // roseType : 'radius',
            data: []
        }]
    }
}

levelPH.prototype.init = function (data, flag) {
    var danwei = '';
    switch (flag) {
        case 1:
            this.opts.title.text = '价位档次';
            danwei = '公斤'
            break;
        case 2:
            this.opts.title.text = '规格档次';
            danwei = '吨'
            break;
        default:
    }

    var style = [{
        label: {
            normal: {
                /*textStyle: {
                    color: "#3eda62",
                    fontSize: 16
                },*/
                formatter: function (params) {
                    //return params.value + danwei + '\n' + params.percent + '%' + '\n' + params.name;
                    return params.name;
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
                //shadowBlur: 20,
            }
        }
    },
        {
            label: {
                normal: {
                    /*textStyle: {
                        color: "#d85f1d",
                        fontSize: 16
                    },*/
                    formatter: function (params) {
                        //return params.value + danwei + '\n' + params.percent + '%' + '\n' + params.name;
                        return params.name;
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
                    //shadowBlur: 20,
                }
            }
        }, {
            label: {
                normal: {
                    /*textStyle: {
                        color: "#02c8f6",
                        fontSize: 16
                    },*/
                    formatter: function (params) {
                        //return params.value + danwei + '\n' + params.percent + '%' + '\n' + params.name;
                        return params.name;
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
                    //shadowBlur: 20,
                }
            }
        }, {
            label: {
                normal: {
                    /*textStyle: {
                        color: "#ADA715",
                        fontSize: 16
                    },*/
                    formatter: function (params) {
                        //return params.value + danwei + '\n' + params.percent + '%' + '\n' + params.name;
                        return params.name;
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
                    //shadowBlur: 20,
                }
            }
        }, {
            label: {
                normal: {
                    /*textStyle: {
                        color: "#165fe1",
                        fontSize: 16
                    },*/
                    formatter: function (params) {
                        //return params.value + danwei + '\n' + params.percent + '%' + '\n' + params.name;
                        return params.name;
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
                    //shadowBlur: 20,
                }
            }
        }, {
            label: {
                normal: {
                    /*textStyle: {
                        color: "#FF5617",
                        fontSize: 16
                    },*/
                    formatter: function (params) {
                       //return params.value + danwei + '\n' + params.percent + '%' + '\n' + params.name;
                        return params.name;
                    }
                }
            },
            itemStyle: {
                normal: {
                    barBorderRadius: 20,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#E59576'
                    }, {
                        offset: 1,
                        color: '#FF5617'
                    }]),
                    shadowColor: 'rgba(0, 0, 0, 0.4)',
                    //shadowBlur: 20,
                }
            }
        }, {
            label: {
                normal: {
                    /*textStyle: {
                        color: "#98EAAF",
                        fontSize: 16
                    },*/
                    formatter: function (params) {
                        //return params.value + danwei + '\n' + params.percent + '%' + '\n' + params.name;
                        return params.name;
                    }
                }
            },
            itemStyle: {
                normal: {
                    barBorderRadius: 20,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#2E7C43'
                    }, {
                        offset: 1,
                        color: '#98EAAF'
                    }]),
                    shadowColor: 'rgba(0, 0, 0, 0.4)',
                    //shadowBlur: 20,
                }
            }
        }, {
            label: {
                normal: {
                    /*textStyle: {
                        color: "#EAA715",
                        fontSize: 16
                    },*/
                    formatter: function (params) {
                       // return params.value + danwei + '\n' + params.percent + '%' + '\n' + params.name;
                        return params.name;
                    }
                }
            },
            itemStyle: {
                normal: {
                    barBorderRadius: 20,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#5D4308'
                    }, {
                        offset: 1,
                        color: '#EAA715'
                    }]),
                    shadowColor: 'rgba(0, 0, 0, 0.4)',
                    //shadowBlur: 20,
                }
            }
        }, {
            label: {
                normal: {
                    /*textStyle: {
                        color: "#DE2912",
                        fontSize: 16
                    },*/
                    formatter: function (params) {
                        //return params.value + danwei + '\n' + params.percent + '%' + '\n' + params.name;
                        return params.name;
                    }
                }
            },
            itemStyle: {
                normal: {
                    barBorderRadius: 20,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#EA8174'
                    }, {
                        offset: 1,
                        color: '#DE2912'
                    }]),
                    shadowColor: 'rgba(0, 0, 0, 0.4)',
                    //shadowBlur: 20,
                }
            }
        }
    ]

    var me = this;
    me.opts.series[0].data = [];
    data.forEach(function (v, i) {
        if (!v) {
            return
        } else {
            // me.opts.series[0].data[i].name = v.name;
            // me.opts.series[0].data[i].value = v.value;
            me.opts.series[0].data.push({
                name: v.name,
                value: v.value
            })
            $.extend(true, me.opts.series[0].data[i], style[i])
        }
    })
    this.myChart.setOption(this.opts)
}