export type DictPickItem = {
  label: string
  path: string
  key: string
  detail: string
}

export type Word = {
  name: string
  trans: string[]
  usphone?: string
  ukphone?: string
}

export type VoiceType = 'us' | 'uk' | 'ja' | 'zh'| 'romaji' | 'de' |'close'

export type Dictionary = {
  id: string
  name: string
  description: string
  category: string
  url: string
  length: number
  language: 'en' | 'romaji' | 'zh' | 'ja' | 'code' | 'de'
}
