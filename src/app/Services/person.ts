import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

export interface PersonDto {
  id: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/Person`; // Use relative URL with proxy

  getPersons(): Observable<PersonDto[]> {
    return this.http.get<PersonDto[]>(this.baseUrl);
  }

  getPerson(id: string): Observable<PersonDto> {
    return this.http.get<PersonDto>(`${this.baseUrl}/${id}`);
  }

  createPerson(person: Omit<PersonDto, 'id'>): Observable<PersonDto> {
    return this.http.post<PersonDto>(this.baseUrl, person);
  }

  updatePerson(id: string, person: PersonDto): Observable<PersonDto> {
    return this.http.put<PersonDto>(`${this.baseUrl}/${id}`, person);
  }

  deletePerson(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
