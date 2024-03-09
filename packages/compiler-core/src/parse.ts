import type { Node } from './ast'
import { NodeTypes } from './ast'

interface ParseContext {
  source: string
}

const enum TagType {
  START,
  END,
}

const openDelimiter = '{{'
const endDelimiter = '}}'

export function baseParse(content: string): Node {
  const context = createParseContext(content)

  return createRoot(parseChildren(context, ''))
}

function parseChildren(context: ParseContext, parentTag: string): Node[] {
  const nodes: Node[] = []
  while (!isEnd(context, parentTag)) {
    let node
    if (context.source.startsWith(openDelimiter))
      node = parseInterpolation(context)

    else if (context.source[0].startsWith('<')) {
      if (/[a-z]/i.test(context.source))
        node = parseElement(context)
    }
    else
      node = parseText(context)

    node && nodes.push(node)
  }

  return nodes
}

function isEnd(context: ParseContext, parentTag: string) {
  // source为空 或者 解析到结束标签
  return !context.source || context.source.startsWith(`</${parentTag}>`)
}

function parseText(context: ParseContext): Node {
  let endIndex = context.source.length
  const endTokens = ['<', openDelimiter]

  for (let i = 0; i < endTokens.length; i++) {
    const endTokenIndex = context.source.indexOf(endTokens[i])
    if (endTokenIndex !== -1 && endIndex > endTokenIndex)
      endIndex = endTokenIndex
  }

  const content = parseTextData(context, endIndex)

  return {
    type: NodeTypes.TEXT,
    content,
  }
}

function parseTextData(context: ParseContext, length: number) {
  const content = context.source.slice(0, length)

  advanceBy(context, length)

  return content
}

function parseElement(context: ParseContext): Node {
  const node = parseTag(context, TagType.START)!

  node.children = parseChildren(context, node.tag!)

  parseTag(context, TagType.END)

  return node
}

function parseTag(context: ParseContext, type: TagType): Node | null {
  const match = /^<\/?([a-z]*)/.exec(context.source)
  if (!match)
    return null

  const tag = match[1]

  advanceBy(context, match[0].length)
  advanceBy(context, 1)

  if (TagType.END === type)
    return null

  return {
    type: NodeTypes.ELEMENT,
    tag,
  }
}

function parseInterpolation(context: ParseContext): Node {
  const closeIndex = context.source.indexOf(endDelimiter)

  advanceBy(context, openDelimiter.length)

  const rawContentLength = closeIndex - openDelimiter.length

  const rawContent = parseTextData(context, rawContentLength)

  const content = rawContent.trim()

  advanceBy(context, endDelimiter.length)

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

function createRoot(children: Array<Node>): Node {
  return {
    type: NodeTypes.ROOT,
    children,
  }
}

function createParseContext(content: string): ParseContext {
  return {
    source: content,
  }
}
