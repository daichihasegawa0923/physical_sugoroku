'use client'

import { useEffect, useRef } from 'react'
import { Box } from '@chakra-ui/react'
import { GameScene } from '@/shared/game/game.scene'
import { MainLogic } from '@/game.logic/monos/main.logic'
import ButtonController from './_components/button.controller'
import useRoom from './_hooks/useRoom'

export default function Page ({ params }: { params: { roomId: string } }) {
  const mainLogic = useRef(new MainLogic())
  const { tryReJoin, join } = useRoom(params.roomId)
  useEffect(() => {
    (async () => {
      const resultReJoin = await tryReJoin()
      if (!resultReJoin) {
        // FIXME: あとで直す
        await join('hogehoge')
      }
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
    })()
  }, [])

  return (
    <Box id="main" w="100%" height="100%">
      <canvas id="main_canvas" style={{ width: '100%', height: '100%' }} />
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
  )
}
