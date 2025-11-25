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
  private breedsList: ICatBreed[] = []

  getCats(page: number = 0, limit: number = 20): Observable<ICatBreed[]> {
    const url = `${this.baseUrl}/cats/breeds?page=${page}&limit=${limit}`;
    return this.http.get<ICatBreed[]>(url).pipe(
      map((resp) => {
        this.breedsList = [...this.breedsList, ...resp];
        return this.breedsList;
      }),
      catchError((error) => {
        console.error('Error fetching cat breeds:', error);
        throw error;
      })
    )
  }

}
