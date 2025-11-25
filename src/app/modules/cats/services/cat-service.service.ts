import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, map, Observable } from 'rxjs';
import { ICatBreed } from '../interfaces/cats.interface';

@Injectable({
  providedIn: 'root',
})
export class CatService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getCats(page: number = 0, limit: number = 20): Observable<ICatBreed[]> {
    const url = `${this.baseUrl}/cats/breeds?page=${page}&limit=${limit}`;
    return this.http.get<ICatBreed[]>(url).pipe(
      map((resp) => {
        return resp;
      }),
      catchError((error) => {
        console.error('Error fetching cat breeds:', error);
        throw error;
      })
    )
  }

  getCatById(breedId: string): Observable<ICatBreed> {
    const url = `${this.baseUrl}/cats/breeds/${breedId}`;
    return this.http.get<ICatBreed>(url).pipe(
      map((resp) => {
        return resp;
      }),
      catchError((error) => {
        console.error('Error fetching cat breed by ID:', error);
        throw error;
      })
    );
  }
}