import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dashboard-stat-card',
  standalone: true,
  templateUrl: './dashboard-stat-card.component.html',
  styleUrl: './dashboard-stat-card.component.scss'
})
export class DashboardStatCardComponent {
  title = input.required<string>();
  value = input.required<string>();
  tone = input<'teal' | 'blue' | 'amber'>('teal');
}
