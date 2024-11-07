'use client'

import { useEffect } from 'react'
import { Box } from '@chakra-ui/react'
import { GameScene } from '@/shared/game/game.scene'
import { MainLogic } from '@/game.logic/monos/main.logic'
import ButtonController from './_components/button.controller'

export default function Page () {
  const mainLogic = new MainLogic()
  useEffect(() => {
    if (GameScene.get()) return
    const mc = document.getElementById('main_canvas')
    const mainC = document.getElementById('main')
    if (mc && mainC) {
      GameScene.init(mc)
      GameScene.add(mainLogic)
      window.addEventListener('resize', () => {
        const rect = mainC.getBoundingClientRect()
        GameScene.onResize(rect.width, rect.height)
      })
    }
  }, [])

  return (
    <Box id="main" w="100%" height="calc(100svh - 54px)">
      <canvas id="main_canvas" style={{ width: '100%', height: '100%' }} />
      <ButtonController
        rightButtonEvent={() => { mainLogic.changeAngle(-0.01) }}
        leftButtonEvent={() => { mainLogic.changeAngle(0.01) }}
        submitEvent={() => { mainLogic.smash() }}
      />
    </Box>
  )
}
