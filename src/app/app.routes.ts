import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { JobCreate } from './features/jobs/job-create/job-create';
import { JobDetails } from './features/jobs/job-details/job-details';
import { Reports } from './features/dashboard/reports/reports';
import { TechnicianDashboard } from './features/dashboard/technician-dashboard/technician-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'reports', component: Reports },
  { path: 'technician', component: TechnicianDashboard },
  { path: 'jobs/create', component: JobCreate },
  { path: 'jobs/:id', component: JobDetails },
  { path: '**', redirectTo: 'dashboard' }
];


