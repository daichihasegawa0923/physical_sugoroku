import { GameScene } from '@/shared/game/game.scene'

interface Props {
  canvasName: string
  containerName: string
}

export default function useGameSceneInitializer ({
  canvasName,
  containerName
}: Props) {
  const mainCanvas = document.getElementById(canvasName)
  const mainContainer = document.getElementById(containerName)
  if (!mainCanvas || !mainContainer) { throw Error('cannot find required html elements.') }

  GameScene.init(mainCanvas)
  window.addEventListener('resize', () => {
    const rect = mainContainer.getBoundingClientRect()
    GameScene.onResize(rect.width, rect.height)
  })
}
