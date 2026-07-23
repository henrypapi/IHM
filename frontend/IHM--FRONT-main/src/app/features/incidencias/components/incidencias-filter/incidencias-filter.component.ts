import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { IncidenciaFilter } from '../../models/incidencia-filter.model';

@Component({
  selector: 'app-incidencias-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './incidencias-filter.component.html',
  styleUrl: './incidencias-filter.component.scss'
})
export class IncidenciasFilterComponent {
  filtersChanged = output<IncidenciaFilter>();

  protected readonly form = new FormBuilder().nonNullable.group({
    search: [''],
    estado: ['']
  });

  protected applyFilters(): void {
    this.filtersChanged.emit(this.form.getRawValue());
  }
}
