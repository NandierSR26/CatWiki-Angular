import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ICatsImages } from '../interfaces/images.interface';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatImagesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getCatImagesByBreed(breedId: string): Observable<string[]> {
    const url = `${this.baseUrl}/images/breed/${breedId}`;
    return this.http.get<ICatsImages[]>(url).pipe(
      map((resp) => resp.map(image => image.url)),
      map((urls: string[]) => urls.filter(url => url !== '' && url !== null && url !== undefined)),
      catchError((error) => {
        console.error('Error fetching cat images by breed:', error);
        throw error;
      })
    )
  }
}
