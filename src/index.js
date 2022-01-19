const StoryParse = require('./core/StoryParser')
const path = require('path')
const dingDianStrategy = require('./strategy/Dingdian')
const BiquStrategy = require('./strategy/BiQu')
const topStrategy = require('./strategy/Top')
// function test() {
//   let storyParse = new StoryParse({
//       chapterPath: '10/10163/',
//       chapterPageCount: 13,
//       filePath: path.resolve(__dirname, './download/斗罗大陆5重生唐三.txt'),
//       step: 10, // 获取章节时，以五章为一个任务
//       storyStrategy: dingDianStrategy
//   })
//   // 以五页为一段进行分段爬取
//   storyParse.downloadStory(5)
// }
// test()

// function test() {
//   let storyParse = new StoryParse({
//       chapterPath: 'booktxt/18359616116/',
//       chapterPageCount: 19,
//       filePath: path.resolve(__dirname, './download/灵域.txt'),
//       step: 10, // 获取章节时，以五章为一个任务
//       storyStrategy: BiquStrategy
//   })
//   // 以五页为一段进行分段爬取
//   storyParse.downloadStory(5)
// }
// test()


function test() {
  let storyParse = new StoryParse({
      chapterPath: '86_86418/mulu/',
      chapterPageCount: 10,
      filePath: path.resolve(__dirname, './download/万相之王.txt'),
      step: 10, // 获取章节时，以五章为一个任务
      storyStrategy: topStrategy
  })
  // 以五页为一段进行分段爬取
  storyParse.downloadStory(5)
}
test()