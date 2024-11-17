import * as THREE from 'three'
import { type MonoBehaviour } from './monobehaviour'
import { CannonWorld } from './cannon.world'
import { type RigidBodyMonoBehaviour } from '@/game.logic/monos/base/rigid.body.monobehaviour'
import { type GameObject } from '@/shared/game/mono.container'

export class GameScene {
  private static instance: GameScene | null = null

  public static get () {
    return GameScene.instance
  }

  public static reset () {
    GameScene.instance = null
  }

  public static init (canvas: HTMLElement) {
    GameScene.reset()
    GameScene.instance = new GameScene(canvas)
  }

  private constructor (canvas: HTMLElement) {
    const rect = canvas.getBoundingClientRect()
    this.scene = new THREE.Scene()
    this.mainCamera = new THREE.PerspectiveCamera(
      75,
      rect.width / rect.height,
      0.1,
      1000
    )
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas || undefined,
      antialias: true,
      alpha: false
    })

    this.renderer.setClearColor(0x000000, 1.0)

    this.renderer.setSize(rect.width, rect.height)
    this.renderer.shadowMap.enabled = true

    const animate = () => {
      this.renderer.render(this.scene, this.mainCamera)
      CannonWorld.getWorld().fixedStep()
      this.monos.forEach((mono) => {
        mono.update()
      })
    }
    this.renderer.setAnimationLoop(animate)
  }

  private readonly mainCamera: THREE.PerspectiveCamera
  private readonly scene: THREE.Scene
  private readonly renderer: THREE.WebGLRenderer

  private monos: MonoBehaviour[] = []
  private onlineObjects: GameObject[] = []

  public static all () {
    return this.instance?.monos ?? []
  }

  public static allOnline () {
    return this.instance?.onlineObjects ?? []
  }

  public static onResize (width: number, height: number) {
    const gameScene = GameScene.get()
    if (!gameScene) return
    gameScene.mainCamera.aspect = width / height
    gameScene.mainCamera.updateProjectionMatrix()
    gameScene.renderer.setSize(width, height)
    gameScene.renderer.setPixelRatio(window.devicePixelRatio)
  }

  public static add (mono: MonoBehaviour, online?: GameObject) {
    const gameScene = GameScene.get()
    if (!gameScene) return
    gameScene.monos.push(mono)
    if (online) {
      gameScene.onlineObjects.push(online)
    }
    const obj3d = mono.getObject3D()
    if (obj3d) {
      gameScene.scene.add(obj3d)
    }
    mono.start()
  }

  public static remove (mono: MonoBehaviour) {
    const gameScene = GameScene.get()
    if (!gameScene) return
    mono.onRemove()
    const obj3d = mono.getObject3D()
    if (obj3d) {
      gameScene.scene.remove(obj3d)
    }
    gameScene.monos = gameScene.monos.filter(
      (originalMono) => originalMono === mono
    )
    // オンラインオブジェクトの削除
    gameScene.onlineObjects = gameScene.onlineObjects.filter(
      (online) => online.id !== mono.getId()
    )
  }

  public static findRigidBodyType () {
    return this.all().filter(
      (m) => (m as RigidBodyMonoBehaviour) != null
    ) as RigidBodyMonoBehaviour[]
  }

  public static findByType<T extends MonoBehaviour>(
    type: new (...args: any[]) => T
  ): T[] {
    const gameScene = GameScene.get()
    if (!gameScene) return []

    return gameScene.monos.filter((m) => m instanceof type) as T[]
  }

  public static findById<T extends MonoBehaviour>(id: string): T | null {
    return GameScene.get()?.monos.find((m) => m.getId() === id) as T
  }

  public getMainCamera (): THREE.Camera {
    return this.mainCamera
  }
}
