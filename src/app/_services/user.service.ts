import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  AUTH_SERVER = "http://127.0.0.1:5400";

  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  update(user: any): Observable<any> {
    return this.httpClient.put(this.AUTH_SERVER + "/api/user/" + this.authService.user.Email, user, {headers: {'Authorization':'Bearer ' + JSON.parse(localStorage.getItem("token")).accessToken}});
  }
}
