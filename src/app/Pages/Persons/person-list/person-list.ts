import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PersonService, PersonDto } from '../../../Services/person';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './person-list.html',
  styleUrl: './person-list.css'
})
export class PersonList implements OnInit {
  private readonly personService = inject(PersonService);
  
  protected readonly persons = signal<PersonDto[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  deleting = signal<string | null>(null);

  ngOnInit(): void {
    this.loadPersons();
  }

  private loadPersons(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.personService.getPersons().subscribe({
      next: (persons) => {
        this.persons.set(persons);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load persons');
        this.loading.set(false);
        console.error('Error loading persons:', error);
      }
    });
  }

  async confirmDelete(person: PersonDto): Promise<void> {
    const ok = window.confirm(`Delete ${person.firstName} ${person.lastName}?`);
    if (!ok) return;
    await this.deleteById(person.id);
  }

  private async deleteById(id: string): Promise<void> {
    try {
      this.deleting.set(id);
      this.error.set(null);
      await firstValueFrom(this.personService.deletePerson(id));
      this.persons.update(list => list.filter(p => p.id !== id));
    } catch (e: any) {
      this.error.set(e?.error?.message ?? 'Failed to delete person.');
    } finally {
      this.deleting.set(null);
    }
  }
}
