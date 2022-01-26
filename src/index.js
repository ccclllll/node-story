const StoryParse = require('./core/StoryParser')
const path = require('path')
const biquStrategy = require('./strategy/BiQu')
const topStrategy = require('./strategy/Top')

function downloadStory(options) {
  let {chapterPath, storyStrategy, chapterPageCount, storyName} = options
  new StoryParse({
    chapterPath,
    chapterPageCount,
    filePath: path.resolve(__dirname, `./download/${storyName}.txt`),
    step: 10, // 获取章节时，以五章为一个任务
    storyStrategy
  }).downloadStory(5)
}
let stories = [
  // 下载速度最快
  {
    chapterPath: 'booktxt/99715199116/',
    storyName: '恶魔公寓',
    storyStrategy: biquStrategy,
    chapterPageCount: 1,
  },
  {
    chapterPath: '21_21089/',
    storyName: '三寸人间',
    storyStrategy: topStrategy,
    chapterPageCount: 1,
  }
]
 downloadStory(stories[1])


