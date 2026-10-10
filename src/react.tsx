import { createContext, useContext, useId, useSyncExternalStore, type ReactNode, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type SVGProps } from 'react';
import { getThemeController, getServerSnapshot, nextPreference, themeIconBody, type ThemePreference, type ThemeSnapshot } from './theme.js';
import { ICON_BODIES, type IconName } from './icons.js';

const subscribe = (listener: () => void) => getThemeController()?.subscribe(listener) ?? (() => {});
const snapshot = () => getThemeController()?.getSnapshot() ?? getServerSnapshot();
interface ThemeValue extends ThemeSnapshot { setPreference(preference: ThemePreference): void }
const ThemeContext = createContext<ThemeValue>({ ...getServerSnapshot(), setPreference: () => {} });
export function ThemeProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, snapshot, getServerSnapshot);
  return <ThemeContext.Provider value={{ ...state, setPreference: preference => getThemeController()?.setPreference(preference) }}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => useContext(ThemeContext);
export function ThemeToggle({ labels, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { labels: Record<ThemePreference | 'change', string> }) {
  const { preference, setPreference } = useTheme();
  return <button type="button" {...props} className={`theme-toggle ${props.className ?? ''}`} onClick={() => setPreference(nextPreference(preference))} aria-label={props["aria-label"] ?? `${labels[preference]}. ${labels.change}`} title={labels[preference]}>
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" dangerouslySetInnerHTML={{__html: themeIconBody(preference)}}/>
  </button>;
}
export function Icon({ name, size = 24, label, className = '', ...props }: Omit<SVGProps<SVGSVGElement>, 'name'> & { name: IconName; size?: number; label?: string }) {
  return <svg {...props} className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false" {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })} dangerouslySetInnerHTML={{ __html: ICON_BODIES[name] }}/>;
}
export function Button({ variant = 'secondary', size, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; size?: 'small' | 'big' }) {
  return <button type="button" {...props} className={`btn ${variant} ${size ?? ''} ${className}`}/>;
}
export const Card = ({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) => <div {...props} className={`card ${className}`}/>;
export const Badge = ({ tone = '', className = '', ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: '' | 'gold' | 'ok' | 'warn' | 'bad' }) => <span {...props} className={`badge ${tone} ${className}`}/>;
export const Notice = ({ tone = '', className = '', ...props }: HTMLAttributes<HTMLDivElement> & { tone?: '' | 'error' | 'warn' }) => <div role={tone === 'error' ? 'alert' : 'status'} {...props} className={`notice ${tone} ${className}`}/>;
export function Loading({ children }: { children: ReactNode }) {
  return <p className="loading" role="status"><span className="glob-spin" aria-hidden="true"/>{children}</p>;
}
export function Field({ label, hint, error, id: suppliedId, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string }) {
  const generated = useId(); const id = suppliedId ?? generated;
  return <div><label className="field" htmlFor={id}>{label}<input {...props} id={id} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={[props['aria-describedby'], error || hint ? `${id}-description` : undefined].filter(Boolean).join(' ') || undefined}/></label>{(error || hint) && <p id={`${id}-description`} className={error ? 'field-error' : 'caption'}>{error ?? hint}</p>}</div>;
}
export function TableWrap({ label, stack = false, children }: { label: string; stack?: boolean; children: ReactNode }) {
  return <div className={`table-wrap${stack ? ' stack' : ''}`} role="region" aria-label={label} tabIndex={0}>{children}</div>;
}
export function Wordmark({ label, className = '' }: { label?: string | null; className?: string }) {
  return <span className={`wordmark ${className}`} {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}/>;
}
export function Tabs({ label, value, onChange, items }: { label: string; value: string; onChange(value: string): void; items: { id: string; label: string; panelId: string; tabId: string }[] }) {
  return <div className="seg" role="tablist" aria-label={label}>{items.map((item, index) => <button key={item.id} type="button" role="tab" id={item.tabId} aria-controls={item.panelId} aria-selected={value === item.id} tabIndex={value === item.id ? 0 : -1} className={value === item.id ? 'on' : ''} onClick={() => onChange(item.id)} onKeyDown={event => {
    let next = index;
    const rtl = event.currentTarget.ownerDocument.defaultView?.getComputedStyle(event.currentTarget).direction === 'rtl';
    if (event.key === 'ArrowRight') next = (index + (rtl ? -1 : 1) + items.length) % items.length;
    else if (event.key === 'ArrowLeft') next = (index + (rtl ? 1 : -1) + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;
    event.preventDefault(); const target = items[next]; if (!target) return;
    onChange(target.id); event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  }}>{item.label}</button>)}</div>;
}
