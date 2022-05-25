import * as vscode from 'vscode'
import path from 'path'
import fs from 'fs'
export type Dictionary = {
  id: string
  name: string
  description: string
  category: string
  url: string
  length: number
}

export type Dicts = {
  [key: string]: Dictionary
}

// 使用与网页版 qwerty 一样的格式，方便共享数据
const dictInfos: Dictionary[] = [
  { id: 'cet4', name: 'CET-4', description: '大学英语四级词库', category: '英语学习', url: '', length: 2607 },
  { id: 'cet6', name: 'CET-6', description: '大学英语六级词库', category: '英语学习', url: 'CET6_T.json', length: 2345 },
  { id: 'gmat', name: 'GMAT', description: 'GMAT 词库', category: '英语学习', url: 'GMAT_3_T.json', length: 3047 },
  { id: 'gre', name: 'GRE', description: 'GRE 词库', category: '英语学习', url: 'GRE_3_T.json', length: 6515 },
  { id: 'ielts', name: 'IELTS', description: '雅思词库', category: '英语学习', url: 'IELTS_3_T.json', length: 3575 },
  { id: 'kaoyan', name: '考研', description: '研究生英语入学考试词库', category: '英语学习', url: 'KaoYan_3_T.json', length: 3728 },
  { id: 'level4', name: '专四', description: '英语专业四级词库', category: '英语学习', url: 'Level4luan_2_T.json', length: 4025 },
  { id: 'level8', name: '专八', description: '英语专业八级词库', category: '英语学习', url: 'Level8luan_2_T.json', length: 12197 },
  {
    id: 'gaokao3500',
    name: '高考 3500 词',
    description: '高考常见词 3500',
    category: '英语学习',
    url: 'GaoKao_3500.json',
    length: 3876,
  },
  {
    id: 'sat',
    name: 'SAT',
    description: '美国 SAT 考试词库',
    category: '英语学习',
    url: 'SAT_3_T.json',
    length: 4464,
  },
  { id: 'toefl', name: 'TOEFL', description: '托福考试常见词', category: '英语学习', url: 'TOEFL_3_T.json', length: 4264 },
  { id: 'bec2', name: '商务英语', description: '商务英语常见词', category: '英语学习', url: 'BEC_2_T.json', length: 2753 },
  { id: 'bec3', name: 'BEC', description: 'BEC考试常见词', category: '英语学习', url: 'BEC_3_T.json', length: 2825 },
  { id: 'coder', name: 'Coder Dict', description: '程序员常见单词词库', category: '代码练习', url: 'it-words.json', length: 1700 },
  { id: 'jsArray', name: 'JS: Array', description: 'JavaScript API 词典', category: '代码练习', url: 'js-array.json', length: 36 },
  { id: 'jsDate', name: 'JS: Date', description: 'JavaScript API 词典', category: '代码练习', url: 'js-date.json', length: 34 },
  {
    id: 'jsGlobal',
    name: 'JS: Global',
    description: 'JavaScript API 词典',
    category: '代码练习',
    url: 'js-global.json',
    length: 9,
  },
  {
    id: 'jsMapSet',
    name: 'JS: Map & Set',
    description: 'JavaScript API 词典',
    category: '代码练习',
    url: 'js-map-set.json',
    length: 16,
  },
  { id: 'jsMath', name: 'JS: Math', description: 'JavaScript API 词典', category: '代码练习', url: 'js-math.json', length: 38 },
  {
    id: 'jsNumber',
    name: 'JS: Number',
    description: 'JavaScript API 词典',
    category: '代码练习',
    url: 'js-number.json',
    length: 22,
  },
  {
    id: 'jsObject',
    name: 'JS: Object',
    description: 'JavaScript API 词典',
    category: '代码练习',
    url: 'js-object.json',
    length: 37,
  },
  {
    id: 'jsPromise',
    name: 'JS: Promise',
    description: 'JavaScript API 词典',
    category: '代码练习',
    url: 'js-promise.json',
    length: 9,
  },
  {
    id: 'jsString',
    name: 'JS: String',
    description: 'JavaScript API 词典',
    category: '代码练习',
    url: 'js-string.json',
    length: 32,
  },
  {
    id: 'python-builtin',
    name: 'Python: Built-in',
    description: 'Python Built-in API',
    category: '代码练习',
    url: 'python-builtin.json',
    length: 65,
  },
  {
    id: 'python-array',
    name: 'Python: array',
    description: 'Python array API ',
    category: '代码练习',
    url: 'python-array.json',
    length: 11,
  },
  {
    id: 'python-date',
    name: 'Python: date',
    description: 'Python date API ',
    category: '代码练习',
    url: 'python-date.json',
    length: 39,
  },
  {
    id: 'python-file',
    name: 'Python: file',
    description: 'Python file API ',
    category: '代码练习',
    url: 'python-file.json',
    length: 21,
  },
  {
    id: 'python-class',
    name: 'Python: class',
    description: 'Python class API ',
    category: '代码练习',
    url: 'python-class.json',
    length: 13,
  },
  {
    id: 'python-set',
    name: 'Python: set',
    description: 'Python set API ',
    category: '代码练习',
    url: 'python-set.json',
    length: 29,
  },
  {
    id: 'python-math',
    name: 'Python: math',
    description: 'Python math API ',
    category: '代码练习',
    url: 'python-math.json',
    length: 37,
  },
  {
    id: 'python-string',
    name: 'Python: string',
    description: 'Python string API ',
    category: '代码练习',
    url: 'python-string.json',
    length: 40,
  },
  {
    id: 'python-system',
    name: 'Python: system',
    description: 'Python system API ',
    category: '代码练习',
    url: 'python-sys.json',
    length: 24,
  },
  {
    id: 'javeArrayList',
    name: 'Java: ArrayList',
    description: 'JavaScript API 词典',
    category: '代码练习',
    url: 'java-arraylist.json',
    length: 25,
  },
  {
    id: 'javaCharacter',
    name: 'Java: Character',
    description: 'JavaScript API 词典',
    category: '代码练习',
    url: 'java-character.json',
    length: 8,
  },
  {
    id: 'javaHashmap',
    name: 'Java: Hashmap',
    description: 'JavaScript API 词典',
    category: '代码练习',
    url: 'java-hashmap.json',
    length: 22,
  },
  {
    id: 'javaLinkedList',
    name: 'Java: LinkedList',
    description: 'JavaScript API 词典',
    category: '代码练习',
    url: 'java-linkedlist.json',
    length: 25,
  },
  {
    id: 'javaString',
    name: 'Java: String',
    description: 'JavaScript API 词典',
    category: '代码练习',
    url: 'java-string.json',
    length: 48,
  },
  {
    id: 'javaStringBuffer',
    name: 'Java: StringBuffer',
    description: 'JavaScript API 词典',
    category: '代码练习',
    url: 'java-stringBuffer.json',
    length: 20,
  },
  {
    id: 'linuxCommand',
    name: 'Linux',
    description: 'Linux Command',
    category: '代码练习',
    url: 'linux-command.json',
    length: 575,
  },
  {
    id: 'csharpList',
    name: 'C#: List API',
    description: 'C# List API',
    category: '代码练习',
    url: 'csharp-list.json',
    length: 36,
  },
  {
    id: 'nce1',
    name: '新概念英语-1',
    description: '新概念英语第一册',
    category: '新概念英语',
    url: 'NCE_1.json',
    length: 900,
  },
  {
    id: 'nce2',
    name: '新概念英语-2',
    description: '新概念英语第二册',
    category: '新概念英语',
    url: 'NCE_2.json',
    length: 858,
  },
  {
    id: 'nce3',
    name: '新概念英语-3',
    description: '新概念英语第三册',
    category: '新概念英语',
    url: 'NCE_3.json',
    length: 1052,
  },
  {
    id: 'nce4',
    name: '新概念英语-4',
    description: '新概念英语第四册',
    category: '新概念英语',
    url: 'NCE_4.json',
    length: 784,
  },
  {
    id: 'SATen',
    name: 'SAT en-en',
    description: 'SAT英英',
    category: 'en2en',
    url: 'SATen.json',
    length: 2681,
  },
  {
    id: '4000 Essential English Words1',
    name: 'Essential Words',
    description: '4000 Essential English Words meaning',
    category: 'en2en',
    url: '4000 Essential English Words-meaning.json',
    length: 3600,
  },
  {
    id: '4000 Essential English Words2',
    name: 'Essential Words',
    description: '4000 Essential English Words sentence',
    category: 'en2en',
    url: '4000 Essential English Words-sentence.json',
    length: 3600,
  },
  {
    id: 'suffix word',
    name: 'suffix word',
    description: 'common suffix',
    category: 'en2en',
    url: 'suffix word.json',
    length: 126,
  },
  {
    id: 'word roots1',
    name: 'word roots1',
    description: 'common roots',
    category: 'en2en',
    url: 'word roots1.json',
    length: 368,
  },
]

export const dicts: Dicts = {}
dictInfos.forEach((i) => (dicts[i.id] = i))

export function compareWord(word: string, input: string) {
  // 错误返回错误索引，正确返回-2，未完成输入且无错误返回-1
  for (let i = 0; i < word.length; i++) {
    if (typeof input[i] !== 'undefined') {
      if (word[i] !== input[i]) {
        return i
      }
    } else {
      return -1
    }
  }
  return -2
}

export function getConfig(key: string) {
  return vscode.workspace.getConfiguration('qwerty-learner')[key]
}

export function getDictFile(dictPath: string) {
  const filePath = path.join(__dirname, '..', 'assets/dicts', dictPath)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

export interface DictPickItem {
  label: string
  path: string
  key: string
  detail: string
}
