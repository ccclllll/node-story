module.exports = {
    BASE: 'http://www.qu-la.com/',
    parser: null,
    setParser(parser) {
        this.parser = parser
    },
    getAllChapterUrl: function () {
        let chapterUrlList = [`${this.BASE}${this.parser.chapterPath}`]
        // for (let index = 1; index <= this.parser.chapterPageCount; index++) {
        //     chapterUrlList.push(`${this.BASE}${this.parser.chapterPath}?page=${index}`)
        // }
        return chapterUrlList
    },

    /**
     * 解析详细内容
     * @param {*} $ 
     * @param {*} url 
     * @returns 
     */
    parseChapterDetail: function ($, url) {

        let pre = url.replace(/\.html/, '')
        pre = pre.split('_')[0]
        let titleDiv = $('.chaptername')[0]
        //console.log(titleDiv)
        let title = titleDiv && titleDiv.children[0] ? titleDiv.children[0].data : ''
        let content = $('#txt')
        let contentStr = '    '
        let hasNextPage = false
        content[0].children && content[0].children.forEach((child, index) => {
            let textDiv = child.next
           // console.log(child.data)
            if (index > 0 && textDiv && textDiv.data) {
                contentStr = contentStr + textDiv.data + '\r\n'
            }
        })
        let nextPageUrl = ''
        contentStr = '    '  + title  + '\r\n\r\n\r\n' + contentStr + + title
        contentStr = contentStr.replace(/NaN/g, '')
        return {
            title,
            hasNextPage,
            nextPageUrl: nextPageUrl,
            content: contentStr,
            pageIndex: 1
        }
    },


    /**
     * 获得章节小说详细内容
     * @param {*} chapterDetailUrl 
     * @param {*} callback 
     */
    getChapterDetail: function (chapters, callback) {
        if (chapters.length <= 0) return
        let allContent = ''
        let queueIndex = 0
        let c = this.parser.getCrawler((error, res) => {
            if (error) {
                console.log(error);
                callback(null)
            } else {
                const $ = res.$;
                let detailRes = this.parseChapterDetail($, res.request.uri.href)
                allContent = allContent + detailRes.content
                if (detailRes.hasNextPage) {
                    c.queue(detailRes.nextPageUrl);
                } else {
                    queueIndex = queueIndex + 1
                    if (queueIndex < chapters.length) {
                        c.queue(chapters[queueIndex].url);
                    } else {
                        callback(allContent)
                    }
                }
            }
        })

        c.queue(chapters[queueIndex].url);
    },

    /**
     * 解析目录页dom
     * @param {*} $ 
     * @returns 
     */
    parseChapter: function ($) {
        let res = []
        let children = $(".cf")[3].children
        //console.log( $(".cf"))
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
    },
    /**
     * 得到目录页目录跳转信息
     * @param {*} chapterUrl 
     * @param {*} callback 
     */
    getChapter: function (chapterUrl, callback) {
        const c = this.parser.getCrawler((error, res) => {
            if (error) {
                callback(null)
            } else {
                var $ = res.$;
                let chapter = this.parseChapter($)
                callback(chapter)
            }
        })
        c.queue(chapterUrl);
    }
}