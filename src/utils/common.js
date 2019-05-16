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

export default {
    convertNum2Chinese,
    isPC
}