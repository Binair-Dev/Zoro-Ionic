import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  constructor(private authService: AuthService, private router: Router) {
    if(this.authService.getUser() !== null && this.authService.getUser().Rank !== "Administrateur") this.router.navigate(['/home']);
  }

  ngOnInit() {
  }

}
