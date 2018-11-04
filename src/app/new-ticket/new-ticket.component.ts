import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
// import { TicketService } from '../ticket.service';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Subject, Observable } from 'rxjs';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
@Component({
  selector: 'app-new-ticket',
  templateUrl: './new-ticket.component.html',
  styleUrls: ['./new-ticket.component.scss']
})
export class NewTicketComponent implements OnInit {
  tickets: Observable<any[]>;
  private techs: Observable<any[]>;
  private currentUser: AngularFireObject<any>;
  newTicketId: string;
  lastTicketId: string;
  formNotValid: boolean;
  private partsOrder: boolean;
  private ticketPriority: string;
  private ticketStatus: string;
  private ticketAssignedName: string;
  private ticketAssignedId: string;
  private partsOrderedBy: string;
  colorTheme = 'theme-default';
  bsConfig: Partial<BsDatepickerConfig>;
  userId: string;

  constructor(public authService: AuthService, public af: AngularFireDatabase, private router: Router) {
    this.techs = af.list('/techs').snapshotChanges();
    this.tickets = af.list('/tickets', ref => ref.orderByChild('id').limitToLast(1)).valueChanges();
    this.tickets.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        this.lastTicketId = snapshot.id;
        var lastTicketSlice = this.lastTicketId.slice(4).replace(/-/g, "");
        var newTicketNum = ("0000000" + ((+lastTicketSlice) + 1)).slice(-7);
        this.newTicketId = ['HTR-', newTicketNum.slice(0, 3), '-', newTicketNum.slice(3)].join('');
      });
    });
    this.authService.user.subscribe(user => {
      if (user) {
        this.currentUser = this.af.object('/users/' + user.uid);
        this.userId = user.uid;
      }
    });
    this.partsOrder = false;
    this.ticketPriority = '4';
    this.ticketStatus = 'Unassigned';
    this.partsOrderedBy = '';
    this.formNotValid = false;
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  createTicket(f: NgForm) {
    if (f.value.client_name && this.ticketAssignedName && this.ticketAssignedId) {
      var newID = this.newTicketId;
      let newTicket = this.af.object('/tickets/' + newID);
      var now = new Date();
      newTicket.set({ id: newID });
      newTicket.update({ date_created: now });
      newTicket.update({ last_updated: now });
      if (f.value.address_city) { newTicket.update({ address_city: f.value.address_city }); } else { newTicket.update({ address_city: "" }); }
      if (f.value.address_ln1) { newTicket.update({ address_ln1: f.value.address_ln1 }); } else { newTicket.update({ address_ln1: "" }); }
      if (f.value.address_ln2) { newTicket.update({ address_ln2: f.value.address_ln2 }); } else { newTicket.update({ address_ln2: "" }); }
      if (f.value.address_state) { newTicket.update({ address_state: f.value.address_state }); } else { newTicket.update({ address_state: "" }); }
      if (f.value.address_zip) { newTicket.update({ address_zip: f.value.address_zip }); } else { newTicket.update({ address_zip: "" }); }
      if (f.value.alt_contact_email) { newTicket.update({ alt_contact_email: f.value.alt_contact_email }); } else { newTicket.update({ alt_contact_email: "" }); }
      if (f.value.alt_contact_name) { newTicket.update({ alt_contact_name: f.value.alt_contact_name }); } else { newTicket.update({ alt_contact_name: "" }); }
      if (f.value.alt_contact_phone) { newTicket.update({ alt_contact_phone: f.value.alt_contact_phone }); } else { newTicket.update({ alt_contact_phone: "" }); }
      // if(f.value.assigned_tech) { newTicket.update({assigned_tech : f.value.assigned_tech}); } else { newTicket.update({assigned_tech : "Unassigned"}); }
      if (f.value.callback) { newTicket.update({ callback: f.value.callback }); } else { newTicket.update({ callback: false }); }
      if (f.value.client_loc_id) { newTicket.update({ client_loc_id: f.value.client_loc_id }); } else { newTicket.update({ client_loc_id: "" }); }
      if (f.value.client_name) { newTicket.update({ client_name: f.value.client_name }); }
      if (f.value.short_desc) {
        if (f.value.short_desc.length > 50) {
          var shortDesc = f.value.short_desc.slice(0, 50);
          newTicket.update({ short_desc: shortDesc });
        } else {
          newTicket.update({ short_desc: f.value.short_desc });
        }
      } else { newTicket.update({ short_desc: "" }); }
      if (f.value.desc_notes) { newTicket.update({ desc_notes: f.value.desc_notes }); } else { newTicket.update({ desc_notes: "" }); }
      if (f.value.discount_partial) { newTicket.update({ discount_partial: f.value.discount_partial }); } else { newTicket.update({ discount_partial: false }); }
      if (f.value.estPartArrDate) { newTicket.update({ estPartArrDate: f.value.estPartArrDate }); } else { newTicket.update({ estPartArrDate: "" }); }
      if (f.value.parts_ordered) { newTicket.update({ parts_ordered: f.value.parts_ordered }); } else { newTicket.update({ parts_ordered: false }); }
      // if(f.value.parts_ordered_by) { newTicket.update({parts_ordered_by : f.value.parts_ordered_by}); } else { newTicket.update({parts_ordered_by : ""}); }
      if (f.value.parts_vendor) { newTicket.update({ parts_vendor: f.value.parts_vendor }); } else { newTicket.update({ parts_vendor: "" }); }
      if (f.value.primary_contact_email) { newTicket.update({ primary_contact_email: f.value.primary_contact_email }); } else { newTicket.update({ primary_contact_email: "" }); }
      if (f.value.primary_contact_name) { newTicket.update({ primary_contact_name: f.value.primary_contact_name }); } else { newTicket.update({ primary_contact_name: "" }); }
      if (f.value.primary_contact_phone) { newTicket.update({ primary_contact_phone: f.value.primary_contact_phone }); } else { newTicket.update({ primary_contact_phone: "" }); }
      // if(f.value.priority) { newTicket.update({priority : f.value.priority}); } else { newTicket.update({priority : ""}); }
      if (f.value.sched_srvc_date) { newTicket.update({ sched_srvc_date: f.value.sched_srvc_date }); } else { newTicket.update({ sched_srvc_date: "" }); }
      // if(f.value.status) { newTicket.update({status : f.value.status}); } else { newTicket.update({status : ""}); }
      newTicket.update({ priority: this.ticketPriority });
      newTicket.update({ status: this.ticketStatus });
      newTicket.update({ assigned_tech_name: this.ticketAssignedName });
      newTicket.update({ assigned_tech: this.ticketAssignedId });
      newTicket.update({ parts_ordered_by: this.partsOrderedBy });
      newTicket.update({ created_by: this.userId });
      this.router.navigate(['/ticket-detail/' + newID]);
    } else {
      this.formNotValid = true;
    }
  }

  togglePartsOrderedPanel() {
    this.partsOrder ? this.partsOrder = false : this.partsOrder = true;
  }

  setTicketPriority(level: string) {
    this.ticketPriority = level;
  }

  setTicketStatus(status: string) {
    this.ticketStatus = status;
  }

  onAssignedTechChange(value) {
    this.ticketAssignedName = value.val().name;
    this.ticketAssignedId = value.key;
  }


  onPartsOrderedByChange(value) {
    this.partsOrderedBy = value.val().name;
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.newTicketId = '';
  }

}
