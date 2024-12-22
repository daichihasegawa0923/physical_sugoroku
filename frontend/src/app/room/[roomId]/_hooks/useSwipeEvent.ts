'use client'

import { useEffect, useRef } from 'react'

export default function useCanvasSwipeEvent (props: {
  canvasName: string
  onMoveCb: (dx: number, dy: number) => void
  onReleaseCb: () => void
}) {
  const { canvasName, onMoveCb, onReleaseCb } = props
  const isEventAdded = useRef(false)

  useEffect(() => {
    if (isEventAdded.current) return

    const canvas = document.getElementById(canvasName)
    if (!canvas) throw Error()

    const endEvent = () => {
      MousePointProvider.up()
      onReleaseCb()
    }

    // SP
    const touchStartEvent = (event: TouchEvent) => {
      MousePointProvider.down()
      const { clientX, clientY } = event.touches[0]
      MousePointProvider.setStartPoint(clientX, clientY)
    }

    const touchMoveEvent = (event: TouchEvent) => {
      if (!MousePointProvider.isDown()) return
      const { clientX, clientY } = event.touches[0]
      onMoveCb(
        clientX - MousePointProvider.getStartPoint().x,
        clientY - MousePointProvider.getStartPoint().y
      )
    }

    canvas.addEventListener('touchstart', touchStartEvent)
    canvas.addEventListener('touchmove', touchMoveEvent)
    canvas.addEventListener('touchend', endEvent)

    // PC

    const mouseOnEvent = (event: MouseEvent) => {
      MousePointProvider.down()
      MousePointProvider.setStartPoint(event.clientX, event.clientY)
    }
    const mouseMoveEvent = (event: MouseEvent) => {
      event.preventDefault()
      if (!MousePointProvider.isDown()) return
      onMoveCb(
        event.clientX - MousePointProvider.getStartPoint().x,
        event.clientY - MousePointProvider.getStartPoint().y
      )
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
  }, [onMoveCb])
}

class MousePointProvider {
  private constructor (
    private readonly startPoint: { x: number, y: number } = { x: 0, y: 0 },
    private down: boolean = false
  ) {}

  private static readonly instance: MousePointProvider =
    new MousePointProvider()

  public static setStartPoint (x: number, y: number) {
    MousePointProvider.instance.startPoint.x = x
    MousePointProvider.instance.startPoint.y = y
  }

  public static down (): void {
    MousePointProvider.instance.down = true
  }

  public static up (): void {
    MousePointProvider.instance.down = false
  }

  public static isDown () {
    return MousePointProvider.instance.down
  }

  public static getStartPoint () {
    return MousePointProvider.instance.startPoint
  }
}
