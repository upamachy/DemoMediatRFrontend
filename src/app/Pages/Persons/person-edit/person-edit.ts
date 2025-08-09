import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PersonService, PersonDto } from '../../../Services/person';

@Component({
  selector: 'app-person-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './person-edit.html',
  styleUrl: './person-edit.css'
})
export class PersonEdit implements OnInit {
  private readonly personService = inject(PersonService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  loading = signal(true);
  error = signal<string | null>(null);
  private personId!: string;

  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
  });

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Missing person id.');
      this.loading.set(false);
      return;
    }

    this.personId = id;

    try {
      const person = await firstValueFrom(this.personService.getPerson(id));
      this.form.setValue({
        firstName: person.firstName,
        lastName: person.lastName
      });
    } catch (e: any) {
      this.error.set(e?.error?.message ?? 'Failed to load person.');
    } finally {
      this.loading.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const { firstName, lastName } = this.form.getRawValue();
    const payload: PersonDto = { id: this.personId, firstName, lastName };

    try {
      const updated = await firstValueFrom(this.personService.updatePerson(this.personId, payload));
      await this.router.navigate([''], { state: { updated } }); // list at root (''); adjust if needed
    } catch (e: any) {
      this.error.set(e?.error?.message ?? 'Failed to update person.');
    } finally {
      this.loading.set(false);
    }
  }

  cancel(): void {
    this.router.navigate(['']); // back to list; adjust if needed
  }
}
