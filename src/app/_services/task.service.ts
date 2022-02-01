import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  AUTH_SERVER = "http://127.0.0.1:5400";

  constructor(private httpClient: HttpClient, private authService: AuthService, private localStorageService: LocalStorageService) {}

  update(user: any, target: string): Observable<any> {
    return this.httpClient.put(this.AUTH_SERVER + "/api/task/" + target, user, {headers: {'Authorization':'Bearer ' + this.localStorageService.get("token").accessToken}});
  }

  create(user: any): Observable<any> {
    return this.httpClient.post(this.AUTH_SERVER + "/api/task/", user, {headers: {'Authorization':'Bearer ' + this.localStorageService.get("token").accessToken}});
  }

  getAll(): Observable<any> {
    return this.httpClient.get(this.AUTH_SERVER + "/api/task/", {headers: {'Authorization':'Bearer ' + this.localStorageService.get("token").accessToken}});
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(this.AUTH_SERVER + "/api/task/" + id, {headers: {'Authorization':'Bearer ' + this.localStorageService.get("token").accessToken}});
  }
}
