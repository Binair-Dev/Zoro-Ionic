import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from './_services/auth.service';
import { LocalStorageService } from './_services/local-storage.service';
import { UserService } from './_services/user.service';

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
    if(this.localStorageService.get("token") !== null) {
      this.authService.isLogged$.next(true);
    }
    this.authService.isLogged$.subscribe(isLogged => {
      if(!isLogged) {
        this.router.navigate(["/login"]);
      }
      if(isLogged && this.localStorageService.get("token") == null) this.authService.isLogged$.next(false);
      if(isLogged && this.authService.getUser() !== null) {
        this.menu = [
          { text: 'Accueil', url: '/home', icon: 'home' },
          { text: 'Déconnexion', url: '/logout', icon: 'log-out' },
        ]
        this.menu = [...this.menu, {text: 'Profile', url: '/profile', icon: 'people'}]
        this.menu = [...this.menu, {text: 'Tâches', url: '/task', icon: 'document-attach'}]

        if(this.authService.getUser().Rank !== null && this.authService.getUser().Rank === "Administrateur") {
          this.menu = [...this.menu, {text: 'Administration', url: '/admin', icon: 'document'}]
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
