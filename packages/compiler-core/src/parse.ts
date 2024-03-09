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

export function baseParse(content: string) {
  const context = createParseContext(content)

  return createRoot(parseChildren(context))
}

function parseChildren(context: ParseContext) {
  const nodes = []
  let node
  if (context.source.startsWith(openDelimiter))
    node = parseInterpolation(context)

  else if (context.source[0].startsWith('<')) {
    if (/[a-z]/i.test(context.source))
      node = parseElement(context)
  }
  else
    node = parseText(context)

  nodes.push(node)

  return nodes
}

function parseText(context: ParseContext) {
  const content = parseTextData(context, context.source.length)

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

function parseElement(context: ParseContext) {
  const element = parseTag(context, TagType.START)

  parseTag(context, TagType.END)

  return element
}

function parseTag(context: ParseContext, type: TagType) {
  const match = /^<\/?([a-z]*)/.exec(context.source)
  if (!match)
    return null

  const tag = match[1]

  advanceBy(context, match[0].length)
  advanceBy(context, 1)

  if (TagType.END === type)
    return

  return {
    type: NodeTypes.ELEMENT,
    tag,
  }
}

function parseInterpolation(context: ParseContext) {
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
