import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import decode from 'jwt-decode';
import { User } from '../_models/user';
import { AuthService } from '../_services/auth.service';
import { LocalStorageService } from '../_services/local-storage.service';
import { sha256 } from '../_tools/password-hash';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email:string;
  password:string;

  constructor(private authService: AuthService, private localStorage: LocalStorageService, private toastController: ToastController, private route: Router) {}

  ngOnInit() {
  }

  async logIn() {
    let password = await sha256(this.password);
    const toast = await this.toastController.create({
      message: 'Connexion réussie.',
      duration: 2000,
      color: 'success'
    });

    this.authService.login({Email: this.email, Password: password}).toPromise().then(data => {
      if(data){
        localStorage.setItem("token", JSON.stringify(data));
        this.authService.user = decode(data.accessToken) as User;
        this.authService.isLogged$.next(true);
        toast.message = 'Connexion réussie.';
        toast.color = 'success';
        toast.present();
      }
    }).catch(err => {
      this.authService.isLogged$.next(false);
      this.authService.user = null;
      toast.message = 'Connexion échouée.';
      toast.color = 'danger';
      toast.present();
    })
    this.route.navigate(['/home']);
  }
}
