import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input({ required: true }) title!: string;
  @Input() maxWidth: string = '500px';
  @Output() closed = new EventEmitter<void>();

  @ViewChild('dialogElement') private dialogElement!: ElementRef<HTMLDialogElement>;

  public open(): void {
    if (this.dialogElement?.nativeElement) {
      this.dialogElement.nativeElement.showModal();
    }
  }

  public close(): void {
    if (this.dialogElement?.nativeElement) {
      this.dialogElement.nativeElement.close();
    }
  }

  protected onDialogClose(): void {
    this.closed.emit();
  }

  protected onBackdropClick(event: MouseEvent): void {
    const dialog = this.dialogElement.nativeElement;
    const rect = dialog.getBoundingClientRect();
    const isInDialog =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;

    if (!isInDialog) {
      this.close();
    }
  }
}
