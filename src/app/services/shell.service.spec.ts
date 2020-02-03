/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ShellService } from './shell.service';
import { ElectronService } from 'ngx-electron';

describe('Service: Shell', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ElectronService,
        ShellService
      ]
    });
  });

  it('should ...', inject([ShellService], (service: ShellService) => {
    expect(service).toBeTruthy();
  }));
});
