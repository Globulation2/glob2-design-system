function mountColony(video, button, { pause, resume, container = video.parentElement, onPlaying = () => {
} }) {
  const win = video.ownerDocument.defaultView;
  const reduced = win.matchMedia("(prefers-reduced-motion: reduce)");
  let paused = false, visible = false, failed = false, playing = false;
  const update = () => {
    button.hidden = reduced.matches || !playing || failed;
    button.textContent = paused ? resume : pause;
    video.classList.toggle("still", reduced.matches);
    if (paused || !visible || reduced.matches || video.ownerDocument.hidden || failed) video.pause();
    else {
      if (!video.getAttribute("src")) video.src = video.dataset.src;
      void video.play().catch((error2) => {
        if (error2.name === "AbortError") return;
        failed = true;
        playing = false;
        update();
        onPlaying(false);
      });
    }
  };
  const started = () => {
    playing = true;
    onPlaying(true);
    update();
  };
  const error = () => {
    failed = true;
    playing = false;
    onPlaying(false);
    update();
  };
  const click = () => {
    paused = !paused;
    update();
  };
  const observer = new win.IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting;
    update();
  });
  observer.observe(container);
  video.addEventListener("playing", started);
  video.addEventListener("error", error);
  button.addEventListener("click", click);
  reduced.addEventListener("change", update);
  video.ownerDocument.addEventListener("visibilitychange", update);
  update();
  return () => {
    observer.disconnect();
    video.pause();
    video.removeEventListener("playing", started);
    video.removeEventListener("error", error);
    button.removeEventListener("click", click);
    reduced.removeEventListener("change", update);
    video.ownerDocument.removeEventListener("visibilitychange", update);
  };
}
export {
  mountColony
};
