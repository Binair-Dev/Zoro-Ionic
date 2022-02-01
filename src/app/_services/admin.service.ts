import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { LogoutService } from './logout.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private authService: AuthService, private logoutService: LogoutService) { }

  verify() {
    if(this.authService.getUser() !== null && this.authService.getUser().RankId !== "0") {
      this.logoutService.logout();
    }
  }
}
