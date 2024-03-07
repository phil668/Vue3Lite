import type { VNode } from './types'

export function shouldUpdateComponent(n1: VNode, n2: VNode) {
  const { props: prevProps } = n1
  const { props: nextProps } = n2

  for (const key in prevProps) {
    if ((prevProps as any)[key] !== (nextProps as any)[key])
      return true
  }
  return false
}
