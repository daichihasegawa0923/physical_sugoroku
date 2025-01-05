import musicManager from '@/shared/game/music/music.manager';
import MusicPlayer from '@/shared/game/music/music.player';

const players: Map<string, MusicPlayer> = new Map<string, MusicPlayer>();

export default function seManager () {
  async function playSe (path: string, volume: number, loop: boolean) {
    if (!musicManager().getCanPlayMusic()) {
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

  function stopSe (path: string) {
    try {
      const player = findPlayer(path);
      player?.stop();
      return true;
    } catch (e) {
      return false;
    }
  }

  function findPlayer (path: string): MusicPlayer | undefined {
    return players.get(path);
  }

  return {
    playSe,
    stopSe
  };
}
