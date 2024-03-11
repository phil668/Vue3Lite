import type { AstTree } from './ast'

export function generate(ast: AstTree) {
  const ctx = createGenerateContext()
  ctx.push('return ')
  const functionName = 'render'
  const args = ['_ctx', '_cache']
  const parameters = args.join(', ')

  const node = ast.codegenNode

  ctx.push(`function ${functionName}(${parameters}){`)
  ctx.push(`return ${node.content}`)
  ctx.push('}')

  return {
    code: ctx.code,
  }
}

function createGenerateContext() {
  return {
    code: '',
    push(str: string) {
      this.code += str
    },
  }
}
