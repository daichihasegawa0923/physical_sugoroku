import bgmManager from '@/shared/game/music/bgm.manager';

let canPlayMusic: boolean = false;

export default function musicManager () {
  function getCanPlayMusic () {
    return canPlayMusic;
  }

  function enableMusic () {
    canPlayMusic = true;
    bgmManager().enableBgm();
  }

  return {
    getCanPlayMusic,
    enableMusic
  };
}
