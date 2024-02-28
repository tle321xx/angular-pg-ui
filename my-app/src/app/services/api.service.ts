import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public baseUrl: string = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  postRegisterUser(data: User) {
    return this.http.post<User>(`${this.baseUrl}`, data);
  }

  getAllRegisterUser() {
    return this.http.get<User[]>(`${this.baseUrl}`);
  }

  putRegisterUser(data:User, id: number){
    return this.http.put<User>(`${this.baseUrl}/${id}`, data)
  }

  getRegisterUserId(id: number) {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }
}
