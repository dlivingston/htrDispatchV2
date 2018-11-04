export class LogEntry {
    $key: string;
    ticketID: string;
    techID: string;
    techName: string;
    clockedIn: boolean;
    clockInTime: string;
    clockOutTime: string;
    activityType: string;
    overtime: boolean;
    totalTime: string;

    constructor() {}
}
