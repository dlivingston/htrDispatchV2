import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {
  tickets: Observable<any[]>;
  techs: Observable<any[]>;
  currentUser: AngularFireObject<any>;
  currentUserId: string;
  currentUserName: string;
  currentUserIsTech: boolean;
  idSubject: Subject<any>;
  clientNameSubject: Subject<any>;
  prioritySubject: Subject<any>;
  sortAscending: boolean;
  viewFilter: boolean;
  viewOptions: boolean;
  fullListView: boolean;
  listView: string;
  selectedOption: any;
  newestTicket: Observable<any[]>;
  newestTicketId: string;
  firstTicket: Observable<any[]>;
  firstTicketId: string;
  currentPageStart: string;
  nextPageStart: string;
  prevPageStart: string;
  prevBtnActive: boolean;
  nextBtnActive: boolean;
  orderByOptions: any[] = [
    { value: 'id', label: 'Ticket ID' },
    { value: 'client_name', label: 'Client Name' },
    { value: 'client_loc_id', label: 'Location' },
    { value: 'assigned_tech', label: 'Assigned Tech' },
    { value: 'priority', label: 'Priority' },
    { value: 'sched_srvc_date', label: 'Sched. Service' }
  ];
  statusFilterOptions: any[];
  priorityFilterOptions: any[];
  assignedTechFilterOptions: any[];
  listLimit: number;

  constructor(public authService: AuthService, public af: AngularFireDatabase, private router: Router) { 
    this.idSubject = new Subject();
    this.clientNameSubject = new Subject();
    this.prioritySubject = new Subject();
    this.statusFilterOptions = [];
    this.priorityFilterOptions = [];
    this.assignedTechFilterOptions = [];
    this.selectedOption = this.orderByOptions[0];
    this.nextPageStart = '';
    this.prevPageStart = '';
    this.prevBtnActive = false;
    this.nextBtnActive = true;
    this.fullListView = false;
    this.listLimit = 50;
    this.authService.user.subscribe(auth_user => {
      if (auth_user) {
        this.currentUserId = auth_user.uid;
        this.currentUser = this.af.object('/users/' + auth_user.uid);
        let tech = this.af.object('/techs/' + auth_user.uid);
        tech.snapshotChanges().subscribe(snapshot => {
          if (snapshot.key) {
            this.currentUserIsTech = true;
          } else {
            this.currentUserIsTech = false;
          }
          this.currentUser.snapshotChanges().subscribe(current_user => {
            this.currentUserName = current_user.payload.val().name;

            if (current_user.payload.val().selectedListView) {
              this.listView = current_user.payload.val().selectedListView;
              this.toggleListView(current_user.payload.val().selectedListView);
            } else {
              if (this.currentUserIsTech) {
                // this.listView = 'assigned';
                this.toggleListView('assigned');
              } else {
                // this.listView = 'paged';
                this.toggleListView('paged');
              }
            }
            if (current_user.payload.val().statusFilterOptions) {
              this.statusFilterOptions = current_user.payload.val().statusFilterOptions;
            } else {
              this.statusFilterOptions = ['All'];
            }
            if (current_user.payload.val().priorityFilterOptions) {
              this.priorityFilterOptions = current_user.payload.val().priorityFilterOptions;
            } else {
              this.priorityFilterOptions = ['All'];
            }
            if (current_user.payload.val().assignedTechFilterOptions) {
              this.assignedTechFilterOptions = current_user.payload.val().assignedTechFilterOptions;
            } else {
              this.assignedTechFilterOptions = ['All'];
            }
            if (current_user.payload.val().selectedOrder) {
              this.selectedOption = current_user.payload.val().selectedOrder;
            } else {
              this.selectedOption = this.orderByOptions[0];
            }
            if (current_user.payload.val().sortAscending) {
              this.sortAscending = current_user.payload.val().sortAscending;
            } else {
              this.sortAscending = false;
            }
          });
        });


      }
    });
    this.newestTicket = af.list('/tickets', ref => ref.orderByChild('id').limitToLast(1)).valueChanges();
    this.newestTicket.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        this.newestTicketId = snapshot.id;
        const currentPageNum = ('0000000' + (this.parseTicketNum(this.newestTicketId) - (this.listLimit - 1)).toString()).slice(-7);
        this.currentPageStart = ['HTR-', currentPageNum.slice(0, 3), '-', currentPageNum.slice(3)].join('');
        const nextPageNum = ('0000000' + (this.parseTicketNum(this.currentPageStart) - this.listLimit).toString()).slice(-7);
        this.nextPageStart = ['HTR-', nextPageNum.slice(0, 3), '-', nextPageNum.slice(3)].join('');
        const prevPageNum = ('0000000' + (this.parseTicketNum(this.currentPageStart) + this.listLimit).toString()).slice(-7);
        this.prevPageStart = ['HTR-', prevPageNum.slice(0, 3), '-', prevPageNum.slice(3)].join('');
      });
    });
    this.firstTicket = af.list('/tickets', ref => ref.orderByChild('id').limitToFirst(1)).valueChanges();
    
    this.firstTicket.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        this.firstTicketId = snapshot.id;
      });
    });
    this.techs = af.list('/techs').snapshotChanges();
    this.viewFilter = false;
    this.viewOptions = false;
  }

  orderBy(option: { value: string, label: string }) {
    this.selectedOption = option;
    this.currentUser.update({ selectedOrder: this.selectedOption });

  }

  setStatusView(view) {
    if (view === 'active') {
      this.statusFilterOptions = ['Assigned', 'Hold', 'Unassigned'];
      this.currentUser.update({ statusFilterOptions: this.statusFilterOptions });
    }
    if (view === 'inactive') {
      this.statusFilterOptions = ['Closed'];
      this.currentUser.update({ statusFilterOptions: this.statusFilterOptions });
    }
    if (view === 'archived') {
      this.statusFilterOptions = ['Invoiced'];
      this.currentUser.update({ statusFilterOptions: this.statusFilterOptions });
    }
  }

  toggleListView(listView) {
    this.listView = listView;
    if (listView === 'assigned') {
      this.currentUser.update({ selectedListView: this.listView });
      this.tickets = this.af.list('/tickets', ref => ref.orderByChild('assigned_tech').equalTo(this.currentUserId)).valueChanges();
    }
    if (listView === 'paged') {
      this.currentUser.update({ selectedListView: this.listView });
      this.tickets = this.af.list('/tickets', ref => ref.orderByChild('id').limitToLast(this.listLimit)).valueChanges();
    }
    if (listView === 'full') {
      this.currentUser.update({ selectedListView: this.listView });
      this.tickets = this.af.list('/tickets', ref => ref.orderByChild('id')).valueChanges();
    }
  }

  toggleAscending() {
    this.sortAscending ? this.sortAscending = false : this.sortAscending = true;
    this.currentUser.update({ sortAscending: this.sortAscending });
  }

  toggleFilterPanel() {
    this.viewFilter ? this.viewFilter = false : this.viewFilter = true;
  }

  toggleOptionsPanel() {
    this.viewOptions ? this.viewOptions = false : this.viewOptions = true;
  }

  toggleStatusFilterOptions(status: string) {
    if (status === 'All') {
      this.statusFilterOptions = ['All'];
      this.currentUser.update({ statusFilterOptions: this.statusFilterOptions });
      return null;
    }
    if (this.statusFilterOptions.indexOf(status) === -1) {
      if (this.statusFilterOptions.indexOf('All') === 0) {
        this.statusFilterOptions = [];
      }
      this.statusFilterOptions.push(status);
      this.currentUser.update({ statusFilterOptions: this.statusFilterOptions });

    } else {
      this.statusFilterOptions.splice(this.statusFilterOptions.indexOf(status), 1);
      this.currentUser.update({ statusFilterOptions: this.statusFilterOptions });
    }
  }

  togglePriorityFilterOptions(priority: string) {
    if (priority === 'All') {
      this.priorityFilterOptions = ['All'];
      this.currentUser.update({ priorityFilterOptions: this.priorityFilterOptions });
      return null;
    }
    if (this.priorityFilterOptions.indexOf(priority) === -1) {
      if (this.priorityFilterOptions.indexOf('All') === 0) {
        this.priorityFilterOptions = [];
      }
      this.priorityFilterOptions.push(priority);
      this.currentUser.update({ priorityFilterOptions: this.priorityFilterOptions });

    } else {
      this.priorityFilterOptions.splice(this.priorityFilterOptions.indexOf(priority), 1);
      this.currentUser.update({ priorityFilterOptions: this.priorityFilterOptions });

    }
  }

  toggleAssignedTechFilterOptions(tech: string) {
    if (tech === 'All') {
      this.assignedTechFilterOptions = ['All'];
      this.currentUser.update({ assignedTechFilterOptions: this.assignedTechFilterOptions });
      return null;
    }
    if (this.assignedTechFilterOptions.indexOf(tech) === -1) {
      if (this.assignedTechFilterOptions.indexOf('All') === 0) {
        this.assignedTechFilterOptions = [];
      }
      this.assignedTechFilterOptions.push(tech);
      this.currentUser.update({ assignedTechFilterOptions: this.assignedTechFilterOptions });
    } else {
      this.assignedTechFilterOptions.splice(this.assignedTechFilterOptions.indexOf(tech), 1);
      this.currentUser.update({ assignedTechFilterOptions: this.assignedTechFilterOptions });
    }
  }

  toggleListLimit(num: number) {
    this.listLimit = num;
    const currentPageNum = ('0000000' + (this.parseTicketNum(this.newestTicketId) - (this.listLimit - 1)).toString()).slice(-7);
    this.currentPageStart = ['HTR-', currentPageNum.slice(0, 3), '-', currentPageNum.slice(3)].join('');
    const nextPageNum = ('0000000' + (this.parseTicketNum(this.currentPageStart) - this.listLimit).toString()).slice(-7);
    this.nextPageStart = ['HTR-', nextPageNum.slice(0, 3), '-', nextPageNum.slice(3)].join('');
    const prevPageNum = ('0000000' + (this.parseTicketNum(this.currentPageStart) + this.listLimit).toString()).slice(-7);
    this.prevPageStart = ['HTR-', prevPageNum.slice(0, 3), '-', prevPageNum.slice(3)].join('');
    this.tickets = this.af.list('/tickets', ref => ref.orderByChild('id').limitToLast(this.listLimit)).valueChanges();
    this.prevBtnActive = false;
    this.nextBtnActive = true;
  }

  nextPage() {
    const nextEndNum = ('0000000' + (this.parseTicketNum(this.prevPageStart) - (this.listLimit + 1)).toString()).slice(-7);
    const nextPageEnd = ['HTR-', nextEndNum.slice(0, 3), '-', nextEndNum.slice(3)].join('');
    this.tickets = this.af.list('/tickets', ref => ref.orderByChild('id').startAt(this.nextPageStart).endAt(nextPageEnd)).valueChanges();
    this.prevBtnActive = true;
    if (this.parseTicketNum(this.nextPageStart) > this.parseTicketNum(this.firstTicketId)) {
      this.prevPageStart = this.currentPageStart;
      this.currentPageStart = this.nextPageStart;
      if ((this.parseTicketNum(this.currentPageStart) - this.listLimit) >= this.parseTicketNum(this.firstTicketId)) {
        const nextStartNum = ('0000000' + (this.parseTicketNum(this.currentPageStart) - this.listLimit).toString()).slice(-7);
        this.nextPageStart = ['HTR-', nextStartNum.slice(0, 3), '-', nextStartNum.slice(3)].join('');
      } else {
        this.nextPageStart = this.firstTicketId;
      }
    } else {
      this.nextBtnActive = false;
    }
  }

  prevPage() {
    const prevEndNum = ('0000000' + (this.parseTicketNum(this.prevPageStart) + (this.listLimit - 1)).toString()).slice(-7);
    const prevPageEnd = ['HTR-', prevEndNum.slice(0, 3), '-', prevEndNum.slice(3)].join('');
    this.tickets = this.af.list('/tickets', ref => ref.orderByChild('id').startAt(this.prevPageStart).endAt(prevPageEnd)).valueChanges();
    this.nextBtnActive = true;
    this.nextPageStart = this.currentPageStart;
    this.currentPageStart = this.prevPageStart;
    const prevStartNum = ('0000000' + (this.parseTicketNum(this.currentPageStart) + this.listLimit).toString()).slice(-7);
    this.prevPageStart = ['HTR-', prevStartNum.slice(0, 3), '-', prevStartNum.slice(3)].join('');
    if (this.parseTicketNum(this.prevPageStart) >= this.parseTicketNum(this.newestTicketId)) {
      this.prevBtnActive = false;
    }
  }
  parseTicketNum(id: string) {
    return parseInt(id.slice(4).replace(/-/g, ''), 10);
  }

  ngOnInit() {
  }

}
