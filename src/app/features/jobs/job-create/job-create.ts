import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Job } from '../../../core/services/job';

@Component({
  selector: 'app-job-create',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './job-create.html',
  styleUrls: ['./job-create.scss']
})
export class JobCreate {
  jobForm: FormGroup;
  isSubmitting = false;
  isEditMode = false;
  jobId: number | null = null;

  constructor(
    private fb: FormBuilder, 
    private jobService: Job, 
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.jobForm = this.fb.group({
      clientName: ['', Validators.required],
      phoneNumber: [''],
      contactPerson: [''],
      motorType: ['', Validators.required],
      pole: [''],
      capacity: ['', Validators.required],
      voltage: [''],
      weight: [''],
      problemReported: [''],
      priority: ['Medium', Validators.required],
      expectedDeliveryDate: [''],
      startDate: [new Date().toISOString().substring(0, 10)] // Default to today
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.jobId = +id;
      this.loadJobDetails(this.jobId);
    }
  }

  loadJobDetails(id: number) {
    this.jobService.getJobById(id).subscribe({
      next: (job) => {
        this.jobForm.patchValue(job);
      },
      error: (err) => console.error('Error loading job for edit', err)
    });
  }

  onSubmit() {
    if (this.jobForm.valid) {
      this.isSubmitting = true;
      const operation = this.isEditMode && this.jobId
        ? this.jobService.updateJob(this.jobId, this.jobForm.value)
        : this.jobService.createJob(this.jobForm.value);

      operation.subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.router.navigate(['/jobs', res.id]);
        },
        error: (err) => {
          console.error('Error saving job', err);
          this.isSubmitting = false;
        }
      });
    }
  }
}
