import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { AuthService } from '../_services/auth.service';
import { LogoutService } from '../_services/logout.service';
import { UserService } from '../_services/user.service';
import { sha256 } from '../_tools/password-hash';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  avatar:string;
  password:string;

  user: User = null;

  constructor(private authService: AuthService, private router: Router, private userService: UserService, private logoutService: LogoutService) {
    if(this.authService.isLogged$.getValue()) this.user = this.authService.getUser();
    else this.router.navigate(['/logout']);
  }

  ngOnInit() {
  }

  async changePass() {
    let newPass =  await sha256(this.password);
    this.userService.update({Password: newPass}).toPromise().then(data => {
      if(data) {
        console.log(data);
        this.logoutService.logout();
      }
    }).catch(err => {
      console.log(err);
    })
  }

  async changeAvatar() {
    this.userService.update({Avatar: this.avatar}).toPromise().then(data => {
      if(data) {
        console.log(data);
        this.logoutService.logout();
      }
    }).catch(err => {
      console.log(err);
    })
  }
}
