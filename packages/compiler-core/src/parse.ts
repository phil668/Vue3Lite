import { NodeTypes } from './ast'

interface ParseContext {
  source: string
}

const openDelimiter = '{{'
const endDelimiter = '}}'

export function baseParse(content: string) {
  const context = createParseContext(content)

  return createRoot(parseChildren(context))
}

function parseChildren(context: ParseContext) {
  const nodes = []
  let node
  if (context.source.startsWith(openDelimiter))
    node = parseInterpolation(context)

  nodes.push(node)

  return nodes
}

function parseInterpolation(context: ParseContext) {
  const closeIndex = context.source.indexOf(endDelimiter)

  advanceBy(context, openDelimiter.length)

  const rawContentLength = closeIndex - 2

  const content = context.source.slice(0, rawContentLength).trim()

  advanceBy(context, rawContentLength + endDelimiter.length)

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content,
    },
  }
}

function advanceBy(context: ParseContext, length: number) {
  context.source = context.source.slice(length)
}

function createRoot(children: any) {
  return {
    children,
  }
}

function createParseContext(content: string): ParseContext {
  return {
    source: content,
  }
}
