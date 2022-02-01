import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AdminService } from '../_services/admin.service';
import { AuthService } from '../_services/auth.service';
import { CategoryService } from '../_services/category.service';
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
  userEdit: boolean = false;
  catCreate: boolean = false;
  catDelete: boolean = false;

  category: String = "";
  email: String = "";
  password: String = "";

  userList: any;
  categoryList: any;

  constructor(
    private alertController: AlertController,
    private router: Router,
    private userService: UserService,
    private logoutService: LogoutService,
    private toastController: ToastController,
    private adminService: AdminService,
    private categoryService: CategoryService,
    ) {}

  ngOnInit() {
    this.adminService.verify();
    this.reloadUsers();
    this.reloadCategories();
  }

  isOneSelected() : boolean {
    if(this.userCreate ||
      this.userEdit ||
      this.catCreate ||
      this.catDelete)
      return true;
    else
      return false;
  }

  userCreateClick() {
    this.userCreate = true;
  }
  userEditClick() {
    this.userEdit = true;
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
      this.reloadUsers();
    }).then().catch(err => {
      toast.message = "Création de l'utilisateur échouée.";
      toast.color = 'danger';
      toast.present();
      this.logoutService.logout();
    })
  }

  reloadCategories() {
    this.categoryList = null;
    this.categoryService.getAll().toPromise().then(data => {
      if(data) {
        this.categoryList = data;
      }
    }).catch(err => this.logoutService.logout())
  }

  reloadUsers() {
    this.userList = null;
    this.userService.getAll().toPromise().then(data => {
      if(data) {
        this.userList = data;
      }
    }).catch(err => this.logoutService.logout())
  }

  reset() {
    this.email = "";
    this.password = "";
    this.category = "";
    this.userCreate = false;
    this.userEdit = false;
    this.catCreate = false;
    this.catDelete = false;
    this.router.navigate(["/home"]);
  }

  resetPage() {
    this.email = "";
    this.password = "";
    this.userCreate = false;
    this.userEdit = false;
    this.catCreate = false;
    this.catDelete = false;
  }

  generateRandomPassword() {
    let i = (Math.random() + 5).toString(36).substring(2);
    let j = (Math.random() + 5).toString(36).substring(2);
    this.password = i + j;
  }

  async deleteUser(id: string) {
    const toast = await this.toastController.create({
      message: 'Supression réussie.',
      duration: 2000,
      color: 'success'
    });

    const alert = await this.alertController.create({
      header: 'Attention',
      message: 'Voulez vous vraiment supprimer cet utilisateur ?',
      buttons: [
        {
          text: 'Oui',
          handler: () => {
            this.userService.delete(id).toPromise().then(data => {
              toast.present();
              this.reloadUsers();
            }).catch(err => this.logoutService.logout())
          }
        },
        {
          text: 'Non',
          role: 'cancel',
        }
      ]
    });
    await alert.present();
  }

  async deleteCategory(id: string) {
    const toast = await this.toastController.create({
      message: 'Supression réussie.',
      duration: 2000,
      color: 'success'
    });

    const alert = await this.alertController.create({
      header: 'Attention',
      message: 'Voulez vous vraiment supprimer cette catégorie ?',
      buttons: [
        {
          text: 'Oui',
          handler: () => {
            this.categoryService.delete(id).toPromise().then(data => {
              toast.present();
              this.reloadCategories();
            }).catch(err => this.logoutService.logout())
          }
        },
        {
          text: 'Non',
          role: 'cancel',
        }
      ]
    });
    await alert.present();
  }

  rankUp(email: string) {
    this.userService.update({RankId: "1"}, email).toPromise().then(data => {
      this.reloadUsers();
    }).catch(err => this.logoutService.logout())
  }

  rankDown(email: string) {
    this.userService.update({RankId: "0"}, email).toPromise().then(data => {
      this.reloadUsers();
    }).catch(err => this.logoutService.logout())
  }

  async createCategory() {
    await this.categoryService.create({Name: this.category}).toPromise().then(async (data) => {
      const toast = await this.toastController.create({
        message: 'Création réussie.',
        duration: 2000,
        color: 'success'
      });
      toast.present();
      this.reset();
      this.reloadCategories();
    }).catch(err => this.logoutService.logout())
  }
}
