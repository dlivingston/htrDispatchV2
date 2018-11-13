import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AngularFireDatabase, AngularFireAction, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { LogEntry } from '../log-entry';
import { ActivityLogService } from '../activity-log.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-time-tracker',
  templateUrl: './time-tracker.component.html',
  styleUrls: ['./time-tracker.component.scss']
})
export class TimeTrackerComponent implements OnInit {
  ticketID: string;
  techID: string;
  techName: string;
  ttActivity: string;
  overtime: boolean;
  formNotValid: boolean;
  techClockedIn: boolean;
  clockedInMessage: string;
  clockInTime: string;
  clockedInOther: boolean;
  clockedInActivity: string;
  clockedInLogKey: string;
  activityRef: AngularFireList<any>;
  ticketActivity: Observable<any[]>;
  userRef: AngularFireObject<any>
  activityLogs: any[];
  constructor(public modalRef: BsModalRef, public af: AngularFireDatabase, public activityLogSvc: ActivityLogService) {  }

  ngOnInit() {
    this.userRef = this.af.object('/users/' + this.techID);
    this.userRef.snapshotChanges().subscribe(user => {
      if (user.payload.val().clockedIn && user.payload.val().clockedInTicket != this.ticketID) {
        this.techClockedIn = true;
        this.clockedInOther = true;
        this.clockedInMessage = `User ${user.payload.val().name} is clocked in on ticket ${user.payload.val().clockedInTicket}`;
      } else {
        this.activityRef = this.af.list('/activity_log', ref => ref.orderByChild('ticketID').equalTo(this.ticketID));
        this.ticketActivity = this.activityRef.snapshotChanges();
        this.ticketActivity
          .subscribe(logs => {
            for (var entry in logs) {
              if (logs[entry].payload.val().techID === this.techID && logs[entry].payload.val().clockedIn === true) {
                let ot: string;
                this.techClockedIn = true;
                this.clockedInLogKey = logs[entry].key;
                this.clockInTime = new Date(logs[entry].payload.val().clockInTime).toLocaleString();
                this.clockedInActivity = logs[entry].payload.val().activityType;
                if (logs[entry].payload.val().overtime === true) {
                  ot = '(OT)';
                } else {
                  ot = '';
                }
                this.clockedInMessage = `
                  Current User: ${this.techName} <br>
                  Activity: ${this.clockedInActivity} ${ot} <br>
                  Clocked In Since: ${this.clockInTime}
                `;
              }
            }
          });
      }
    });
  }

  ttClockIn(ttForm: NgForm){
    if (ttForm.value.ttActivity) {
      let now = new Date();
      let logEntry = new LogEntry();
      logEntry.ticketID = this.ticketID;
      logEntry.techID = this.techID;
      logEntry.techName = this.techName;
      logEntry.clockedIn = true;
      logEntry.clockInTime = now.toUTCString();
      logEntry.clockOutTime = null;
      logEntry.activityType = ttForm.value.ttActivity;
      ttForm.value.overtime ? logEntry.overtime = ttForm.value.overtime : logEntry.overtime = false;
      this.activityLogSvc.pushLogEntry(logEntry);
      this.userRef = this.af.object('/users/' + this.techID);
      this.userRef.update({ clockedIn: true, clockedInTicket: this.ticketID });
      this.modalRef.hide();
    } else {
      this.formNotValid = true;
    }
  }

  ttClockOut() {
    let now = new Date().toUTCString();
    let clockOut = new Date(now).getTime();
    let clockIn = new Date(this.clockInTime).getTime();
    let elapsed = clockOut - clockIn;
    const currentLog = this.af.object('/activity_log/' + this.clockedInLogKey);
    currentLog.update({ clockOutTime: now });
    currentLog.update({ clockedIn: false });
    currentLog.update({ totalTime: elapsed});
    this.userRef = this.af.object('/users/' + this.techID);
    this.userRef.update({ clockedIn: false, clockedInTicket: '' });
    this.modalRef.hide();
  }

}
