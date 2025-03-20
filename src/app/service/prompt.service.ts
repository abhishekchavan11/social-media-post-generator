import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  private apiUrl = 'http://52.4.250.105:8000';

  constructor(private http: HttpClient) { }

  getAnswers(prompt : object) : Observable<any>{
    // const formData: FormData = new FormData();
    // formData.append('prompt', prompt.query);

    return this.http.post(`${this.apiUrl}/generate-posts`, prompt).pipe(
      tap((response : any) => {
        console.log('Prompt response:', response);
      })
    )
  }

}
