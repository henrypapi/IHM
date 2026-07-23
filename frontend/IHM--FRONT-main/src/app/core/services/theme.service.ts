import { Injectable, computed, signal } from '@angular/core';

export interface AppTheme {
  id: string;
  name: string;
  primary: string;
  primaryHover: string;
  sidebarStart: string;
  sidebarEnd: string;
  sidebarAccent: string;
  sidebarAccentSoft: string;
  sidebarText: string;
}

export interface FontOption {
  id: string;
  name: string;
  family: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEYS = {
    theme: 'ui_theme_id',
    fontScale: 'ui_font_scale',
    fontFamily: 'ui_font_family'
  };

  public readonly themes: AppTheme[] = [
    {
      id: 'slate-blue',
      name: 'Slate Blue (Corporativo)',
      primary: '#2563eb', // Royal Blue
      primaryHover: '#1d4ed8',
      sidebarStart: '#0f172a',
      sidebarEnd: '#1e293b',
      sidebarAccent: '#38bdf8', // Sky Blue
      sidebarAccentSoft: 'rgba(56, 189, 248, 0.15)',
      sidebarText: '#f8fafc'
    },
    {
      id: 'graphite-indigo',
      name: 'Graphite Indigo (Oscuro)',
      primary: '#6366f1', // Indigo
      primaryHover: '#4f46e5',
      sidebarStart: '#171717',
      sidebarEnd: '#262626',
      sidebarAccent: '#818cf8', // Indigo Accent
      sidebarAccentSoft: 'rgba(129, 140, 248, 0.15)',
      sidebarText: '#f3f4f6'
    },
    {
      id: 'midnight-emerald',
      name: 'Midnight Emerald (Moderno)',
      primary: '#10b981', // Emerald
      primaryHover: '#059669',
      sidebarStart: '#022c22',
      sidebarEnd: '#064e3b',
      sidebarAccent: '#34d399', // Emerald Accent
      sidebarAccentSoft: 'rgba(52, 211, 153, 0.15)',
      sidebarText: '#ecfdf5'
    },
    {
      id: 'ocean-breeze',
      name: 'Ocean Breeze (Clásico)',
      primary: '#0891b2', // Cyan
      primaryHover: '#0e7490',
      sidebarStart: '#1e1b4b',
      sidebarEnd: '#312e81',
      sidebarAccent: '#a5b4fc', // Lavender/Blue Accent
      sidebarAccentSoft: 'rgba(165, 180, 252, 0.2)',
      sidebarText: '#eef2ff'
    }
  ];

  public readonly fonts: FontOption[] = [
    {
      id: 'inter',
      name: 'Inter (Limpio y Moderno)',
      family: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    {
      id: 'roboto',
      name: 'Roboto (Estándar)',
      family: '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    },
    {
      id: 'outfit',
      name: 'Outfit (Geométrico Elegante)',
      family: '"Outfit", "Inter", -apple-system, sans-serif'
    },
    {
      id: 'monospace',
      name: 'Monospace (Técnico)',
      family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
    }
  ];

  // Signals for state
  public readonly activeThemeId = signal<string>(this.getStoredThemeId());
  public readonly fontScale = signal<number>(this.getStoredFontScale());
  public readonly activeFontId = signal<string>(this.getStoredFontId());

  // Computed signals
  public readonly activeTheme = computed(() => {
    return this.themes.find((t) => t.id === this.activeThemeId()) ?? this.themes[0];
  });

  public readonly activeFont = computed(() => {
    return this.fonts.find((f) => f.id === this.activeFontId()) ?? this.fonts[0];
  });

  constructor() {
    this.applyThemeToDom();
  }

  public setTheme(themeId: string): void {
    if (this.themes.some((t) => t.id === themeId)) {
      this.activeThemeId.set(themeId);
      this.setStoredValue(this.STORAGE_KEYS.theme, themeId);
      this.applyThemeToDom();
    }
  }

  public setFontScale(scale: number): void {
    const normalized = Math.min(1.3, Math.max(0.85, Number(scale.toFixed(2))));
    this.fontScale.set(normalized);
    this.setStoredValue(this.STORAGE_KEYS.fontScale, String(normalized));
    this.applyThemeToDom();
  }

  public setFontId(fontId: string): void {
    if (this.fonts.some((f) => f.id === fontId)) {
      this.activeFontId.set(fontId);
      this.setStoredValue(this.STORAGE_KEYS.fontFamily, fontId);
      this.applyThemeToDom();
    }
  }

  private applyThemeToDom(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const theme = this.activeTheme();
    const font = this.activeFont();
    const scale = this.fontScale();
    const root = document.documentElement;

    // Apply font settings
    root.style.setProperty('--app-font-family', font.family);
    root.style.setProperty('--app-font-scale', String(scale));

    // Apply color settings
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-primary-hover', theme.primaryHover);
    root.style.setProperty('--sidebar-start', theme.sidebarStart);
    root.style.setProperty('--sidebar-end', theme.sidebarEnd);
    root.style.setProperty('--sidebar-accent', theme.sidebarAccent);
    root.style.setProperty('--sidebar-accent-soft', theme.sidebarAccentSoft);
    root.style.setProperty('--sidebar-text', theme.sidebarText);
  }

  private getStoredThemeId(): string {
    const val = this.getStoredValue(this.STORAGE_KEYS.theme);
    return this.themes.some((t) => t.id === val) ? val! : this.themes[0].id;
  }

  private getStoredFontScale(): number {
    const val = Number(this.getStoredValue(this.STORAGE_KEYS.fontScale));
    return Number.isFinite(val) && val >= 0.85 && val <= 1.3 ? val : 1.0;
  }

  private getStoredFontId(): string {
    const val = this.getStoredValue(this.STORAGE_KEYS.fontFamily);
    return this.fonts.some((f) => f.id === val) ? val! : this.fonts[0].id;
  }

  private getStoredValue(key: string): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  private setStoredValue(key: string, value: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }
}
