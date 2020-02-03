/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MainComponent } from './main.component';
import { ElectronService } from 'ngx-electron';
import { ShellService } from '../services/shell.service';
import { AppSettingsService } from '../Services/app-settings.service';
import { NotificationService } from '../services/notification.service';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainComponent
      ],
      imports: [
        TabsModule.forRoot(),
        BrowserModule,
        FormsModule,
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
        BrowserAnimationsModule
     ],
     providers: [
       ElectronService,
       ShellService,
       AppSettingsService,
       NotificationService
    ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
      (fixture.nativeElement as HTMLElement).remove();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
