import { VoiceType } from './../../typings/index'
import { getConfig } from '../../utils'
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
  try {
    NATIVE = require(`node-loader!./rodio/linux-x64.node`) as NativeModule
  } catch (error) {
    NATIVE = null
  }
}
if (!(NATIVE && NATIVE.playerPlay)) {
  NATIVE = null
}

export const voicePlayer = (word: string, callback: () => void) => {
  if (NATIVE) {
    const type = getConfig('voiceType') === 'us' ? 2 : 1
    NATIVE.playerPlay(`https://dict.youdao.com/dictvoice?audio=${word}&type=${type}`, callback)
  } else {
    callback()
  }
}
