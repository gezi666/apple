/**
 * Created by mengshaohua on 2017/5/15.
 */
function map() {
    return {
        init: function (option) {
        	var me = this;
            var dom = null;
            if (!option.dom) throw new Error('未检测到dom');
            if (option.dom.length) dom = option.dom[0]
            else dom = option.dom;
            me.myChart = echarts.init(dom);
            me.titleTop = option.titleTop;
            me.mapTop = option.mapTop;            
            me.op = {
                title: {
                    text: '',
                    left: 'center',
                    textStyle: {
						color: '#fff',
						fontSize: '20',
						fontStyle:'normal'
					},
                     top: me.titleTop                   
                },            	
            	tooltip: {
                    formatter: option.tooltipCallBack
               },
                series: [
                    {
                        type: 'map',
                        top: me.mapTop,                        
                        mapType: '',
                        zoom:1,
                        roam: true,
                        itemStyle: option.itemStyle || {
                            normal: {
                                borderColor: '#389BB7',
                                areaColor: '#fff'
                            },
                            emphasis: {
                                areaColor: '#389BB7',
                                borderWidth: 0
                            }
                        },
                        data: []
                    }
                ]
            };
        },
        setVisualMap: function (option) {
            var me = this;
            me.op.title.text = option.mapTitle;
            me.op.visualMap = {
                type: 'continuous',
                itemWidth: option.itemWidth || 25,
                itemHeight: option.itemHeight || 180,
                min: option.min || 0,
                max: option.max || 1e5,
                text: option.text || ['Higt', 'Low'],
                realtime: false,
                calculable: true,
                inRange: {
                    color: option.inRangeColor || ['lightskyblue', 'yellow', 'orangered']
                },
                textStyle: option.textStyle || {
                    color: '#88c6ff'
                },
                textGap: option.textGap
            };
        },                               
        setMap: function (option) {
            var me = this;
            $.get('./../lib/data/map_json/' + option.name + '-county.json', function (geoJson) {
                echarts.registerMap(option.name, geoJson);
                me.op.series[0].data = option.data;
                me.op.series[0].mapType = option.name;
                me.myChart.setOption(me.op, true);
            });
        },
        resize: function () {
            var me = this;
            me.myChart.resize();
        }
    };
}
