import { type AstTree, type Node, NodeTypes } from './ast'
import { CREATE_ELEMENT_VNODE, TO_DISPLAY_STRING, helperNameMap } from './runtimeHelpers'

interface GenerateContext {
  code: string
  push: (str: string) => void
  helper: (str: symbol) => string
}

export function generate(ast: AstTree) {
  const ctx = createGenerateContext()

  genFunctionPreamble(ast, ctx)

  ctx.push('return ')
  const functionName = 'render'
  const args = ['_ctx', '_cache']
  const parameters = args.join(', ')

  ctx.push(`function ${functionName}(${parameters}){`)

  const node = ast.codegenNode

  node && genNode(node, ctx)

  ctx.push('}')

  return {
    code: ctx.code,
  }
}

function genNode(node: Node, ctx: GenerateContext) {
  switch (node.type) {
    case NodeTypes.TEXT:
      genText(node, ctx)
      break
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(node, ctx)
      break
    case NodeTypes.INTERPOLATION:
      genInterpolation(node, ctx)
      break
    case NodeTypes.ELEMENT:
      genElement(node, ctx)
      break
    default:
      break
  }
}

function genElement(node: Node, ctx: GenerateContext) {
  const { tag } = node
  if (tag)
    ctx.push(`${ctx.helper(CREATE_ELEMENT_VNODE)}('${tag}')`)
}

function genExpression(node: Node, ctx: GenerateContext) {
  ctx.push(`${node.content as string}`)
}

function genInterpolation(node: Node, ctx: GenerateContext) {
  ctx.push(`${ctx.helper(TO_DISPLAY_STRING)}(`)
  genNode(node.content as Node, ctx)
  ctx.push(')')
}

function genText(node: Node, ctx: GenerateContext) {
  ctx.push(`return ${node.content as string}`)
}

function genFunctionPreamble(ast: AstTree, ctx: GenerateContext) {
  const helpers = ast.helpers
  if (helpers && helpers.length) {
    const vueGloabl = 'Vue'

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const helpersStr = helpers.map(v => `${(helperNameMap as any)[v]}: _${(helperNameMap as any)[v]}`).join(', ')

    ctx.push(`const { ${helpersStr} } = ${vueGloabl}`)

    ctx.push('\n')
  }
}

function createGenerateContext(): GenerateContext {
  return {
    code: '',
    push(str: string) {
      this.code += str
    },
    helper(key: symbol) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      return `_${(helperNameMap as any)[key]}`
    },
  }
}
