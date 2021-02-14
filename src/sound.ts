const wavPlayer = require('node-wav-player')
import path from 'path'
import { getConfig } from './utils'

type SoundType = 'click' | 'wrong' | 'success'

export const soundPlayer = (type: SoundType) => {
  if (getConfig('keySound')) {
    let soundPath
    switch (type) {
      case 'click':
        soundPath = path.join(__dirname, '..', 'assets/sounds', 'click.wav')
        break
      case 'wrong':
        soundPath = path.join(__dirname, '..', 'assets/sounds', 'beep.wav')
        break
      case 'success':
        soundPath = path.join(__dirname, '..', 'assets/sounds', 'hint.wav')
        break
      default:
        break
    }
    // wavPlayer.stop()
    wavPlayer.play({ path: soundPath })
  }
}
