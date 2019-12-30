import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notificationMessage: string = 'Test Notification Service';

constructor() { }

setNotification(message: string): void {
  this.notificationMessage = message;
  setTimeout(() => {
    this.notificationMessage = null;
  }, 3000);
}

clearNotification(): void {
  this.notificationMessage = null;
}

}
