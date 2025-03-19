import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  private apiUrl = '';

  constructor(private http: HttpClient) { }

  getAnswers(prompt : {query : string}) : Observable<any>{
    const formData: FormData = new FormData();
    formData.append('prompt', prompt.query);

    return this.http.post(`${this.apiUrl}/process`, formData).pipe(
      tap((response : any) => {
        console.log('Prompt response:', response);
      })
    )
  }

}
