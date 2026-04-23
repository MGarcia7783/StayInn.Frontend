import { Component, inject, OnInit, signal } from '@angular/core';
import { DashboardService } from '../service/dashboard-service';
import { InteractionService } from '../../../shared/service/interaction.service';
import { IDashboard } from '../interface/idashboard';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexFill,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { CommonModule } from '@angular/common';

// Tipado del gráfico
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  fill: ApexFill;
  colors: string[];
};

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  // Inyección de dependecias
  private dashboardService = inject(DashboardService);
  private interactionService = inject(InteractionService);

  // Signals
  datos = signal<IDashboard | null>(null);
  cargando = signal(true);

  chartOptions: ChartOptions | null = null;

  ngOnInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard() {
    this.cargando.set(true);

    this.dashboardService.obtenerResumen().subscribe({
      next: (res: IDashboard | null) => {
        this.datos.set(res);

        if (res && res.tendenciaReservas.length > 0) {
          const categorias = res.tendenciaReservas.map((t) => t.fecha);
          const data = res.tendenciaReservas.map((t) => t.cantidad);

          this.chartOptions = {
            series: [
              {
                name: 'Reservas',
                data: data,
              },
            ],

            chart: {
              height: 300,
              type: 'area',
              toolbar: { show: false },
              zoom: { enabled: false },
            },

            colors: ['#3D39AF'],

            dataLabels: { enabled: false },

            stroke: {
              curve: 'smooth',
              width: 3,
            },

            fill: {
              type: 'gradient',
              gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.1,
                stops: [0, 90, 100],
              },
            },

            xaxis: {
              categories: categorias,
            },

            yaxis: {
              min: 0,
            },
          };
        } else {
          this.chartOptions = null;
        }

        this.cargando.set(false);
      },
      error: (err) => {
        this.cargando.set(false);
        this.interactionService.mostrarError(err);
      },
    });
  }
}
