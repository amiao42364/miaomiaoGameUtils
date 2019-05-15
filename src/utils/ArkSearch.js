import arkData from "../views/arkNights/ArkNightsData";
import globalConfig from "../globalConfig";

/**
 * 抽卡主方法
 */
function search(count, baseData) {
    for (let i = 0; i < count; i++) {
        baseData.totalCount += 1;
        // 先判断是否抽到6星
        let r1 = Math.floor(Math.random() * 100);
        if (r1 < baseData.lv6Rate) {
            baseData.lv6Count += 1;
            baseData.lv6Rate = 2;
            baseData.noLv6Count = 0;
            addCharacter(baseData, 6);
            continue;
        }
        baseData.noLv6Count += 1;
        if (baseData.noLv6Count > 50) {
            baseData.lv6Rate += 1;
        }
        // 判断是否抽到5星
        let r2 = Math.floor(Math.random() * (100 - baseData.lv6Rate));
        if (r2 < baseData.lv5Rate) {
            baseData.lv5Count += 1;
            addCharacter(baseData, 5);
            continue;
        }
        // 判断是否抽到4星
        let r3 = Math.floor(Math.random() * (100 - baseData.lv6Rate - baseData.lv5Rate));
        if (r3 < baseData.lv4Rate) {
            baseData.lv4Count += 1;
            addCharacter(baseData, 4);
            continue;
        }
        // 保底3星
        baseData.lv3Count += 1;
        addCharacter(baseData, 3);
    }
    return baseData;
}

/**
 * 抽取人物
 * @param baseData
 * @param level
 */
function addCharacter(baseData, level) {
    // 判断是否为活动池
    let upCharacter = false;
    if ((6 === level || 5 === level) && baseData.upValue) {
        let random = Math.floor(Math.random() * 100);
        if (random < 50) {
            upCharacter = true;
        }
    }
    // 获取池子数据
    let pool = [];
    if (upCharacter) {
        pool = 6 === level ? arkData.level6up : arkData.level5up;
    } else {
        pool = arkData["level" + level];
    }
    // 抽取人物
    let random = Math.floor(Math.random() * pool.length);
    let character = pool[random];
    // 写入图片url
    character.url = globalConfig.DEFAULT_OSS_URL + character.id + globalConfig.DEFAULT_OSS_SUFFIX;
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
    judgeContain(selfPool, character);
}

/**
 * 判断池子是否包含人物
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
                if(indexAry.length > 10){
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
    if(actualRate < 0.02){
        return "非洲大酋长";
    }
    else if(actualRate < (avgRate + 0.0025)){
        return "正常水平";
    }
    else if(actualRate < 0.06){
        return "有点欧了";
    }
    else if(actualRate < 0.1){
        return "欧皇附体";
    }
    else{
        return "你开挂了";
    }
}

export default {
    search,
    statistics
}