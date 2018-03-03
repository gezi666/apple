$(function() {
    //消费总量
    var totalObj = {
        year: ['2005', '2006', "2007", '2008', "2009", "2010", "2011", "2012", "2013", "2014"],
        totalData: [370, 1250, 1600, 2335, 1278, 550, 700, 1820, 450, 790],
        changeRate: [130, 150, 286, 221, 123, -88, 68, 59, 286, 221]
    }
    var totalChartsObj = new totalConsume("total_consume")
    totalChartsObj.init(totalObj);

    //消费总量时间选择
    $(".history .pub-time").on("click", ".time-yes", function(e) {
        e.stopPropagation();
        // 获取 已勾选的时间段
        var times = getTime(".history");
        var totalObj = {
            year: times.split(','),
            totalData: [370, 1250, 1600, 2335, 1278, 550, 700, 1820, 450, 790],
            changeRate: [130, 150, 286, 221, 123, 88, 68, 59, 286, 221]
        }
        totalChartsObj.init(totalObj);
    });



    //消费结构
    var constructObj = {
        year: ['2011', '2012', '2013', '2014', '2015'],
        data1: [70, 110, 145, 165, 135],
        data2: [30, 60, 80, 125, 70],
        data3: [50, 70, 80, 90, 70]
    }

    var constructChartsObj = new constructConsume('occupy1');
    constructChartsObj.init(constructObj)


    var pieObj = {
        text: '2015年', //默认展示最后一年的数据
        sunhao: 1500,
        jiagong: 1500,
        xianshixiaofei: 4800　
    }
    var constructPieChartsObj = new constructPie('occupy2')
    constructPieChartsObj.init(pieObj)

    /**
     * 点击左侧 echarts 图表不同年份时，右侧echarts 图表 灌入不同数据
     */
    constructChartsObj.myChart.on("click", function(params) {
    	console.log('ctt')
        console.log(params)
        var time;
        // 判断点击的是 x 轴 而非其它 区域
        if (params.componentType === "xAxis") {
            time = params.value;
        } else {
            time = params.name;
        }
        //ajax调取数据
        var mockData = {
            text: time,
            sunhao: 1100,
            jiagong: 1800,
            xianshixiaofei: 4200
        }
        constructPieChartsObj.init(mockData)

    });

    //消费结构时间选择
    $(".consume-construct .pub-time").on("click", ".time-yes", function(e) {
        e.stopPropagation();
        // 获取 已勾选的时间段
        var times = getTime(".consume-construct");
        var constructObj = {
            year: times.split(','),
            data1: [50, 70, 80, 90, 70],
            data2: [70, 110, 145, 165, 135],
            data3: [30, 60, 80, 125, 70]
        }
        constructChartsObj.init(constructObj);
    });



    //消费水平

    var consumeLevelChartsObj = new consumeLevel('consume-level');

    //ajax初始化。。。
    getDataConsumeLevel()

    function getDataConsumeLevel() {
        //需要传递给后台的数据
        var postData = {
            areas: getAreas('.consume-level'),
            year: getTime(".consume-level"),
            danwei: getDanwei(".consume-level")
        }

        //ajax...得到的data
        var levelObJ = {
            areas: getAreas('.consume-level'), //默认取得全球，中国，美国 配置legend用
            year: getTime(".consume-level").split(','), //默认时间 x轴用
            data: [{
                    name: '全球苹果',
                    stack: '全球',
                    data: getArray(5)
                },
                {
                    name: '全球苹果汁',
                    stack: '全球',
                    data: getArray(5)
                },
                {
                    name: '中国苹果',
                    stack: '中国',
                    data: getArray(5)
                },
                {
                    name: '中国苹果汁',
                    stack: '中国',
                    data: getArray(5)
                },
                {
                    name: '美国苹果',
                    stack: '美国',
                    data: getArray(5)
                },
                {
                    name: '美国苹果汁',
                    stack: '美国',
                    data: getArray(5)
                },
                {
                    name: '印度苹美国',
                    stack: '印度',
                    data: getArray(5)
                },
                {
                    name: '印度苹果汁',
                    stack: '印度',
                    data: getArray(5)
                },
                {
                    name: '日本苹美国',
                    stack: '日本',
                    data: getArray(5)
                },
                {
                    name: '日本苹果汁',
                    stack: '日本',
                    data: getArray(5)
                }
            ]
        }
        consumeLevelChartsObj.init(levelObJ)
    }

    //鲜食加工，苹果加工 标签切换
    $(".consume-level .pub-radio").on('click', "li", function() {
        //ajax...
        getDataConsumeLevel()
    });

    //消费水平时间选择
    $(".consume-level .pub-time").on("click", ".time-yes", function(e) {
        e.stopPropagation();
        // 获取 已勾选的时间段
        getDataConsumeLevel()
    });

    //消费水平地区选择
    $(".consume-level .another-location").on("click", ".yes", function(e) {
        // 获取 已勾选的时间段
        console.log('....' + getAreas('.consume-level'))
        getDataConsumeLevel()
    });


    //人均消费
    var consumePersonalChartsObJ = new consumePersonal('consume-personal');

    getDataConsumePersonal();

    function getDataConsumePersonal() {
        //需要传递给后台的数据
        var postData = {
            areas: getAreas('.consume-personal'),
            year: getTime(".consume-personal"),
            danwei: getDanwei(".consume-personal")
        }
        console.log(postData)
        //ajax...得到的data
        var personalObj = {
            areas: getAreas('.consume-personal'), //默认取得全球，中国，美国 配置legend用
            year: getTime(".consume-personal").split(','), //默认时间 x轴用
            data: [{
                    name: '全球',
                    data: getArray(5)
            },
                {
                    name: '中国',
                    data: getArray(5)
                },
                {
                    name: '美国',
                    data: getArray(5)
                },
                {
                    name: '朝鲜',
                    data: getArray(5)
                },
                {
                    name: '韩国',
                    data: getArray(5)
                }
            ]
        }
        consumePersonalChartsObJ.init(personalObj)
    }

    //人均消费
    //鲜食加工，苹果加工 标签切换
    $(".consume-personal .pub-radio").on('click', "li", function() {
        //ajax...
        getDataConsumePersonal()
    });

    //人均消费时间选择
    $(".consume-personal .pub-time").on("click", ".time-yes", function(e) {
        e.stopPropagation();
        // 获取 已勾选的时间段
        getDataConsumePersonal()
    });

    //人均消费地区选择
    $(".consume-personal .another-location").on("click", ".yes", function(e) {
        // 获取 已勾选的时间段
        getDataConsumePersonal()
    });
})

//随机生成数组 ，后台不用看
function getArray(num) {
    var ret = [];
    for (var i = 0; i < num; i++) {
        ret.push(Math.floor(Math.random() * 100))
    }
    return ret
}



// 消费总量函数

function totalConsume(dom) {
    this.dom = dom;
    this.myChart = echarts.init(document.getElementById(dom));
    this.opts = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
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
                var str = params[0].name + "<br>";
                params.forEach(function(v, i) {
                	if(v.seriesType=='bar'){
                    	str += v.seriesName + ": " + v.value + "万吨" + "<br>";
                   	}else{
                   		str += v.seriesName + ": " + v.value + "%" + "<br>";
                   	}
                });
                return str
            }

        },
        legend: {
            top: '0',
            data: [{
                    name: "消费总量",
                    textStyle: {
                        color: "#fff"
                    }
                },
                {
                    name: "变化率",
                    textStyle: {
                        color: "#fff"
                    },
                }
            ],
        },
        label: {
            normal: {
                textStyle: {
                    color: "#ff3b00"
                }
            },
            emphasis: {
                textStyle: {
                    color: "#ff3b00"
                }
            }
        },
        grid: {
            left: '1%',
            right: '7%',
            bottom: '5%',
            top: '8%',
            containLabel: true
        },
        yAxis: [{
            name: "万吨",
            type: 'value',
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {

                textStyle: {
                    color: "#fff",
                    fontSize: 15
                }
            }
        }, {
            type: 'value',
            name: "(%)",
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                formatter: '{value}',
                textStyle: {
                    color: "#fff",
                    fontSize: 15
                }
            }
        }],

        xAxis: {
            type: 'category',
            name: '',
            splitLine: {
                show: true,
                lineStyle: {
                    color: ['#254495'],
                    type: 'dashed'
                }
            },
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
            data: '',
        },
        series: [{
                name: '消费总量',
                type: 'bar',
                barWidth: 20,
                label: {
                    normal: {
                        show: false,
                        position: 'right',
                        formatter: "{c}%"
                    }
                },
                itemStyle: {
                    normal: {
                        barBorderRadius: [10, 10, 10, 10],
                        //barBorderColor: '#f97b00',
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(7, 213, 225, 0.4)'
                        }, {
                            offset: 1,
                            color: 'rgba(23, 67, 156, 1)'
                        }])
                    }

                },
                // 顺序 从下向上 传入
                data: []
            },
            {
                name: '变化率',
                type: 'line',
                symbolSize: 0,
                smooth: true,
                yAxisIndex: 1,
                markLine:{
                    symbol:'circle',
                    label:{
                        normal:{
                            show:false
                        }
                    },
                    data:   [{
                        name: '',
                        yAxis: 0
                    }]
                },
                itemStyle: {
                    normal: {
                        color: '#fdeb59'
                    }
                },
                data: []

            }
        ],
        "dataZoom": [{
            "show": true,
            "height": 15,
            "xAxisIndex": [0],
            left: '50',
            right: '120',
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
    }
}

totalConsume.prototype.init = function(obj) {
    this.opts.xAxis.data = obj.year;
    this.opts.series[0].data = obj.totalData;
    this.opts.series[1].data = obj.changeRate;
    this.myChart.setOption(this.opts)
}


//消费结构
function constructConsume(dom) {
    this.dom = dom
    this.myChart = echarts.init(document.getElementById(dom));
    this.opts = {
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
            formatter: function (params, ticket, callback) {
                return "<span>" + params[0].name + "年</span>" + "<br />" +"<span>鲜食消费 : </span>" + "<span>" + params[0].value + "万吨</span>"+
                "<br>"+"<span>加工消费: </span>" + "<span>" + params[1].value + "万吨</span>"+
                "<br>"+"<span>损耗: </span>" + "<span>" + params[2].value + "万吨</span>"
            }

        },
        grid: {
            left: '15px',
            right: '18px',
            bottom: '30px',
            containLabel: true
        },
        legend: {
            left: 'right',
            data: ['鲜食消费', '加工消费', '损耗'],
            textStyle: {
                color: '#fff'
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            triggerEvent: true,
            axisLine: {
                lineStyle: {
                    color: '#8ac7ff'
                }
            },
            axisLabel: {
                 textStyle: {
                    color: "#fff",
                    fontSize: 15
                }

            },
            data: []
        },
        yAxis: {
            type: 'value',
            name: '万吨',
            show: true,
            axisTick: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    color: '#fff',
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
        },
        series: [{
                name: '鲜食消费',
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
                data: [],
            },
            {
                name: '加工消费',
                type: 'line',
                symbolSize: 15,
                itemStyle: {
                    normal: {
                        color: '#0f86cc',
                        borderWidth: 2
                    },
                    emphasis: {
                        borderColor: '#0f86cc'
                    }
                },
                smooth: true,
                data: [],
            },
            {
                name: '损耗',
                type: 'line',
                symbolSize: 15,
                itemStyle: {
                    normal: {
                        color: '#edbf28',
                        borderWidth: 2
                    },
                    emphasis: {
                        borderColor: '#edbf28'
                    }
                },
                smooth: true,
                data: [],
            }
        ],
        "dataZoom": [{
            "show": true,
            "height": 15,
            "xAxisIndex": [0],
            left: '50',
            right: '40',
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
    }
}

constructConsume.prototype.init = function(obj) {
    this.opts.xAxis.data = obj.year;
    this.opts.series[0].data = obj.data1;
    this.opts.series[1].data = obj.data2;
    this.opts.series[2].data = obj.data3;
    this.myChart.setOption(this.opts)
}

function constructPie(dom) {
    this.dom = dom;
    this.myChart = echarts.init(document.getElementById(dom));
    this.opts = {
        title: {
            text: '',
            textStyle: {
                fontSize: 18,
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
        legend: {
            show: false,
            right: '0',
            textStyle: {
                color: "#82bcff"
            },
            data: ['', '', '', '', '', '', '']
        },
        series: [{
            name: ' ',
            label: {
                normal: {
                    formatter: '{c}万吨 \n {d}% \n {b}',
                    textStyle: {
                        fontSize: 18
                    }
                }
            },
            type: 'pie',
            labelLine: {
                normal: {
                    length: 11,
                    length2: 8

                }
            },

            radius: ['20%', '50%'],
            center: ['50%', '50%'],
            color: ['#1b8c53', '#166d9c', '#7d5831', '#742a2f', '#9a8e34', 'pink'],
            data: [

                {
                    value: '',
                    name: '损耗',
                    label: {
                        normal: {
                            textStyle: {
                                //color: "#fff",
                                color: "#ffa654",

                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            barBorderRadius: 20,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#d74000'
                            }, {
                                offset: 1,
                                color: '#ffa654'
                            }]),
                            shadowColor: 'rgba(0, 0, 0, 0.4)',
                            //shadowBlur: 20,

                        }
                    }
                }, {
                    value: '',
                    name: '加工',
                    label: {
                        normal: {
                            textStyle: {
                                //color: "#fff",
                                color: "#fce940",

                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            barBorderRadius: 20,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#a99b17'
                            }, {
                                offset: 1,
                                color: '#fce940'
                            }]),
                            shadowColor: 'rgba(0, 0, 0, 0.4)',
                            //shadowBlur: 20,

                        }
                    }
                },
                {
                    value: '',
                    name: '鲜食消费',
                    label: {
                        normal: {
                            textStyle: {
                                //color: "#fff",
                                color: "#3fa7dc",
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            barBorderRadius: 20,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#99d9ea'
                            }, {
                                offset: 1,
                                color: '#3fa7dc'
                            }]),
                            shadowColor: 'rgba(0, 0, 0, 0.4)',
                            //shadowBlur: 20,

                        }
                    }
                }

            ]
        }]
    }
}
constructPie.prototype.init = function(obj) {
    this.opts.title.text = obj.text;
    this.opts.series[0].data[0].value = obj.sunhao;
    this.opts.series[0].data[1].value = obj.jiagong;
    this.opts.series[0].data[2].value = obj.xianshixiaofei;
    this.myChart.setOption(this.opts)
}



//消费水平
function consumeLevel(dom) {
    this.dom = dom;
    this.myChart = echarts.init(document.getElementById(dom));
    this.opts = {
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
            extraCssText: 'box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);',

        },
        legend: {
            //y: 'top',
            //x: 'right',
            left:'70',
            data: [
                {name:'全球苹果汁'}
            ],
            textStyle: {
                color: "#fff"
            }
        },
        color: ["#3fa7dc", "#ffea38", "#f9852d"],
        grid: {
            left: '15',
            right: '50',
            bottom: '30',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            show: true,
            triggerEvent: true,
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: "#fff"
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: "#fff",
                    fontSize: 15
                }
            },
            nameTextStyle: {
                color: "#fff"
            },
            data: []
        },
        yAxis: [{
                type: 'value',
                name: '(万吨)',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: "#fff"
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: "#fff",
                        fontSize: 14
                    }
                },

                nameTextStyle: {
                    color: "#fff"
                }
            }

        ],
        "dataZoom": [{
            "show": true,
            "height": 15,
            "xAxisIndex": [0],
            left: '50',
            right: '80',
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
        series: [
            {
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: {
                        //barBorderRadius: 30,
                        borderColor: '#03bdf3',
                        color:'#03bdf3'

                    }
                },
                data: [] //苹果
            },

            {
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: {
                        barBorderRadius: [15, 15, 0, 0],
                        borderColor: '#00eaff',
                        color:'#00eaff'
                    }
                },
                data: [] //苹果汁
            },

            {
                name: '',
                type: 'bar',
                stack: '',
                barWidth: 15,
                itemStyle: {
                    normal: {
                        //barBorderRadius: 30,
                        borderColor: '#42b17b',
                        color: "#42b17b"

                    }
                },
                data: []
            },
            {
                name: '',
                stack: '',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: {
                       barBorderRadius: [15, 15, 0, 0],
                        borderColor: '#44e488',
                        color: '#44e488'

                    }
                },
                data: []
            },
            {
                name: '',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: {
                       // barBorderRadius: 30,
                        borderColor: '#c6ac54',
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, [{
                                offset: 0,
                                color: '#c6ac54'
                            }, {
                                offset: 1,
                                color: '#c6ac54'
                            }]
                        ),

                    }
                },
                data: []
            },
            {
                name: '',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: {
                        barBorderRadius: [15, 15, 0, 0],
                        borderColor: '#f5dc50',
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, [{
                                offset: 0,
                                color: '#f5dc50'
                            }, {
                                offset: 1,
                                color: '#f5dc50'
                            }]
                        ),

                    }
                },
                data: []
            },
            {
                name: '',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: {
                        //barBorderRadius: 30,
                        borderColor: '#99623d',
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, [{
                                offset: 0,
                                color: '#99623d'
                            }, {
                                offset: 1,
                                color: '#99623d'
                            }]
                        ),

                    }
                },
                data: []
            },
            {
                name: '',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: {
                        barBorderRadius: [15, 15, 0, 0],
                        borderColor: '#ff8814',
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, [{
                                offset: 0,
                                color: '#ff8814'
                            }, {
                                offset: 1,
                                color: '#ff8814'
                            }]
                        ),

                    }
                },
                data: []
            },
            {
                name: '',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: {
                       // barBorderRadius: 30,
                        borderColor: '#c1424c',
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, [{
                                offset: 0,
                                color: '#c1424c'
                            }, {
                                offset: 1,
                                color: '#c1424c'
                            }]
                        ),

                    }
                },
                data: []
            },
            {
                name: '',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: {
                       barBorderRadius: [15, 15, 0, 0],
                        borderColor: '#ff456c',
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, [{
                                offset: 0,
                                color: '#ff456c'
                            }, {
                                offset: 1,
                                color: '#ff456c'
                            }]
                        ),

                    }
                },
                data: []
            }


        ]


    }
}

consumeLevel.prototype.init = function(obj) {
    //this.opts.legend.data = obj.areas.split(',')
    this.opts.xAxis.data = obj.year;

    var me = this;
    obj.data.forEach(function(v, i, a) {
        me.opts.legend.data.push({name:v.name})
        me.opts.series[i].name = v.name;
        me.opts.series[i].data = v.data;
        me.opts.series[i].stack = v.stack;
    })
    console.log(this.opts)
    this.myChart.setOption(this.opts)
}


//消费水平-人均消费
function consumePersonal(dom) {
    this.dom = dom;
    this.myChart = echarts.init(document.getElementById(dom));
    this.opts = {
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
               var str = params[0].name + "<br>";
               for (var i=0;i<params.length;i++){
               		str+='<span style="display:inline-block;width:10px;height:10px;background:'+params[i].color+';border-radius:50%"></span>&nbsp;'+params[i].seriesName+':'+params[i].value+'公斤<br />'
               }
             return str;

            }
        },
        grid: {
            left: '15px',
            right: '60px',
            bottom: '0',
            containLabel: true
        },
        legend: {
            right: '20',
            data: [],
            textStyle: {
                color: '#fff'
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                 textStyle: {
                    color: "#fff",
                    fontSize: 15
                }
            },
            data: []
        },
        yAxis: {
            type: 'value',
            name: '公斤',
            show: true,
            min: 'dataMin',
            axisTick: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    color: '#fff',
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
        },
        series: [{
                name: '',
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
                data: [],
            },
            {
                name: '',
                type: 'line',
                symbolSize: 15,
                itemStyle: {
                    normal: {
                        color: '#0f86cc',
                        borderWidth: 2
                    },
                    emphasis: {
                        borderColor: '#0f86cc'
                    }
                },
                smooth: true,
                data: [],
            },
            {
                name: '',
                type: 'line',
                symbolSize: 15,
                itemStyle: {
                    normal: {
                        color: '#edbf28',
                        borderWidth: 2
                    },
                    emphasis: {
                        borderColor: '#edbf28'
                    }
                },
                smooth: true,
                data: [],
            },
            {
                name: '',
                type: 'line',
                symbolSize: 15,
                itemStyle: {
                    normal: {
                        color: '#fff600',
                        borderWidth: 2
                    },
                    emphasis: {
                        borderColor: '#fff600'
                    }
                },
                smooth: true,
                data: [],
            }, {
                name: '',
                type: 'line',
                symbolSize: 15,
                itemStyle: {
                    normal: {
                        color: '#cb424a',
                        borderWidth: 2
                    },
                    emphasis: {
                        borderColor: '#cb424a'
                    }
                },
                smooth: true,
                data: [],
            }
        ]
    }
}

consumePersonal.prototype.init = function(obj) {
    this.opts.legend.data = obj.areas.split(',')
    this.opts.xAxis.data = obj.year;
    var me = this;
    obj.data.forEach(function(v, i, a) {
        me.opts.series[i].name = v.name;
        me.opts.series[i].data = v.data;

    })
    this.myChart.setOption(this.opts)
}
