import { Injectable } from '@angular/core';
import {Problem} from '../models/problem.model';
import {PROBLEMS} from '../mock.problem';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private problemsSource = new BehaviorSubject<Problem[]>([]);
  problems: Problem[] = PROBLEMS;
  constructor(private http: HttpClient) { }
  getProblems(): Observable<Problem[]> {
    this.http.get('api/v1/problems').toPromise()
      .then((res: any) => {
        this.problemsSource.next(res.json());
      })
      .catch(this.handleError);
    return this.problemsSource.asObservable();
  }

  getProblem(id: number): Promise<Problem> {
    return this.http.get('api/v1/problems/').toPromise()
      .then((res: any) => res.json())
      .catch(this.handleError);
  }

  addProblem(problem: Problem): Promise<Problem> {
    const headers = { headers : new HttpHeaders({'content-type': 'application/json'})};
    return this.http.post<Problem>('/api/v1/problems', problem, headers)
      .toPromise()
      .then((res: any) => {
        this.getProblems();
        return res.json();
      })
      .catch(this.handleError);
  }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.body || error);
  }
}
