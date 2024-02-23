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
import { Toolbar } from './toolbar'
import { setBold, unsetBold } from './mark'

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

    dispatchTransaction(tr) {
      let newState = editorView.state.apply(tr)
      editorView.updateState(newState)
      toolbar.update(editorView, editorView.state)
    },
  })

  const toolbar = new Toolbar(editorView, {
    groups: [
      {
        name: '段落',
        menus: [
          {
            label: '添加段落',
            handler: (props) => {
              const { view } = props
              insertParagraph(view, '新段落')
            },
          },
          {
            label: '添加一级标题',
            handler: (props) => {
              insertHeading(props.view, '新一级标题')
            },
          },
          {
            label: '添加 blockquote',
            handler: (props) => {
              insertBlockquote(props.view)
            },
          },
          {
            label: '添加 datetime',
            handler: (props) => {
              insertDatetime(props.view, Date.now())
            },
          },
        ],
      },
      {
        name: '格式',
        menus: [
          {
            label: '加粗',
            handler(props) {
              setBold(props.view)
            },
          },
          {
            label: '取消加粗',
            handler(props) {
              unsetBold(props.view)
            },
          },
        ],
      },
    ],
  })

  const fragment = document.createDocumentFragment()
  fragment.appendChild(editorRoot)

  el.appendChild(fragment)
}
