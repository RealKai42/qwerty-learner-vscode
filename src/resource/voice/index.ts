import { VoiceType } from './../../typings/index'
import { getConfig } from '../../utils'
import { romajiToHiragana } from '@/utils/kana'
interface NativeModule {
  playerPlay(voiceUrl: string, callback: () => void): void
}

let NATIVE: any = null

try {
  NATIVE = require(`node-loader!./rodio/mac-arm.node`) as NativeModule
} catch (error) {
  NATIVE = null
}

if (!(NATIVE && NATIVE.playerPlay)) {
  try {
    NATIVE = require(`node-loader!./rodio/win32.node`) as NativeModule
  } catch (error) {
    NATIVE = null
  }
}
if (!(NATIVE && NATIVE.playerPlay)) {
  try {
    NATIVE = require(`node-loader!./rodio/mac-intel.node`) as NativeModule
  } catch (error) {
    NATIVE = null
  }
}

if (!(NATIVE && NATIVE.playerPlay)) {
  NATIVE = null
}

const pronunciationApi = 'https://dict.youdao.com/dictvoice?audio='

const generateWordSoundSrc = (word: string) => {
  const pronunciation = getConfig('pronounces') as VoiceType
  switch (pronunciation) {
    case 'uk':
      return `${pronunciationApi}${word}&type=1`
    case 'us':
      return `${pronunciationApi}${word}&type=2`
    case 'romaji':
      return `${pronunciationApi}${romajiToHiragana(word)}&le=jap`
    case 'zh':
      return `${pronunciationApi}${word}&le=zh`
    case 'ja':
      return `${pronunciationApi}${word}&le=jap`
    case 'de':
      return `${pronunciationApi}${word}&le=de`
  }

}

export const voicePlayer = (word: string, callback: () => void) => {
  if (NATIVE) {
    const soundSrc = generateWordSoundSrc(word)
    NATIVE.playerPlay(soundSrc, callback)
  } else {
    callback()
  }
}
