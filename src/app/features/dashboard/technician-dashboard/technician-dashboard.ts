import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Job } from '../../../core/services/job';

@Component({
  selector: 'app-technician-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './technician-dashboard.html',
  styleUrls: ['./technician-dashboard.scss']
})
export class TechnicianDashboard implements OnInit {
  myJobs: any[] = [];
  loading = true;

  constructor(private jobService: Job) {}

  ngOnInit() {
    this.loadMyJobs();
  }

  loadMyJobs() {
    // For MVP with single user, we just fetch all jobs and filter
    // In a real app with roles, we would fetch only jobs assigned to the logged-in tech
    this.jobService.getAllJobs().subscribe({
      next: (data) => {
        // Simulating "My assigned jobs" by showing jobs that are NOT completed
        this.myJobs = data.filter(j => j.currentStage !== 'DISPATCHED' && j.currentStage !== 'READY_FOR_DISPATCH');
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading jobs', err);
        this.loading = false;
      }
    });
  }
}
