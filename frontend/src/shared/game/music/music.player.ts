export default class MusicPlayer {
  public constructor (
    public readonly path: string,
    private isPlaying: boolean = false
  ) {}

  private audioContext?: AudioContext;
  private gainNode?: GainNode;
  private sourceNode?: AudioBufferSourceNode;
  private arrayBuffer?: ArrayBuffer;

  public static async create (path: string): Promise<MusicPlayer | undefined> {
    try {
      const player = new MusicPlayer(path);
      return player;
    } catch (e) {
      console.error(e);
    }
  }

  public async play (volume: number, loop: boolean): Promise<void> {
    if (this.isPlaying) return;
    await this.setup(loop);
    if (!this.sourceNode || !this.gainNode) return;
    this.sourceNode.start(0);
    this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    this.isPlaying = true;
  }

  public stop () {
    if (!this.isPlaying) return;
    this.sourceNode?.stop(0);
    this.sourceNode?.disconnect();
    this.gainNode?.disconnect();
    if (this.audioContext) {
      this.audioContext.close().then(() => {
        this.isPlaying = false;
      });
      return;
    }
    this.isPlaying = false;
  }

  public getIsPlaying () {
    return this.isPlaying;
  }

  private async setup (loop: boolean) {
    const response = await fetch(this.path);
    this.arrayBuffer = await response?.arrayBuffer();
    if (!this.arrayBuffer) return;
    this.audioContext = new AudioContext();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
    const audioBuffer = await this.audioContext.decodeAudioData(
      this.arrayBuffer
    );
    this.sourceNode = this.audioContext.createBufferSource();
    this.sourceNode.buffer = audioBuffer;
    this.sourceNode.loop = loop;
    this.sourceNode.connect(this.gainNode);
  }
}
