import bgmManager from '@/shared/game/music/bgm.manager';

const TITLE = '/resources/music/bgm/title.wav';
const BATTLE = '/resources/music/bgm/battle.wav';

export function playTitleBGM () {
  bgmManager().playBgm(TITLE, 0.5, true);
}

export function playBattleBGM () {
  bgmManager().playBgm(BATTLE, 0.5, true);
}
