import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

export interface ContextHelpStep {
  anchorId: string;
  description: string;
  id: string;
  label: string;
}

export interface ContextHelpLayout {
  arrowClass: string;
  calloutStyles: Record<string, string>;
}

@Component({
  selector: 'app-context-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './context-help.component.html',
  styleUrl: './context-help.component.scss'
})
export class ContextHelpComponent {
  readonly isOpen = input(false);
  readonly layouts = input<Record<string, ContextHelpLayout>>({});
  readonly steps = input<ContextHelpStep[]>([]);
  readonly close = output<void>();
  readonly focusSection = output<string>();

  protected trackStep(index: number, step: ContextHelpStep): string {
    return `${index}-${step.id}`;
  }

  protected onFocusSection(anchorId: string): void {
    this.focusSection.emit(anchorId);
  }
}
