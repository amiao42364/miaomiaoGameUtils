import arkData from "../views/arkNights/ArkNightsData";
import globalConfig from "../globalConfig";

export default function search(count, baseData) {
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
        let r2 = Math.floor(Math.random() * 100);
        if (r2 < baseData.lv5Rate) {
            baseData.lv5Count += 1;
            addCharacter(baseData, 5);
            continue;
        }
        // 判断是否抽到4星
        let r3 = Math.floor(Math.random() * 100);
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
}