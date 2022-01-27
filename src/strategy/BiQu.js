const Strategy = require('./Strategy')
const {
    inherit
} = require('../utils/common')

function BiquStrategy(BaseUrl) {
    Strategy.call(this, BaseUrl)
}

inherit(BiquStrategy, Strategy)

/**
 * 章节页
 * @returns 
 */
BiquStrategy.prototype.getAllChapterUrl = function () {
    let chapterUrlList = [`${this.BASE}${this.parser.chapterPath}`]
    return chapterUrlList
}

/**
 * 解析详细内容
 * @param {*} $ 
 * @param {*} url 
 * @returns 
 */
BiquStrategy.prototype.parseChapterDetail = function ($, url) {
    let pre = url.replace(/\.html/, '')
    pre = pre.split('_')[0]
    let titleDiv = $('.chaptername')[0]
    let title = titleDiv && titleDiv.children[0] ? titleDiv.children[0].data : ''
    let content = $('#txt')
    let contentStr = '    '
    let hasNextPage = false
    content[0].children && content[0].children.forEach((child, index) => {
        let textDiv = child.next
        if (index > 0 && textDiv && textDiv.data) {
            contentStr = contentStr + textDiv.data + '\r\n'
        }
    })
    let nextPageUrl = ''
    contentStr = '    ' + title + '\r\n\r\n\r\n' + contentStr + +title
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
BiquStrategy.prototype.parseChapter = function ($) {
    let res = []
    let children = $(".cf")[3].children
    children.forEach(child => {
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

module.exports = new BiquStrategy('http://www.qu-la.com/')