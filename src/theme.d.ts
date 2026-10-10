export type ThemePreference = 'system' | 'light' | 'dark';
export type Theme = 'light' | 'dark';
export interface ThemeSnapshot { readonly preference: ThemePreference; readonly theme: Theme }
export interface ThemeController {
 getSnapshot(): ThemeSnapshot;
 subscribe(listener: () => void): () => void;
 setPreference(preference: ThemePreference): void;
 refresh(): void;
 destroy(): void;
}
export function readPreference(win: Window): ThemePreference;
export function writePreference(win: Window, preference: ThemePreference): void;
export function createThemeController(win: Window): ThemeController;
export function getThemeController(): ThemeController | undefined;
export function getServerSnapshot(): ThemeSnapshot;
export function nextPreference(preference: ThemePreference): ThemePreference;
export function mountThemeToggle(button: HTMLButtonElement, labels: Record<ThemePreference | 'change', string>): () => void;
