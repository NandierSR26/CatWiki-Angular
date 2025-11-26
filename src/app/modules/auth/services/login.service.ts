import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ILoginRequest, ILoginResponse } from '../interfaces/login.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  login(data: ILoginRequest) {
    const url = `${this.baseUrl}/auth/login`;
    return this.http.post<ILoginResponse>(url, data);
  }
}
