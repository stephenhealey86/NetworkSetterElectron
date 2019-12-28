import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { environment } from 'src/environments/environment';
import { AppSettingsService } from '../Services/app-settings.service';

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

  constructor(private electronService: ElectronService, private settnigs: AppSettingsService) { }

  ngOnInit() {
    if (environment.production) {
      // Get electron window if running in electron
      this.window = this.electronService.remote.getCurrentWindow();
    }
  }

  // Returns true if running in production, Electron is assumed to be true when in production
  private isRunningInElectron(): boolean {
    return environment.production;
  }

  // Emits windowIsMaximised value
  emitWindowState(): void {
    this.windowState.emit(this.windowIsMaximised);
  }

  closeWindow(): void {
    this.settnigs.saveAppSettings();
    if (this.isRunningInElectron()) {
      this.window.close();
    } else {
      console.log('Close window.');
    }
  }

  // Minimize the window
  minWindow(): void {
    if (this.isRunningInElectron()) {
      const ELEMENT = document.activeElement as HTMLElement;
      if (ELEMENT) {
        console.log(ELEMENT);
        ELEMENT.classList.add('removeHover');
        ELEMENT.onmouseleave = () => {
          ELEMENT.classList.remove('removeHover');
        };
      }
      this.window.minimize();
    } else {
      console.log('Minimize window.');
    }
  }
}
