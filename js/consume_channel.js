$(function(){







  var MUTI = {
      timeDir: './../',
      mapDir: '../',
      mapJson: './../Lib/data/json/',
      starDot: '<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:',
      endDot: '"></span>',
      notnum: 0,
      countryTime: null, // 地区比较时间轴
      areasTime: null, // 地区排名时间轴
      leftArea: '华北地区'
  };


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

   // 电商和批发市场模拟数据
    var dianshangData = [
        {"name":"海门","value":[121.15,31.89,90]},
        {"name":"鄂尔多斯","value":[109.781327,39.608266,120]},
        {"name":"招远","value":[120.38,37.35,120]},
        {"name":"舟山","value":[122.207216,29.985295,120]},
        {"name":"齐齐哈尔","value":[123.97,47.33,140]}];
    var pifaData = [
      {"name":"盐城某批发市场","value":[120.13,33.38,100]},
      {"name":"赤峰某批发市场","value":[118.87,42.28,100]},
      {"name":"青岛某批发市场","value":[120.33,36.07,100]},
      {"name":"乳山某批发市场","value":[121.52,36.89,100]},
      {"name":"金昌某批发市场","value":[102.188043,38.520089,100]}]
    var tradeFlowObj = {
         timeWhile: MUTI.countryTime, // ajax需要字段， 时间
         areas: getMainArea(".country-flow"), // ajax需要的字段，苹果种类，鲜苹果
         danwei: getDanwei(".country-flow"), // ajax需要的字段，单位 贸易额，贸易量
     };
    var channelMapCharts = new channelMap("map");
    channelMapCharts.init(dianshangData,1);

    initFrontTenEchart(0, tradeFlowObj)

    //电商，批发市场切换
    $(".channel-fenbu .pub-radio").on('click', "li", function() {
        //ajax...
        if($(this).text() === '电商'){
          //初始化图形
          channelMapCharts.init(dianshangData,1);
          //左上角信息
          messageFenbu(1)
          //这里应该获取总数量字段赋值给 $("#totalNum").text('10000')
          $("#totalNum").text('10000')
          $("#country-flow-time").show()
        }
        else{
          channelMapCharts.init(pifaData,2);
          messageFenbu(2)
          $("#totalNum").text('200')
          $("#country-flow-time").hide()
        }
    });


    //地图 滑动条
    var tradeFlowTime = new scrollBar({
        dom: document.getElementById('country-flow-time'),
        height: 12,
        // width: 800,
        position: 'bottom',
        backgroundImage: MUTI.timeDir + 'images/scale-bg.png',
        withTime: true,
        slideStart: MUTI.slideCurrentTime,
        slideBgImage: MUTI.timeDir + 'images/scroll-icon.png',
        data: [],
        tooltipWidth: 48,
        tooltipHeight: 20,
        tooltipImage: MUTI.timeDir + 'images/tooltip.png'
    });
    // 时间轴 初始化时间段，起始时间函数
    //initTimeControl(1)
    var arr = ['2010', '2011', '2013', '2014', '2015', '2016', '2017'];
    //var arr = data.data
    tradeFlowTime.setData(arr); //时间范围 后台取
    tradeFlowTime.setTime(arr[arr.length - 1]); //开始时间 默认最后一个
    MUTI.compareTime = arr[arr.length - 1];

    tradeFlowTime.scrollChange(function(time) {
        MUTI.countryTime = time;
        console.log(time);
    })


    //渠道销量 时间下拉框 首先发请求取得月份和年份的下拉 填充到页面
    //getNearTime(".channel-xiaoliang",'http://dadasffsa.das')
    //getNearTime(".channel-xiaoliang",'http://dadasffsa.das','month')
    //渠道销量模拟数据
    var channelXLData1 = {
      time : getTime(".channel-xiaoliang").split(','),
      dataDS : [70,110,145,165,135], //电商
      dataPF : [30,60,80,125,70] //批发市场
    }

    var channelXLData2 = {
      time : getTime(".channel-xiaoliang").split(','),
      dataDS : [10,120,145,165,135], //电商
      dataPF : [30,60,180,25,70] //批发市场
    }

    //渠道销量调用
    var channelXlCharts = new channelXl('xiaoliang')
    channelXlCharts.init(channelXLData1,1) //默认是月度的



    $(".channel-xiaoliang .pub-radio").on('click', "li", function() {
        //ajax...
        fillTime(".channel-xiaoliang")

        /**线图柱图切换**/
        var index = $(this).index();
        //$(".channel-xiaoliang .sec-ct .sec-part").eq(index).show().siblings('.sec-part').hide()


    });

    //点击月份下拉框

    $(".channel-xiaoliang .pub-time").on("click", ".month-item", function (e) {
        var channelXLData1 = {
          time : getTime(".channel-xiaoliang").split(','),
          dataDS : [70,110,145,22,200], //电商
          dataPF : [30,60,60,125,70] //批发市场
        }
        channelXlCharts.init(channelXLData1,1);
    })


    //点击年份下拉框
    $(".channel-xiaoliang .pub-time").on("click", ".time-yes", function(e) {
      var channelXLData1 = {
        time : getTime(".channel-xiaoliang").split(','), //[2015,2016,2017]
        dataDS : [70,110,145,22,200], //电商
        dataPF : [30,60,60,125,70] //批发市场
      }
      channelXlCharts.init(channelXLData1,2);
    });



    //渠道特征 时间下拉框 首先发请求取得月份和年份的下拉 填充到页面
    //getNearTime(".channel-tezheng",'http://dadasffsa.das')
    //getNearTime(".channel-tezheng",'http://dadasffsa.das','month')

    $(".channel-tezheng .pub-radio").on('click', "li", function() {
        //ajax...
        fillTime(".channel-tezheng")
        var text = $(this).text();
        if(text === '年度')
        {
            $("#analyze-timeCDPH").hide()
        }
        else{
            $("#analyze-timeCDPH").show()
        }
    });

    //渠道特征模拟数据
    var tzData1 = {
      data:[
        {name:'销地配送', value: 500},
        {name:'主产地配送', value: 1500}
      ]
    }

    var tzData2 = {
    				title:'xxx排名',
            xdata:['美国', '俄罗斯', '越南', '印度', '菲律宾', '缅甸', '韩国', '日本', '英国', '法国'],
            ydata:[11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    }

    var channelTZCharts1 = new channelTZ('tz1')
    var channelTZCharts2 = new channelTZS('tz2')

    channelTZCharts1.init(tzData1,1)
    channelTZCharts2.init(tzData2)

 		 /**
     * 渠道特征  点击左侧 echarts ，右侧echarts 图表 灌入不同数据
     */
    channelTZCharts1.myChart.on("click", function(params) {
    	console.log('ctt')
        console.log(params)
        //ajax调取数据
        var mockData = {
            title: params.name+'排名',
            xdata:['河北', '河南', '湖南', '湖北', '安徽', '北京', '天津', '上海', '重庆', '香港'],
            ydata:[2, 4, 12, 7, 14, 9, 11, 5, 15, 19]
        }
        channelTZCharts2.init(mockData)

    });
    //点击月份下拉框

    $(".channel-tezheng .pub-time").on("click", ".month-item", function (e) {
      var tzData1 = {
        data:[
          {name:'销地配送', value: 300},
          {name:'主产地配送', value: 1500}
        ]
      }
        channelTZCharts1.init(tzData1,1);
    })


    //点击年份下拉框
    $(".channel-tezheng .pub-time").on("click", ".time-yes", function(e) {
      var tzData2 = {
        data:[
          {name:'销地销量', value: 600},
          {name:'主产地销量', value: 1200}
        ]
      }
      channelTZCharts2.init(tzData2,2);
    });

})
function initTimeControl() {
    // after some ajax.....
    // arr 为 通过ajax 获取时间后的变量
    var url = 'bbb';
    //ajaxGetDataCall(url, '', timeCb);

    function timeCb(data) {
         var arr = ['a', 'b', 'c', 'd'];
        //var arr = data.data
        tradeFlowTime.setData(arr); //时间范围 后台取
        tradeFlowTime.setTime(arr[arr.length - 1]); //开始时间 默认最后一个
        MUTI.compareTime = arr[arr.length - 1];
    };
}

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



function channelMap(dom){
  this.dom = dom;
  this.myChart = echarts.init(document.getElementById(dom));
  this.opts = {
   tooltip : {
       trigger: 'item'
   },

   geo: {
       map: 'china',
       label: {
           emphasis: {
               show: false
           }
       },
       roam: true,
       itemStyle: {
           normal: {
               areaColor: 'rgba(72, 118, 255,0.9)',
               borderColor: '#111'
           },
           emphasis: {
               areaColor: '#3952ca'
           }
       }
   },
   series : [
       {
           name: '',
           type: 'effectScatter',
           coordinateSystem: 'geo',
           symbol:'',
           data:[],
           symbolSize: function (val) {
               var area = val[2] / 10;
               console.log(area)
               return area
           },
           label: {
               normal: {
                   formatter: '{b}',
                   position: 'right',
                   show: false
               },
               emphasis: {
                   show: false
               }
           },
           itemStyle: {
               normal: {
                   color: 'rgb(255,235,68)'
               }
           }
       }
   ]

  }
}

channelMap.prototype.init = function(data,flag) {
  this.opts.series[0].data = data
  this.opts.tooltip.formatter= tooltipOptsFn(flag)
  flag === 1 ? this.opts.series[0].symbol = 'circle' : this.opts.series[0].symbol = 'pin'
  this.myChart.setOption(this.opts)
}
//电商和批发市场的tooltip不一样
function tooltipOptsFn(flag){
  if(flag === 1){
    return function(pa){
      return pa.name + ':<b style="color:#ffa600;font-weight:blod;font-size:18px;">' + pa.data.value[2] + "</b>家"
    }
  }
  else{
    return function(pa){
      return pa.name
    }
  }
}


function messageFenbu(flag){
  var text = $('.spec_txt').text()
  //电商
  if(flag === 1){
    $('.spec_txt').text('电商网店样本数量')
  }
  else{
    $('.spec_txt').text('批发市场样本数量')
  }
}


//渠道销量函数
function channelXl(dom){
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
    },
    grid: {
        left: '15px',
        right: '15px',
        bottom: '20px',
        containLabel: true
    },
    legend: {
        right: '20',
        data:['电商'],
        textStyle: {
            color: '#fff'
        }
    },
    xAxis: {
         type : 'category',
         boundaryGap: true,
         axisLine: {
            lineStyle: {
                color: '#fff'
            }
        },
         axisLabel:{
                 interval: 0,
                 rotate:'0',
                 textStyle:{
                     fontSize:15,
                     color:'#fff'
                 }
         },

         data : [],
     },
    yAxis: {
        type: 'value',
        name:'月销量(吨)',
        show:true,
        min:'dataMin',
        axisTick: {
            show: false
        },
        axisLine: {
        	show:true,
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
            show:true,
            formatter: '{value}',
            lineStyle: {
                color: 'rgba(138, 199, 255, .2)'
            }
        }
    },
    series: [
        {
            name:'电商',
            type:'bar',
            smooth: true,
            symbolSize:15,
            barMaxWidth: 20,
            itemStyle: {
            normal: {
                color: '#3ed1a2',
                borderWidth:2,
                barBorderRadius: 30
            },
            emphasis: {
                 borderColor:'#3ed1a2'
            }
        },
            data:[],
        }

    ],
    "dataZoom": [{
      "show": true,
      "height": 15,
      "xAxisIndex": [0],
      left: '60',
      right: '60',
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

channelXl.prototype.init = function(data,flag){
  this.opts.xAxis.data = data.time;
  if(flag === 1){ // 电商
    this.opts.yAxis.name = '月销量(吨)'
    this.opts.series.forEach(function(v,i,a){
      v.type = 'line'
    })
  }
  else{
    this.opts.yAxis.name = '成交量(吨)'
    this.opts.series.forEach(function(v,i,a){
      v.type = 'bar'
    })
  }
  this.opts.series[0].data = data.dataDS
 // this.opts.series[1].data = data.dataPF
  this.myChart.setOption(this.opts)
}





//渠道特征
function channelTZ(dom){
  this.dom = dom;
  this.myChart = echarts.init(document.getElementById(dom));
  this.opts = {
    title: {
        text: '',
        left: 'center',
        top: 30,
        textStyle:{
            fontSize:16,
            color:'#fff'
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
        show: true,

        textStyle: { color: "#fff" },
        data: []
    },
    series: [{
        name: ' ',
        label: {
            normal: {
                formatter: '{c}吨 \n {d}% \n {b}',
                textStyle: {
                  fontSize:16
                }
            }
        },
        type: 'pie',
        labelLine: {
            normal: {
                length: 30,
                length2: 30

            }
        },

        radius: ['20%', '50%'],
        center: ['50%', '50%'],
        color: [],
        data: [

            {
                value:'',
                name: '',
                label: {
                    normal: {
                        textStyle: {
                            color: "#fc712e",

                        }
                    }
                },
                itemStyle: {
                    normal: {
                        barBorderRadius: 20,
                        shadowColor: 'rgba(0, 0, 0, 0.4)',
                        //shadowBlur: 20,

                    }
                }
            },{
                value: '',
                name: '',
                label: {
                    normal: {
                        textStyle: {
                            color: "",

                        }
                    }
                },
                itemStyle: {
                    normal: {
                        barBorderRadius: 20,
                        shadowColor: 'rgba(0, 0, 0, 0.4)',
                        //shadowBlur: 20,

                    }
                }
            }

        ]
    }]
  }
}

channelTZ.prototype.init = function(data,flag){
  if(flag === 1){
    this.opts.series[0].color = ['#f8df37', '#13e5f0'];
    this.opts.title.text = '电商主产地、销地配送量占比';
    //this.opts.legend.data = ['销地配送', '主产地配送'];
    this.opts.series[0].data[0].label.normal.textStyle.color = '#ebd536'
  }
  else{
    this.opts.series[0].color = ['#ff9b43','#3895e8'];
    this.opts.title.text = '批发市场主产地、销地销量占比';
    //this.opts.legend.data = ['销地销量', '主产地销量'];
    this.opts.series[0].data[0].label.normal.textStyle.color = '#ffa241'
  }
  var me = this;
  data.data.forEach(function(v,i){
    console.log(v)
    me.opts.series[0].data[i].name = v.name;
    me.opts.series[0].data[i].value = v.value;
  })
  this.myChart.setOption(this.opts);
}
/*渠道柱状图*/
function channelTZS(dom) {
    	  this.dom = dom;
  			this.myChart = echarts.init(document.getElementById(dom));
 				  this.opts = {
            // backgroundColor: '#1B2971',
             title: {
				        text: '',
				        left: 'center',
				        top: 20,
				        textStyle:{
				            fontSize:16,
				            color:'#fff'
				        },
				        x: 'center',
				        y: 'center'
				   },
            grid: {
                 left: '10%',
				        right: '20%',
				        bottom: '15%',
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
                data: [],
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
                        formatter: "{c}吨",
                        textStyle: {
                            fontSize: 16,
                            color: echartOpt.color
                        }
                    }
                },
                data: [],
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
    }
 channelTZS.prototype.init = function(data){
 	this.opts.title.text = data.title;
	 this.opts.yAxis[0].data = data.xdata;
	 this.opts.series[0].data = data.ydata;
   this.myChart.setOption(this.opts);
   window.onresize = this.myChart.resize;
}
/*     var tzData2 = {
      data:[
        {name:'销地销量', value: 300},
        {name:'主产地销量', value: 1200}
      ]
    } */
