import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.css']
})
export class TitleBarComponent implements OnInit {

  //#region Variables
  // Emits windowIsMaximized
  @Output() windowState = new EventEmitter();
  // True is window is maximized
  windowIsMaximised = false;
  // Electron window
  window = {} as Electron.BrowserWindow;
  //#endregion

  constructor(private electronService: ElectronService) { }

  ngOnInit() {
    if (environment.production) {
      // Get electron window if running in electron
      this.window = this.electronService.remote.getCurrentWindow();
    }
  }

  // Emits windowIsMaximised value
  emitWindowState(): void {
    this.windowState.emit(this.windowIsMaximised);
  }

  closeWindow(): void {
    if (environment.production) {
      // Close window after animation
      setTimeout(() => this.window.close(), 1000);
    } else {
      console.log('Close window.');
    }
  }

  // Minimize the window
  minWindow(): void {
    if (environment.production) {
      this.window.minimize();
    } else {
      console.log('Minimize window.');
    }
  }
}
