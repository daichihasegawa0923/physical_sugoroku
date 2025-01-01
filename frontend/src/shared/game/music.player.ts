export class MusicManager {
  private static readonly instance = new MusicManager();

  private constructor () {}

  private players: Record<string, MusicPlayer> = {};

  public static async add (name: string, path: string) {
    if (MusicManager.find(name) != null) {
      return;
    }
    const player = await MusicPlayer.create(path);
    if (!player) return;
    this.instance.players[name] = player;
  }

  public static async play (name: string, volume: number, loop: boolean) {
    const player = MusicManager.find(name);
    if (!player) return;
    await player.play(volume, loop);
  }

  public static isPlayingAny () {
    return (
      Object.entries(MusicManager.instance.players)
        .map((entry) => entry[1])
        .find((player) => player.getIsPlaying()) != null
    );
  }

  public static stop (name: string) {
    const player = MusicManager.find(name);
    if (!player) return;
    player.stop();
  }

  public static isPlaying (name: string) {
    const player = MusicManager.find(name);
    if (!player) return;
    return player.getIsPlaying();
  }

  public static find (name: string): MusicPlayer | undefined {
    return this.instance.players[name];
  }
}

class MusicPlayer {
  public constructor (private isPlaying: boolean = false) {}

  private audioContext?: AudioContext;
  private gainNode?: GainNode;
  private sourceNode?: AudioBufferSourceNode;
  private arrayBuffer?: ArrayBuffer;

  public static async create (path: string): Promise<MusicPlayer | undefined> {
    try {
      const player = new MusicPlayer();
      const response = await fetch('/api/resources/music/' + path);
      player.arrayBuffer = await response.arrayBuffer();
      return player;
    } catch (e) {
      console.error(e);
    }
  }

  public async play (volume: number, loop: boolean): Promise<void> {
    await this.setup(loop);
    if (!this.sourceNode || !this.gainNode || this.isPlaying) return;
    this.sourceNode.start(0);
    this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    this.isPlaying = true;
  }

  public stop (): void {
    if (!this.sourceNode) return;
    this.sourceNode.stop(0);
  }

  public getIsPlaying () {
    return this.isPlaying;
  }

  private async setup (loop: boolean) {
    if (!this.arrayBuffer) return;
    this.audioContext = AudioContextProvider.get();
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

class AudioContextProvider {
  private static readonly instance: AudioContextProvider = new AudioContextProvider();

  private constructor () {}

  private audioContext: AudioContext | null = null;

  public static get (): AudioContext {
    if (AudioContextProvider.instance.audioContext == null) {
      AudioContextProvider.instance.audioContext = new AudioContext();
    }
    return AudioContextProvider.instance.audioContext;
  }
}
