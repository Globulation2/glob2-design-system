export function mountColony(video: HTMLVideoElement, button: HTMLButtonElement, options: {
 pause: string; resume: string; container?: Element;
 onPlaying?: (playing: boolean) => void;
}): () => void;
