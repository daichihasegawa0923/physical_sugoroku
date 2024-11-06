'use client'

import { useEffect, useState } from 'react'
import useThree from './hooks/useThree'
import * as THREE from 'three'
import { Box } from '@chakra-ui/react'

export default function Page () {
  const [mainCanvas, setMainCanvas] = useState<HTMLElement | null>(null)
  const { init } = useThree()

  useEffect(() => {
    if (mainCanvas) return
    const mc = document.getElementById('main_canvas')
    const mainC = document.getElementById('main')
    if (mc && mainC) {
      setMainCanvas(mc)
      const { scene, camera, onResize } = init({
        canvas: mc
      })
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      const cube = new THREE.Mesh(geometry, material)
      scene.add(cube)
      camera.position.add(new THREE.Vector3(0, 1, 5))
      window.addEventListener('resize', () => {
        const rect = mainC.getBoundingClientRect()
        onResize(rect.width, rect.height)
      })
    }
  }, [mainCanvas, setMainCanvas])

  return (
    <Box id="main" w="100%" height="calc(100svh - 54px)">
      <canvas id="main_canvas" style={{ width: '100%', height: '100%' }} />
    </Box>
  )
}
