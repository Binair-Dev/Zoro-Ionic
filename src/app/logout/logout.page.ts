import { Component, OnInit } from '@angular/core';
import { LogoutService } from '../_services/logout.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(private logoutService: LogoutService) {
    this.logoutService.logout();
  }

  ngOnInit() {
  }

}
