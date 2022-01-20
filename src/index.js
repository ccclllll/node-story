const StoryParse = require('./core/StoryParser')
const path = require('path')
const dingDianStrategy = require('./strategy/Dingdian')
const BiquStrategy = require('./strategy/BiQu')
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
  {
    chapterPath: 'booktxt/99715199116/',
    storyName: '恶魔公寓',
    storyStrategy: BiquStrategy,
    chapterPageCount: 1,

  },
  {
    chapterPath: '86_86418/mulu/',
    storyName: '万相之王',
    storyStrategy: topStrategy,
    chapterPageCount: 10,
  },
  {
    chapterPath: '10/10163/',
    storyName: '斗罗大陆5重生唐三',
    storyStrategy: dingDianStrategy,
    chapterPageCount: 13,
  },
]
downloadStory(stories[0])