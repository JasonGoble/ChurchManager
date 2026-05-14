import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserSummary } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/users`;

  getUnlinked() {
    return this.http.get<UserSummary[]>(`${this.baseUrl}/unlinked`);
  }
}
