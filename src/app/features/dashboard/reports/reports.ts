import { Component, OnInit } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { Report } from '../../../core/services/report';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, KeyValuePipe],
  templateUrl: './reports.html',
  styleUrls: ['./reports.scss']
})
export class Reports implements OnInit {
  metrics: any = null;
  loading = true;

  constructor(private reportService: Report) {}

  ngOnInit() {
    this.reportService.getDashboardMetrics().subscribe({
      next: (data) => {
        this.metrics = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load metrics', err);
        this.loading = false;
      }
    });
  }

  exportData() {
    this.reportService.exportJobsCsv();
  }
}
