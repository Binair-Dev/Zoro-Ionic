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
  isEditing: boolean = false;
  isAddingSomeone: boolean = false;

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

  TaskList: any[];
  actualTask: any;

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

    this.taskService.getAll().subscribe(data => {
      if(data) this.TaskList = data;
    }, err => this.logoutService.logout());

    if(this.isAdmin) {
      this.agendaService.getAll().subscribe(data => {
        if(data) this.Agendas = data;
      }, err => this.logoutService.logout());

      this.userService.getAll().subscribe(data => {
        if(data) this.Concerning = data;
      }, err => this.logoutService.logout());

      this.categoryService.getAll().subscribe(data => {
        if(data) this.Categories = data;
      }, err => this.logoutService.logout());
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
          value: (this.startDate !== null ? this.format_date(this.startDate) : firstDate),
          max: maxDate
        },
        {
          name: 'toDt',
          type: 'date',
          value: (this.endDate !== null ? this.format_date(this.endDate) : null),
        }
      ],
      buttons:
      [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
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
              if(element._id !== this.authService.getUser()._id)
                tempList.push(element._id);
            }
          });
        });
      }
      return tempList;
    }
  }

  reloadUsers() {
    this.Concerning = null;
    this.userService.getAll().subscribe(data => {
      if(data) this.Concerning = data;
    }, err => this.logoutService.logout());
  }
  reset() {
    this.TaskList = null;
    this.Agendas = null;
    this.Concerning = null;
    this.Categories = null;

    this.taskService.getAll().subscribe(data => {
      if(data) this.TaskList = data;
    }, err => this.logoutService.logout());

    if(this.isAdmin) {
      this.agendaService.getAll().subscribe(data => {
        if(data) this.Agendas = data;
      }, err => this.logoutService.logout());

      this.userService.getAll().subscribe(data => {
        if(data) this.Concerning = data;
      }, err => this.logoutService.logout());

      this.categoryService.getAll().subscribe(data => {
        if(data) this.Categories = data;
      }, err => this.logoutService.logout());
    }

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
    this.isEditing = false;
    this.isAddingSomeone = false;
  }

  async createTask() {
    const toast = await this.toastController.create({
      message: 'Création de la tâche réussie.',
      duration: 2000,
      color: 'success'
    });
    let aId;
    if(this.startDate !== null && this.endDate !== null) {

          this.taskService.create({
            startDate: this.startDate,
            endDate: this.endDate,

            CategoryId: this.getCategory(),
            Name: this.name,
            Description: this.description,
            AgendaId: aId,
            UserId: this.authService.getUser()._id,
            Concerning: this.getConcerned(),
          }).subscribe(data => {
            this.reloadTasks();
            if(data) {
              toast.present();
            }
          }, err => this.logoutService.logout());

    }
    this.reset();
  }

  async deleteTask(task: any) {
    const alert = await this.alertController.create({
      header: 'Attention',
      message: 'Voulez vous vraiment supprimer cette catégorie ?',
      buttons: [
        {
          text: 'Oui',
          handler: () => {
            this.delTask(task);
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

  async delTask(task: any) {
    const toast = await this.toastController.create({
      message: 'Supression de la tâche réussie.',
      duration: 2000,
      color: 'success'
    });

    this.taskService.delete(task).subscribe(data => {
      console.log(data);
      toast.present();
      this.reloadTasks()
    }, e => {
      console.log(e);

      this.logoutService.logout();
      toast.message = "Supression de la tâche échouée !"
      toast.color = "danger";
      toast.present();
    })
    window.location.reload();
  }

  reloadTasks() {
    this.taskService.getAll().subscribe(data => {
      this.TaskList = data;
    }, err => this.logoutService.logout());
  }

  async editTask(task: any) {
    this.actualTask = task;
    this.name = task.Name;
    this.description = task.Description;
    let catName;
    await this.categoryService.getOne(task.CategoryId).subscribe(data => {
        catName = data.Name;
    });
    this.selectedCat = catName;
    this.startDate = task.Agenda.startDate;
    this.endDate = task.Agenda.endDate;

    this.isEditing = true;
  }

  addUserToTask(task: any) {
    this.reloadUsers();

    this.isAddingSomeone = true;
  }

  updateTask(task: any) {

  }

  addUnderTask(task: any) {

  }

  isUserConcerned(user: any) : boolean {
    let status = false;
    this.actualTask.Concerning.forEach(element =>
      {
        if (user._id.trim() === element.trim()) {
          status = true;
        }
        return status;
    });
    return status;
  }

  async removeUserFromTask(user: any) {
    const toast = await this.toastController.create({
      message: 'Mise a jour de la tâche réussie.',
      duration: 2000,
      color: 'success'
    });

    const index: number = this.actualTask.Concerning.indexOf(user._id);
    if (index !== -1) {
      this.actualTask.Concerning.splice(index, 1);
    }

    this.actualTask.Concerning.slice(user._id)
    this.taskService.update({Concerning: this.actualTask.Concerning}, this.actualTask._id).subscribe(data => {
      if(data) this.reloadUsers();
      toast.present();
    }, err => {
      toast.message = "Mise a jour de la tâche échouée."
      toast.color = "danger."
      toast.present();
    });
  }

  async addUserFromTask(user: any) {
    const toast = await this.toastController.create({
      message: 'Mise a jour de la tâche réussie.',
      duration: 2000,
      color: 'success'
    });
    let isInside = false;
    this.actualTask.Concerning.forEach(element => {
      if(element === user._id)
        isInside = true;
    });
    if(isInside === false) {
      this.actualTask.Concerning.push(user._id)
    }
    this.taskService.update({Concerning: this.actualTask.Concerning}, this.actualTask._id).subscribe(data => {
      if(data) this.reloadUsers();
      toast.present();
    }, err => {
      toast.message = "Mise a jour de la tâche échouée."
      toast.color = "danger."
      toast.present();
    });
  }
}
