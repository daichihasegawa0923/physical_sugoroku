import manager from '@/shared/game/music/music.manager';
import MusicPlayer from '@/shared/game/music/music.player';

let bgmQueue: {
  path: string;
  volume: number;
  loop: boolean;
} | null = null;

const bgmPlayers: MusicPlayer[] = [];

export default function bgmManager () {
  function addQueue ({
    path,
    volume,
    loop
  }: {
    path: string;
    volume: number;
    loop: boolean;
  }) {
    if (bgmQueue != null && bgmQueue.path === path) {
      return;
    }
    bgmQueue = { path, volume, loop };
  }

  function enableBgm () {
    if (bgmQueue != null) {
      playBgm(bgmQueue.path, bgmQueue.volume, bgmQueue.loop);
    }
  }

  function playBgm (path: string, volume: number, loop: boolean) {
    if (!manager().getCanPlayMusic()) {
      addQueue({ path, volume, loop });
      return;
    }
    MusicPlayer.create(path).then((musicPlayer) => {
      if (musicPlayer == null) return;
      musicPlayer.play(volume, loop).then(() => {
        bgmPlayers.push(musicPlayer);
        stopExcludeLast();
      });
    });
  }

  function stopAll () {
    bgmPlayers.forEach((player) => {
      player.stop();
    });
    for (let i = 0; i < bgmPlayers.length; i++) {
      bgmPlayers.pop();
    }
  }

  function stopExcludeLast () {
    const isSingle = bgmPlayers.length <= 1;
    if (isSingle) return;
    for (let i = 0; i < bgmPlayers.length - 1; i++) {
      const target = bgmPlayers.shift();
      target?.stop();
    }
  }

  return {
    enableBgm,
    playBgm,
    stopAll
  };
}
