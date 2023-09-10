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

export type VoiceType = 'us' | 'uk' | 'close'

export type Dictionary = {
  id: string
  name: string
  description: string
  category: string
  url: string
  length: number
  language: 'en' | 'romaji' | 'zh' | 'ja' | 'code' | 'de'
}

export type DictionaryResource = {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  url: string
  length: number
  language: LanguageType
  languageCategory: LanguageCategoryType
  //override default pronunciation when not undefined
  defaultPronIndex?: number
}

export type LanguageType = 'en' | 'romaji' | 'zh' | 'ja' | 'code' | 'de'
export type LanguageCategoryType = 'en' | 'ja' | 'de' | 'code'
