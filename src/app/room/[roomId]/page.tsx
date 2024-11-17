'use client'

import { useEffect, useRef } from 'react'
import { Box } from '@chakra-ui/react'
import { GameScene } from '@/shared/game/game.scene'
import { MainLogic } from '@/game.logic/monos/main.logic'
import TryJoin from '@/app/room/[roomId]/_components/try.join'
import Canvas from '@/app/room/[roomId]/_components/canvas'
import ButtonController from '@/app/room/[roomId]/_components/button.controller'

export default function Page ({ params }: { params: { roomId: string } }) {
  const mainLogic = useRef(new MainLogic())
  useEffect(() => {
    const mc = document.getElementById('main_canvas')
    const mainC = document.getElementById('main')
    if (mc && mainC) {
      GameScene.init(mc)
      GameScene.add(mainLogic.current)
      window.addEventListener('resize', () => {
        const rect = mainC.getBoundingClientRect()
        GameScene.onResize(rect.width, rect.height)
      })
    }
  }, [])

  return (
    <TryJoin roomId={params.roomId}>
      <Box id="main" w="100%" height="100%">
        <Canvas id="main_canvas" />
        <ButtonController
          rightButtonEvent={() => {
            mainLogic.current.changeAngle(-0.01)
          }}
          leftButtonEvent={() => {
            mainLogic.current.changeAngle(0.01)
          }}
          submitEvent={() => {
            mainLogic.current.smash()
          }}
        />
      </Box>
    </TryJoin>
  )
}
