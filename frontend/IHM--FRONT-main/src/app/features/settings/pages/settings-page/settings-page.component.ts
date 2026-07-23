import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ThemeService, AppTheme, FontOption } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  protected readonly themeService = inject(ThemeService);

  protected readonly themes = this.themeService.themes;
  protected readonly fonts = this.themeService.fonts;

  protected readonly activeThemeId = this.themeService.activeThemeId;
  protected readonly activeFontId = this.themeService.activeFontId;
  protected readonly fontScale = this.themeService.fontScale;

  protected selectTheme(themeId: string): void {
    this.themeService.setTheme(themeId);
  }

  protected selectFont(fontId: string): void {
    this.themeService.setFontId(fontId);
  }

  protected adjustScale(amount: number): void {
    this.themeService.setFontScale(this.fontScale() + amount);
  }

  protected setScale(scale: number): void {
    this.themeService.setFontScale(scale);
  }
}
