import { Component, output } from '@angular/core';

@Component({
  selector: 'app-dashboard-toolbar',
  standalone: true,
  templateUrl: './dashboard-toolbar.component.html',
  styleUrl: './dashboard-toolbar.component.scss'
})
export class DashboardToolbarComponent {
  actionSelected = output<string>();

  protected select(action: string): void {
    this.actionSelected.emit(action);
  }
}
