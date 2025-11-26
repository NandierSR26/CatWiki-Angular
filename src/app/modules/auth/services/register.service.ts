import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { IRegisterRequest, IRegisterResponse } from '../interfaces/register.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  register(data: IRegisterRequest): Observable<IRegisterResponse> {
    const url = `${this.baseUrl}/auth/register`;
    return this.http.post<IRegisterResponse>(url, data);
  }
}
