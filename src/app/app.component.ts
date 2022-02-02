import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './_services/auth.service';
import { LocalStorageService } from './_services/local-storage.service';
import decode from 'jwt-decode';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  menu: any[] = null;
  connectedUsers: any[] = null;

  constructor(
    private menuCtrl: MenuController,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private router: Router)
  {
      let token = this.localStorageService.get("token");

      if(token !== null) {
        if(this.authService.isLogged$ === undefined ||this.authService.isLogged$ === null)
          this.authService.isLogged$ = new BehaviorSubject(false);
        else {
          this.authService.isLogged$ = new BehaviorSubject(true);
          this.authService.user = decode(token.accessToken) as User;
        }
      }

      this.authService.isLogged$.subscribe(isLogged => {
      if(!isLogged) {
        this.router.navigate(["/login"]);
      }

      if(isLogged && token.accessToken !== null) {
        this.menu = [
          { text: 'Accueil', url: '/home', icon: 'home' },
          { text: 'Déconnexion', url: '/logout', icon: 'log-out' },
        ]
        this.menu = [...this.menu, {text: 'Profile', url: '/profile', icon: 'people'}]
        this.menu = [...this.menu, {text: 'Tâches', url: '/task', icon: 'document-attach'}]

        if(this.authService.getUser() !== undefined && this.authService.getUser() !== null) {
          if(this.authService.getUser() !== null && this.authService.getUser().Rank !== null && this.authService.getUser().Rank === "Administrateur") {
            this.menu = [...this.menu, {text: 'Administration', url: '/admin', icon: 'document'}]
          }
        }
      }else {
        this.menu = [
          { text: 'Accueil', url: '/home', icon: 'home' },
          { text: 'Connexion', url: '/login', icon: 'log-in' },
        ]
      }
    })
  }

  closeMenu() {
    this.menuCtrl.close();
  }
}
