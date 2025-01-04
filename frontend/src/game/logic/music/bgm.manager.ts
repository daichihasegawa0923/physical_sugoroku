import { bgmManager } from '@/shared/game/music.manager';

const TITLE = '/resources/music/bgm/title.wav';
const BATTLE = '/resources/music/bgm/battle.wav';

export async function playTitleBGM () {
  bgmManager().stop(BATTLE);
  if (bgmManager().isPlaying(TITLE)) return;
  await bgmManager().play(TITLE, 0.5, true);
}

export async function playBattleBGM () {
  bgmManager().stop(TITLE);
  if (bgmManager().isPlaying(BATTLE)) return;
  await bgmManager().play(BATTLE, 0.5, true);
}
