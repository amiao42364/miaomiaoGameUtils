function hr_click(button, _this) {
    let value = button.srcElement.innerText;
    // 先判断是否选中状态
    if (_this.selectedButton.indexOf(value) > -1) {
        for (let i = 0; i < _this.selectedButton.length; i++) {
            if (value === _this.selectedButton[i]) {
                _this.selectedButton.splice(i, 1);
                i--;
            }
        }
        _this.selectedButton.filter(item => item !== value);
        button.path[0].style.color = "#67C23A";
        button.path[0].style.background = "#f0f9eb";
        button.path[0].onmouseover = function () {
            this.style.color = "#f0f9eb";
            this.style.background = "#67C23A";
        };
        button.path[0].onmouseleave = function () {
            this.style.color = "#67C23A";
            this.style.background = "#f0f9eb";
        };
        hr_init(_this);
        return;
    }
    if (_this.selectedButton.length >= 5) {
        _this.$message.error("只能选择五条哦");
        return;
    }
    // 渲染样式
    button.path[0].style.color = "#f0f9eb";
    button.path[0].style.background = "#67C23A";
    button.path[0].onmouseover = function () {
    };
    button.path[0].onmouseleave = function () {
    };
    _this.selectedButton.push(value);
    hr_init(_this);
}

function hr_init(_this) {
    let originData = _this.selectedButton;
    if (originData.length === 0) {
        _this.tableData = [];
        return;
    }
    // 生成标签排列组合
    let tagResult = [];
    getCombo(_this, tagResult, originData, 0, "");
    // 获取符合组合的人物
    let result = [];
    tagResult.forEach(function (value) {
        let tempAry = value.split(",");
        let characters = [];
        _this.hrData.forEach(function (character) {
            let tags = character["tags"];
            let flag = true;
            tempAry.forEach(function (tag) {
                if (tags.indexOf(tag) < 0) {
                    flag = false;
                }
            });
            if (flag) {
                character.url = _this.$globalConfig.DEFAULT_OSS_URL_CHARACTER + character.id + _this.$globalConfig.DEFAULT_OSS_SUFFIX + "?x-oss-process=image/resize,w_25";
                // 六星干员必须有“高级资深干员”标签
                if(character.level === 6){
                    if(tempAry.indexOf("高级资深干员") > -1){
                        characters.push(character);
                    }
                }else{
                    characters.push(character);
                }
            }
        });
        if (characters.length > 0) {
            // 生成该组合的评分
            let grade = 0;
            characters.forEach(function (value) {
                if (6 === value.level) {
                    grade += 1000;
                } else if (5 === value.level) {
                    grade += 100;
                } else if (4 === value.level) {
                    grade += 10;
                } else {
                    grade -= 1000;
                }
            });
            // 按等级排序
            characters.sort((a, b) => b.level - a.level);
            result.push({
                "tags": tempAry,
                "characters": characters,
                "grade": grade
            });
        }
    });
    // 按组合评分排序
    result.sort((a, b) => b.grade - a.grade);
    _this.tableData = result;
}

function getCombo(_this, result, data, count, initial) {
    for (let i = count; i < data.length; i++) {
        const value = initial + ("," + data[i]);
        result.push(value.substr(1));
        if (i < data.length - 1) {
            getCombo(_this, result, data, i + 1, value);
        }
    }
}

export default {
    hr_click
}