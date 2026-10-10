import { type ReactNode, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type SVGProps } from 'react';
import { type ThemePreference, type ThemeSnapshot } from './theme.js';
import { type IconName } from './icons.js';
interface ThemeValue extends ThemeSnapshot {
    setPreference(preference: ThemePreference): void;
}
export declare function ThemeProvider({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare const useTheme: () => ThemeValue;
export declare function ThemeToggle({ labels, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & {
    labels: Record<ThemePreference | 'change', string>;
}): import("react").JSX.Element;
export declare function Icon({ name, size, label, className, ...props }: Omit<SVGProps<SVGSVGElement>, 'name'> & {
    name: IconName;
    size?: number;
    label?: string;
}): import("react").JSX.Element;
export declare function Button({ variant, size, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'small' | 'big';
}): import("react").JSX.Element;
export declare const Card: ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => import("react").JSX.Element;
export declare const Badge: ({ tone, className, ...props }: HTMLAttributes<HTMLSpanElement> & {
    tone?: "" | "gold" | "ok" | "warn" | "bad";
}) => import("react").JSX.Element;
export declare const Notice: ({ tone, className, ...props }: HTMLAttributes<HTMLDivElement> & {
    tone?: "" | "error" | "warn";
}) => import("react").JSX.Element;
export declare function Loading({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare function Field({ label, hint, error, id: suppliedId, ...props }: InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    hint?: string;
    error?: string;
}): import("react").JSX.Element;
export declare function TableWrap({ label, stack, children }: {
    label: string;
    stack?: boolean;
    children: ReactNode;
}): import("react").JSX.Element;
export declare function Wordmark({ label, className }: {
    label?: string | null;
    className?: string;
}): import("react").JSX.Element;
export declare function Tabs({ label, value, onChange, items }: {
    label: string;
    value: string;
    onChange(value: string): void;
    items: {
        id: string;
        label: string;
        panelId: string;
        tabId: string;
    }[];
}): import("react").JSX.Element;
export {};
