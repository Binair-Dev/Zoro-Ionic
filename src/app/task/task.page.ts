import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { User } from '../_models/user';
import { AgendaService } from '../_services/agenda.service';
import { AuthService } from '../_services/auth.service';
import { CategoryService } from '../_services/category.service';
import { LogoutService } from '../_services/logout.service';
import { TaskService } from '../_services/task.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit {

  isAdmin: boolean = false;
  isCreating: boolean = false;

  name: String;
  description: String;
  selectedCategory: String;
  selectedAgendas: String;
  SelectedConcerning: any[];
  selectedCat: string = "";
  selectedUsers: string = "";

  Categories: any[];
  Agendas: any[];
  Concerning: User[];

  startDate: Date = null;
  endDate: Date = null;

  constructor(
    private authService: AuthService,
    private logoutService: LogoutService,
    private agendaService: AgendaService,
    private taskService: TaskService,
    private userService: UserService,
    private categoryService: CategoryService,
    private alertController: AlertController,
    private toastController: ToastController,

    ) { }

  ngOnInit() {
    if(this.authService.getUser().RankId !== "0") {
      this.isAdmin = false;
    } else this.isAdmin = true;

    if(this.isAdmin) {
      this.agendaService.getAll().toPromise().then(data => {
        if(data) this.Agendas = data;
      }).catch(err => this.logoutService.logout());

      this.userService.getAll().toPromise().then(data => {
        if(data) this.Concerning = data;
      }).catch(err => this.logoutService.logout());

      this.categoryService.getAll().toPromise().then(data => {
        if(data) this.Categories = data;
      }).catch(err => this.logoutService.logout());
    }
  }

  private format_date(dt: any) {
    var today = new Date(dt);
    let dd: any = today.getDate();
    let mm: any = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    if (dd < 10) {
        dd = `0${dd}`;
    }
    if (mm < 10) {
        mm = `0${mm}`;
    }
    return `${yyyy}-${mm}-${dd}`;
}
  async selectDates() {
    const dt = new Date();
    let firstDate =   dt.getFullYear() + '-' + ((dt.getMonth() + 1) < 10 ? '0' + (dt.getMonth() + 1) : (dt.getMonth() + 1) ) + '-01';
    let maxDate = this.format_date(dt);
    const alerts = await this.alertController.create({
      header: 'Choisis les dates',
      inputs: [
        {
          name: 'fromDt',
          type: 'date',
          value: firstDate,
          max: maxDate
        },
        {
          name: 'toDt',
          type: 'date',
        }
      ],
      buttons:
      [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Valider',
          handler: (alertData) => {
              this.startDate = new Date(alertData.fromDt);
              this.endDate = new Date(alertData.toDt);
            }
          }
      ]
    });
    await alerts.present();
  }

  getCategory() : string {
    let choice = "";
    if(this.selectedCat !== "") {
      this.Categories.forEach(element => {
        if(element.Name === this.selectedCat) {
          choice = element._id;
        }
      });
    }
    return choice;
  }
  getConcerned() : any[] {
    if(this.authService.getUser() !== null) {
      let tempList = [this.authService.getUser()._id];
      if(this.selectedUsers !== null) {
        let splitted = this.selectedUsers.toString().split(",")
        splitted.forEach(users => {
          this.Concerning.forEach(element => {
            if(element.Email === users.trim()) {
              tempList.push(element._id);
            }
          });
        });
      }
      return tempList;
    }
  }

  reset() {
    this.startDate = null;
    this.endDate = null;
    this.name = null;
    this.description = null;
    this.selectedCategory = null;
    this.selectedAgendas = null;
    this.SelectedConcerning = [];
    this.selectedCat = null;
    this.selectedUsers = null;
    this.isCreating = false;
  }

  async createTask() {
    const toast = await this.toastController.create({
      message: 'Création de la tâche réussie.',
      duration: 2000,
      color: 'success'
    });
    let aId;
    if(this.startDate !== null && this.endDate !== null) {
      await this.agendaService.create({
        startDate: this.startDate,
        endDate: this.endDate
      }).toPromise().then(data => {
        if(data) {
          if(data._id !== null) {
            aId = data._id;
          }
        }
      }).catch(err => this.logoutService.logout())
    }
    if(aId) {
      this.taskService.create({
        CategoryId: this.getCategory(),
        Name: this.name,
        Description: this.description,
        AgendaId: aId,
        UserId: this.authService.getUser()._id,
        Concerning: this.getConcerned(),
      }).toPromise().then(data => {
        if(data) {
          toast.present();
        }
      }).catch(err => this.logoutService.logout())
    }
    this.reset();
  }
}
