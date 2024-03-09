type Job = (...args: any[]) => any

// await nextTick
export function nextTick(fn?: Job) {
  return fn ? Promise.resolve().then(fn) : Promise.resolve()
}

// 响应式数据变化后 => 合并到一个微任务 => 再执行
const queue: any[] = []
let isFlushPending = false

// 添加任务
export function queueJob(job: Job) {
  if (!queue.includes(job)) {
    queue.push(job)
    queueFlush()
  }
}

// 开始执行所有任务以微任务的形式
function queueFlush() {
  if (isFlushPending)
    return

  isFlushPending = true
  nextTick(flushJobs).catch(() => {

  }).finally(() => {
    isFlushPending = false
  })
}

function flushJobs() {
  let job
  // eslint-disable-next-line no-cond-assign
  while ((job = queue.shift())) {
    if (job)
      job()
  }
}
