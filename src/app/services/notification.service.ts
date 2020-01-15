import { Injectable } from '@angular/core';
import { NotificationEnum } from '../models/notificationEnum.enum';
import { delay } from 'q';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notificationMessage: string;
  private notificationList = [] as Array<string>;
  private setTimeoutId: any;
  private notificationStillVisible = false;
  private userHasAcknowledgeNotification = false;

constructor() { }

async setNotification(notificationLevel: NotificationEnum, message: string): Promise<void> {
  const NEXT_MESSAGE = `${NotificationEnum[notificationLevel]} - ${message}`;
  if (this.notificationList.indexOf(NEXT_MESSAGE) === -1) {
    this.notificationList.push(NEXT_MESSAGE);
    if (this.notificationMessage) {
      this.clearNotification();
    }
    while (this.notificationList.length > 0) {
      await delay(100);
      if (!this.notificationMessage) {
        this.notificationMessage = this.notificationList[0];
        this.notificationStillVisible = true;
        this.setTimeoutId = setTimeout(() => {
          this.clearNotification();
        }, 6000);
      }
    }
  }
}

clearNotification(): void {
  if (!this.userHasAcknowledgeNotification) {
    this.userHasAcknowledgeNotification = true;
    clearTimeout(this.setTimeoutId);
    this.setTimeoutId = null;

    const ELEMENT = document.getElementById('notificationDiv') as HTMLDivElement;
    if (ELEMENT) {
      ELEMENT.animate([
        // keyframes
        { transform: 'translateY(0)' },
        { transform: 'translateY(150px)' }
      ], {
        // timing options
        duration: 2000
      });
    }

    setTimeout(() => {
      this.notificationMessage = null;
      this.notificationList.splice(0, 1);
      this.userHasAcknowledgeNotification = false;
    }, 1800);
  }
}

}
