$(function() {
//空间相关性部分地图表
    // price_market.js 页面内部的 部分全局变量
    var MUTI = {
        mapDir: '../',
        area1: '北京',   // 主销城市 默认地区
        area2: '陕西',    // 主产城市 默认地区
        monitorUnite: '%'
    };
  var maxNum=100;
    var areaObj = {};
    function switchArea(dom) {
        var whichArea = $(dom).find(".time-tab li.active").text();
        switch (whichArea) {
            case '主销区':
                areaObj.lineStyle = 'solid';
                areaObj.dir = false;
                areaObj.selArea = MUTI.area1;
                areaObj.unite = MUTI.monitorUnite;
                break;
            case '主产区':
                areaObj.dir = true;
                areaObj.lineStyle = 'dashed';
                areaObj.selArea = MUTI.area2;
                areaObj.unite = MUTI.monitorUnite;
                break;
            default:
        }
        return areaObj;
    }
var convertData = function(data, areaObj) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];
        var fromCoord = geoCoordMap[dataItem[0].name];
        var toCoord = geoCoordMap[dataItem[1].name];
        if (fromCoord && toCoord) {
            if (areaObj.dir) {
                res.push({
                    fromName: dataItem[0].name,
                    toName: dataItem[1].name,
                    coords: [fromCoord, toCoord],
                	value:dataItem[1].value
                });
            } else {
                res.push({
                    fromName: dataItem[0].name,
                    toName: dataItem[1].name,
                    coords: [toCoord, fromCoord],
                	value:dataItem[1].value
                });
            }
        }
    }
    return res;
};
//封装地图的series的方法
function handleResData(resData, areaObj, maxNum) {
    //定义传导机制和市场流通流向图中的空数组
    // var arr=[];
    var newAreaObj = areaObj;
    if (!areaObj) {
        newAreaObj = { 'lineStyle': 'solid', 'dir': true };
    }
    var color = 'aqua'; //'gold','lime'
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
                    color: color,
                    width: 1,
                    curveness: 0.2,
                    type: newAreaObj.lineStyle
                }
            },
            data: convertData(item.data, newAreaObj)
        }, { //移动 点
            name: item.name,
            type: 'lines',
            zlevel: 2,
            effect: {
                show: true,
                period: 6,
                trailLength: 0,
                // symbol: planePath,
                symbolSize: 5
            },
            lineStyle: {
                normal: {
                    color: color,
                    width: 1,
                    opacity: 0.4,
                    curveness: 0.2
                }
            },
            data: convertData(item.data, newAreaObj)
        }, { //省份圆点
            name: item.name,
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            rippleEffect: {
                brushType: 'stroke',
                scale: 6
            },
            label: {
                normal: {
                    show: true,
                    position: 'top',
                        formatter: function(params) {
                        if(params.name.indexOf(params.seriesName) != -1 ) return '';
                        return params.name + '： ' + params.value[2] + areaObj.unite;
                    }
                }
            },
            symbolSize: function(val) {
                return (val[2] / maxNum) * 30 > 10 ? (val[2] / maxNum) * 30 : 10;
            },
            //symbolSize: 15,
            itemStyle: {
                normal: {
                    color: color
                }
            },
            data: item.data.map(function(dataItem) {
                return {
                    name: dataItem[1].name,
                    value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                };
            })
        }, {
            name: '辅助颜色',
            type: 'map',
            zoom: 1,
            mapType: 'china',
            markPoint: {
                symbol: 'circle'
            },
            itemStyle: {
                normal: {
                    areaColor: 'rgba(72, 118, 255,0.9)',
                    borderColor: '#fff'
                },
                emphasis: {
                    areaColor: '#3952ca'
                }
            },
            data: [
                { name: '山东', value: 0 },
                { "name": "广西", value: 0}
            ],
            roam: true,
        });
    });
    return series;
}

//模拟数据/*
var SXdata = [{
    name: '陕西',
    data: [
    	[{
            name: '陕西省'
        }, {
            name: '陕西省',
            value: 95
        }],

        [{
            name: '陕西省'
        }, {
            name: '黑龙江省',
            value: 95
        }],
        [{
            name: '陕西省'
        }, {
            name: '青海省',
            value: 90
        }],
        [{
            name: '陕西省'
        }, {
            name: '河南省',
            value: 80
        }],
        [{
            name: '陕西省'
        }, {
            name: '云南省',
            value: 70
        }],
        [{
            name: '陕西省'
        }, {
            name: '湖南省',
            value: 60
        }],
        [{
            name: '陕西省'
        }, {
            name: '广东省',
            value: 50
        }],
        [{
            name: '陕西省'
        }, {
            name: '北京市',
            value: 40
        }],
        [{
            name: '陕西省'
        }, {
            name: '上海市',
            value: 30
        }],
        [{
            name: '陕西省'
        }, {
            name: '重庆市',
            value: 20
        }],
        [{
            name: '陕西省'
        }, {
            name: '福建省',
            value: 10
        }]
    ]
}];
var SDdata = [{
    name: '山东',
    data: [
    	[{
            name: '山东省'
        }, {
            name: '山东省',
            value: 95
        }],

        [{
            name: '山东省'
        }, {
            name: '上海市',
            value: 95
        }],
        [{
            name: '山东省'
        }, {
            name: '广东省',
            value: 90
        }],
        [{
            name: '山东省'
        }, {
            name: '辽宁省',
            value: 80
        }],
        [{
            name: '山东省'
        }, {
            name: '湖北省',
            value: 70
        }],
        [{
            name: '山东省'
        }, {
            name: '内蒙古',
            value: 70
        }],
        [{
            name: '山东省'
        }, {
            name: '江苏省',
            value: 60
        }],
        [{
            name: '山东省'
        }, {
            name: '新疆维吾尔自治区',
            value: 70
        }],
        [{
            name: '山东省'
        }, {
            name: '四川省',
            value: 40
        }],
        [{
            name: '山东省'
        }, {
            name: '云南省',
            value: 30
        }],
        [{
            name: '山东省'
        }, {
            name: '黑龙江省',
            value: 30
        }],
        [{
            name: '山东省'
        }, {
            name: '甘肃省',
            value: 90
        }],
        [{
            name: '山东省'
        }, {
            name: '西藏自治区',
            value: 60
        }]
    ]
}];

var BJdata = [{
    name: '北京',
    data: [
    	[{
            name: '北京市'
        }, {
            name: '北京市',
            value: 95
        }],


        [{
            name: '北京市'
        }, {
            name: '上海市',
            value: 95
        }],
        [{
            name: '北京市'
        }, {
            name: '广东省',
            value: 90
        }],
        [{
            name: '北京市'
        }, {
            name: '辽宁省',
            value: 80
        }],
        [{
            name: '北京市'
        }, {
            name: '湖北省',
            value: 70
        }],
        [{
            name: '北京市'
        }, {
            name: '内蒙古',
            value: 70
        }],
        [{
            name: '北京市'
        }, {
            name: '江苏省',
            value: 60
        }],
        [{
            name: '北京市'
        }, {
            name: '新疆维吾尔自治区',
            value: 70
        }],
        [{
            name: '北京市'
        }, {
            name: '四川省',
            value: 40
        }],
        [{
            name: '北京市'
        }, {
            name: '云南省',
            value: 80
        }],
        [{
            name: '北京市'
        }, {
            name: '黑龙江省',
            value: 80
        }],
        [{
            name: '北京市'
        }, {
            name: '甘肃省',
            value: 90
        }],
        [{
            name: '北京市'
        }, {
            name: '西藏自治区',
            value: 60
        }]
    ]
}];
var spaceRelated = echarts.init(document.getElementById('space-related'));
_setMap(SXdata,{dir: true, lineStyle: "dashed", selArea: "陕西", unite: "%"},maxNum);
// 初始化地图
function _setMap(resData,areaObj,maxNum){
	var relatedoption = {
	    title: {
	    	text:areaObj.selArea +'苹果价格的影响程度分析',
	        left: 'center',
	        padding:[60,0,0,0],
	        textStyle: {
				color: '#fff',
				fontSize: '20',
				fontStyle:'normal'
			}
	    },
    	tooltip: {
        trigger: 'item',
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
        extraCssText: 'box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);',
        formatter: function(params) {
            var flag = switchArea(".related").dir;
            if (params.seriesIndex == 2) {
                if (flag) {
                	if(params.name.indexOf(params.seriesName) != -1 ) return;
                    return params.seriesName + '>' + params.name + '<br>' + '贡献度:<b style="color:#ffa600;font-weight:blod;font-size:18px;">' + params.data.value[2] + '</b>%';
                } else {
                	if(params.name.indexOf(params.seriesName) != -1 ) return;
                    return params.name + '>' + params.seriesName + '<br>' + '贡献度:<b style="color:#ffa600;font-weight:blod;font-size:18px;">' + params.data.value[2] + '</b>%';
                }
            }
        }
    },
    geo: {
        map: 'china',
        zoom:1,
        label: {
            normal: {
            	show: false,
                position: 'bottom',
                textStyle: {
                    color: "#bde4ff"
                }
            },
            emphasis: {
            	show:false,
                textStyle: {
                    color: "#bde4ff"
                }
            }
        },
        roam: true,
        itemStyle: {
            normal: {
                areaColor: 'rgba(72, 118, 255,0.9)',
                borderColor: '#fff'
            },
            emphasis: {
                areaColor: '#3952ca'
            }
        }
    },
    visualMap: {
        type: 'continuous',
        min: 0,
        max: 100,
        text: ['贡献度(%)'],
        textGap: 40,
        calculable: true,
        color: ['#ff3333', 'orange', 'yellow', 'lime', 'aqua', '#1E3FDE'],
        textStyle: {
            color: '#0e9cf1',
            fontSize: 16,
            align: 'center'
        }
    },
    series: handleResData(resData, areaObj,maxNum)
};
spaceRelated.setOption(relatedoption);
}

// 初始化地图完成

    // 点击主销区时的 ajax 交互
    $(".related .time-tab").on("click", "li", function() {
        var streamMonitorObj = {
            areaObj: switchArea(".related"), // 前台样式 无关交互\
            whichArea: getPeriod(".related"), // ajax 可能需要字段， 主销区 主产区哪个状态
            timeMonitor: MUTI.timeMonitor
        };
			if (streamMonitorObj.areaObj.selArea === '陕西') {
	            _setMap(SXdata,areaObj,maxNum)
	       }
	        if (streamMonitorObj.areaObj.selArea === '北京') {
	            _setMap(BJdata,areaObj,maxNum);
	        }
    });
    //点击地图切换
        spaceRelated.on('click', function(params) {

            if (params.name === '山东') {
                _setMap(SDdata,areaObj,maxNum)
            }
            if (params.name === '陕西') {
                _setMap(SXdata,areaObj,maxNum);
            }
            if (params.name === '北京') {
                _setMap(BJdata,areaObj,maxNum);
            }
        });

});


//时滞性部分柱状图图表
//模拟数据
var timeLagValueData1 = [15, 27, 17, 22, 29],
    timeLagValueData2 = [15, 17, 26, 17, 13],
    timeLagAreaData1 = ['河南', '福建', '黑龙江', '河北'],
    timeLagAreaData2 = ['内蒙古', '广西', '广东', '山西'];
var selectedName = $('.timelag .sel-area').val();
//初始化图表
var timeLag = echarts.init(document.getElementById('time-lag'));
initBar(timeLagAreaData1, timeLagValueData1);

function initBar(timeLagAreaData, timeLagValueData) {
    // var timeLag = echarts.init(document.getElementById('time-lag'));
    var timeLagOption = {
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
            extraCssText: 'box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);',
            formatter: function(params) {
                var str = selectedName + '>' + params[0].name + '<br/>价格传导滞后世间：' + '<b style="color:#ff7a00;font-weight:blod;font-size:18px;">' + params[0].value + '</b>' + '周';
                return str;
            }
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
            right: '5%',
            bottom: '1%',
            top: '30',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            name: '销地',
            nameTextStyle:{
	          fontSize: echartOpt.fz,
		      color:  echartOpt.color
	        },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#8ac7ff'
                }
            },
            axisLabel: {
                textStyle: {
                    fontSize: echartOpt.fz,
            		color:  echartOpt.color
                }
            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: '#476bbe'
                }
            },
            data: timeLagAreaData
        }],
        yAxis: [{
            type: 'value',
            name: '时间(周)',
	        nameTextStyle:{
	          fontSize: echartOpt.fz,
		      color:  echartOpt.color
	        },
            show: true,
            axisTick: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#77aded'
                }
            },
            axisLabel: {
                textStyle: {
					fontSize: echartOpt.fz,
		            color:  'echartOpt.color'
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#476bbe'
                }
            }
        }],
        series: [{
            name: '数量',
            type: 'bar',
            stack: '总量',
            barWidth: 20,
            itemStyle: {
                normal: {
                    barBorderRadius: [10, 10, 10, 10],
                    barBorderColor: '#0a9be6',
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgb(2, 238, 244)'
                    }, {
                        offset: 1,
                        color: 'rgba(17, 91, 183, 0.4)'
                    }])
                },
                emphasis: {
                    barBorderColor: '#31569c',
                }
            },
            // 顺序 从下向上 传入
            data: timeLagValueData
        }]
    };
    timeLag.setOption(timeLagOption);
};
/*$(function() {
	 var text = getMainArea(".timelag");
	 //console.log(text)
	 //initBar(timeLagAreaData1, timeLagValueData1);
    // console.log(te)
	 switch (text) {
            case '山东':
                selectedName = '山东';
                initBar(timeLagAreaData1, timeLagValueData1);
                break;
            case '陕西':
                selectedName = '陕西';
                initBar(timeLagAreaData2, timeLagValueData2);
                break;
            default:
       }
})*/
$(function () {
    $('')





})