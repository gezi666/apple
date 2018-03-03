/*!
 * Some library v0.1.0
 * Powered by Jusfoun Visualization Department
 * Contact: 
 *   vd@jusfoun.com
 *   http://vd.jusfoun.com
 * 
 * Copyright (c) 2017, Jusfoun Big Data Group Inc.
 * All rights reserved.
 * 
 * LICENSE
 * http://www.jusfoun.com/software/LICENSE.txt
 */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("LibraryName",[],e):"object"==typeof exports?exports.LibraryName=e():t.LibraryName=e()}(this,function(){return function(t){function e(o){if(a[o])return a[o].exports;var r=a[o]={exports:{},id:o,loaded:!1};return t[o].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var a={};return e.m=t,e.c=a,e.p="",e(0)}([function(t,e,a){e.createChart=a(1),e.tickVals=a(2)},function(t,e){function a(t){var e=$("<div></div");$("."+t.dom).append(e),e.css({width:t.width+"px",height:t.height+"px",position:"relative"}),$("."+t.dom).css({position:"absolute"});var a=echarts.init(e[0]),o=$('<div class="chart_txt"></div>');e.append(o);var r=$("<div></div>"),i=$("<span>元/公斤</span>"),n=$("<p>"+t.name+"</p>");"日均价"==t.name?(n.css("margin-top","85px"),$("."+t.dom).css({top:"45px",left:"305px"}),r.css({fontSize:"43px"})):"月均价"==t.name?(n.css("margin","50px 0 0 -6px"),$("."+t.dom).css({top:"62px",left:"153px"}),r.css({fontSize:"32px"})):"年均价"==t.name&&(n.css("margin","50px 0 0 -6px"),$("."+t.dom).css({top:"62px",left:"479px"}),r.css({fontSize:"32px"})),o.append(r),o.append(i),o.append(n),r.html(t.seriesData);var s={series:[{type:"liquidFill",data:[t.seriesData/t.valBigData],center:["50%","50%"],waveLength:"60%",amplitude:8,radius:"98%",label:{normal:{formatter:function(t){return""}}},outline:{itemStyle:{borderColor:"#0498dc",borderWidth:3},borderDistance:0},itemStyle:{normal:{color:{type:"linear",x:0,y:0,x2:0,y2:1,colorStops:[{offset:0,color:"#00cef6"},{offset:1,color:"#0074e0"}],globalCoord:!1}}},backgroundStyle:{color:"#002e96"},shape:""}]};a.setOption(s)}t.exports=a},function(t,e){function a(t,e,a,o,r){var i=d3.select("#"+t).append("svg:svg").attr("width",o).attr("height",r),n=iopctrl.arcslider().radius(o/2);n.axis().orient("in").normalize(!0).ticks(8).tickSubdivide(4).tickSize(10,8,10).tickPadding(1).scale(d3.scale.linear().domain([e,a]).range([-(Math.PI/2+Math.PI/9),Math.PI/2+Math.PI/9])),i.append("g").attr("class","gauge").attr("transform","translate(-50,-48)").call(n)}t.exports=a}])});