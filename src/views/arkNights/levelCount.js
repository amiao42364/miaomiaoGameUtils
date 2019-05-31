function changeStar(_this, value) {
    if (_this.curStar === value) {
        return;
    }
    // 初始化数据
    _this.curStar = value;
    if ("一星干员" === value || "二星干员" === value) {
        _this.disabledPower1 = true;
        _this.disabledPower2 = true;
        _this.targetPower = "0";
    } else if ("三星干员" === value) {
        _this.disabledPower2 = true;
        _this.targetPower = "1";
    } else {
        _this.disabledPower1 = false;
        _this.disabledPower2 = false;
        _this.targetPower = "2";
    }
    _this.curPower = "0";
    _this.curLevel = 1;
    _this.targetLevel = 1;
    _this.curExp = 0;
}

function getMaxLevel(_this, power) {
    if (power > 2) {
        power = 2;
    }
    let levelAry = [];
    switch (_this.curStar) {
        case "六星干员":
            levelAry = _this.levelData["maxLevel"][5];
            return levelAry[power];
        case "五星干员":
            levelAry = _this.levelData["maxLevel"][4];
            return levelAry[power];
        case "四星干员":
            levelAry = _this.levelData["maxLevel"][3];
            return levelAry[power];
        case "三星干员":
            levelAry = _this.levelData["maxLevel"][2];
            if (power > 1) {
                power = 1;
            }
            return levelAry[power];
        case "二星干员":
            levelAry = _this.levelData["maxLevel"][1];
            if (power > 0) {
                power = 0;
            }
            return levelAry[power];
        case "一星干员":
            levelAry = _this.levelData["maxLevel"][0];
            if (power > 0) {
                power = 0;
            }
            return levelAry[power];
    }
}
function calculation(_this) {
    // 先判断输入值
    let curPower = Number.parseInt(_this.curPower) ? Number.parseInt(_this.curPower) : 0;
    let targetPower = Number.parseInt(_this.targetPower) ? Number.parseInt(_this.targetPower) : 0;
    if (curPower > targetPower) {
        _this.$message.error("目标等级不可以大于当前等级");
        return;
    }
    if (curPower === targetPower) {
        if (_this.targetLevel <= _this.curLevel) {
            _this.$message.error("目标等级不可以大于当前等级");
            return;
        }
    }
    let totalExp = 0;
    let totalMoney = 0;
    for (let i = curPower; i <= targetPower; i++) {
        // 精英化费用
        if (i !== curPower) {
            const breakCountAry = _this.levelData["evolveGoldCost"];
            if (_this.curStar === "六星干员") {
                totalMoney += breakCountAry[5][i - 1];
            } else if (_this.curStar === "五星干员") {
                totalMoney += breakCountAry[4][i - 1];
            } else if (_this.curStar === "四星干员") {
                totalMoney += breakCountAry[3][i - 1];
            } else if (_this.curStar === "三星干员") {
                if (i === 2) {
                    return true;
                }
                totalMoney += breakCountAry[2][i - 1];
            } else {
                return true;
            }

        } else {
            _this.start = _this.curLevel;
            if (curPower === targetPower) {
                _this.end = _this.targetLevel;
            } else {
                _this.end = getMaxLevel(_this, i);
            }
        }
        let expAry = _this.levelData["characterExpMap"][i];
        let moneyAry = _this.levelData["characterUpgradeCostMap"][i];

        for (let j = _this.start; j < _this.end; j++) {
            totalExp += expAry[j - 1];
            totalMoney += moneyAry[j - 1];
        }
        _this.start = 1;
        if ((i + 1) === targetPower) {
            _this.end = _this.targetLevel;
        } else {
            _this.end = getMaxLevel(_this, i + 1);
        }
    }
    totalExp = totalExp - _this.curExp - 2000 * _this.curBookLv4 - 1000 * _this.curBookLv3 - 400 * _this.curBookLv2 - 200 * _this.curBookLv1;
    if (totalExp < 0) {
        totalExp = 0;
    }
    totalMoney = totalMoney - _this.curMoney;
    if (totalMoney < 0) {
        totalMoney = 0;
    }
    let expNum = Math.ceil(totalExp / 7500);
    let moneyNum = Math.ceil(totalMoney / 7500);

    _this.resultHtml = "";
    if (totalExp > 0) {
        _this.resultHtml += "<p>还需要<span style='color: firebrick;'>" + totalExp + "</span>经验值，需打LS-5<span style='color: firebrick;'>" + expNum + "</span>次</p>";
    }
    if (totalMoney > 0) {
        _this.resultHtml += "<p>还需要<span style='color: firebrick;'>" + totalMoney + "</span>龙门币，需打CE-5<span style='color: firebrick;'>" + moneyNum + "</span>次</p>";
    }
    _this.resultHtml += "<p>一共需要<span style='color: firebrick;'>" + 30 * (expNum + moneyNum) + "</span>体力</p>";
}

export default {
    changeStar,
    getMaxLevel,
    calculation
}