import * as vscode from 'vscode'
import cet4 from './assets/CET4_T.json'
import { range } from 'lodash'
import { compareWord, getConfig, dicts, DictPickItem, getDictFile } from './utils'
import { soundPlayer } from './sound'

export function activate(context: vscode.ExtensionContext) {
  const globalState = context.globalState
  globalState.setKeysForSync(['chapter', 'order', 'dictKey'])
  const chapterLength = 20
  let isStart = false,
    hasWrong = false,
    chapter = globalState.get('chapter', 0),
    order = globalState.get('order', 0),
    dict = cet4,
    dictKey = 'cet4'
  let wordList = dict.slice(chapter * chapterLength, (chapter + 1) * chapterLength)
  let totalChapters = Math.ceil(dict.length / chapterLength)
  const wordBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -100)
  const inputBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -101)
  const transBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -102)
  changeDict(globalState.get('dictKey', 'cet4'))

  function setupWord() {
    if (order === chapterLength - 1) {
      if (chapter === totalChapters - 1) {
        chapter = 0
      } else {
        chapter += 1
      }
      order = 0
      wordList = dict.slice(chapter * chapterLength, (chapter + 1) * chapterLength)
    }
    let phonetic = ''
    switch (getConfig('phonetic')) {
      case 'us':
        phonetic = wordList[order].usphone || ''
        break
      case 'uk':
        phonetic = wordList[order].ukphone || ''
        break
      case 'close':
        phonetic = ''
        break
    }

    wordBar.text = `${dicts[dictKey].name} chp.${chapter + 1}  ${order}/${chapterLength}  ${wordList[order].name}`
    inputBar.text = ''
    transBar.text = phonetic ? `/${phonetic}/  ` : ''
    transBar.text += wordList[order].trans.join('; ')
    updateGlobalState()
  }

  function refreshWordList() {
    totalChapters = Math.ceil(dict.length / chapterLength)
    wordList = dict.slice(chapter * chapterLength, (chapter + 1) * chapterLength)
    setupWord()
  }

  function changeDict(key: string) {
    if (key === 'cet4') {
      dict = cet4
    } else {
      dict = getDictFile(dicts[key].url)
    }
    dictKey = key
    refreshWordList()
  }

  function updateGlobalState() {
    globalState.update('chapter', chapter)
    globalState.update('order', order)
    globalState.update('dictKey', dictKey)
  }

  vscode.workspace.onDidChangeTextDocument((e) => {
    if (isStart) {
      const { uri } = e.document
      const { range, text, rangeLength } = e.contentChanges[0]

      if (text !== '') {
        // 删除用户输入的字符
        const newRange = new vscode.Range(range.start.line, range.start.character, range.end.line, range.end.character + 1)
        const editAction = new vscode.WorkspaceEdit()
        editAction.delete(uri, newRange)
        vscode.workspace.applyEdit(editAction)
        if (!hasWrong && text.length === 1) {
          soundPlayer('click')
          inputBar.text += text
          const result = compareWord(wordList[order].name, inputBar.text)
          if (result === -2) {
            order++
            soundPlayer('success')
            setupWord()
          } else if (result >= 0) {
            hasWrong = true
            inputBar.color = getConfig('highlightWrongColor')
            soundPlayer('wrong')
            setTimeout(() => {
              hasWrong = false
              inputBar.color = undefined
              setupWord()
            }, getConfig('highlightWrongDelay'))
          }
        }
      }
    }
  })

  let startCom = vscode.commands.registerCommand('qwerty-learner.Start', () => {
    isStart = !isStart
    if (isStart) {
      wordBar.show()
      inputBar.show()
      transBar.show()
      setupWord()
    } else {
      wordBar.hide()
      inputBar.hide()
      transBar.hide()
    }
  })

  let changeChapterCom = vscode.commands.registerCommand('qwerty-learner.changeChapter', async () => {
    const inputChapter = await vscode.window.showQuickPick(
      range(1, totalChapters + 1).map((i) => i.toString()),
      { placeHolder: `当前章节: ${chapter + 1}   共 ${totalChapters}章节` },
    )
    if (inputChapter !== undefined) {
      chapter = parseInt(inputChapter) - 1
      order = 0
      refreshWordList()
    }
  })

  let changeDictCom = vscode.commands.registerCommand('qwerty-learner.changeDict', async () => {
    const dictList: DictPickItem[] = []
    Object.keys(dicts).forEach((key) => {
      dictList.push({ label: dicts[key].name, path: dicts[key].url, detail: dicts[key].description, key: key })
    })
    const inputDict = await vscode.window.showQuickPick(dictList, { placeHolder: `当前字典: ${dicts[dictKey].name}` })
    if (inputDict !== undefined) {
      chapter = 0
      order = 0
      changeDict(inputDict.key)
    }
  })

  context.subscriptions.push(startCom)
  context.subscriptions.push(changeChapterCom)
  context.subscriptions.push(changeDictCom)
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log('我裂开了')
}
