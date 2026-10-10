import { getThemeController, mountThemeToggle } from "./theme.js";
import { mountColony } from "./colony.js";
function mountTabs(root, { onChange = () => {
} } = {}) {
  const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
  const select = (tab, focus = false) => {
    for (const item of tabs) {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      item.classList.toggle("on", selected);
      const panel = item.ownerDocument.getElementById(item.getAttribute("aria-controls"));
      if (panel) panel.hidden = !selected;
    }
    if (focus) tab.focus();
  };
  const handlers = tabs.map((tab, index) => {
    const activate = () => {
      select(tab);
      onChange(tab.id);
    };
    const key = (event) => {
      const rtl = root.ownerDocument.defaultView.getComputedStyle(root).direction === "rtl";
      const delta = rtl ? -1 : 1;
      let next;
      if (event.key === "ArrowRight") next = (index + delta + tabs.length) % tabs.length;
      else if (event.key === "ArrowLeft") next = (index - delta + tabs.length) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault();
      select(tabs[next], true);
      onChange(tabs[next].id);
    };
    tab.addEventListener("click", activate);
    tab.addEventListener("keydown", key);
    return () => {
      tab.removeEventListener("click", activate);
      tab.removeEventListener("keydown", key);
    };
  });
  const initial = tabs.find((tab) => tab.getAttribute("aria-selected") === "true") ?? tabs[0];
  if (initial) select(initial);
  return () => handlers.forEach((cleanup) => cleanup());
}
export {
  getThemeController,
  mountColony,
  mountTabs,
  mountThemeToggle
};
