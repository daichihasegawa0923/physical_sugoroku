let canPlayMusic: boolean = false;
const players: Map<string, MusicPlayer> = new Map<string, MusicPlayer>();
const stack: Array<{
  path: string;
  volume: number;
  loop: boolean;
}> = [];

export function bgmManager () {
  function getCanPlayMusic () {
    return canPlayMusic;
  }

  function addStack (props: { path: string; volume: number; loop: boolean }) {
    const alreadyAdded = stack.find((st) => st.path === props.path);
    if (alreadyAdded != null) return;
    stack.push(props);
  }

  function enableMusic () {
    canPlayMusic = true;
    if (stack.length !== 0) {
      stack.forEach((st) => {
        play(st.path, st.volume, st.loop);
      });
    }
  }

  async function play (path: string, volume: number, loop: boolean) {
    if (!canPlayMusic) {
      addStack({ path, volume, loop });
      return;
    }
    await addPlayer(path);
    findPlayer(path)?.play(volume, loop);
  }

  async function addPlayer (path: string) {
    if (findPlayer(path) != null) {
      return;
    }
    const player = await MusicPlayer.create(path);
    if (!player) return;
    players.set(path, player);
  }

  function stop (path: string) {
    try {
      const player = findPlayer(path);
      player?.stop();
      return true;
    } catch (e) {
      return false;
    }
  }

  function isPlaying (path: string) {
    const player = findPlayer(path);
    return player?.getIsPlaying() ?? false;
  }

  function findPlayer (path: string): MusicPlayer | undefined {
    return players.get(path);
  }

  return {
    getCanPlayMusic,
    stop,
    play,
    isPlaying,
    enableMusic
  };
}

class MusicPlayer {
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

  public stop (): void {
    if (!this.sourceNode || !this.isPlaying) return;
    this.sourceNode.stop(0);
    this.isPlaying = false;

    this.sourceNode.disconnect();
    this.sourceNode = undefined;
    this.gainNode?.disconnect();
    this.gainNode = undefined;
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
