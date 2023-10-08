import { range } from 'lodash'
import * as vscode from 'vscode'
import { dictionaries } from './resource/dictionary'
import { voicePlayer } from './resource/voice'
import { soundPlayer } from './sound'
import { DictPickItem } from './typings/index'
import { getConfig } from './utils'
import PluginState from './utils/PluginState'

const PLAY_VOICE_COMMAND = 'qwerty-learner.playVoice'
const PREV_WORD_COMMAND = 'qwerty-learner.prevWord'
const NEXT_WORD_COMMAND = 'qwerty-learner.nextWord'
const TOGGLE_TRANSLATION_COMMAND = 'qwerty-learner.toggleTranslation'
const TOGGLE_DIC_NAME_COMMAND = 'qwerty-learner.toggleDicName'

export function activate(context: vscode.ExtensionContext) {
  const pluginState = new PluginState(context)

  const wordBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -100)
  const inputBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -101)
  const playVoiceBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -102)
  const translationBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -103)
  const prevWord = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -104)
  const nextWord = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -105)
  prevWord.text = '<'
  prevWord.tooltip = '切换上一个单词'
  prevWord.command = PREV_WORD_COMMAND
  nextWord.text = '>'
  nextWord.tooltip = '切换下一个单词'
  nextWord.command = NEXT_WORD_COMMAND
  playVoiceBar.command = PLAY_VOICE_COMMAND
  playVoiceBar.tooltip = '播放发音'
  translationBar.tooltip = '显示/隐藏中文翻译'
  translationBar.command = TOGGLE_TRANSLATION_COMMAND
  wordBar.command = TOGGLE_DIC_NAME_COMMAND
  wordBar.tooltip = '隐藏/显示字典名称'

  vscode.workspace.onDidChangeTextDocument((e) => {
    if (!pluginState.isStart) {
      return
    }

    if (pluginState.readOnlyMode) {
      return
    }

    const { uri } = e.document
    // 避免破坏配置文件
    if (uri.scheme.indexOf('vscode') !== -1) {
      return
    }

    const { range, text, rangeLength } = e.contentChanges[0]
    if (!(text !== '' && text.length === 1)) {
      return
    }

    if(pluginState.autoCaptureMode === false) {

      // 删除用户输入的字符
      const newRange = new vscode.Range(range.start.line, range.start.character, range.end.line, range.end.character + 1)
      const editAction = new vscode.WorkspaceEdit()
      editAction.delete(uri, newRange)
      vscode.workspace.applyEdit(editAction)
      if (pluginState.hasWrong) {
        return
      }
      soundPlayer('click')
      inputBar.text = pluginState.getCurrentInputBarContent(text)

      const compareResult = pluginState.compareResult
      if (compareResult === -2) {
        // 用户完成单词输入
        soundPlayer('success')
        pluginState.finishWord()
        initializeBar()
      } else if (compareResult >= 0) {
        pluginState.wrongInput()
        inputBar.color = pluginState.highlightWrongColor
        soundPlayer('wrong')
        setTimeout(() => {
          pluginState.clearWrong()
          inputBar.color = undefined
          initializeBar()
        }, pluginState.highlightWrongDelay)
      }
    }else {

      const expectedInput = pluginState.currentWord.name;  // 期望的单词
      const expectedInputLength = expectedInput.length;  // 期望的单词的长度

      pluginState.getCurrentInputBarContent(text)
      
      // 删除正确匹配的单词字符
      if (pluginState.compareResult === -2) {

              const newRange = new vscode.Range(range.start.line, range.start.character - expectedInputLength, range.end.line, range.end.character + 1);
              const editAction = new vscode.WorkspaceEdit();
              editAction.delete(uri, newRange);
              vscode.workspace.applyEdit(editAction);

              // 执行其他逻辑，比如播放声音，更新状态等
              soundPlayer('success');
              pluginState.finishWord()
              initializeBar()
      } else if (pluginState.compareResult >= 0) {
        pluginState.wrongInput()
        pluginState.clearWrong()
      }
    }

  })

  vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration('qwerty-learner.placeholder')) {
      pluginState.placeholder = getConfig('placeholder')
      initializeBar()
    }

    if (event.affectsConfiguration('qwerty-learner.chapterLength')) {
      pluginState.chapterLength = getConfig('chapterLength')
      initializeBar()
    }
  })

  // 注册 vscode commands
  context.subscriptions.push(
    ...[
      vscode.commands.registerCommand('qwerty-learner.start', () => {
        pluginState.isStart = !pluginState.isStart
        if (pluginState.isStart) {
          initializeBar()
          wordBar.show()
          inputBar.show()
          playVoiceBar.show()
          prevWord.show()
          nextWord.show()
          translationBar.show()
          if (pluginState.readOnlyMode) {
            setUpReadOnlyInterval()
          }
        } else {
          wordBar.hide()
          inputBar.hide()
          playVoiceBar.hide()
          prevWord.hide()
          nextWord.hide()
          translationBar.hide()
          removeReadOnlyInterval()
        }
      }),
      vscode.commands.registerCommand('qwerty-learner.changeChapter', async () => {
        const inputChapter = await vscode.window.showQuickPick(
          range(1, pluginState.totalChapters + 1).map((i) => i.toString()),
          { placeHolder: `当前章节: ${pluginState.chapter + 1}   共 ${pluginState.totalChapters}章节` },
        )
        if (inputChapter !== undefined) {
          pluginState.chapter = parseInt(inputChapter) - 1
          initializeBar()
        }
      }),
      vscode.commands.registerCommand('qwerty-learner.changeDict', async () => {
        const dictList: DictPickItem[] = []
        dictionaries.forEach((dict) => {
          dictList.push({ label: dict.name, path: dict.url, detail: dict.description, key: dict.id })
        })
        const inputDict = await vscode.window.showQuickPick(dictList, { placeHolder: `当前字典: ${pluginState.dict.name}` })
        if (inputDict !== undefined) {
          pluginState.dictKey = inputDict.key
          initializeBar()
        }
      }),
      vscode.commands.registerCommand('qwerty-learner.toggleWordVisibility', () => {
        pluginState.wordVisibility = !pluginState.wordVisibility
        initializeBar()
      }),
      vscode.commands.registerCommand('qwerty-learner.toggleReadOnlyMode', () => {
        pluginState.readOnlyMode = !pluginState.readOnlyMode
        if (pluginState.readOnlyMode) {
          setUpReadOnlyInterval()
        } else {
          removeReadOnlyInterval()
        }
      }),
      vscode.commands.registerCommand(PLAY_VOICE_COMMAND, playVoice),
      vscode.commands.registerCommand(TOGGLE_TRANSLATION_COMMAND, () => {
        pluginState.toggleTranslation()
        initializeBar()
      }),
      vscode.commands.registerCommand(TOGGLE_DIC_NAME_COMMAND, () => {
        pluginState.toggleDictName()
        wordBar.text = pluginState.getInitialWordBarContent()
      }),
      vscode.commands.registerCommand(PREV_WORD_COMMAND, () => {
        pluginState.prevWord()
        initializeBar()
      }),
      vscode.commands.registerCommand(NEXT_WORD_COMMAND, () => {
        pluginState.nextWord()
        initializeBar()
      }),
      vscode.commands.registerCommand('qwerty-learner.toggleChapterCycleMode', () => {
        pluginState.chapterCycleMode = !pluginState.chapterCycleMode
        if (pluginState.chapterCycleMode) {
          vscode.window.showInformationMessage('章节循环模式已开启')
        } else {
          vscode.window.showInformationMessage('章节循环模式已关闭')
        }
      }),
      vscode.commands.registerCommand('qwerty-learner.toggleAutoCaptureMode', () => {
        pluginState.autoCaptureMode = !pluginState.autoCaptureMode
        if (pluginState.autoCaptureMode) {
          vscode.window.showInformationMessage('自动捕获模式已开启')
        } else {
          vscode.window.showInformationMessage('自动捕获模式已关闭')
        }
      }),
    ],
  )

  function initializeBar() {
    setUpWordBar()
    setUpPlayVoiceBar()
    setUpTranslationBar()
    setUpInputBar()
  }
  function playVoice() {
    if (pluginState.shouldPlayVoice) {
      pluginState.voiceLock = true
      voicePlayer(pluginState.currentWord.name, () => {
        pluginState.voiceLock = false
      })
    }
  }
  function setUpWordBar() {
    wordBar.text = pluginState.getInitialWordBarContent()
    playVoice()
  }
  function setUpPlayVoiceBar() {
    playVoiceBar.text = pluginState.getInitialPlayVoiceBarContent()
  }
  function setUpTranslationBar() {
    translationBar.text = pluginState.getInitialTranslationBarContent()
  }
  function setUpInputBar() {
    inputBar.text = pluginState.getInitialInputBarContent()
  }

  function setUpReadOnlyInterval() {
    if (!pluginState.readOnlyIntervalId) {
      pluginState.readOnlyIntervalId = setInterval(() => {
        pluginState.finishWord()
        initializeBar()
      }, pluginState.readOnlyInterval)
    }
  }
  function removeReadOnlyInterval() {
    if (pluginState.readOnlyIntervalId) {
      clearInterval(pluginState.readOnlyIntervalId)
      pluginState.readOnlyIntervalId = null
    }
  }
}
