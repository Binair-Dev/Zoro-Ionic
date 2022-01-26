import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(private route: Router, private localStorage: LocalStorageService, private authService: AuthService) {}

  logout(){
    this.localStorage.delete("token");
    this.authService.isLogged$.next(false);
    this.authService.user = null;
    this.route.navigate(["/home"]);
  }
}
