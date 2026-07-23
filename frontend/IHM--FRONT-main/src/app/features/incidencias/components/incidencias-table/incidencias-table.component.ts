import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { Incidencia } from '../../models/incidencia.model';

@Component({
  selector: 'app-incidencias-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './incidencias-table.component.html',
  styleUrl: './incidencias-table.component.scss'
})
export class IncidenciasTableComponent {
  incidencias = input<Incidencia[]>([]);
}
