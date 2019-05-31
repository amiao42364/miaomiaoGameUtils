function numInput(_this) {
    // 用来防止真正需求的子材料被其他父材料刷掉
    let requireAry = [];
    Object.keys(_this.baseData).forEach(function (key) {
        let item = _this.baseData[key];
        let require = isNaN(Number.parseInt(item.require)) ? 0 : Number.parseInt(item.require);
        let parentRequire = isNaN(Number.parseInt(item.parentRequire)) ? 0 : Number.parseInt(item.parentRequire);
        let have = isNaN(Number.parseInt(item.have)) ? 0 : Number.parseInt(item.have);
        let subHave = getSubHave(_this, item);

        require += parentRequire;
        have += subHave;
        let need = require - have;
        _this.baseData[key].need = need;

        if (need > 0) {
            item.isShow = true;
            item.needHtml = "<span>还需要</span><span style='color: #FF6600'>" + need + "</span><span>个</span>";
            // 写入子材料的需求
            let sub = item['subId'];
            Object.keys(sub).forEach(function (subKey) {
                requireAry.push(subKey);
                _this.baseData[subKey].parentRequire = ((need + subHave) * sub[subKey]);
            });
        } else {
            item.needHtml = "";
            item.parentRequire = "";
            // 写入子材料的需求
            let sub = item['subId'];
            Object.keys(sub).forEach(function (key) {
                if(requireAry.indexOf(key) < 0){
                    _this.baseData[key].parentRequire = "";
                }
            });
        }

    });
}

function getSubHave(_this, item) {
    if (Object.keys(item['subId']).length === 0) {
        return 0;
    }
    let sub = item['subId'];

    let count = 0;
    let flag = true;
    while (flag) {
        let breakFlag = false;
        Object.keys(sub).forEach(function (key) {
            let have = isNaN(Number.parseInt(_this.baseData[key].have)) ? 0 : Number.parseInt(_this.baseData[key].have);
            if (Object.keys(_this.baseData[key]['subId']).length > 0) {
                let subHave = getSubHave(_this, _this.baseData[key]);
                have += subHave;
            }
            if (have < (count + 1) * sub[key]) {
                breakFlag = true;
                return false;
            }
        });

        if (breakFlag) {
            flag = false;
        } else {
            count += 1;
        }
    }
    return count;
}


export default {
    numInput
}