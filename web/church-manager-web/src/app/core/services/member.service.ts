import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PaginatedResult } from '../models/api.models';
import { CreateMemberRequest, Member, MemberStatus, MemberSummary } from '../models/member.models';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/members`;

  getAll(organizationId: number, page = 1, pageSize = 25, search?: string, status?: MemberStatus) {
    let params = new HttpParams()
      .set('organizationId', organizationId)
      .set('page', page)
      .set('pageSize', pageSize);
    if (search) params = params.set('search', search);
    if (status !== undefined) params = params.set('status', status);
    return this.http.get<PaginatedResult<MemberSummary>>(this.baseUrl, { params });
  }

  getById(id: number) {
    return this.http.get<Member>(`${this.baseUrl}/${id}`);
  }

  create(member: CreateMemberRequest) {
    return this.http.post<{ id: number }>(this.baseUrl, member);
  }

  update(id: number, member: Partial<Member>) {
    return this.http.put(`${this.baseUrl}/${id}`, { id, ...member });
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
