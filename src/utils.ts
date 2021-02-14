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
  { id: 'coder', name: 'Coder Dict', description: '程序员常见单词词库', category: '代码练习', url: 'it-words.json', length: 1700 },
  { id: 'gmat', name: 'GMAT', description: 'GMAT 词库', category: '英语学习', url: 'GMAT_T.json', length: 3047 },
  { id: 'gre', name: 'GRE', description: 'GRE 词库', category: '英语学习', url: 'GRE_T.json', length: 6515 },
  { id: 'ielts', name: 'IELTS', description: '雅思词库', category: '英语学习', url: 'IELTS_T.json', length: 3575 },
  { id: 'kaoyan', name: '考研', description: '研究生英语入学考试词库', category: '英语学习', url: 'KaoYan_T.json', length: 3728 },
  { id: 'level4', name: '专四', description: '英语专业四级词库', category: '英语学习', url: 'Level4_T.json', length: 4025 },
  { id: 'level8', name: '专八', description: '英语专业八级词库', category: '英语学习', url: 'Level8_T.json', length: 12197 },
  {
    id: 'sat',
    name: 'SAT',
    description: '美国 SAT 考试词库',
    category: '英语学习',
    url: './dicts/SAT_T.json',
    length: 4464,
  },
  { id: 'toefl', name: 'TOEFL', description: '托福考试常见词', category: '英语学习', url: 'TOEFL_T.json', length: 4264 },
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
