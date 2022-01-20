module.exports = {
    BASE: 'https://m.top.la/',
    parser: null,
    setParser(parser) {
        this.parser = parser
    },
    getAllChapterUrl: function () {
        let chapterUrlList = []
        for (let index = 1; index <= this.parser.chapterPageCount; index++) {
            chapterUrlList.push(`${this.BASE}${this.parser.chapterPath}${index}/`)
        }
        // console.log(chapterUrlList)
        return chapterUrlList
    },

    /**
     * 解析详细内容
     * @param {*} $ 
     * @param {*} url 
     * @returns 
     */
    parseChapterDetail: function ($, url) {

        let titleDiv = $('.zhong')[0]
        let title = titleDiv && titleDiv.children[0] ? titleDiv.children[0].data : ''
        let content = $('#nr')
        let contentStr = '    '
       // console.log(title)
        content[0].children && content[0].children.forEach((child, index) => {
            if (child.data) {      
                contentStr = contentStr + child.data + '\r\n\r\n\r\n\r\n\r\n\r\n'
            }
        })

        // 判断是否有下一页按钮
        let hasNextPage = false
        let nextPageUrl = ''
        
        contentStr =   title + '\r\n\r\n\r\n\r\n\r\n\r\n' + contentStr
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
                       // console.log(chapters[queueIndex].url)
                        c.queue(chapters[queueIndex].url);
                    } else {
                        callback(allContent)
                    }
                }
            }
        })
        
       // console.log(chapters)
       // console.log(chapters[queueIndex].url)
        c.queue(chapters[queueIndex].url);
    },

    /**
     * 解析目录页dom
     * @param {*} $ 
     * @returns 
     */
    parseChapter: function ($) {
        let res = []
        //console.log($)
        let children = $(".fk")[1].children
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