import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentUser: Observable<any>;
  email: string = '';
  password: string = '';
  showAdminPanel: boolean;
  constructor(public authService: AuthService, public af: AngularFireDatabase, private router: Router) {
    this.authService.user.subscribe(user => {
      if (user) {
        this.currentUser = this.af.object('/users/' + user.uid).valueChanges();
      }
    });
    this.showAdminPanel = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }

  onAdminPanelClose(show: boolean){
    this.showAdminPanel = show;
  }

  toggleAdminPanel() {
    this.showAdminPanel ? this.showAdminPanel = false : this.showAdminPanel = true;
  }

}
