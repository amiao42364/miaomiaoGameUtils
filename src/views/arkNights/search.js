function generateUpContent(_this, upSwitch, activity) {
    if (!upSwitch) {
        if(activity){
            return "当前关闭活动UP";
        }
        return "当前关闭标准寻访UP";
    }
    let prefix = "up";
    let content = "当前开启标准寻访UP:";
    if (activity) {
        prefix = "up2";
        content = "当前开启活动UP:";
    }

    let flag = false; //标记是否存在活动池
    for (let level = 6; level >= 3; level--) {
        if (_this.arkCharactersData.hasOwnProperty("level" + level + prefix)) {
            let array = _this.arkCharactersData["level" + level + prefix];
            if (array.length > 0) {
                if (flag) {
                    content += ", ";
                }
                content += (_this.$commonUtil.convertNum2Chinese(level) + "星50%为");
                for (let i = 0; i < array.length; i++) {
                    if (i === 0) {
                        flag = true;
                    } else {
                        content += "/";
                    }
                    content += "<span class='level" + level + "Color'>" + array[i].name + "</span>";
                }
            }
        }
    }
    // 存在活动池
    if (flag) {
        return content;
    } else {
        return "当前无活动up";
    }
}

function searchMain(_this, count, baseData) {
    for (let i = 0; i < count; i++) {
        baseData.totalCount += 1;
        // 先判断人物星级
        let level = 3;
        let r1 = Math.floor(Math.random() * 100);
        if (r1 < baseData.lv6Rate) {
            level = 6;
            baseData.lv6Count += 1;
            baseData.lv6Rate = 2;
            baseData.noLv6Count = 0;
        } else if (r1 < (baseData.lv6Rate + baseData.lv5Rate)) {
            baseData.noLv6Count += 1;
            baseData.lv5Count += 1;
            level = 5;
        } else if (r1 < (baseData.lv6Rate + baseData.lv5Rate + baseData.lv4Rate)) {
            baseData.noLv6Count += 1;
            baseData.lv4Count += 1;
            level = 4;
        } else {
            baseData.noLv6Count += 1;
            baseData.lv3Count += 1;
        }
        if (baseData.noLv6Count > 50) {
            baseData.lv6Rate += 2;
        }
        addCharacter(_this, baseData, level);
    }
    return baseData;
}

function addCharacter(_this, baseData, level) {
    // 判断是否为活动池
    let upCharacter = false;
    if (baseData.upValue) {
        let random = Math.floor(Math.random() * 100);
        if (random < 50) {
            upCharacter = true;
        }
    }
    // 获取池子数据
    let pool = [];
    let prefix = "up";
    if(_this.up2Value){
        prefix = "up2";
    }
    if (upCharacter) {
        pool = _this.arkCharactersData["level" + level + prefix] == null || _this.arkCharactersData["level" + level + prefix].length === 0
            ? _this.arkCharactersData["level" + level]
            : _this.arkCharactersData["level" + level + prefix];
    } else {
        pool = _this.arkCharactersData["level" + level];
    }
    // 抽取人物
    let random = Math.floor(Math.random() * pool.length);
    let character = pool[random];
    // 写入图片url
    character.url = _this.$globalConfig.DEFAULT_OSS_URL_CHARACTER + character.id + _this.$globalConfig.DEFAULT_OSS_SUFFIX + "?x-oss-process=image/resize,w_25";
    // 写入当前序号
    if ("index" in character) {
        character.index.push(baseData.totalCount);
    } else {
        character.index = [baseData.totalCount];
    }

    // 判断是否已拥有人物
    if (null == baseData.characters || null == baseData.characters["level" + level]) {
        baseData.characters["level" + level] = [];
    }
    let selfPool = baseData.characters["level" + level];
    judgeContain(_this, selfPool, character);
}

function judgeContain(_this, selfPool, character) {
    if (null == selfPool || 0 === selfPool.length) {
        character.count = 1;
        selfPool.push(character);
    } else {
        for (let i = 0; i < selfPool.length; i++) {
            if (character.name === selfPool[i].name) {
                selfPool[i].count += 1;
                return;
            }
        }
        character.count = 1;
        selfPool.push(character);
    }
}

function statistics(_this, result) {
    let characterData = [];
    let statisticData = [];
    packageData(characterData, statisticData, result);
    _this.characterData = characterData;
    _this.statisticData = statisticData;
}

function packageData(characterData, statisticData, result) {
    // 组装干员数据
    let characters = result.characters;
    for (let lv = 6; lv >= 3; lv--) {
        if ("level" + lv in characters) {
            for (let i = 0; i < characters["level" + lv].length; i++) {
                let indexAry = characters["level" + lv][i].index;
                let indexStr = "";
                if (indexAry.length > 10) {
                    indexAry = indexAry.slice(0, 10);
                    indexStr = "…";
                }
                characterData.push({
                    id: characters["level" + lv][i].id,
                    index: indexAry.join(", ") + indexStr,
                    url: characters["level" + lv][i].url,
                    record: characters["level" + lv][i].record,
                    level: lv,
                    name: characters["level" + lv][i].name,
                    num: characters["level" + lv][i].count
                });
            }
        }
    }
    // 组装统数据
    let totalCount = result.totalCount;
    let lv6Rate = ((result.lv6Count / totalCount).toFixed(4) * 100).toFixed(2) + "%";
    let lv5Rate = ((result.lv5Count / totalCount).toFixed(4) * 100).toFixed(2) + "%";
    let appraise = getAppraise(result.lv6Count, totalCount);

    statisticData.push({
        totalCount: totalCount,
        lv6Count: lv6Rate,
        lv5Count: lv5Rate,
        appraise: appraise
    });
}

function getAppraise(lv6Count, totalCount) {
    // 数学期望34.5抽可以获得一个六星干员
    let avgRate = 0.02899;
    let actualRate = (lv6Count / totalCount).toFixed(5);
    if (actualRate < 0.02) {
        return "非洲大酋长";
    } else if (actualRate < (avgRate + 0.0025)) {
        return "正常水平";
    } else if (actualRate < 0.06) {
        return "有点欧了";
    } else if (actualRate < 0.1) {
        return "欧皇附体";
    } else {
        return "你开挂了";
    }
}

export default {
    generateUpContent,
    searchMain,
    statistics
}