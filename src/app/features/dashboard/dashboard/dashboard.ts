import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Job } from '../../../core/services/job';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  jobs: any[] = [];
  filteredJobs: any[] = [];
  
  // Stats
  totalJobs = 0;
  inProgress = 0;
  testing = 0;
  readyForDispatch = 0;
  completed = 0;

  // Filters
  searchTerm: string = '';
  statusFilter: string = 'ALL';

  constructor(private jobService: Job, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.jobService.getAllJobs().subscribe({
      next: (data) => {
        console.log('Jobs loaded from API:', data);
        this.jobs = data || [];
        this.filteredJobs = this.jobs;
        this.calculateStats();
        this.cdr.detectChanges(); // Force view update
      },
      error: (err) => {
        console.error('Failed to load jobs:', err);
      }
    });
  }

  calculateStats() {
    this.totalJobs = this.jobs.length;
    this.inProgress = this.jobs.filter(j => ['RECEIVED', 'INSPECTION', 'DISMANTLING', 'REWINDING', 'COIL_MANUFACTURING', 'VPI', 'ASSEMBLY'].includes(j.currentStage)).length;
    this.testing = this.jobs.filter(j => j.currentStage === 'TESTING').length;
    this.readyForDispatch = this.jobs.filter(j => j.currentStage === 'READY_FOR_DISPATCH').length;
    this.completed = this.jobs.filter(j => j.currentStage === 'DISPATCHED').length;
  }

  filterByGroup(group: string) {
    this.statusFilter = group;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredJobs = this.jobs.filter(job => {
      const matchesSearch = job.jobId.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                            job.clientName.toLowerCase().includes(this.searchTerm.toLowerCase());
                            
      let matchesStatus = true;
      if (this.statusFilter === 'ALL') {
        matchesStatus = true;
      } else if (this.statusFilter === 'IN_PROGRESS_GROUP') {
        matchesStatus = ['RECEIVED', 'INSPECTION', 'DISMANTLING', 'REWINDING', 'COIL_MANUFACTURING', 'VPI', 'ASSEMBLY'].includes(job.currentStage);
      } else {
        matchesStatus = job.currentStage === this.statusFilter;
      }
      
      return matchesSearch && matchesStatus;
    });
  }

  downloadMasterSheet() {
    window.open(`${(this.jobService as any).baseUrl}/api/jobs/master-sheet`, '_blank');
  }
}
