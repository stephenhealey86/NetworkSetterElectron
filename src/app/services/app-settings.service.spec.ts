/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AppSettingsService } from './app-settings.service';
import { ElectronService } from 'ngx-electron';

describe('Service: AppSettings', () => {
  let service: AppSettingsService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppSettingsService,
        ElectronService
      ]
    });
    service = TestBed.get(AppSettingsService);
  });

  it('AppSettingsService should be injected', () => {
    expect(service).toBeTruthy();
  });
});
