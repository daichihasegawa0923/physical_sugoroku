import { useEffect, useRef } from 'react'

export default function useCanvasSwipeEvent (
  canvasName: string,
  callBack: (dx: number, dy: number) => void
) {
  const isEventAdded = useRef(false)

  useEffect(() => {
    if (isEventAdded.current) return

    let startPoint = { x: 0, y: 0 }
    let isDown = false

    const canvas = document.getElementById(canvasName)
    if (!canvas) throw Error()

    const endEvent = () => {
      isDown = false
    }

    // SP
    const touchStartEvent = (event: TouchEvent) => {
      isDown = true
      const { clientX, clientY } = event.touches[0]
      startPoint = { x: clientX, y: clientY }
    }

    const touchMoveEvent = (event: TouchEvent) => {
      if (!isDown) return
      const { clientX, clientY } = event.touches[0]
      callBack(clientX - startPoint.x, clientY - startPoint.y)
    }
    canvas.addEventListener('touchstart', touchStartEvent)
    canvas.addEventListener('touchmove', touchMoveEvent)
    canvas.addEventListener('touchend', endEvent)

    // PC

    const mouseOnEvent = (event: MouseEvent) => {
      isDown = true
      startPoint = { x: event.clientX, y: event.clientY }
    }
    const mouseMoveEvent = (event: MouseEvent) => {
      event.preventDefault()
      if (!isDown) return
      callBack(event.clientX - startPoint.x, event.clientY - startPoint.y)
    }
    canvas.addEventListener('mousedown', mouseOnEvent)
    canvas.addEventListener('mousemove', mouseMoveEvent)
    canvas.addEventListener('mouseup', endEvent)

    isEventAdded.current = true

    return () => {
      canvas.removeEventListener('touchstart', touchStartEvent)
      canvas.removeEventListener('touchmove', touchMoveEvent)
      canvas.removeEventListener('mousedown', mouseOnEvent)
      canvas.removeEventListener('mousemove', mouseMoveEvent)
      canvas.removeEventListener('touchend', endEvent)

      isEventAdded.current = false
    }
  }, [callBack])
}
