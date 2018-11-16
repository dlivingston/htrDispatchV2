import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NewTicketComponent } from './new-ticket/new-ticket.component';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { PartsListComponent } from './parts-list/parts-list.component';
import { ClientsListComponent } from './clients-list/clients-list.component';
import { UsersComponent } from './users/users.component';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'new-ticket', component: NewTicketComponent },
  { path: 'ticket-detail/:id', component: TicketDetailsComponent },
  { path: 'ticket-list', component: TicketListComponent },
  { path: 'parts-list', component: PartsListComponent },
  { path: 'clients-list', component: ClientsListComponent },
  { path: 'users', component: UsersComponent }
];


@NgModule({
  exports: [
    RouterModule
  ],
  imports: [RouterModule.forRoot(appRoutes, {})],
  declarations: []
})
export class AppRoutingModule { }
