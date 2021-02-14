import * as vscode from 'vscode'
import path from 'path'
import fs from 'fs'

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

interface Dicts {
  [key: string]: [string, string]
}

export const dicts: Dicts = {
  cet4: ['CET-4', 'CET4_T.json'],
  cet6: ['CET-6', 'CET6_T.json'],
}

export function getDictFile(dictPath: string) {
  const filePath = path.join(__dirname, '..', 'dicts', dictPath)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

export interface DictPickItem {
  label: string
  path: string
  key: string
}
