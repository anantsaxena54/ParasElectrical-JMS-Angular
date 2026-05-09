import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Job } from '../../../core/services/job';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './job-details.html',
  styleUrls: ['./job-details.scss']
})
export class JobDetails implements OnInit {
  jobId: number = 0;
  job: any = null;
  activeTab: string = 'workflow';
  
  // Hardcoded stages for UI rendering based on PRD
  stages = [
    { id: 'RECEIVED', name: 'Received', number: 1 },
    { id: 'INSPECTION', name: 'Inspection', number: 2 },
    { id: 'DISMANTLING', name: 'Dismantling', number: 3 },
    { id: 'REWINDING', name: 'Rewinding', number: 4 },
    { id: 'COIL_MANUFACTURING', name: 'Coil Manufacturing', number: 5 },
    { id: 'VPI', name: 'VPI', number: 6 },
    { id: 'ASSEMBLY', name: 'Assembly', number: 7 },
    { id: 'TESTING', name: 'Testing', number: 8 },
    { id: 'READY_FOR_DISPATCH', name: 'Ready for Dispatch', number: 9 },
    { id: 'DISPATCHED', name: 'Dispatched', number: 10 }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: Job,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.jobId = +params['id'];
      this.loadJobDetails();
      this.loadPhotos();
      this.loadDocuments();
      this.loadNotes();
    });
  }

  photos: any[] = [];
  documents: any[] = [];
  notes: any[] = [];
  editingNoteId: number | null = null;
  checklistItems: any[] = [];
  defaultTestingItems = [
    'Insulation Resistance (IR) Test',
    'High Voltage (HV) Test',
    'Surge Test',
    'No Load Trial Test',
    'Vibration Testing'
  ];

  loadChecklist() {
    if (this.job && this.job.currentStage === 'TESTING') {
      this.jobService.getChecklist(this.jobId, 'TESTING').subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.checklistItems = data;
          } else {
            this.checklistItems = this.defaultTestingItems.map(desc => ({
              taskDescription: desc,
              completed: false,
              stage: 'TESTING'
            }));
            this.saveChecklist(); // Save initial defaults
          }
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error loading checklist', err)
      });
    }
  }

  saveChecklist() {
    this.jobService.updateChecklist(this.jobId, 'TESTING', this.checklistItems).subscribe({
      next: (data) => {
        this.checklistItems = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error saving checklist', err)
    });
  }

  onChecklistChange() {
    this.saveChecklist();
  }

  loadPhotos() {
    this.jobService.getPhotos(this.jobId).subscribe({
      next: (data) => {
        this.photos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading photos', err)
    });
  }

  loadDocuments() {
    this.jobService.getDocuments(this.jobId).subscribe({
      next: (data) => {
        this.documents = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading documents', err)
    });
  }

  loadNotes() {
    this.jobService.getNotes(this.jobId).subscribe({
      next: (data) => {
        this.notes = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading notes', err)
    });
  }

  addNote(content: string) {
    if (!content.trim()) return;
    this.jobService.addNote(this.jobId, content).subscribe({
      next: (note) => {
        this.notes.unshift(note); // Add to top
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error adding note', err)
    });
  }

  startEditNote(note: any) {
    this.editingNoteId = note.id;
    this.cdr.detectChanges();
  }

  cancelEditNote() {
    this.editingNoteId = null;
    this.cdr.detectChanges();
  }

  saveNoteEdit(noteId: number, content: string) {
    if (!content.trim()) return;
    this.jobService.updateNote(noteId, content).subscribe({
      next: (updatedNote) => {
        const idx = this.notes.findIndex(n => n.id === noteId);
        if (idx !== -1) {
          this.notes[idx] = updatedNote;
        }
        this.editingNoteId = null;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error updating note', err)
    });
  }

  deleteNote(noteId: number) {
    if(confirm('Are you sure you want to delete this note?')) {
      this.jobService.deleteNote(noteId).subscribe({
        next: () => {
          this.notes = this.notes.filter(n => n.id !== noteId);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error deleting note', err)
      });
    }
  }

  getPhotosByBucket(bucket: string) {
    return this.photos.filter(p => p.bucketType === bucket);
  }

  getFileUrl(filename: string): string {
    return `http://localhost:8080/api/upload/files/${filename}`;
  }

  getDownloadUrl(filename: string): string {
    return `http://localhost:8080/api/upload/files/${filename}?download=true`;
  }

  selectedPhotoForPreview: string | null = null;

  openPreview(filePath: string) {
    this.selectedPhotoForPreview = this.getFileUrl(filePath);
    this.cdr.detectChanges();
  }

  closePreview() {
    this.selectedPhotoForPreview = null;
    this.cdr.detectChanges();
  }

  onPhotoSelected(event: any, bucketType: string) {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.jobService.uploadPhoto(this.jobId, files[i], bucketType).subscribe({
          next: (photo) => {
            this.photos = [...this.photos, photo];
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Error uploading photo', err)
        });
      }
    }
  }

  deletePhoto(photoId: number) {
    if(confirm('Are you sure you want to delete this photo?')) {
      this.jobService.deletePhoto(photoId).subscribe({
        next: () => {
          this.photos = this.photos.filter(p => p.id !== photoId);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error deleting photo', err)
      });
    }
  }

  deleteAllPhotos(bucketType: string) {
    const bucket = this.getPhotosByBucket(bucketType);
    if (bucket.length === 0) return;
    if (!confirm(`Delete all ${bucket.length} photo(s) from "${bucketType}"?`)) return;

    const deleteRequests = bucket.map(p => this.jobService.deletePhoto(p.id));
    let completed = 0;
    deleteRequests.forEach(req => {
      req.subscribe({
        next: () => {
          completed++;
          if (completed === deleteRequests.length) {
            this.photos = this.photos.filter(p => p.bucketType !== bucketType);
            this.cdr.detectChanges();
          }
        },
        error: (err) => console.error('Error deleting photo', err)
      });
    });
  }

  onDocumentSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.jobService.uploadDocument(this.jobId, files[i], 'General').subscribe({
          next: (doc) => {
            this.documents = [...this.documents, doc];
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Error uploading document', err)
        });
      }
    }
  }

  deleteDocument(docId: number) {
    if(confirm('Are you sure you want to delete this document?')) {
      this.jobService.deleteDocument(docId).subscribe({
        next: () => {
          this.documents = this.documents.filter(d => d.id !== docId);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error deleting document', err)
      });
    }
  }

  deleteAllDocuments() {
    if (this.documents.length === 0) return;
    if (!confirm(`Delete all ${this.documents.length} document(s)?`)) return;
    const deleteRequests = this.documents.map(d => this.jobService.deleteDocument(d.id));
    let completed = 0;
    deleteRequests.forEach(req => {
      req.subscribe({
        next: () => {
          completed++;
          if (completed === deleteRequests.length) {
            this.documents = [];
            this.cdr.detectChanges();
          }
        },
        error: (err) => console.error('Error deleting document', err)
      });
    });
  }

  getFileExtension(filename: string): string {
    return filename?.split('.').pop()?.toUpperCase() || 'FILE';
  }

  openDocumentPreview(filePath: string) {
    window.open(this.getFileUrl(filePath), '_blank');
  }

  loadJobDetails() {
    this.jobService.getJobById(this.jobId).subscribe({
      next: (data) => {
        this.job = data;
        this.loadChecklist();
        this.cdr.detectChanges(); // Force view update
      },
      error: (err) => console.error('Error loading job details', err)
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.cdr.detectChanges(); // Force UI to update active tab
  }

  getCurrentStageNumber(): number {
    if (!this.job) return 0;
    const stage = this.stages.find(s => s.id === this.job.currentStage);
    return stage ? stage.number : 0;
  }

  moveToNextStage() {
    const currentNum = this.getCurrentStageNumber();
    if (currentNum < 10) {
      const nextStage = this.stages.find(s => s.number === currentNum + 1);
      if (nextStage) {
        this.jobService.updateStage(this.jobId, nextStage.id).subscribe({
          next: (res) => {
            this.job = res;
            if (this.activeTab === 'checklist' && this.job.currentStage !== 'TESTING') {
              this.activeTab = 'workflow';
            }
            if (this.job.currentStage === 'TESTING') {
              this.loadChecklist();
            }
            this.cdr.detectChanges(); // Force UI to update with new stage
          },
          error: (err) => console.error('Error updating stage', err)
        });
      }
    }
  }

  moveToPreviousStage() {
    const currentNum = this.getCurrentStageNumber();
    if (currentNum > 1) {
      const prevStage = this.stages.find(s => s.number === currentNum - 1);
      if (prevStage) {
        this.jobService.updateStage(this.jobId, prevStage.id).subscribe({
          next: (res) => {
            this.job = res;
            if (this.activeTab === 'checklist' && this.job.currentStage !== 'TESTING') {
              this.activeTab = 'workflow';
            }
            if (this.job.currentStage === 'TESTING') {
              this.loadChecklist();
            }
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Error updating stage', err)
        });
      }
    }
  }

  deleteJob() {
    if (confirm(`Are you sure you want to delete Job ${this.job.jobId}? This action cannot be undone.`)) {
      this.jobService.deleteJob(this.jobId).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Error deleting job', err);
          alert('Failed to delete job. Please try again.');
        }
      });
    }
  }
}
