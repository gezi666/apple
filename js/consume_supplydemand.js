$(function() {

	//拼接x轴的时间方法
	function DealxAxis(years) {
		var srt = '',
			newyears = [];
		years.forEach(function(v, i) {
			/*str=v.substring(2);			
			var strlast = str > 8 ? (parseInt(str)+1) : '0' + (parseInt(str)+1);*/
			newyears.push((parseInt(v) - 1) + '/' + v);
		})
		return newyears;
	}
	
	function getMin(min){
		var num = parseInt(min);
        var leng = num.toString().length;
        var newNum = '';
        if(leng ==2){
        	newNum = (Math.floor(num*0.9));
        }else if(leng == 3){
        	newNum = (Math.floor(num/10))*10;
        }else if(leng == 4){
        	newNum = (Math.floor(num/100))*100;
        }else if(leng == 5){
        	newNum = (Math.floor(num/10000))*10000;
        }		
        return newNum;        
	}

/**
 * ****供求现状的js
 * */
	//初始化图表的数据
	var times = getTime(".actuality");
	var timesArr = times.split(',');
	var supplyObj = {
		year: DealxAxis(timesArr),
		DataXFZL: [2500, 1900, 2400, 2300, 2600, 2890, 2690, 2200, 2000, 2300],
		DataPGZL: [2000, 1300, 1800, 2330, 1350, 1500, 1430, 1600, 1750, 2000],
		DataCLBHL: [1.2, 1.3, 1.8, 2.3, 1.3, 1.5, 1.4, 1.6, 1.7, 2.0],
		DataXFLBHL: [2.3, 1.3, 1.5, 2.0, 1.8, 1.4, 1.6, 1.7, 2.0, 1.3]
	};
	supplydemand('supplydemand', supplyObj)

	//供求现状时间选择
	$(".actuality .pub-time").on("click", ".time-yes", function(e) {
		e.stopPropagation();
		// 获取 已勾选的时间段	
		var times = getTime(".actuality");
		var timesArr = times.split(',');
		var supplyObj = {
			year: DealxAxis(timesArr),
			DataXFZL: [2500, 1900, 2400, 2300, 2600, 2890, 2690, 2200, 2000, 2300],
			DataPGZL: [2000, 1300, 1800, 2330, 1350, 1500, 1430, 1600, 1750, 2000],
			DataCLBHL: [1.2, 1.3, 1.8, 2.3, 1.3, 1.5, 1.4, 1.6, 1.7, 2.0],
			DataXFLBHL: [2.3, 1.3, 1.5, 2.0, 1.8, 1.4, 1.6, 1.7, 2.0, 1.3]
		}
		supplydemand('supplydemand', supplyObj)
	});

	function supplydemand(dom, data) {
		var data = data;
		var echartOpt = {
			fz: '15',
			color: '#fff'
		};
		var myChart = echarts.init(document.getElementById(dom));
		var option = {
			//backgroundColor: '#1b237e',    
			grid: {
				right: '5%',
				left: '5%',
				bottom: '10%',
				top: '15%'
			},
			"dataZoom": [{
				"show": true,
				"height": 15,
				"xAxisIndex": [0],
				left: '100',
				right: '100',
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
				/*formatter: function(params, ticket, callback) {
					return  params[0].name + "年" + "<br />" +  params[0].seriesName + ":" +  + params[0].value + "万吨<br>" +  params[1].seriesName + ":" +  params[1].value + "万吨<br>" + "<span style='color:#82bcff'>" + params[2].seriesName + ":"  + params[2].value + "%" + "<br>" + params[3].seriesName + ": " + params[3].value + "%";
				},*/
                formatter: function(params) {
                    var str = params[0].name + "年<br>";
                    params.forEach(function(v, i) {
                        var unite = params[i].seriesType === "bar" ? "万吨" : "%"
                        str += v.seriesName + ": " + v.value + unite + "<br>";
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
				data: ['苹果产量', '国内苹果消费总量', '产量变化率', '消费量变化率'],
				right: '60',
				top: '0',
				textStyle: {
					color: echartOpt.color,
					//fontSize: echartOpt.fz
				},
                //selectedMode:false,
				itemGap: 20,
				itemHeight: 15,
				itemWidth: 25
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
					//interval: 0,
					rotate: '0',
					textStyle: {
						//fontSize: echartOpt.fz,
						color: echartOpt.color
					}
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: ['#2f46a1']
					}
				},
				data: data.year,
			},
			yAxis: [{
				name: "(万吨)",
				type: 'value',
				//min: 'dataMin',
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
				name: "变化率(%)",
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
			series: [{
				name: '苹果产量',
				type: 'bar',
				barMaxWidth: 20,
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
				data: data.DataXFZL

			}, {
				name: '国内苹果消费总量',
				type: 'bar',
				barMaxWidth: 20,
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
				data: data.DataPGZL

			}, {
				name: '产量变化率',
				type: 'line',
				symbolSize: 0,
				smooth: true,
				yAxisIndex: 1,
				itemStyle: {
					normal: {
						color: '#fdeb59'
					}
				},
				data: data.DataCLBHL,
				zlevel: 9
			}, {
				name: '消费量变化率',
				type: 'line',
				symbolSize: 0,
				smooth: true,
				yAxisIndex: 1,
				itemStyle: {
					normal: {
						color: '#3ed1a2'
					}
				},
				data: data.DataXFLBHL,
				zlevel: 9
			}]
		};
		myChart.setOption(option);
	}

	/**
	 * 供需结余量部分
	 **/

	//获取时间框内的时间段
	var times = getTime(".actuality");
	var timesArr = times.split(',');
	var balanceAmountObj = {
		year: DealxAxis(timesArr),
		DataJYL: [2500, 1900, 2400, 2300, 2600, 2890, 2690, 2200, 2000],
		DataJYBHL: [2.3, 1.3, 1.5, 2.0, 1.8, 1.4, 1.6, 1.7, 2.0]

	};
	balanceAmount('balanceAmount', balanceAmountObj)
	//供需结余量时间选择
	$(".balance-amount .pub-time").on("click", ".time-yes", function(e) {
		e.stopPropagation();
		// 获取 已勾选的时间段	
		var times = getTime(".balance-amount");
		var timesArr = times.split(',')
		var balanceAmountObj = {
			year: DealxAxis(timesArr),
			DataJYL: [2500, 1900, 2400, 2300, 2600, 2890, 2690, 2200, 2000, 2300],
			DataJYBHL: [2.3, 1.3, 1.5, 2.0, 1.8, 1.4, 1.6, 1.7, 2.0, 1.3]
		}
		balanceAmount('balanceAmount', balanceAmountObj)
	});

	function balanceAmount(dom, data) {
		var data = data;
		var echartOpt = {
			fz: '15',
			color: '#fff'
		};
		var myChart = echarts.init(document.getElementById(dom));
		var option = {
			//backgroundColor: '#1b237e',    
			grid: {
				right: '5%',
				left: '5%',
				bottom: '10%',
				top: '15%'
			},
			"dataZoom": [{
				"show": true,
				"height": 15,
				"xAxisIndex": [0],
				left: '100',
				right: '100',
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
				/*formatter: function(params, ticket, callback) {
                    console.log(params)
					return  params[0].name + "年<br />" +  params[0].seriesName + ":" + params[0].value + "万吨" + "<br>" + params[1].seriesName + ":" +  params[1].value + "%"
				},*/
                formatter: function(params) {
                    var str = params[0].name + "年<br>";
                    params.forEach(function(v, i) {
                        var unite = params[i].seriesType === "bar" ? "万吨" : "%"
                        str += v.seriesName + ": " + v.value + unite + "<br>";
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
				data: ['供需结余量', '供需结余变化率'],
				right: '60',
				top: '0',
				textStyle: {
					color: echartOpt.color,
					//fontSize: echartOpt.fz
				},
                //selectedMode:false,
				itemGap: 20,
				itemHeight: 15,
				itemWidth: 25
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
					//interval: 0,
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
				data: data.year,
			},
			yAxis: [{
				name: "(万吨)",
				type: 'value',
				//min: 'dataMin',
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
				name: "变化率(%)",
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
			series: [{
				name: '供需结余量',
				type: 'bar',
				barMaxWidth: 20,
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
				data: data.DataJYL

			}, {
				name: '供需结余变化率',
				type: 'line',
				symbolSize: 0,
				smooth: true,
				yAxisIndex: 1,
				itemStyle: {
					normal: {
						color: '#fdeb59'
					}
				},
				data: data.DataJYBHL,
				zlevel: 9
			}]
		};
		myChart.setOption(option);
	}
    /**
     * 单变量分析的模拟data
     * */
        //消费预测的模拟data
    var dataJG = {
            flag: 3,
            Xdate: ['2012/2013', '2013/2014', '2014/2015', '2015/2016', '2016/2017', '2017/2018*', '2018/2019*', '2019/2020*', '2020/2021*'],
            dataJGTX: [25, 110, 70, 80, 45, 65, 35, 25, 50], //需求价格弹性
        };
    //单变量分析的模拟data
    var dataSR = {
        flag: 4,
        Xdate: ['2012/2013', '2013/2014', '2014/2015', '2015/2016', '2016/2017', '2017/2018*', '2018/2019*', '2019/2020*', '2020/2021*'],
        dataSRTX: [125, 80, 130, 110, 145, 165, 135, 125, 110], //需求收入弹性
    };

	/**
	 * 供求预测的模拟data
	 * */
	//消费预测的模拟data
	var dataXF = {
		flag: 1,
		Xdate: ['2012/2013', '2013/2014', '2014/2015', '2015/2016', '2016/2017', '2017/2018*', '2018/2019*', '2019/2020*', '2020/2021*'],
		dataXFYC: [25, 110, 70, 80, 45, 65, 35, 25, 50], //消费预测值
		dataXFSJ: [10, 90, 60, 50, 35, 45, 25, '-', '-'] //消费实际值
	};
	//产量预测的模拟data
	var dataCL = {
		flag: 2,
		Xdate: ['2012/2013', '2013/2014', '2014/2015', '2015/2016', '2016/2017', '2017/2018*', '2018/2019*', '2019/2020*', '2020/2021*'],
		dataCLYC: [125, 80, 130, 110, 145, 165, 135, 125, 110], //产量实际值
		dataCLSJ: [100, 70, 120, 100, 135, 155, 123, '-', '-'] //产量预测值
	};

	function InitEcharts(dom) {
		this.dom = dom;
		this.myChart = echarts.init(document.getElementById(dom));
		this.opts = {
			//backgroundColor: '#263c9f',
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow',
					shadowStyle: {
						color: 'rgba(0,46, 115, 0.3)'
					}
				},
				/*formatter: function(params, ticket, callback) {
					return params[0].name + "年" + "<br />"  + params[0].seriesName + ":" + params[0].value + "万吨" + "<br>" + params[1].seriesName + ":" + params[1].value + "万吨"
				},*/
                formatter: function(params) {
                    var str = params[0].name + "年<br>";
                    params.forEach(function(v, i) {
                        //var unite = params[i].seriesType === "bar" ? "万吨" : "%"
                        str += v.seriesName + ": " + v.value + '万吨' + "<br>";
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
			grid: {
				left: '15px',
				right: '55px',
				bottom: '0',
				containLabel: true
			},
			legend: {
				right: 60,
				top: 20,
				data: [],
				textStyle: {
					color: '#fff'
				}
			},
            //selectedMode:false,
			xAxis: {
				type: 'category',
				boundaryGap: false,
				axisLine: {
					lineStyle: {
						color: '#8ac7ff'
					}
				},
				axisLabel: {
					textStyle: {
						color: echartOpt.color,
						//fontSize: echartOpt.fz
					}
				},
				data: []
			},
			yAxis: {
				type: 'value',
				name: '(万吨)',
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
							color: '',
							borderWidth: 2
						}
					},
					data: []
				},
				{
					name: '',
					type: 'line',
					symbolSize: 15,
					itemStyle: {
						normal: {
							color: '',
							borderWidth: 2
						}
					},
					smooth: true,
					data: []
				}
			]
		};

	}

	InitEcharts.prototype.init = function(data) {
		var num = data.flag;
		if(num === 1) {
			this.opts.xAxis.data = data.Xdate;
			this.opts.legend.data = ['国内苹果消费总量实际值', '国内苹果消费总量预测值'];
			this.opts.series[0].data = data.dataXFYC;
			this.opts.series[0].itemStyle.normal.color = '#D5CD15';
			this.opts.series[0].name = '国内苹果消费总量预测值';
			this.opts.series[1].data = data.dataXFSJ;
			this.opts.series[1].itemStyle.normal.color = '#FB6205';
			this.opts.series[1].name = '国内苹果消费总量实际值';
		} else if(num === 2) {
			this.opts.xAxis.data = data.Xdate;
			this.opts.legend.data = ['产量实际值', '产量预测值'];
			this.opts.series[0].data = data.dataCLYC;
			this.opts.series[0].itemStyle.normal.color = '#23B0E5';
			this.opts.series[0].name = '产量预测值';
			this.opts.series[1].data = data.dataCLSJ;
			this.opts.series[1].itemStyle.normal.color = '#29B037';
			this.opts.series[1].name = '产量实际值';
		} else if(num === 3) { //单变量分析部分
            this.opts.xAxis.data = data.Xdate;
            this.opts.legend.data = ['需求价格弹性'];
            this.opts.series[0].data = data.dataJGTX;
            this.opts.series[0].itemStyle.normal.color = '#23B0E5';
            this.opts.series[0].name = '需求价格弹性';
            this.opts.yAxis.name = '弹性系数';
            this.opts.yAxis.min = 'dataMin';
        } else if(num === 4) {
            this.opts.xAxis.data = data.Xdate;
            this.opts.legend.data = ['需求收入弹性'];
            this.opts.series[0].data = data.dataSRTX;
            this.opts.series[0].itemStyle.normal.color = '#29B037';
            this.opts.series[0].name = '需求收入弹性';
            this.opts.yAxis.name = '弹性系数';
            this.opts.yAxis.min = 'dataMin';
        }
		this.myChart.setOption(this.opts)
	}
    /**
     * //供求预测部分默认图表为产量预测
     * *
     * */
    var charts = new InitEcharts('supplyForecast');
    charts.init(dataCL);
    $(".some-class .pub-radio").on('click', "li", function() {
        if($(this).text() === '消费预测') {
            charts.init(dataXF);
        } else if($(this).text() === '产量预测') {
            charts.init(dataCL);
        }
    });


/**
 * 供求与价格部分echarts 图表函数封装
 */
    var supplyPrice = echarts.init(document.getElementById('supplyPrice'));
    function initsupplyPrice(data, obj) {
        var supplyPriceOption = {
            grid: {
                right: '5%',
                left: '7%',
                bottom: '10%',
                top: '15%'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    shadowStyle: {
                        color: 'rgba(0,46, 115, 0.3)'
                    }
                },
                /*formatter: function(params, ticket, callback) {
                	var tooltipName = (params[1].seriesName)==='批发价格' ? '元/公斤' : '%';
					return params[0].name + "年" + "<br />" + params[0].seriesName + ":"  + params[0].value + "%" + "<br>" + params[1].seriesName + ":"  + params[1].value +  tooltipName
				},*/
                formatter: function(params) {
                    var str = params[0].name + "年<br>";
                    params.forEach(function(v, i) {
						if(v.seriesName==='批发价格'){
                            str += v.seriesName + ": " + v.value + '元/公斤' + "<br>";
						}else{
                            str += v.seriesName + ": " + v.value + '%' + "<br>";
						}
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
                data: ['产量变化率', '价格趋势'],
                right: '60',
                top: '0',
                textStyle: {
                    color: echartOpt.color,
                    //fontSize: echartOpt.fz
                },
                //selectedMode:false,
                itemGap: 20,
                itemHeight: 15,
                itemWidth: 25
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
                    //interval: 0,
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
                data: ['2006/2007', '2007/2008', '2008/2009', '2009/2010', '2010/2011', '2011/2012', '2012/2013', '2013/2014', '2014/2015', '2015/2016', '2016/2017*'],
            },
			yAxis: [{
				name: "变化率(%)",
				type: 'value',
				//min: 'dataMin',
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
				name: "元/公斤",
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
            series: [{
                name: '产量变化率',
                type: 'line',
                symbolSize: 15,
                barMaxWidth: 20,
                itemStyle: {
						normal: {
							color: '#23B0E5',
							borderWidth: 2
						}
					},
				smooth: true,
                data: [],
                zlevel: 9

            }, {
                name: '价格趋势',
                type: 'line',
                symbolSize: 15,
                barMaxWidth: 20,
                yAxisIndex: 1,
                itemStyle: {
						normal: {
							color: '#29B037',
							borderWidth: 2
						}
					},
				smooth: true,
                data: [],
                zlevel: 9

            }]
        };
        var legend = [obj.areas, obj.danwei]
        var yUnite = obj.danwei === '批发价格' ?  '批发价格（元/公斤）'  :  (obj.danwei + '（%）')
        var newOption = {
            legend: {
                data: legend
            },
            yAxis: [{
            	 name: obj.areas + '（%）'
            },{
            	 name: yUnite
            }],
            series: [{
                name: legend[0],
                data: [1.8, 3.3, 3.5, 3.7, 2.3, 1.5, 2.0, 2.8, 2.3, 0.4, 1.5],
            }, {
                name: legend[1],
                data: [1.3, 2.3, 2.5, 2.7, 1.3, 0.4, 1.5, 1.9, 1.3, 1.5, 2.0],
            }]
        }
        $.extend(true, supplyPriceOption, newOption);
        supplyPrice.setOption(supplyPriceOption, true);
    }
    // ajax 获取数据后调用 echarts 图表渲染函数
    function getPriceData() {
    	var tootipName = getDanwei(".supply-price") ==='价格波动' ? '批发价格变化率' : '批发价格';
        var tradePriceObj = {
            areas: getMainArea(".supply-price"), // ajax需要的字段，产量变化率，供需结余变化率
            danwei: tootipName, // ajax需要的字段，价格波动(批发价格变化率) 价格趋势(批发价格)
        };
        initsupplyPrice(0, tradePriceObj)
    }

    /**
     * 供求与价格 ajax 交互
     * 第一次打开页面时初始化图表
     */
    getPriceData()

    /**
     * 供求与价格 ajax 交互
     * 根据 产量变化率还是 渲染 echarts 表
     */
    $(".supply-price .fake-ul").on("click", "li", function() {
        getPriceData()
    });

    /**
     * 供求与价格 ajax 交互
     * 根据 价格趋势还是价格波动   渲染 echarts 图表
     */
    $(".supply-price .pub-radio").on('click', "li", function() {
        getPriceData()
    });


/**
 * ******** 影响因素的js
 * */


	//影响因素的模拟data

//serise里的模拟data
	var seriesData = [{
		name: '苹果价格',
		data: [1.2, 0.23]
	}, {
		name: '苹果替代品价格(西瓜)',
		data: [0.23, -1.12]
	}, {
		name: '国内生产总值',
		data: [0.12, 0.3]
	}]
	//取出数据中的name作为legend的数据
	var legendData = [];
	seriesData.forEach(function(v,i){
		legendData.push(v.name)
	})
	//x轴里的数据
    var	Xdate = ['1995/96年度--2003/04年度', '2004/05年度--2015/16年度'];


	setFactor(seriesData);

	function setFactor(data) {
        var influencingFactor = echarts.init(document.getElementById('influencingFactor'));
	    console.log(data)
		var echartOpt = {
			fz: '15',
			color: '#fff'
		};

		var influencingFactorOption = {
			grid: {
				right: '5%',
				left: '5%',
				bottom: '10%',
				top: '10%'
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow',
					shadowStyle: {
						color: 'rgba(0,46, 115, 0.3)'
					}
				},
				/*formatter: function(params) {
					var str = '';
					params.forEach(function(v, i) {
						str += '苹果的需求收入' + '<br>' + '弹性系数： ' + '<span style="color:#FF8F00;font-size:20px;font-weight:bold">' + params[0].data + '</span>';
					});
					return str

				},*/
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
				show: true,
				data: legendData,
				right: '60',
				top: '0',
				textStyle: {
					color: echartOpt.color,
					//fontSize: echartOpt.fz
				},
                //selectedMode:false,
				itemGap: 20,
				itemHeight: 15,
				itemWidth: 25
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
					//interval: 0,
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
				data: Xdate
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
			series: setSerise(data)
		};
		influencingFactor.setOption(influencingFactorOption);
        //点击图表显示对应的单变量图表
        $('.moreBariableBut').hide();
        influencingFactor.on('click', function (params) {
            if(params.seriesName == '苹果价格'){
                var chartsSingle = new InitEcharts('influencingFactor');
                chartsSingle.init(dataJG);
                $('.secondTitle').text('单变量分析');
				$(".moreBariableBut").show();
            }else if (params.seriesName == '国内生产总值'){
                var chartsSingle = new InitEcharts('influencingFactor');
                chartsSingle.init(dataSR);
                $('.secondTitle').text('单变量分析');
                $(".moreBariableBut").show();
            }
        });
	}

//封装serise的方法
    function setSerise(dataArr){
        var serise = [];
        var colors = ['lime','#00e6f2', '#e7ea00', '#ffa91a',"#FFFF99","#B5FF91","#94DBFF","#FFBAFF","#FFBD9D","#C7A3ED","#CC9898","#8AC007","#CCC007","#FFAD5C"];
        dataArr.forEach(function(item,i){
            serise.push(
                {
                    name: item.name,
                    label:{
                        normal:{
                            show:true,
                            position: 'top',
                            textStyle:{
                                fontSize:14,
                                color:'#fff'
                            },
                            formatter:'{c}'
                        }
                    },
                    type: 'bar',
                    barMaxWidth: 50,
                    itemStyle: {
                        normal: {
                        	color:colors[i],
                            opacity: 0.6,
                            barBorderRadius: 10
                        },
                        emphasis: {
                            opacity: 1
                        }
                    },
                    data:item.data,
                    zlevel: 9,
                    markLine: {
                        lineStyle:{normal:{color:'#fff'}},
                        data: [{
                            name: '最小值到最大值',
                            type: 'min',
                            yAxis: -1
                        },
                        {
                            type: 'max',
                            yAxis: 1
                        }
                        ]
                    }
                },
            )
        })
		return serise;
    };


//点击返回显示多变量分析图表

    $(".moreVariable .moreBariableBut").on('click',  function() {
        $(this).hide();
        $("#influencingFactor").html("");
        $('.secondTitle').text('多变量分析');
        setFactor(seriesData);
    });
})