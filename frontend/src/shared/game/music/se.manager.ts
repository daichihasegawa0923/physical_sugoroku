import musicManager from '@/shared/game/music/music.manager';
import MusicPlayer from '@/shared/game/music/music.player';

const players: Map<string, MusicPlayer> = new Map<string, MusicPlayer>();

export default function seManager () {
  function playSe (
    path: string,
    volume: number,
    loop?: boolean,
    durationSec?: number
  ) {
    if (!musicManager().getCanPlayMusic()) {
      return;
    }
    const alreadyAdded = players.get(path);
    if (alreadyAdded) {
      if (alreadyAdded.getIsPlaying()) return;
      players.delete(path);
      return;
    }
    MusicPlayer.create(path).then((player) => {
      if (loop) {
        addPlayer(player).then(() => {});
      }
      player?.play(volume, loop ?? false).then(() => {
        if (!loop) {
          setTimeout(
            () => {
              player?.stop();
            },
            durationSec ? durationSec * 1000 : 5000
          );
        }
      });
    });
  }

  async function addPlayer (player: MusicPlayer | undefined) {
    if (!player) return;
    players.set(player.path, player);
    return player;
  }

  function stopSe (path: string) {
    players.entries().forEach(([_, player]) => {
      if (player.path !== path) return;
      player.stop();
    });
  }

  return {
    playSe,
    stopSe
  };
}
