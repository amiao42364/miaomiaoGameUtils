import Vue from "vue";

let vm = new Vue();

/**
 * 阿拉伯数字转换为汉字
 * @param num
 * @returns {string}
 */
function convertNum2Chinese(num) {
    switch (num) {
        case 0:
            return "零";
        case 1:
            return "一";
        case 2:
            return "二";
        case 3:
            return "三";
        case 4:
            return "四";
        case 5:
            return "五";
        case 6:
            return "六";
        case 7:
            return "七";
        case 8:
            return "八";
        case 9:
            return "九";
        default:
            return "";
    }
}

/**
 * 判断PC端还是移动端
 * @returns {boolean}
 */
function isPC() {
    return !/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
}

/**
 * 写入缓存
 * @Param key key
 * @Param value value
 * @Param expired 过期时间(秒)
 * @Param flagAlways 是否持久化存储
 */
function set(key, value, flagAlways, expired) {
    sessionStorage.setItem(key, JSON.stringify(value));
    if (flagAlways) {
        let curTime = new Date().getTime();
        let jsonValue = {data: value};
        if (expired) {
            jsonValue.expiredTime = curTime + 1000 * expired;
        } else {
            jsonValue.expiredTime = curTime + 1000 * 3600 * 24 * 7;
        }
        localStorage.setItem(key, JSON.stringify(jsonValue));
    }
}

/**
 * 从缓存读取
 * @param key
 */
function get(key) {
    let jsonData = sessionStorage.getItem(key);
    if (jsonData != null) {
        let value = JSON.parse(jsonData);
        if(value === ""){
            return null
        }
        return value;
    }

    jsonData = localStorage.getItem(key);
    if (jsonData == null) {
        return null;
    }
    let value = JSON.parse(jsonData);
    if (new Date().getTime() - value.expiredTime > 0) {
        localStorage.removeItem(key);
        return null;
    } else {
        return value.data === "" ? null : value.data;
    }
}

/**
 * 从缓存删除
 * @param key
 */
function del(key) {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
}

export default {
    convertNum2Chinese,
    isPC,
    get,
    set,
    del
}