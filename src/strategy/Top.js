const Strategy = require('./Strategy')
const {
    inherit
} = require('../utils/common')

function TopStrategy(BaseUrl) {
    Strategy.call(this, BaseUrl)
}

inherit(TopStrategy, Strategy)

TopStrategy.prototype.getAllChapterUrl = function () {
    let chapterUrlList = [`${this.BASE}${this.parser.chapterPath}`]
    return chapterUrlList
}

/**
 * 解析详细内容
 * @param {*} $ 
 * @param {*} url 
 * @returns 
 */
TopStrategy.prototype.parseChapterDetail = function ($, url, title) {
    let content = $('.yd_text2')
    let hasNextPage = false
    let contentStr = ''
    if (!content[0]) {
        contentStr = '抱歉,本章节内容缺失...'
    }
    content[0] && content[0].children.forEach((child, index) => {
        if (index > 0 && child.data) {
            contentStr = contentStr + child.data
        }
    })
    let nextPageUrl = ''
    contentStr = '\r\n\r\n' + '    ' + title + '\r\n' + contentStr + +title
    contentStr = contentStr.replace(/NaN/g, '')
    return {
        title,
        hasNextPage,
        nextPageUrl: nextPageUrl,
        content: contentStr,
        pageIndex: 1
    }
}

/**
 * 解析目录页dom
 * @param {*} $ 
 * @returns 
 */
TopStrategy.prototype.parseChapter = function ($) {
    let res = []
    let children = $(".mulu")[0].children
    children[0].children.forEach(child => {
        if (child.children && child.children[0]) {
            let item = child.children[0]
            let resObj = {
                url: this.BASE.replace(/\/$/, '') + item.attribs['href'],
                name: item.children[0].data
            }
            res.push(resObj)
        }
    })
    return res
}

module.exports = new TopStrategy('https://www.top.la/')