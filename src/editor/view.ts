import { EditorView } from 'prosemirror-view'
import { EditorState } from 'prosemirror-state'
import { schema } from './schema'
import { keymap } from 'prosemirror-keymap'
// baseKeymap 定义了对于很多基础按键按下后的功能，例如回车换行，删除键等。
import { baseKeymap } from 'prosemirror-commands'
// history 是操作历史，提供了对保存操作历史以及恢复等功能，undo，redo 函数对应为进行 undo 操作与 redo 操作，恢复历史数据
import { history, undo, redo } from 'prosemirror-history'
import {
  insertHeading,
  insertParagraph,
  insertBlockquote,
  insertDatetime,
} from './utils'

export const setupEditor = (el: HTMLElement | null) => {
  if (!el) return

  const editorRoot = document.createElement('div')
  editorRoot.id = 'editorRoot'

  // 根据 schema 定义，创建 editorState 数据实例
  const editorState = EditorState.create({
    schema,
    // 新增 keymap 插件。
    plugins: [
      // 这里 keymap 是个函数，运行后，会生成一个插件，插件功能即将基础按键绑定到对应的功能上，例如回车换行，删除键等。
      keymap(baseKeymap),
      // 接入 history 插件，提供输入历史栈功能
      history(),
      // 将组合按键 ctrl/cmd + z, ctrl/cmd + y 分别绑定到 undo, redo 功能上
      keymap({ 'Mod-z': undo, 'Mod-y': redo }),
    ],
  })

  // 创建编辑器视图实例，并挂在到 el 上
  const editorView = new EditorView(editorRoot, {
    state: editorState,
  })

  // 添加两个 button 分别插入段落和标题
  const btnGroup = document.createElement('div')
  btnGroup.style.marginBottom = '12px'

  const addParagraphBtn = document.createElement('button')
  addParagraphBtn.innerText = '添加新段落'
  addParagraphBtn.addEventListener('click', () =>
    insertParagraph(editorView, '新段落')
  )

  const addHeadingBtn = document.createElement('button')
  addHeadingBtn.innerText = '添加新一级标题'
  addHeadingBtn.addEventListener('click', () =>
    insertHeading(editorView, '新一级标题')
  )

  const addBlockquoteBtn = document.createElement('button')
  addBlockquoteBtn.innerText = '添加引用块'
  addBlockquoteBtn.addEventListener('click', () =>
    insertBlockquote(editorView, 'blockquote')
  )

  const addDateTimeBtn = document.createElement('button')
  addDateTimeBtn.innerText = '添加时间块'
  addDateTimeBtn.addEventListener('click', () => insertDatetime(editorView, 0))

  btnGroup.appendChild(addParagraphBtn)
  btnGroup.appendChild(addHeadingBtn)
  btnGroup.appendChild(addBlockquoteBtn)
  btnGroup.appendChild(addDateTimeBtn)

  const fragment = document.createDocumentFragment()
  fragment.appendChild(btnGroup)
  fragment.appendChild(editorRoot)

  el.appendChild(fragment)

  console.log('editorView', editorView)
}
