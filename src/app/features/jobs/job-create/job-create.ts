import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
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

  constructor(private fb: FormBuilder, private jobService: Job, private router: Router) {
    this.jobForm = this.fb.group({
      clientName: ['', Validators.required],
      phoneNumber: [''],
      motorType: ['AC', Validators.required],
      capacity: ['', Validators.required],
      voltage: [''],
      weight: [''],
      problemReported: [''],
      priority: ['Medium', Validators.required],
      expectedDeliveryDate: ['']
    });
  }

  onSubmit() {
    if (this.jobForm.valid) {
      this.isSubmitting = true;
      this.jobService.createJob(this.jobForm.value).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.router.navigate(['/jobs', res.id]);
        },
        error: (err) => {
          console.error('Error creating job', err);
          this.isSubmitting = false;
        }
      });
    }
  }
}
