import { type MonoBehaviour } from '@/shared/game/monobehaviour'
import { type GameObject } from '@/shared/game/type'

export class MonoContainer {
  private static readonly INSTANCE: MonoContainer = new MonoContainer()

  private constructor () {}

  private prefabs: Record<string, (input: GameObject) => MonoBehaviour> = {}

  public static registerPrefab (
    className: string,
    getter: (input: GameObject) => MonoBehaviour
  ) {
    this.INSTANCE.prefabs[className] = getter
  }

  public static createInstance (
    className: string,
    input: GameObject
  ): MonoBehaviour | null {
    const getter = this.INSTANCE.prefabs[className]
    if (!getter) return null
    return getter(input)
  }
}
