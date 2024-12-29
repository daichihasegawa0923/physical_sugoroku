export class GameSceneNotInitializedError extends Error {
  public constructor () {
    super();
  }

  override message: string = 'scene is not initialized.';
}
