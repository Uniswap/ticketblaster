import { useEffect } from 'react'

export default function useAnimationFrame(callback: () => Promise<void>) {
  useEffect(() => {
    async function tick() {
      await callback()
      handle = requestAnimationFrame(tick)
    }

    let handle = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(handle)
  }, [callback])
}
