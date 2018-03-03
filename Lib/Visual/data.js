/**
 * Created by mengshaohua on 2017/5/23.
 */
function CreateData() {
    var areaValue = [];
    var resFn = function () {
    };
    var i = 0;
    while (i < 8) {
        areaValue.push(randomData(400, 100));
        i++;
    }

    function division(obj) {
        obj.id.toString();
        switch (parseInt(obj.id.charAt(0))) {
            case 1:
                return {
                    areaName: '华北',
                    name: obj.properties.name,
                    id: obj.id,
                    areaId: obj.id.charAt(0),
                    areaValue: areaValue[obj.id.charAt(0) - 1]
                };
                break;
            case 2:
                return {
                    areaName: '东北',
                    name: obj.properties.name,
                    id: obj.id,
                    areaId: obj.id.charAt(0),
                    areaValue: areaValue[obj.id.charAt(0) - 1]
                };
                break;
            case 3:
                return {
                    areaName: '华东',
                    name: obj.properties.name,
                    id: obj.id,
                    areaId: obj.id.charAt(0),
                    areaValue: areaValue[obj.id.charAt(0) - 1]
                };
                break;
            case 4:
                return {
                    areaName: '中南',
                    name: obj.properties.name,
                    id: obj.id,
                    areaId: obj.id.charAt(0),
                    areaValue: areaValue[obj.id.charAt(0) - 1]
                };
                break;
            case 5:
                return {
                    areaName: '西南',
                    name: obj.properties.name,
                    id: obj.id,
                    areaId: obj.id.charAt(0),
                    areaValue: areaValue[obj.id.charAt(0) - 1]
                };
                break;
            case 6:
                return {
                    areaName: '西北',
                    name: obj.properties.name,
                    id: obj.id,
                    areaId: obj.id.charAt(0),
                    areaValue: areaValue[obj.id.charAt(0) - 1]
                };
                break;
            case 7:
                return {
                    areaName: '台湾',
                    name: obj.properties.name,
                    id: obj.id,
                    areaId: obj.id.charAt(0),
                    areaValue: areaValue[obj.id.charAt(0) - 1]
                };
                break;
            case 8:
                return {
                    areaName: '港澳',
                    name: obj.properties.name,
                    id: obj.id,
                    areaId: obj.id.charAt(0),
                    areaValue: areaValue[obj.id.charAt(0) - 1]
                };
                break;
        }
    }

    function randomData(max, min) {
        return parseInt(Math.random() * (max - min + 1) + min, 10) / 10;
    }

    return {
        getData: function (type, fn) {
            var i = 0,
                feature = null,
                city = [];
            $.get('./../Lib/data/map_json/' + type + '.json', function (json) {
                if (type == 'china') {
                    for (; i < json.features.length; i++) {
                        feature = json.features[i];
                        city.push(division(feature));
                    }
                } else if (type == 'shandong') {
                    for (; i < json.features.length; i++) {
                        feature = json.features[i];
                        city.push({
                            cp: feature.properties.cp,
                            name: feature.properties.name,
                            value: randomData(200, 100)
                        });
                    }
                }
                resFn(city);
            });
            resFn = fn
        }
    }
}
