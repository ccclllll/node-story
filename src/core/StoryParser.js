var Crawler = require("crawler");
const fileHelper = require('../utils/txtFileHelper')
const async = require('async')

function StoryParse(options) {
    this.BASE = 'http://m.dingdianxs.la/'
    let {
        chapterPath,
        chapterPageCount,
        filePath,
        step,
        storyStrategy
    } = options
    this.chapterPath = chapterPath
    this.chapterPageCount = chapterPageCount
    this.filePath = filePath
    this.step = step
    this.storyStrategy = storyStrategy
    storyStrategy.setParser(this)
    let chapterUrlList = storyStrategy.getAllChapterUrl()
    this.chapterUrlList = chapterUrlList;
}

StoryParse.prototype.getCrawler = function (callback) {
    return new Crawler({
        maxConnections: 10,
        retries: 20,
        timeout: 50000,
        rateLimit: 600,
        retryTimeout: 600,
        // 这个回调每个爬取到的页面都会触发
        callback: function (error, res, done) {
            callback(error, res)
            done();
        }
    });
}

/**
 * 构建获取章节列表的并行函数列表
 * @returns parallel
 */
StoryParse.prototype.getChapterParallel = function (start, end) {
    let that = this
    let parallel = {}
    for (let index = 0; index < end - start; index++) {

        parallel[index] = function (cb) {
            that.storyStrategy.getChapter(that.chapterUrlList[index + start], (res) => {
                cb(null, res)
            })
        }
    }
    return parallel
}

/**
 * 构建获取章节内容的并行函数列表
 * @param {*} chapters 
 * @returns 
 */
StoryParse.prototype.getChapterDetailParallel = function (chapters, step = 10) {
    let that = this
    let parallel = {}

    for (let index = 0; index < chapters.length;) {
        let end = (index + step) < chapters.length ? (index + step) : chapters.length
        let list = chapters.slice(index, end)
        let _index = index
        parallel[_index] = function (cb) {

            that.storyStrategy.getChapterDetail(list, (res) => {
                cb(null, res)
            })
        }
        index = end
    }
    return parallel
}

StoryParse.prototype.run = function (start, end, cb) {
    const that = this
    let chapterParallel = this.getChapterParallel(start, end)

    const waterfallList = [
        // 获取所有章节
        function (done) {
            console.log('正在获取章节列表...')

            async.parallel(chapterParallel, function (err, result) {
                console.log('获取章节列表成功...')
                done(err, result) //将结果写入result
            });
        },
        function (result, done) {
            let chapters = []
            for (let key in result) {
                chapters = [...chapters, ...result[key]]
            }

             //console.log(chapters)
            let contentParallel = that.getChapterDetailParallel(chapters, that.step)
            console.log('正在获取小说内容...')
            async.parallel(contentParallel, function (err, result) {
                console.log('获取小说内容成功...')
                done(err, result) //将结果写入result
            });

        },
    ];
    async.waterfall(waterfallList, (error, result) => {
        let storyContent = ''
        for (let key in result) {
            storyContent += result[key]
        }
    
       // storyContent = storyContent.replace(/（本章未完，请点击下一页继续阅读）/g, '')
        this.writeFile(this.filePath, storyContent)
        cb && cb()
    });
}

StoryParse.prototype.writeFile = function (filePath, str) {
    console.log('正在写入文档...')
    try {
        fileHelper.writeFile(filePath, str)
    } catch (e) {
        console.log('写入失败!')
        throw e
    }
    console.log('写入成功!')
}

/**
 * 为保证下载成功，采用分段下载的策略
 * @@param {number} step 每段下载几页的内容
 */
StoryParse.prototype.downloadStory = function (step) {
    let start = new Date()
    console.log('开始...')
    let per = step
    let that = this
    let waterfallList = []
    let perCount = 1
    for (let index = 0; index < this.chapterPageCount;) {
        let endPage = (index + per) < this.chapterPageCount ? (index + per) : this.chapterPageCount
        let startPage = index
        let count = perCount
        waterfallList.push(function (...args) {
            console.log(`正在下载第${count}段内容`)
            that.run(startPage, endPage, () => {
                args[args.length - 1]()
            })
        })
        perCount = perCount + 1
        index = endPage
    }
    
    async.waterfall(waterfallList, (error, result) => {
        let end = new Date()
        console.log('小说生成成功，总耗时:' + (end.getTime() - start.getTime()))
    });
}

module.exports = StoryParse