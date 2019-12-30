import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ElectronService } from 'ngx-electron';
import * as settings from 'electron-settings';
import { AppSettingsModel } from '../models/app-settings-model';
import { NetworkSettings } from '../models/network-settings';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {

  //#region Variables
  private settings: typeof settings;
  private appSettings: AppSettingsModel;
  private SETTINGS = 'networkSettingsApp';

  get networkSettings(): Array<NetworkSettings> {
    if (this.appSettings === null || this.appSettings === undefined) {
      this.appSettings = this.getAppSettings();
    }
    if (this.appSettings.networkSettings === null || this.appSettings.networkSettings === undefined) {
      this.appSettings = this.getAppSettings();
    }
    return this.appSettings.networkSettings;
  }

  set networkSettings(value: Array<NetworkSettings>) {
    this.appSettings.networkSettings = value;
  }
  //#endregion

constructor(private electronService: ElectronService) {
  if (this.isRunningInElectron()) {
    this.settings = this.electronService.remote.require('electron-settings');
  }
}

// Returns true if running in production, Electron is assumed to be true when in production
private isRunningInElectron(): boolean {
  return environment.production;
}

private seedSettings(): AppSettingsModel {
  return {
    networkSettings: [{
      name: 'Rename Me!',
      interface: '',
      ipAddress: '0.0.0.0',
      subnet: '0.0.0.0',
      gateway: '0.0.0.0',
      dnsPrimary: '0.0.0.0',
      dnsSecondary: '0.0.0.0',
      active: true
    }]
  };
}

private getAppSettings(): AppSettingsModel {
  if (this.isRunningInElectron()) {
    return this.getElectronSettings();
  } else {
    return this.getWebAppSettings();
  }
}

private getElectronSettings(): AppSettingsModel {
  // Get notes from storage
  if (this.settings.has(this.SETTINGS)) {
    const SETTINGS = JSON.parse(this.settings.get(this.SETTINGS)) as AppSettingsModel;
    return SETTINGS;
  }
  return this.seedSettings();
}

private getWebAppSettings(): AppSettingsModel {
  const SETTINGS  = JSON.parse(localStorage.getItem(this.SETTINGS)) as AppSettingsModel;
  if (SETTINGS !== null && SETTINGS !== undefined) {
    return SETTINGS;
  }
  return this.seedSettings();
}

saveAppSettings(): void {
  if (this.isRunningInElectron()) {
    // Store electron notes
    this.settings.set(this.SETTINGS, JSON.stringify(this.appSettings));
  } else { // Store webapp notes
    localStorage.setItem(this.SETTINGS, JSON.stringify(this.appSettings));
  }
}

}
