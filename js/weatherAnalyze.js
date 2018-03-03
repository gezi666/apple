var MUTI = {
	mapDir: '../'
};
//获取数据
//lowDot:临界低温;lowT:最低温;heightDot:临界高温;heightT:最高温;Xdata:图表x轴时间;analyzeTimeData:拖动时间轴日期;seriesData:生育期临界时间点及生育期名;defenseLowT:防御低温临界温度;defenseHeightT:防御高温临界温度
var analyzeData = {
	Xdate: ['5-1', '5-2', '5-3', '5-4', '5-5', '5-6', '5-7', '5-8', '5-9', '5-10', '5-11', '5-12', '5-13', '5-14', '5-15', '5-16', '5-17', '5-18', '5-19', '5-20', '5-21', '5-22', '5-23', '5-24', '5-25', '5-26', '5-27', '5-28', '5-29', '5-30'],
	last7dayIndex: '5-23',
	seriesData: [{
			name: '休眠期',
			dateStart: '5-1',
			dateEnd: '5-5',
			heightDot: '13',
			sleepTime: '5-3',
			lowDot: '-',
			defenseT: '-',
			lowT: [{
				value: '-12'
			}, {
				value: '-10'
			}, {
				value: '-11'
			}, {
				value: '-15'
			}, {
				value: '-10'
			}],
			heightT: [{
				value: '30'
			}, {
				value: '35'
			}, {
				value: '45'
			}, {
				value: '34'
			}, {
				value: '20'
			}],
			tooltipNote: [{
					heightNote: ''
				},
				{
					lowNote: ''
				},
				{
					defenseNote: '7.2℃以下的低温小于1400小时，花芽发育不良'
				}
			]
		},
		{
			name: '芽萌动期',
			dateStart: '5-5',
			dateEnd: '5-14',
			heightDot: '30',
			lowDot: '-20',
			defenseT: '-15',
			lowT: [{
				value: -10
			}, {
				value: -23
			}, {
				value: -35
			}, {
				value: -30
			}, {
				value: -20
			}, {
				value: -25
			}, {
				value: -10
			}, {
				value: -27
			}, {
				value: -30
			}, {
				value: -35
			}],
			heightT: [{
				value: 20
			}, {
				value: 25
			}, {
				value: 23
			}, {
				value: 25
			}, {
				value: 22
			}, {
				value: 49
			}, {
				value: 50
			}, {
				value: 25
			}, {
				value: 27
			}, {
				value: 24
			}],
			tooltipNote: [{
					heightNote: '气温大于30℃，花芽停止生长'
				},
				{
					lowNote: '气温小于0℃，花芽发生冻害'
				},
				{
					defenseNote: '温度小于0℃，请注意防御花期冻害'
				}
			]
		}, {
			name: '花期',
			dateStart: '5-14',
			dateEnd: '5-20',
			heightDot: '35',
			lowDot: '-25',
			defenseT: '-22',
			lowT: [{
				value: -19
			}, {
				value: -35
			}, {
				value: -37
			}, {
				value: 1
			}, {
				value: -10
			}, {
				value: -15
			}],
			heightT: [{
				value: 26
			}, {
				value: 25
			}, {
				value: 17
			}, {
				value: 40
			}, {
				value: 25
			}, {
				value: 43
			}],
			tooltipNote: [{
					heightNote: '气温大于25℃，抑制花芽生理分化'
				},
				{
					lowNote: '气温小于-2.8℃，花蕾发生冻害'
				},
				{
					defenseNote: '温度小于0℃，请注意防御花期冻害'
				}
			]
		}, {
			name: '幼果期',
			dateStart: '5-20',
			dateEnd: '5-30',
			heightDot: '30',
			lowDot: '-30',
			defenseT: '-25',
			lowT: [{
				value: -20
			}, {
				value: -15
			}, {
				value: -10
			}, {
				value: -23
			}, {
				value: -25
			}, {
				value: -10
			}, {
				value: -39
			}, {
				value: -28
			}, {
				value: -26
			}, {
				value: -10
			}],
			heightT: [{
				value: 38
			}, {
				value: 25
			}, {
				value: 23
			}, {
				value: 37
			}, {
				value: 20
			}, {
				value: 22
			}, {
				value: 38
			}, {
				value: 35
			}, {
				value: 28
			}, {
				value: 17
			}],
			tooltipNote: [{
					heightNote: '气温大于35℃，果实停止生长'
				},
				{
					lowNote: '气温小于-1℃，幼果发生冻害'
				},
				{
					defenseNote: '温度小于2.2℃，请注意防御冻害'
				}
			]
		}
	]
};

//echarts 初始化
var cropAnalyze = echarts.init(document.getElementById('crop-analyze'));
//获取元素在数组中的index值的方法
let getArrIndex = function(arr, obj) {
	let index = null;
	arr.every(function(value, i) {
		if(value === obj) {
			index = i;
			return false;
		}
		return true;
	});
	return index;
};

//判断日期是否在某个区间内的方法

function isBetween(dateString, start, end) {
	var flag = false;
	var startFlag = (dateCompare(dateString, start) < 1);
	var endFlag = (dateCompare(dateString, end) > -1);
	if(startFlag && endFlag) {
		flag = true;
	}
	return flag;
};
//创建固定长度数组方法
function creatArray(length, array, element) {
	var array = [];
	for(var i = 0; i < length; i++) {
		array.push(element);
	}
	return array;
}
var periodName = '';
var sleepTime = '';
var lowT = [],
	lowDot = [],
	heightT = [],
	heightDot = [];
var tooltipNote = [];
analyzeData.seriesData.forEach(function(obj, index, all) {
	var Tlength = obj.lowT.length;
	lowT = lowT.concat(obj.lowT);
	heightT = heightT.concat(obj.heightT);
	lowDot += creatArray(Tlength, lowDot, obj.lowDot) + ',';
	heightDot += creatArray(Tlength, heightDot, obj.heightDot) + ',';
})
//console.log(lowT)
//处理高低温临界点为数组
lowDot = lowDot.substring(0, lowDot.length - 1);
lowDot = lowDot.split(',');
heightDot = heightDot.substring(0, heightDot.length - 1);
heightDot = heightDot.split(',');
//获取产生预测点在x轴的index值
var last7dayIndex = getArrIndex(analyzeData.Xdate, analyzeData.last7dayIndex);
//判断预测抵御点在那条线上,1表示在低温线上,2表示在高温线上
var flag = 1;
/*heightDot = ["13", "13", {
	value: 13,
	symbol: 'circle',
	itemStyle: {
		normal: {
			color: 'rgb(222,119,53)',
			borderWidth: 1,
			borderColor: '#fff'
		}
	},
	symbolSize: '10',
	tooltip: {
		trigger: 'item',
		formatter: function(params) {
			return '7.2℃以下的低温小于1400小时，花芽发育不良';
		}
	}
}, "13", "13", "30", "30", "30", "30", "30", "30", "30", "30", "30", "30", "35", "35", "35", "35", "35", "35", "30", "30", "30", "30", "30", "30", "30", "30", "30", "30"];*/

var str = '{ "name": "cxh", "sex": "man" }'; 
//var obj =eval('('+str+')')
//var obj = str.parseJSON()
var obj = JSON.parse(str)
console.log(obj)
/***
 * 低温线部分
 * ***/
analyzeData.seriesData.forEach(function(obj, index, all) {
	var note = null;
	var note = obj.tooltipNote[1].lowNote;
	obj.lowT.forEach(function(v, i, a) {
		if(parseInt(v.value) < parseInt(obj.lowDot)) {
			v.symbol = 'circle';
			v.itemStyle = {
				normal: {
					color: '#ff0',
					borderWidth: 1,
					borderColor: '#fff'
				}
			};
			v.symbolSize = '10';
			v.tooltip = {
				trigger: 'item',
				formatter: function(params) {
					return params.name + '<br/>' + params.seriesName + '：' + params.value + '<br/>结果分析：<br/>' + note;
				}
			};
		}
		//判断预测期是否存在给不同提示
		else if(typeof last7dayIndex != 'undefined' && parseInt(v.value) < parseInt(obj.defenseT) && flag == 1) {
			v.symbol = 'circle';
			v.itemStyle = {
				normal: {
					color: 'rgb(222,119,53)',
					borderWidth: 1,
					borderColor: '#fff'
				}
			};
			v.symbolSize = '10';
			v.tooltip = {
				trigger: 'item',
				formatter: function(params) {
					return params.name + '<br/>当前温度' + '：' + params.value + '<br/>防御温度为：' + obj.defenseT + '度<br/>' + note;
				}
			}
		}
	})

})

/***
 * 高温线部分
 * ***/

analyzeData.seriesData.forEach(function(obj, index, all) {
	var note = null;
	var note = obj.tooltipNote[0].heightNote;
	
	
	periodName = obj.name;
	sleepTime = obj.sleepTime;	
	var sleepTimeIndex = getArrIndex(analyzeData.Xdate, sleepTime);

	obj.heightT.forEach(function(v, i, a) {
		if(parseInt(v.value) > parseInt(obj.heightDot)) {
			v.symbol = 'circle';
			v.itemStyle = {
				normal: {
					color: '#ff0',
					borderWidth: 1,
					borderColor: '#fff'
				}
			};
			v.symbolSize = '10';
			v.tooltip = {
				trigger: 'item',
				formatter: function(params) {
					return params.name + '<br/>' + params.seriesName + '：' + params.value + '<br/>结果分析：<br/>' + note;
				}
			};
		} else if(typeof last7dayIndex != 'undefined' && obj.defenseT < parseInt(v.value) < parseInt(obj.heightDot) && flag == 2) {
			v.symbol = 'circle';
			v.itemStyle = {
				normal: {
					color: 'rgb(222,119,53)',
					borderWidth: 1,
					borderColor: '#fff'
				}
			};
			v.symbolSize = '10';
			v.tooltip = {
				trigger: 'item',
				formatter: function(params) {
					return params.name + '<br/>当前温度' + '：' + params.value + '<br/>防御温度为：' + obj.defenseT + '度<br/>' + note;
				}
			}
		}

	})
	var replaceArray={};
	heightDot.forEach(function(v, i, a) {
		if(periodName == '休眠期' && sleepTimeIndex==i) {		
			replaceArray = {
				value:v,
				symbol: 'circle',
				itemStyle:{
					normal: {
						color: 'rgb(222,119,53)',
						borderWidth: 1,
						borderColor: '#fff'
					}
				},
				symbolSize: '10',
				tooltip:{
					trigger: 'item',
					formatter: function(params) {
						return params.name + '<br/>7.2℃以下的低温小于1400小时，花芽发育不良';
					}
				}		
				
			}
			
			
			heightDot.splice(sleepTimeIndex,1,replaceArray)
		}
			
})	
	
})




//图表series部分

var lineseries = [];
var Xdate = analyzeData.Xdate;
analyzeData.seriesData.forEach(function(v, i, a) {
	if(Xdate.indexOf(v.dateStart) > -1 || Xdate.indexOf(v.dateEnd) > -1) {
		var data1 = {
			name: v.name,
			type: 'line',
			symbol: 'none',
			smooth: true,
			markArea: {
				silent: true,
				data: [
					[{
						name: v.name,
						xAxis: v.dateStart
					}, {
						xAxis: v.dateEnd
					}]
				]
			}
		};
		lineseries.push(data1);
	}
})
//向lineseries数组里追加四条线
lineseries.push({
	name: '临界高温',
	type: 'line',
	symbol: 'none',
	smooth: true,
	data: heightDot

}, {
	name: '最高温',
	type: 'line',
	symbol: 'none',
	smooth: true,
	data: heightT
}, {
	name: '最低温',
	type: 'line',
	symbol: 'none',
	smooth: true,
	data: lowT,
	smooth: true,
	symbolSize: 10
}, {
	name: '临界低温',
	type: 'line',
	step: 'start',
	symbol: 'none',
	data: lowDot
})

//图表设置部分
var analyzeOption = {
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			//type: 'shadow',
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
		extraCssText: 'box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);',
	},

	legend: {
		data: ['临界高温', '最高温', '最低温', '临界低温'],
		textStyle: {
			//fontSize: echartOpt.fz,
			color: echartOpt.color
		},
        right: '30',
        top: '0',
        textStyle: {
            color: echartOpt.color,
            //fontSize: echartOpt.fz
        },
        itemGap: 20,
        itemHeight: 15,
        itemWidth: 25
	},
	grid: {
		top: 50,
		left: 50,
		right: 10,
		bottom: 50
	},
	xAxis: [{
		boundaryGap: false,
		type: 'category',

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
				color: echartOpt.color
			}
		},
		splitLine: {
			show: false,
			lineStyle: {
				color: '#476bbe'
			}
		},

		data: analyzeData.Xdate
	}],
	yAxis: [{
		type: 'value',
		name: '温度（℃）',
		nameTextStyle: {
			fontSize: echartOpt.fz,
			color: echartOpt.color
		},
		/*min: -60,
		max: 60,*/
		position: 'left',
		axisTick: {
			show: false
		},
		axisLine: {
			onZero: false,
			lineStyle: {
				color: '#8ac7ff'
			}
		},
		axisLabel: {
			textStyle: {
				fontSize: 15,
				color: '#fff'
			}
		},
		splitLine: {
			show: false,
			lineStyle: {
				color: '#476bbe'
			}
		}
	}],
	color: ['#4fabfd', '#af4ffd', '#f9be82', '#fe636d', '#61e3e0', '#3cf872', '#e962f6', '#fee83a'],
	series: lineseries
};
cropAnalyze.setOption(analyzeOption);

// 拖动的时间轴
var analyzeTimeData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
var beyondtfBar = new scrollBar({
	dom: document.getElementById('analyze-time'),
	height: 12,
	//width: 240,
	position: 'bottom',
	backgroundImage: MUTI.mapDir + 'images/scale-bg.png',
	slideStart: 'left',
	slideBgImage: MUTI.mapDir + 'images/scroll-icon.png',
	data: analyzeTimeData,
	tooltipWidth: 48,
	tooltipHeight: 20,
	//tooltipFontSize:16,
	tooltipImage: MUTI.mapDir + 'images/tooltip.png'
});
beyondtfBar.scrollChange(function(e) {
	console.log(e);
})