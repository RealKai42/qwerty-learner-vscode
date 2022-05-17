const { playerPlay } = require("node-loader!./rodio/index.node");
import { getConfig } from './utils'

type voiceType = 'us' | 'uk' | 'close'

export const getVoiceType = () => {
  const voiceType: voiceType = getConfig('voiceType')
  let type
  switch (voiceType) {
    case 'us':
      type = 2
      break
    case 'uk':
      type = 1
      break
    case 'close':
      type = ''
      break
    default:
      type = ''
      break
  }
  return type
}

export const voicePlayer = (word: string, type: string | number) => {
  if (type) {
    playerPlay(`https://dict.youdao.com/dictvoice?audio=${word}&type=${type}`)
  }
}
