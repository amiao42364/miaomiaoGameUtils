import Vue from 'vue'
import arkData from "../../public/ArkNightsData";

let vm = new Vue();

/**
 * 抽卡主方法
 * @Param count 抽卡次数
 * @Param baseData 基本数据
 */
function search(count, baseData) {
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
        addCharacter(baseData, level);
    }
    return baseData;
}

/**
 * 抽取人物
 * @param baseData 基本数据
 * @param level 人物星级
 */
function addCharacter(baseData, level) {
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
    if (upCharacter) {
        pool = arkData["level" + level + "up"] == null || arkData["level" + level + "up"].length === 0 ? arkData["level" + level] : arkData["level" + level + "up"];
    } else {
        pool = arkData["level" + level];
    }
    // 抽取人物
    let random = Math.floor(Math.random() * pool.length);
    let character = pool[random];
    // 写入图片url
    character.url = vm.$globalConfig.DEFAULT_OSS_URL + character.id + vm.$globalConfig.DEFAULT_OSS_SUFFIX;
    // 写入当前序号
    if ("Index.vue" in character) {
        character.index.push(baseData.totalCount);
    } else {
        character.index = [baseData.totalCount];
    }

    // 判断是否已拥有人物
    if (null == baseData.characters || null == baseData.characters["level" + level]) {
        baseData.characters["level" + level] = [];
    }
    let selfPool = baseData.characters["level" + level];
    judgeContain(selfPool, character);
}

/**
 * 判断自身是否包含人物并加入
 * @param selfPool
 * @param character
 */
function judgeContain(selfPool, character) {
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

/**
 * 判断卡池是否有重复数据
 */
function judgeData() {
    let flag = true;
    Object.keys(arkData).forEach(function (key) {
        let arrays = arkData[key];
        for (let i = 0; i < arrays.length; i++) {
            let val1 = arrays[i].name;
            for (let j = i + 1; j < arrays.length; j++) {
                let val2 = arrays[j].name;
                if (val1 === val2) {
                    flag = false;
                    console.log("存在相同数据" + val1);
                }
            }
        }
    });
    if (flag) {
        console.log("数据正常");
    }
}

/**
 * 统计结果
 * @param result
 * @param _this
 */
function statistics(result, _this) {
    let characterData = [];
    let statisticData = [];
    packageData(characterData, statisticData, result);
    _this.characterData = characterData;
    _this.statisticData = statisticData;
}

/**
 * 组装数据
 * @param characterData
 * @param statisticData
 * @param result
 */
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

/**
 * 评价
 */
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

/**
 * 生成up池描述
 * @returns {string}
 */
function generateUpContent(upSwitch) {
    if (!upSwitch) {
        return "当前关闭活动UP";
    }
    let content = "当前开启活动UP:";
    let flag = false; //标记是否存在活动池
    for (let level = 6; level >= 3; level--) {
        if (arkData.hasOwnProperty("level" + level + "up")) {
            let array = arkData["level" + level + "up"];
            if (array.length > 0) {
                if (flag) {
                    content += ", ";
                }
                content += (vm.$commonUtil.convertNum2Chinese(level) + "星50%为");
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

export default {
    search,
    statistics,
    judgeData,
    generateUpContent
}