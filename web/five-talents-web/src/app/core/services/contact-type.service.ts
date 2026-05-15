import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactTypesDto } from '../models/contact-type.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ContactTypeService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/contact-types`;

  getAll(): Observable<ContactTypesDto> {
    return this.http.get<ContactTypesDto>(this.base);
  }
}
