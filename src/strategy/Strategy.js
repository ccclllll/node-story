function Strategy(BaseUrl) {
    this.BASE = BaseUrl
}
Strategy.prototype.setParser = function (parser) {
    this.parser = parser
}

/**
 * 得到目录页目录跳转信息
 * @param {*} chapterUrl 
 * @param {*} callback 
 */
Strategy.prototype.getChapter = function (chapterUrl, callback) {
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

/**
 * 获得章节小说详细内容
 * @param {*} chapterDetailUrl 
 * @param {*} callback 
 */
Strategy.prototype.getChapterDetail = function (chapters, callback) {
    if (chapters.length <= 0) return
    let allContent = ''
    let queueIndex = 0
    let c = this.parser.getCrawler((error, res) => {
        if (error) {
            console.log(error);
            callback(null)
        } else {
            const $ = res.$;
            let detailRes = this.parseChapterDetail($, res.request.uri.href,chapters[queueIndex].name)
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
}

module.exports = Strategy