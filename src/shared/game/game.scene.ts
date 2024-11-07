import * as THREE from 'three'
import { type MonoBehaviour } from './monobehaviour'
import { CannonWorld } from './cannon.world'

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
      alpha: true
    })

    this.renderer.setSize(rect.width, rect.height)
    const animate = () => {
      this.renderer.render(this.scene, this.mainCamera)
      CannonWorld.getWorld().fixedStep()
      this.monos.forEach((mono) => { mono.update() })
    }
    this.renderer.setAnimationLoop(animate)
  }

  private readonly mainCamera: THREE.PerspectiveCamera
  private readonly scene: THREE.Scene
  private readonly renderer: THREE.WebGLRenderer

  private monos: MonoBehaviour[] = []

  public onResize (width: number, height: number) {
    this.mainCamera.aspect = width / height
    this.mainCamera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
  }

  public add (mono: MonoBehaviour) {
    this.monos.push(mono)
    const obj3d = mono.getObject3D()
    if (obj3d) {
      this.scene.add(obj3d)
    }
    mono.start()
  }

  public remove (mono: MonoBehaviour) {
    mono.onRemove()
    const obj3d = mono.getObject3D()
    if (obj3d) {
      this.scene.remove(obj3d)
    }
    this.monos = this.monos.filter((originalMono) => originalMono === mono)
  }

  public findByType<T extends MonoBehaviour>(
    type: new (...args: any[]) => T
  ): T[] {
    return this.monos.filter((m) => m instanceof type) as T[]
  }

  public getMainCamera (): THREE.Camera {
    return this.mainCamera
  }
}
