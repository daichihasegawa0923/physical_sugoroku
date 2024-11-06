import * as THREE from 'three'

interface Props {
  canvas: HTMLElement
}

export default function useThree () {
  const init = ({ canvas }: Props) => {
    const rect = canvas.getBoundingClientRect()
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      rect.width / rect.height,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas || undefined,
      antialias: true,
      alpha: true
    })

    renderer.setSize(rect.width, rect.height)
    const animate = () => {
      renderer.render(scene, camera)
    }
    renderer.setAnimationLoop(animate)

    const onResize = (width: number, height: number) => {
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      renderer.setPixelRatio(window.devicePixelRatio)
    }

    return {
      scene,
      camera,
      onResize
    }
  }

  return {
    init
  }
}
