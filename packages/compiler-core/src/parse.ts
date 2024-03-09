import type { AstTree, Node } from './ast'
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

export function baseParse(content: string): AstTree {
  const context = createParseContext(content)

  return createRoot(parseChildren(context, []))
}

function parseChildren(context: ParseContext, ancestors: Node[]): Node[] {
  const nodes: Node[] = []
  while (!isEnd(context, ancestors)) {
    let node
    if (context.source.startsWith(openDelimiter))
      node = parseInterpolation(context)

    else if (context.source[0].startsWith('<')) {
      if (/[a-z]/i.test(context.source))
        node = parseElement(context, ancestors)
    }
    else
      node = parseText(context)

    node && nodes.push(node)
  }

  return nodes
}

function isEnd(context: ParseContext, ancestors: Node[]) {
  const s = context.source
  if (s.startsWith('<')) {
    for (let i = 0; i < ancestors.length; i++) {
      const tag = ancestors[i].tag!
      if (startWithEndTagOpen(s, tag))
        return true
    }
  }

  // source为空 或者 解析到结束标签
  return !s
}

function startWithEndTagOpen(source: string, tag: string) {
  return source.slice(2, tag.length + 2) === tag
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

function parseElement(context: ParseContext, ancestors: Node[]): Node {
  const node = parseTag(context, TagType.START)!
  ancestors.push(node)
  node.children = parseChildren(context, ancestors)
  ancestors.pop()

  if (startWithEndTagOpen(context.source, node.tag!))
    parseTag(context, TagType.END)

  else
    throw new Error(`缺少结束标签: ${node.tag!}`)

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

function createRoot(children: Array<Node>): AstTree {
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
