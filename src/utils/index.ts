import * as vscode from 'vscode'
import path from 'path'
import fs from 'fs'

/**
 * 错误返回错误索引，正确返回-2，未完成输入且无错误返回-1
 */
export function compareWord(word: string, input: string) {
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
