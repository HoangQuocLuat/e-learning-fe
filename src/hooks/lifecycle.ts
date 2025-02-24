import { useEffect, useRef } from 'react'

export const useMounted = (callback: () => void) => {
  const isMounted = useRef<boolean>(false)

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (isMounted.current) return

    isMounted.current = true
    requestAnimationFrame(() => {
      callback()
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    isMounted,
  }
}
