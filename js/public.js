var echartOpt = {
    fz: '15',
    color: '#fff'
};

// echarts 图表 省份经纬度
var geoCoordMap = {
    '安徽省': [117.17, 31.52],
    '北京市': [116.24, 39.55],
    '重庆市': [106.54, 29.59],
    '福建省': [119.18, 26.05],
    '甘肃省': [103.51, 36.04],
    '广东省': [113.14, 23.08],
    '广西壮族自治区': [108.19, 22.48],
    '贵州省': [106.42, 26.35],
    '海南省': [110.20, 20.02],
    '河北省': [114.30, 38.02],
    '河南省': [113.40, 34.46],
    '黑龙江省': [128.36, 45.44],
    '湖北省': [112.27, 30.15],
    '湖南省': [112.59, 28.12],
    '吉林省': [125.19, 43.54],
    '江苏省': [118.46, 32.03],
    '江西省': [115.55, 28.40],
    '辽宁省': [123.25, 41.48],
    '内蒙古': [108.41, 40.48],
    '宁夏回族自治区': [106.16, 38.27],
    '青海省': [101.48, 36.38],
    '山东省': [118.00, 36.40],
    '山西省': [112.33, 37.54],
    '陕西省': [108.57, 34.17],
    '上海市': [121.29, 31.14],
    '海南': [108.77, 19.10],
    '四川省': [104.04, 30.40],
    '天津市': [117.12, 39.02],
    '西藏自治区': [91.08, 29.39],
    '新疆维吾尔自治区': [87.36, 43.45],
    '云南省': [102.42, 25.04],
    '浙江省': [120.10, 30.16],
    '澳门': [115.07, 21.33],
    '台湾省': [121.21, 23.53],
    // 后期添加
    '澳门特别行政区': [115.07, 21.33],
    '香港特别行政区': [115.12, 21.23],
    '内蒙古自治区': [108.41, 40.48],
    '新疆维吾尔族自治区': [87.36, 43.45]
};

// 流向监测
var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';

// Echarts 表中的随机数
function randomData() {
    return Math.round(Math.random() * 1000);
}

function randomData2() {
    return Math.round(Math.random() * 100);
}

/**
 * tab 切换
 * @param {tab} arg tab 切换处标题的dom
 * @param {tabCt} arg tab 切换处 内容 包裹 处 的dom
 */
function ChangeTab(arg) {
    this.config = {
        tab: $(".tab-nav"),
        tabCt: $(".tab-ct")
    };
    // console.log(this)
    if (arg && $.isPlainObject(arg)) {
        $.extend(this.config, arg);
    } else {
        return;
    }
}

ChangeTab.prototype = {
    index: 0,
    switchTab: function() {
        var that = this;
        this.config.tab.children("").on("click", function() {
            that.index = $(this).index();
            $(this).addClass("active").siblings("").removeClass("active");
            // 切换内容
            that.switchCt(that.index);
        });
    },
    switchCt: function(i) {
        this.config.tabCt.children().eq(i).removeClass("din")
            .siblings().addClass("din");
    }
};

// new ChangeTab().switchTab();
function PubSelRadio(arg) {
    this.config = {
        par: $(""),
        son: ''
    };
    if (arg && $.isPlainObject(arg)) {
        $.extend(this.config, arg);
    } else {
        return;
    }
}
PubSelRadio.prototype = {
    selRadio: function() {
        var that = this;
        this.config.par.on("click", this.config.son, function() {
            $(this).addClass("active")
                .siblings(that.config.son).removeClass("active");
        });
    }
};

// 判断浏览器
function isBrowser() {
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1]:
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

    if (Sys.ie || Sys.firefox) {
        $(".edit-ct").removeClass("scrollbar-inner");
        $("ul.time-list").removeClass("scrollbar-inner");
        $("ul.areas").removeClass("scrollbar-inner");
    }
}

/**
 * 公共函数
 * @param  {Number} min 最小值
 * @return {Number}     最小值取整
 */
function getMin(min) {
    if (isNaN(parseInt(min))) {
        return
    }
    var flag = parseInt(min) < 0;
    var num = parseInt(min);
    var leng = (Math.abs(num)).toString().length;
    var newNum = 0;
    if (leng == 1) {
        newNum = Math.floor(min);
    } else if (leng == 2) {
        newNum = num - Math.abs((num % 5))
    } else if (leng == 3) {
        newNum = (Math.floor(num / 100)) * 100;
    } else if (leng == 4) {
        newNum = (Math.floor(num / 100)) * 100;
    } else if (leng == 5) {
        newNum = (Math.floor(num / 1000)) * 1000;
    }
    return newNum;
}

/**
 * 公共函数
 * 获取时间段
 * @return {string} '2011,2012,2013'
 */
function getTime(dom) {
    // flag > 0 则为 年份
    var target = $(dom + " .time-txt").text()
    var flag = target.indexOf("-") > 0;
    if (flag) {
        var time = [];
        var timeCt = target.split("-");
        // console.log(target)
        var starTime = parseInt(timeCt[0]);
        var endTime = parseInt(timeCt[1]);
        for (var i = 0; i < (endTime - starTime + 1); i++) {
            time[i] = starTime + i;
        }
        return time.join(",");
    } else {
        var arr = [];
        for (var i = 1; i <= 12; i++) {
            if (i.toString().length !==2) {
                i = '0' + i.toString();
            }
            arr.push(target + "-" + i)
        }
        return arr.join(",")
    }
}
// function getTime(dom) {
//     var time = [];
//     var timeCt = $(dom + " .time-txt").text().split("-");
//     // console.log($(dom + " .time-txt").text())
//     var starTime = parseInt(timeCt[0]);
//     var endTime = parseInt(timeCt[1]);
//     for (var i = 0; i < (endTime - starTime + 1); i++) {
//         time[i] = starTime + i;
//     }
//     return time.join(",");
// }
/**
 * 公共函数
 * 获取当前选中地区
 * @param  {object} dom 选取范围
 * @return {string}     '中国,贵州'
 */
function getAreas(dom) {
    // 获取 选择的地区数据
    var areas = [];
    $(dom).find(".locations").children("span").each(function() {
        var flag = $(this).data("areaid");
        if (flag) {
            areas.push($(this).data("areaid"));
        } else {
            areas.push($(this).text());
        }
    });
    var forAjaxAreas = areas.join(",");
    return forAjaxAreas;
}

function getAreasTwo(dom) {
    // 获取 选择的地区数据
    var areas = [];
    $(dom).find(".locations").children("span").each(function() {
        areas.push($(this).text());
    });
    var forAjaxAreas = areas.join(",");
    return forAjaxAreas;
}

/**
 * 公共函数
 * 获取单位
 * @param  {object} dom 作用范围
 * @return {string}     '种植面积', '产量'
 */
function getDanwei(dom) {
    var danwei = '';
    $(dom + " .pub-radio li").each(function() {
        var flag = $(this).is(".active");
        if (flag) {
            danwei = $(this).text();
        }
    });
    return danwei;
}

/**
 * 公共函数
 * 生产占比处 获取当前 地区
 * @param  {object} dom 作用范围
 * @return {string}     '种植面积', '产量'
 */
function getCurrentArea(dom) {
    var areaid = $(dom).find(".current-area").data("areaid");
    return areaid;
}

/**
 * 公共函数
 * 获取当前 日度 周度 月度 年度
 * @param  {object} dom 作用范围
 * @return {string}     '种植面积', '产量'
 */
function getPeriod(dom) {
    var target = $(dom).find(".time-tab li.active");
    var period = target.text();
    var flag = target.data("areaid");
    if (flag) {
        return target.data("areaid");
    } else {
        return target.text();
    }
}

/**
 * 公共函数
 * 获取当前 主销区 地域
 * @param  {object} dom 作用范围
 * @return {string}     '', ''
 */
function getMainArea(dom) {
    var target = $(dom).find(".sel-area");
    var flag = target.data("areaid");
    if (flag) {
        return target.data("areaid");
    } else {
        return target.text();
    }
}

/**
 * 公共函数
 * 中国地图处 获取名字后
 * 转换为 相应地图名称 的 id
 */
function getId(name) {
    var areaId = cityMap[name];
    return areaId;
}

/**
 * 公共函数
 * 根据 年度 月度 选择时间
 * @param  {document} dom 限定范围
 * @return {[type]}     [description]
 */
function fillTime(dom) {
    var yearTime = $(dom + " .time-item:first span").text();
    var monthTime = $(dom + " .month-item:first span").text();
    var flag = getDanwei(dom);
    if (flag === '月度') {
        $(dom).find(".time-item").css("display", "none").siblings(".month-item").css("display", "block")
            .closest(".pub-time").find(".time-txt").html(monthTime)
            .closest(".pub-time").find(".yesorno-btn").css("display", "none");
    } else {
        $(dom).find(".time-item").css("display", "block").siblings(".month-item").css("display", "none")
            .closest(".pub-time").find(".time-txt").html(yearTime)
            .closest(".pub-time").find(".yesorno-btn").css("display", "block");
    }
}

/**
 * 公共方法
 * 获取最近的时间年限
 * @param  {document} dom 限制范围
 * @param  {string} url ajax字段
 */
function getNearTime(dom, url, isMonth) {
    $.ajax({
        type: "GET",
        url: url,
        dataType: 'json',
        async: false,
        timeout : 2000,
        success: function(result) {
            var data = result.data;
            var str = '';
            if (isMonth !== 'month' || !isMonth) {
                $(dom + ' ul.time-list').html('');
                data.forEach(function(v, i) {
                    str += '<li class="time-item"> ' +
                        '<label>' +
                        '<input type="checkbox" name="">' +
                        '<i class="checkbox iconfont"></i>' +
                        '<span>' + v + '</span>' +
                        '</label>' +
                        '</li>';
                });
                $(dom + " .yesorno-btn").show();
                var startTime = data[data.length - 1].split('-')[0];
                var endTime = data[0].split('-')[1];

                // 只展示 近15年的时间数据
                if ((endTime - startTime) > 15) {
                    startTime = endTime - 15 + 1;
                }
                var completeTime = startTime + '-' + endTime;
                $(dom + ' .time-txt').html(completeTime);
            } else {
                data.forEach(function(v, i) {
                    str += '<li class="month-item"> ' +
                        '<label>' +
                        '<input type="checkbox" name="">' +
                        '<i class="checkbox iconfont"></i>' +
                        '<span>' + v + '</span>' +
                        '</label>' +
                        '</li>';
                });
                $(dom + " .yesorno-btn").hide();
                $(dom + ' .time-txt').html(data[0]);
            }

            $(dom + ' ul.time-list').append(str);
            // $(dom + ' .time-txt').html(data[0]);

        },
        error: function() {
            console.log("参数错误");
        }
    });
}

// 运行
$(function() {
    isBrowser();

    $(".scrollbar-inner").scrollbar();

    new ChangeTab({
        tab: $(".history .tab-nav"),
        tabCt: $(".history .tab-ct")
    }).switchTab();

    new ChangeTab({
        tab: $(".occupy .tab-nav"),
        tabCt: $(".occupy .tab-ct")
    }).switchTab();

    new ChangeTab({
        tab: $(".production_status .rank .tab-nav"),
        tabCt: $(".production_status .rank .tab-ct")
    }).switchTab();

    new ChangeTab({
        tab: $(".scale-advnatage-tab-nav"),
        tabCt: $(".scale-advantage-tab-ct")
    }).switchTab();

    new ChangeTab({
        tab: $(".efficiency-advnatage-tab-nav"),
        tabCt: $(".efficiency-advantage-tab-ct")
    }).switchTab();

    new ChangeTab({
        tab: $(".benefit-advnatage-tab-nav"),
        tabCt: $(".benefit-advantage-tab-ct")
    }).switchTab();

    new ChangeTab({
        tab: $(".history-advnatage-tab-nav"),
        tabCt: $(".history-advantage-tab-ct")
    }).switchTab();

    new ChangeTab({
        tab: $(".scale-advantage .rank .tab-nav"),
        tabCt: $(".scale-advantage .rank .tab-ct")
    }).switchTab();

    new ChangeTab({
        tab: $(".efficiency-advantage .rank .tab-nav"),
        tabCt: $(".efficiency-advantage .rank .tab-ct")
    }).switchTab();

    new ChangeTab({
        tab: $(".benefit-advantage .rank .tab-nav"),
        tabCt: $(".benefit-advantage .rank .tab-ct")
    }).switchTab();

    // 地图切换
    // new ChangeTab({
    //     tab: $(".maptab-nav"),
    //     tabCt: $(".maptab-ct")
    // }).switchTab();

    // 日度 月度 年度 切换
    new ChangeTab({
        tab: $(".time-tab"),
        tabCt: $("li")
    }).switchTab();

    // 左侧导航 状态变化
    $(window).scroll(function() {
        if ($(".nav-bar-bg").offset().top < $(document).scrollTop()) {
            $(".nav-bar").css({
                "position": "fixed",
                "top": "18px"
            });
        } else {
            $(".nav-bar").css({
                "position": "absolute",
                "top": "48px"
            });
        }
    });


    /**
     * 平滑滚动
     */
    $(".navbar-item").on("click", "li > a", function() {
        // 激活态 无用 = =
        $(".navbar-item ul a").removeClass("active");
        $(this).addClass("active");

        var href = $(this).attr("href");
        if (href.substring(href.length - 1) != "#") {
            var pos = $(href).offset().top;
            $("html,body").animate({ scrollTop: pos }, 300);
            return false;
        }
    });

    // 顶部导航
    // $(".nav").on("click", ".nav-item", function() {
    //     $(this).children("a").addClass("active")
    //         .closest("li").siblings("li").children("a").removeClass("active");
    // });

    // 种植面积 产量处 单选功能
    new PubSelRadio({
        par: $(".pub-radio"),
        son: "li"
    }).selRadio();

    /**
     * 地域选择处函数
     * 1. 点击确定 内容填充
     */
    $(".another-location").on("click", ".yes", function(e) {
        var areas = [];
        var target = $(this).parents(".pop-areas").find(".area-item");
        target.each(function() {
            var flag = $(this).find("input").is(":checked");
            var areaidFlag = $(this).find("span").data("areaid")
            if (flag) {
                if (areaidFlag) {
                    areas.push({
                        text: $(this).find("span").text(),
                        id: $(this).find("span").data("areaid").toString()
                    });
                } else {
                    areas.push({
                        text: $(this).find("span").text()
                    });
                }
            }
        });
        if (areas.length > 5) {
            alert("最多可选 5 个区域，请重选");
            return;
        }

        var str = '';
        var strTitle = '';
        for (var i = 0; i < areas.length; i++) {
            if (areas[i].id) {
                if (areas[i] != undefined) {
                    str += '<span data-areaid=' + areas[i].id + '>' + areas[i].text + '</span>';
                    strTitle += areas[i].text + ", ";
                } else {
                    str += '';
                }
            } else {
                if (areas[i] != undefined) {
                    str += '<span>' + areas[i].text + '</span>';
                    strTitle += areas[i].text + ", ";
                } else {
                    str += '';
                }
            }
        }
        strTitle = strTitle.substring(0, strTitle.length - 2);
        $(this).parents(".pub-check").find(".locations").html(str);
        $(this).parents(".pub-check").find(".locations").attr("title", strTitle);

        $(".pop-areas").slideUp();
    });

    /**
     * 地域选择处函数
     * 2. 地域选择清除
     */
    $(".another-location").on("click", ".no", function(e) {
        e.stopPropagation();
        var target = $(this).parents(".pop-areas").find(".area-item");
        target.each(function() {
            var flag = $(this).find("input").is(":checked");
            if (flag) {
                $(this).find("input").prop("checked", "");
            }
        });
        // $(".pop-areas").slideUp();
    });

    /**
     * 地域选择处函数
     * 3. 显示隐藏地域，添加 scrollbar
     */
    $(".another-location").on("click", ".for-pop", function(e) {
        e.stopPropagation();
        var target = $(this).closest(".another-location").children(".pop-areas");
        target.slideToggle(300);
        // target.children(".areas").scrollbar();
    });

    /**
     * 地域选择处函数
     * 4. 点击 具体的 列表项时，阻止冒泡
     */
    $(".another-location").on("click", ".area-item", function(e) {
        e.stopPropagation();
    });

    /**
     * 时间选择函数
     */
    $(".pop-time").on("click", "input", function(e) {
        e.stopPropagation();
        var ct = $(this).siblings("span").text();
        $(this).closest(".pop-time").children(".time-txt").html(ct);
        $(this).closest(".time-list").slideUp(300);
    });

    $(".pop-time").on("click", function(e) {
        e.stopPropagation();
        $(this).children(".time-list").slideToggle(300);
    });
    $(document).on("click", function (e) {
        e.stopPropagation();
        $(".time-list").slideUp(300)
    })
    /**
     * 时间选择函数 新功能
     */
    /**
     * 时间选择函数
     * 1. 点击确定 内容填充
     */
    $(".pub-time").on("click", ".time-des", function(e) {
        var times = [];
        var target = $(this).parents(".another-time").find(".time-item");
        target.each(function() {
            var flag = $(this).find("input").is(":checked");
            // var areaidFlag = $(this).find("span").data("areaid");
            if (flag) {
                times.push({
                    index: $(this).index(),
                    timeCt: $(this).find("span").text()
                });
            }
        });
        for (var i = 0; i < times.length - 1; i++) {
            var rt1 = times[i + 1].index - times[i].index;
            if (rt1 > 1) {
                alert("请选取连续的时间段");
                // e.stopPropagation();
                // break;
                return;
            }
        }
        var endTime = times[0].timeCt.split("-")[1];
        var startTime = times[times.length - 1].timeCt.split("-")[0];

        var str = startTime + '-' + endTime;
        $(this).parents(".pub-time").find(".time-txt").html(str);
        $(".another-time").slideUp(300);
    });

    /**
     * 时间选择函数
     * 2. 时间选择清除
     */
    $(".pub-time").on("click", ".time-no", function(e) {
        e.stopPropagation();
        var target = $(this).parents(".another-time").find(".time-item");
        target.each(function() {
            var flag = $(this).find("input").is(":checked");
            if (flag) {
                $(this).find("input").prop("checked", "");
            }
        });
        // $(".pop-areas").slideUp();
    });

    /**
     * 时间选择函数
     * 3. 功能函数 显现 隐藏
     */
    $(".pub-time").on("click", ".time-txt", function(e) {
        e.stopPropagation();
        $(this).parents(".pub-time").find(".another-time").slideToggle(300);
        // $(".pop-areas").slideUp();
    });

    /**
     * 时间选择函数
     * 4. 阻止冒泡
     */
    $(".pub-time").on("click", ".time-item", function(e) {
        e.stopPropagation();
    });

    /**
     * 时间选择函数 新需求
     * 1. 月份点击渲染fix-time 时间
     */
    $(".pub-time").on("click", ".month-item", function (e) {
        $(this).siblings().find("input").prop("checked", "");
        var str = $(this).find("span").text();
        $(this).parents(".pub-time").find(".time-txt").html(str);
    })

    /**
     * 公共样式 —— 1. 虚假的下拉框
     * 模拟原生浏览器 点击效果。
     * 要查询 dom，缺点较多
     */
    $(".sel-areas").on("click", ".fake-ul", function(e) {
        e.stopPropagation();
        var flag = $(this).children('ul').css("display");
        if (flag == "none") {
            // 默认点击一个 下拉框时 其它 下拉框 隐藏
            $(".fake-ul > ul").slideUp(300);

            $(this).children('ul').slideDown();
            $(this).find('li').click(function(e) {
                // e.stopPropagation();   // 防止冒泡触发 else 下的语句
                $(this).addClass("active").siblings().removeClass("active");
                $(this).closest('.fake-ul').children('.sel-area').text($(this).text())
                    .siblings("ul").slideUp();
                $(this).closest('.fake-ul').children('.sel-area').val($(this).text())
                    .siblings("ul").slideUp();
                if ($(this).data("areaid")) {
                    $(this).closest('.fake-ul').children('.sel-area').data("areaid", $(this).data("areaid"));
                }
            });
        } else {
            $(this).children('ul').slideUp(300);
        }
    });

    // 表格修改项
    $(".sheet").on("click", ".sheet-modify, input", function(e) {
        e.stopPropagation();
        $(this).siblings("td").children("input")
            .attr("disabled", false)
            .css("color", "#fff");
    });


    // 编辑区域
    $(".edit-btn").on("click", function(e) {
        e.stopPropagation();
        $(this).parents(".desc-edit").find(".edit-ct")
            .attr("disabled", false)
            .css("color", "#fff");
    });
    // 阻止点击编辑区域时，冒泡触发停止编辑
    $(".edit-btn").parents(".desc-edit").find("textarea").on("click", function(e) {
        e.stopPropagation();
        return;
    });
    // 编辑区域 滚动条加载
    // $(".desc-ct").scrollbar();


    // 收起 echarts 图表
    $(".toggle-down").on("click", function () {
        $(this).children("i").toggleClass("icon-shouqi icon-xiala-copy")
            .closest(".toggle-down").prev(".echart-ct").slideToggle()
            .closest(".right-echart").toggleClass("special-height")
    })


    $(document).on("click", function(e) {
        var areasFlag = $(e.target).is("button.yes") || $(e.target).is("div.scroll-wrapper") || $(e.target).is("ul.areas");
        var timeFlag = $(e.target).is("button.yes") || $(e.target).is("div.scroll-wrapper") || $(e.target).is("ul.time-list");
        // if (areasFlag) {return;}
        // if(e.target )
        // 表格修改
        $(".sheet").find("input").attr("disabled", true).css("color", "#82bcff");
        // 描述更改
        $(".edit-ct").attr("disabled", true).css("color", "#82bcff");

        // 时间选择
        // $(".time-list").slideUp();

        // 单选框
        $(".fake-ul > ul").each(function() {
            if ($(this).css("display") == 'block') {
                $(this).slideUp();
            }
        });

        if (areasFlag || timeFlag) {
            return;
        } else {
            // 地区选择
            $(".pop-areas").slideUp();
            // 时间下拉 收起
            $(".another-time").slideUp(300);
        }
    });

});
