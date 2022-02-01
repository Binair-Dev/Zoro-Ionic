import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
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

  constructor(private authService: AuthService, private router: Router, private userService: UserService, private logoutService: LogoutService, private toastController: ToastController) {
    if(this.authService.isLogged$.getValue()) this.user = this.authService.getUser();
    else this.router.navigate(['/logout']);
  }

  ngOnInit() {
  }

  async changePass() {
    const toast = await this.toastController.create({
      message: 'Modification réussie.',
      duration: 2000,
      color: 'success'
    });

    let newPass =  await sha256(this.password);
    this.userService.update({Password: newPass}, this.authService.getUser().Email).subscribe(data => {
      if(data) {
        toast.message = 'Modification réussie.';
        toast.color = 'success';
        toast.present();
        this.logoutService.logout();
      }
    }, err => {
      toast.message = 'Erreur lors de la modification.';
      toast.color = 'danger';
      toast.present();
      console.log(err);
    });
  }

  async changeAvatar() {
    const toast = await this.toastController.create({
      message: 'Modification réussie.',
      duration: 2000,
      color: 'success'
    });
    this.userService.update({Avatar: this.avatar}, this.authService.getUser().Email).subscribe(data => {
      if(data) {
        toast.message = 'Modification réussie.';
        toast.color = 'success';
        toast.present();
        console.log(data);
        this.logoutService.logout();
      }
    }, err => {
      toast.message = 'Erreur lors de la modification.';
      toast.color = 'danger';
      toast.present();
      console.log(err);
    });
  }
}
