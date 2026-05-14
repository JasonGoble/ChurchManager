import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  CreateOrganizationRequest,
  Organization,
  OrganizationLevel,
  OrganizationSettings,
  OrganizationTree,
  UpdateOrganizationRequest,
} from '../models/organization.models';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/organizations`;

  getAll(includeInactive = false) {
    const params = new HttpParams().set('includeInactive', includeInactive);
    return this.http.get<Organization[]>(this.baseUrl, { params });
  }

  getById(id: number) {
    return this.http.get<Organization>(`${this.baseUrl}/${id}`);
  }

  getTree() {
    return this.http.get<OrganizationTree[]>(`${this.baseUrl}/tree`);
  }

  getLevels() {
    return this.http.get<OrganizationLevel[]>(`${this.baseUrl}/levels`);
  }

  create(request: CreateOrganizationRequest) {
    return this.http.post<{ id: number }>(this.baseUrl, request);
  }

  update(request: UpdateOrganizationRequest) {
    return this.http.put(`${this.baseUrl}/${request.id}`, request);
  }

  getSettings(id: number) {
    return this.http.get<OrganizationSettings>(`${this.baseUrl}/${id}/settings`);
  }

  updateSettings(id: number, settings: OrganizationSettings) {
    return this.http.put(`${this.baseUrl}/${id}/settings`, settings);
  }
}
