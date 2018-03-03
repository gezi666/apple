/**
 * Created by mengshaohua on 2017/4/11.
 */
var scrollBar;
scrollBar = function (option) {
    var changefn = function () {
    };

    /* 处理参数 */
    if (option instanceof Array || typeof option === 'string' || option instanceof Number || !option) throw new Error('参数格式错误');
    if (isEmptyObject(option)) throw new Error('参数为空{}');

    /* 处理dom */
    var dom;
    if (!option.dom) throw new Error('DOM元素不存在');
    option.dom.length ? dom = option.dom[0] : dom = option.dom;
    if (isEmptyObject(dom)) throw new Error('DOM为空{}');
    if (!(dom instanceof Element)) throw new Error('DOM元素不存在');
    dom.style.position = 'relative';

    /* 注入DOM */
    var scrollBox = document.createElement('div');
    var h = option.height || 12;
    var w = option.width || dom.offsetWidth || 996;

    //  处理位置
    var tb = '';
    arrHad(['bottom', 'top'], option.position).b ? tb = option.position : tb = 'bottom';

    var sliedWidth = option.sliedWidth || 18;

    //  设置属性
    var bgUrl = '';
    option.backgroundImage ? bgUrl = 'url(' + option.backgroundImage + ') repeat-x' : bgUrl = '#1E2A71';
    scrollBox.style.width = w - 2 + 'px';
    scrollBox.style.height = h - 2 + 'px';
    scrollBox.style.background = bgUrl;
    scrollBox.style.position = 'absolute';
    scrollBox.style.backgroundSize = '18px 100%';
    scrollBox.style[tb] = '10px';
    scrollBox.style.borderRadius = h / 2 + 'px';
    scrollBox.style.left = '50%';
    scrollBox.style.marginLeft = -(w / 2) + 'px';
    scrollBox.style.border = '1px solid #3357B0';

    //  滑块
    var scrollDom = document.createElement('div');

    var slideBg = '';
    option.slideBgImage ? slideBg = 'url(' + option.slideBgImage + ') no-repeat' : slideBg = '#00A8FC';
    scrollDom.style.position = 'absolute';
    scrollDom.style.width = sliedWidth + 'px';
    scrollDom.style.height = h + 'px';
    scrollDom.style.background = slideBg;
    scrollDom.style.backgroundSize = 'cover';
    scrollDom.style.marginTop = '-1px';
    scrollDom.style.cursor = 'pointer';
    scrollBox.appendChild(scrollDom);

    //  左右shadow
    var scrollLeft = document.createElement('span');
    scrollLeft.style.position = 'absolute';
    scrollLeft.style.top = '-2px';
    scrollLeft.style.left = '-2px';
    scrollLeft.style.width = '1px';
    scrollLeft.style.height = h + 4 + 'px';
    scrollLeft.style.backgroundColor = '#ffffff';
    scrollLeft.style.boxShadow = '0 0 3px #00A8FD';
    scrollDom.appendChild(scrollLeft);
    var scrollRight = document.createElement('span');
    scrollRight.style.position = 'absolute';
    scrollRight.style.top = '-2px';
    scrollRight.style.right = '-2px';
    scrollRight.style.width = '1px';
    scrollRight.style.height = h + 4 + 'px';
    scrollRight.style.backgroundColor = '#ffffff';
    scrollRight.style.boxShadow = '0 0 3px #00A8FD';
    scrollDom.appendChild(scrollRight);

    //  tooltip
    var tlUrl = '';
    option.tooltipImage ? tlUrl = 'url(' + option.tooltipImage + ') no-repeat' : tlUrl = '#24358C';
    var scrollToolTip = document.createElement('div');
    scrollToolTip.style.width = (option.tooltipWidth || 48) + 'px';
    scrollToolTip.style.height = (option.tooltipHeight || 20) + 8 + 'px';
    scrollToolTip.style.position = 'absolute';
    scrollToolTip.style.left = -((option.tooltipWidth || 48) - sliedWidth) / 2 + 'px';
    scrollToolTip.style.top = -(option.tooltipHeight || 48) - 10 + 'px';
    scrollToolTip.style.background = tlUrl;
    scrollToolTip.style.backgroundSize = '100% 100%';
    scrollToolTip.style.borderRadius = '3px';
    // scrollToolTip.style.border = '1px solid #42B7FF';
    scrollToolTip.style.cursor = 'auto';
    scrollToolTip.style.color = '#00C9FF';
    scrollToolTip.style.textAlign = 'center';
    scrollToolTip.style.fontSize = option.tooltipFontSize || 12 + 'px';
    scrollToolTip.style.lineHeight = (option.tooltipHeight || 20) + 'px';
    scrollToolTip.innerHTML = '2017';
    scrollDom.appendChild(scrollToolTip);

    //  放入Dom中
    dom.appendChild(scrollBox);

    /* 拖动*/
    var len = option.data.length;
    var scaleW = (w - sliedWidth) / len;
    var left = 0;
    if (option.withTime) {
        left = arrHad(option.data, option.slideStart).i * scaleW;
    } else {
        var arrHadResponse = arrHad(['left', 'right'], option.slideStart);
        var slideStart = arrHadResponse.i * (len - 1);
        left = slideStart * scaleW;
    }
    scrollDom.style.left = left + 'px';
    var oldLeft = scrollDom.offsetLeft;
    var index = parseInt(oldLeft / scaleW);
    scrollToolTip.innerHTML = option.slideStart;
    var oldInner = option.slideStart;

    scrollDom.onmousedown = function (e) {
        var oldX = e.clientX;
        oldLeft = scrollDom.offsetLeft;
        document.onmousemove = function (e) {
            var newX = e.clientX;
            var newLeft = oldLeft + (newX - oldX);
            if (newLeft >= w - sliedWidth - 2) {
                newLeft = w - sliedWidth - 2;
            } else if (newLeft < 0) {
                newLeft = 0;
            }
            index = parseInt(newLeft / scaleW);
            if (index >= option.data.length) index = option.data.length - 1;
            scrollToolTip.innerHTML = option.data[index];
            var newInner = option.data[index];
            if (newInner != oldInner) {
                oldInner = newInner;
                changefn(oldInner);
            }
            scrollDom.style.left = newLeft + 'px';
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };
        e.stopPropagation();
        e.preventDefault();
    };

    return {
        scrollChange: function (fn) {
            changefn = fn;
        },
        setTime: function (str) {
            var len = option.data.length;
            var scaleW = (w - sliedWidth) / len;
            var left = arrHad(option.data, str).i * scaleW;
            scrollDom.style.left = left + 'px';
            scrollToolTip.innerHTML = str;
            option.slideStart = str;
        },
        setData: function (arr) {
            option.data = arr;
            var len = option.data.length;
            var scaleW = (w - sliedWidth) / len;
            var left = 0;
            if (option.withTime) {
                left = arrHad(option.data, option.slideStart).i * scaleW;
            } else {
                var arrHadResponse = arrHad(['left', 'right'], option.slideStart);
                var slideStart = arrHadResponse.i * (len - 1);
                left = slideStart * scaleW;
            }

            scrollDom.style.left = left + 'px';
            var oldLeft = scrollDom.offsetLeft;
            var index = parseInt(oldLeft / scaleW);
            scrollToolTip.innerHTML = option.slideStart;
            var oldInner = option.slideStart;

            scrollDom.onmousedown = function (e) {
                var oldX = e.clientX;
                oldLeft = scrollDom.offsetLeft;
                document.onmousemove = function (e) {
                    var newX = e.clientX;
                    var newLeft = oldLeft + (newX - oldX);
                    if (newLeft >= w - sliedWidth - 2) {
                        newLeft = w - sliedWidth - 2;
                    } else if (newLeft < 0) {
                        newLeft = 0;
                    }
                    index = parseInt(newLeft / scaleW);
                    if (index >= option.data.length) index = option.data.length - 1;
                    scrollToolTip.innerHTML = option.data[index];
                    var newInner = option.data[index];
                    if (newInner != oldInner) {
                        oldInner = newInner;
                        changefn(oldInner);
                    }
                    scrollDom.style.left = newLeft + 'px';
                };
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
                e.stopPropagation();
                e.preventDefault();
            };
        }
    };

    /* 判断参数是否为{} */
    function isEmptyObject(e) {
        var t = null;
        for (t in e) {
            return !1;
        }
        return !0;
    }

    /* 判断数组中是否包含item 并返回其下标 */
    function arrHad(arr, item) {
        if (!item) return {
            b: !1,
            i: 0
        };
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == item) return {
                b: !0,
                i: i
            };
        }
        return {
            b: !1,
            i: 0
        };
    }
};