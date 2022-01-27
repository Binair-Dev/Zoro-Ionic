import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../_services/auth.service';
import { LogoutService } from '../_services/logout.service';
import { UserService } from '../_services/user.service';
import { sha256 } from '../_tools/password-hash';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  userCreate: boolean = false;
  userDelete: boolean = false;
  rankCreate: boolean = false;
  rankDelete: boolean = false;

  email: String = "";
  password: String = "";

  constructor(private authService: AuthService, private router: Router, private userService: UserService, private logoutService: LogoutService, private toastController: ToastController) {
    if(this.authService.getUser() !== null && this.authService.getUser().Rank !== "Administrateur") this.router.navigate(['/home']);
  }

  ngOnInit() {
  }

  isOneSelected() : boolean {
    if(this.userCreate ||
      this.userDelete ||
      this.rankCreate ||
      this.rankDelete)
      return true;
    else
      return false;
  }

  userCreateClick() {
    this.userCreate = true;
  }
  userDeleteClick() {
    this.userDelete = true;
  }
  rankCreateClick() {
    this.rankCreate = true;
  }
  rankDeleteClick() {
    this.rankDelete = true;
  }

  async createUser() {

    const toast = await this.toastController.create({
      message: 'Connexion réussie.',
      duration: 2000,
      color: 'success'
    });

    let user = {
      Email: this.email,
      Password: await sha256(this.password),
      RankId: 1,
      isOnline: false,
      isSoftDeleted: false,
      Avatar: "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
    }

    this.userService.create(user).toPromise().then(data => {
      toast.message = "Création de l'utilisateur réussie.";
      toast.color = 'success';
      toast.present();
      this.reset();
    }).then().catch(err => {
      toast.message = "Création de l'utilisateur échouée.";
      toast.color = 'danger';
      toast.present();
      this.logoutService.logout();
    })
  }

  reset() {
    this.email = "";
    this.password = "";
    this.userCreate = false;
    this.userDelete = false;
    this.rankCreate = false;
    this.rankDelete = false;
    this.router.navigate(["/home"]);
  }

  generateRandomPassword() {
    let i = (Math.random() + 5).toString(36).substring(2);
    let j = (Math.random() + 5).toString(36).substring(2);
    this.password = i + j;
  }
}
