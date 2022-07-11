import { Howl } from 'howler';

function getEffectSound(src, volume = 1) {
	let sound;
	const soundInject = (src) => {
		sound = new Howl({ src });
		sound.volume(volume);
	};
	soundInject(src);
	return sound;
}

const effectSound = {
	getEffectSound,
};
export default effectSound;
