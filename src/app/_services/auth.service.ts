import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { User } from '../_models/user';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLogged$: BehaviorSubject<boolean>;
  user: User = null;

  AUTH_SERVER = "http://127.0.0.1:5400";

  constructor(private httpClient: HttpClient, private localStorage: LocalStorageService) {
    if(localStorage.get("token") !== null) this.isLogged$ = new BehaviorSubject(true);
    else this.isLogged$ = new BehaviorSubject(true);
  }

  login(user: any): Observable<any> {
    return this.httpClient.post(this.AUTH_SERVER + "/api/login", user);
  }

  getUser() {
    return this.user;
  }
}
