/** Minimal concurrency limiter (keeps CV parsing to a few at a time on the shared droplet). */
export function createLimiter(max: number) {
  let active = 0
  const queue: Array<() => void> = []

  const next = () => {
    if (active >= max) return
    const run = queue.shift()
    if (run) {
      active += 1
      run()
    }
  }

  return function limit<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      queue.push(() => {
        task()
          .then(resolve, reject)
          .finally(() => {
            active -= 1
            next()
          })
      })
      next()
    })
  }
}
