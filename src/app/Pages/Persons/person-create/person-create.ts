import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PersonService } from '../../../Services/person';

@Component({
  selector: 'app-person-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './person-create.html',
  styleUrl: './person-create.css'
})
export class PersonCreate {
  private readonly personService = inject(PersonService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const { firstName, lastName } = this.form.getRawValue();

    try {
      await firstValueFrom(this.personService.createPerson({ firstName, lastName }));
      await this.router.navigate(['']); // Adjust route if needed
    } catch (e: any) {
      this.error.set(e?.error?.message ?? 'Failed to create person.');
    } finally {
      this.loading.set(false);
    }
  }

  cancel(): void {
    this.router.navigate(['']); // Adjust route
  }
}
