module.exports = {
    BASE: 'http://m.qu-la.com/',
    parser: null,
    setParser(parser) {
        this.parser = parser
    },
    getAllChapterUrl: function () {
        let chapterUrlList = []
        for (let index = 1; index <= this.parser.chapterPageCount; index++) {
            chapterUrlList.push(`${this.BASE}${this.parser.chapterPath}?page=${index}`)
        }
        return chapterUrlList
    },

    /**
     * 解析详细内容
     * @param {*} $ 
     * @param {*} url 
     * @returns 
     */
    parseChapterDetail: function ($, url) {
        let indexOf_ = url.indexOf('_'),
            pageIndex = 1

        if (indexOf_ > 0) {
            pageIndex = url.charAt(indexOf_ + 1)
        }

        let pre = url.replace(/\.html/, '')
        pre = pre.split('_')[0]
        let titleDiv = $('#chaptername')[0]
        let title = titleDiv && titleDiv.children[0] ? titleDiv.children[0].data : ''
        let content = $('#txt')
        let contentStr = ''
        let hasNextPage
        // console.log(title)

        let pageTag = 1
        let setTitle = false
        content[0].children && content[0].children.forEach((child, index) => {
            let textDiv = child.next

            if(textDiv && textDiv.data && textDiv.data.indexOf(')') > -1 && textDiv.data.indexOf('\/') > -1){
                let index = textDiv.data.indexOf(')')
                let cur = textDiv.data.substring(index + 1, index+2)
                let total = textDiv.data.substring(index + 3, index+4)
                hasNextPage = parseInt(total) - parseInt(cur) > 0
                
                pageTag = 2
            }else if (textDiv && textDiv.data && index > 0) {
   
                if ( !setTitle && pageIndex === 1) {
                    contentStr = contentStr + '    ' + title + '\r\n\r\n\r\n'
                    setTitle = true
                } else if (index > 1) {
                    contentStr = contentStr + textDiv.data + '\r\n'
                }
            }
        })

   
        // 判断是否有下一页按钮

        let nextPageUrl = ''
        if (hasNextPage) {
            pageIndex = parseInt(pageIndex) + 1
            nextPageUrl = `${pre}_${pageIndex}.html`
        }

        return {
            title,
            hasNextPage,
            nextPageUrl: nextPageUrl,
            content: contentStr,
            pageIndex: pageIndex
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
        let children = $(".chapter-list")[1].children
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