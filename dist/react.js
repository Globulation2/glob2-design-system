import { jsx, jsxs } from "react/jsx-runtime";
import { createContext, useContext, useId, useSyncExternalStore } from "react";
import { getThemeController, getServerSnapshot, nextPreference, themeIconBody } from "./theme.js";
import { ICON_BODIES } from "./icons.js";
const subscribe = (listener) => getThemeController()?.subscribe(listener) ?? (() => {
});
const snapshot = () => getThemeController()?.getSnapshot() ?? getServerSnapshot();
const ThemeContext = createContext({ ...getServerSnapshot(), setPreference: () => {
} });
function ThemeProvider({ children }) {
  const state = useSyncExternalStore(subscribe, snapshot, getServerSnapshot);
  return /* @__PURE__ */ jsx(ThemeContext.Provider, { value: { ...state, setPreference: (preference) => getThemeController()?.setPreference(preference) }, children });
}
const useTheme = () => useContext(ThemeContext);
function ThemeToggle({ labels, ...props }) {
  const { preference, setPreference } = useTheme();
  return /* @__PURE__ */ jsx("button", { type: "button", ...props, className: `theme-toggle ${props.className ?? ""}`, onClick: () => setPreference(nextPreference(preference)), "aria-label": props["aria-label"] ?? `${labels[preference]}. ${labels.change}`, title: labels[preference], children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", width: "20", height: "20", "aria-hidden": "true", fill: "none", stroke: "currentColor", strokeWidth: "2", dangerouslySetInnerHTML: { __html: themeIconBody(preference) } }) });
}
function Icon({ name, size = 24, label, className = "", ...props }) {
  return /* @__PURE__ */ jsx("svg", { ...props, className: `icon ${className}`, width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", focusable: "false", ...label ? { role: "img", "aria-label": label } : { "aria-hidden": true }, dangerouslySetInnerHTML: { __html: ICON_BODIES[name] } });
}
function Button({ variant = "secondary", size, className = "", ...props }) {
  return /* @__PURE__ */ jsx("button", { type: "button", ...props, className: `btn ${variant} ${size ?? ""} ${className}` });
}
const Card = ({ className = "", ...props }) => /* @__PURE__ */ jsx("div", { ...props, className: `card ${className}` });
const Badge = ({ tone = "", className = "", ...props }) => /* @__PURE__ */ jsx("span", { ...props, className: `badge ${tone} ${className}` });
const Notice = ({ tone = "", className = "", ...props }) => /* @__PURE__ */ jsx("div", { role: tone === "error" ? "alert" : "status", ...props, className: `notice ${tone} ${className}` });
function Loading({ children }) {
  return /* @__PURE__ */ jsxs("p", { className: "loading", role: "status", children: [
    /* @__PURE__ */ jsx("span", { className: "glob-spin", "aria-hidden": "true" }),
    children
  ] });
}
function Field({ label, hint, error, id: suppliedId, ...props }) {
  const generated = useId();
  const id = suppliedId ?? generated;
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("label", { className: "field", htmlFor: id, children: [
      label,
      /* @__PURE__ */ jsx("input", { ...props, id, "aria-invalid": error ? true : props["aria-invalid"], "aria-describedby": [props["aria-describedby"], error || hint ? `${id}-description` : void 0].filter(Boolean).join(" ") || void 0 })
    ] }),
    (error || hint) && /* @__PURE__ */ jsx("p", { id: `${id}-description`, className: error ? "field-error" : "caption", children: error ?? hint })
  ] });
}
function TableWrap({ label, stack = false, children }) {
  return /* @__PURE__ */ jsx("div", { className: `table-wrap${stack ? " stack" : ""}`, role: "region", "aria-label": label, tabIndex: 0, children });
}
function Wordmark({ label, className = "" }) {
  return /* @__PURE__ */ jsx("span", { className: `wordmark ${className}`, ...label ? { role: "img", "aria-label": label } : { "aria-hidden": true } });
}
function Tabs({ label, value, onChange, items }) {
  return /* @__PURE__ */ jsx("div", { className: "seg", role: "tablist", "aria-label": label, children: items.map((item, index) => /* @__PURE__ */ jsx("button", { type: "button", role: "tab", id: item.tabId, "aria-controls": item.panelId, "aria-selected": value === item.id, tabIndex: value === item.id ? 0 : -1, className: value === item.id ? "on" : "", onClick: () => onChange(item.id), onKeyDown: (event) => {
    let next = index;
    const rtl = event.currentTarget.closest('[dir="rtl"]') !== null || event.currentTarget.ownerDocument.documentElement.dir === "rtl";
    if (event.key === "ArrowRight") next = (index + (rtl ? -1 : 1) + items.length) % items.length;
    else if (event.key === "ArrowLeft") next = (index + (rtl ? 1 : -1) + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault();
    const target = items[next];
    if (!target) return;
    onChange(target.id);
    event.currentTarget.parentElement?.querySelectorAll('[role="tab"]')[next]?.focus();
  }, children: item.label }, item.id)) });
}
export {
  Badge,
  Button,
  Card,
  Field,
  Icon,
  Loading,
  Notice,
  TableWrap,
  Tabs,
  ThemeProvider,
  ThemeToggle,
  Wordmark,
  useTheme
};
