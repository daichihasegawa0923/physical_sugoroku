import { MusicManager } from '@/shared/game/music.player';

const TITLE_MUSIC_PATH = 'title.wav';
const BATTLE_MUSIC_PATH = 'battle.wav';

export async function playTitleBGM () {
  await MusicManager.add(TITLE_MUSIC_PATH, TITLE_MUSIC_PATH);
  if (MusicManager.isPlaying(BATTLE_MUSIC_PATH)) {
    MusicManager.stop(BATTLE_MUSIC_PATH);
  }
  if (MusicManager.isPlaying(TITLE_MUSIC_PATH)) return;
  await MusicManager.play(TITLE_MUSIC_PATH, 0.5, true);
}

export async function playBattleBGM () {
  await MusicManager.add(BATTLE_MUSIC_PATH, BATTLE_MUSIC_PATH);
  if (MusicManager.isPlaying(TITLE_MUSIC_PATH)) {
    MusicManager.stop(TITLE_MUSIC_PATH);
  }
  if (MusicManager.isPlaying(BATTLE_MUSIC_PATH)) return;
  await MusicManager.play(BATTLE_MUSIC_PATH, 0.5, true);
}
