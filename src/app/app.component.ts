import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from './_services/auth.service';
import { LocalStorageService } from './_services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  menu: any[]

  constructor(private menuCtrl: MenuController,private localStorage: LocalStorageService, private authService: AuthService) {
    this.authService.isLogged$.subscribe(isLogged => {
      if(isLogged && this.localStorage.get("token") == null) this.authService.isLogged$.next(false);
      if(isLogged && this.authService.user !== null) {
        this.menu = [
          { text: 'Accueil', url: '/home', icon: 'home' },
          { text: 'Déconnexion', url: '/logout', icon: 'log-out' },
        ]
        this.menu = [...this.menu, {text: 'Profile', url: '/profile', icon: 'people'}]
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
