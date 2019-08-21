import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CateService {

  constructor(
    public httpClient: HttpClient
  ) { }

  public getPeople() {
    return this.httpClient.get('/assets/people.json').pipe(
      map(d => d && d['results'])
    );
  }

  public setPeople(request) {
    return this.httpClient.get('/assets/people.json').pipe(
      map(d => d && d['results'])
    );
  }
}
