import { Injectable } from '@angular/core';
import { LogEntry } from './log-entry';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityLogService {
  user: Observable<firebase.User>;
  logEntries: AngularFireList<LogEntry[]>;

  constructor(private afDb: AngularFireDatabase, private fbAuth: AngularFireAuth) { }

  getLogEntries(query: { ticketId: string }) {
    this.logEntries = this.afDb.list('/activity_log', ref => ref.equalTo(query.ticketId));
  }

  pushLogEntry(entry: LogEntry){
    this.afDb.list('/activity_log').push(entry);
  }
}
