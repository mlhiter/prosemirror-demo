import { setupEditor } from './editor/view'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h3>从第一个 prosemirror 案例开始认识它</h3>
    <div id="editorContainer"></div>
  </div>
`
// 在 main.ts 中，调用 setupEditor，将编辑器 view 挂在在 editorContainer 中
setupEditor(document.querySelector('#editorContainer'))
