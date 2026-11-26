function mountColony(video, button, { pause, resume, container = video.parentElement, onPlaying = () => {
}, chooseSources }) {
  const win = video.ownerDocument.defaultView;
  const reduced = win.matchMedia("(prefers-reduced-motion: reduce)");
  let paused = false, visible = false, failed = false, playing = false;
  let sources;
  const nextSource = () => {
    const next = sources?.shift();
    if (!next) return false;
    video.src = next.src;
    return true;
  };
  const update = () => {
    button.hidden = reduced.matches || !playing || failed;
    button.textContent = paused ? resume : pause;
    video.classList.toggle("still", reduced.matches);
    if (paused || !visible || reduced.matches || video.ownerDocument.hidden || failed) video.pause();
    else {
      if (!video.getAttribute("src")) {
        if (chooseSources) {
          sources = chooseSources().filter((source2) => video.canPlayType(source2.type) !== "");
          if (!nextSource()) {
            fail();
            return;
          }
        } else video.src = video.dataset.src;
      }
      const source = video.src;
      void video.play().catch((reason) => {
        if (reason.name === "AbortError" || video.src !== source || failed) return;
        if (reason.name === "NotSupportedError") recover();
        else fail();
      });
    }
  };
  const started = () => {
    playing = true;
    onPlaying(true);
    update();
  };
  const fail = () => {
    failed = true;
    playing = false;
    onPlaying(false);
    update();
  };
  const recover = () => {
    if (!nextSource()) {
      fail();
      return;
    }
    onPlaying(false);
    update();
  };
  const error = () => {
    if (!failed && video.error) recover();
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
