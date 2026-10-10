const KEY = "glob2-theme";
const FALLBACK_KEY = "glob2-theme-v2";
const valid = (value) => ["system", "light", "dark"].includes(value);
const production = (win) => win.location.protocol === "https:" && (win.location.hostname === "glob2online.com" || win.location.hostname.endsWith(".glob2online.com"));
function readPreference(win) {
  try {
    if (production(win)) {
      const cookie = win.document.cookie.split(";").map((x) => x.trim()).find((x) => x.startsWith(`${KEY}=`));
      const value = cookie?.slice(KEY.length + 1);
      if (valid(value)) {
        try {
          win.localStorage.removeItem(KEY);
        } catch {
        }
        return value;
      }
    } else {
      const saved = win.localStorage.getItem(FALLBACK_KEY);
      if (valid(saved)) return saved;
    }
    const legacy = win.localStorage.getItem(KEY);
    if (valid(legacy)) {
      writePreference(win, legacy);
      return legacy;
    }
  } catch {
  }
  return "system";
}
function writePreference(win, preference) {
  if (!valid(preference)) throw new TypeError("Invalid theme preference");
  try {
    if (production(win)) {
      win.document.cookie = `${KEY}=${preference}; Domain=glob2online.com; Path=/; SameSite=Lax; Secure; Max-Age=31536000`;
    } else {
      win.localStorage.setItem(FALLBACK_KEY, preference);
    }
    const saved = production(win) ? win.document.cookie.split(";").some((x) => x.trim() === `${KEY}=${preference}`) : win.localStorage.getItem(FALLBACK_KEY) === preference;
    if (saved) win.localStorage.removeItem(KEY);
  } catch {
  }
}
function createThemeController(win) {
  const query = win.matchMedia?.("(prefers-color-scheme: dark)");
  let preference = readPreference(win);
  const listeners = /* @__PURE__ */ new Set();
  let snapshot;
  const apply = () => {
    const theme = preference === "system" ? query?.matches ? "dark" : "light" : preference;
    const root = win.document.documentElement;
    if (preference === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", preference);
    if (!snapshot || snapshot.preference !== preference || snapshot.theme !== theme) {
      snapshot = Object.freeze({ preference, theme });
      for (const listener of listeners) listener();
    }
  };
  const refresh = () => {
    const saved = readPreference(win);
    if (persisted) preference = saved;
    apply();
  };
  let persisted = true;
  const setPreference = (next) => {
    if (!valid(next)) throw new TypeError("Invalid theme preference");
    preference = next;
    writePreference(win, next);
    persisted = readPreference(win) === next;
    apply();
  };
  query?.addEventListener("change", apply);
  win.addEventListener("pageshow", refresh);
  win.addEventListener("focus", refresh);
  win.addEventListener("storage", refresh);
  const visibility = () => {
    if (!win.document.hidden) refresh();
  };
  win.document.addEventListener("visibilitychange", visibility);
  apply();
  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setPreference,
    refresh,
    destroy: () => {
      query?.removeEventListener("change", apply);
      win.removeEventListener("pageshow", refresh);
      win.removeEventListener("focus", refresh);
      win.removeEventListener("storage", refresh);
      win.document.removeEventListener("visibilitychange", visibility);
      listeners.clear();
    }
  };
}
const serverSnapshot = Object.freeze({ preference: "system", theme: "light" });
const getServerSnapshot = () => serverSnapshot;
function getThemeController() {
  if (typeof window === "undefined") return void 0;
  return window.Glob2Theme ??= createThemeController(window);
}
const nextPreference = (preference) => ({ system: "light", light: "dark", dark: "system" })[preference];
function mountThemeToggle(button, labels) {
  const controller = getThemeController();
  if (!controller) return () => {
  };
  const update = () => {
    const { preference } = controller.getSnapshot();
    button.textContent = labels[preference];
    button.setAttribute("aria-label", `${labels[preference]}. ${labels.change}`);
    button.title = labels[preference];
  };
  const click = () => controller.setPreference(nextPreference(controller.getSnapshot().preference));
  button.addEventListener("click", click);
  const unsubscribe = controller.subscribe(update);
  update();
  return () => {
    button.removeEventListener("click", click);
    unsubscribe();
  };
}
export {
  createThemeController,
  getServerSnapshot,
  getThemeController,
  mountThemeToggle,
  nextPreference,
  readPreference,
  writePreference
};
