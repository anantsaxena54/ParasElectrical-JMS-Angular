import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Job } from '../../../core/services/job';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.scss']
})
export class Reports implements OnInit {
  jobs: any[] = [];
  loading = true;

  constructor(
    private jobService: Job,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    
    // Load all jobs for master view
    this.jobService.getAllJobs().subscribe({
      next: (data) => {
        this.jobs = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load jobs', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  exportData() {
    window.open(`${(this.jobService as any).baseUrl}/api/jobs/master-sheet`, '_blank');
  }
}
