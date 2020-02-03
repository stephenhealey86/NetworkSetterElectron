import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { ShellService } from './services/shell.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TitleBarComponent } from './title-bar/title-bar.component';
import { AppSettingsService } from './Services/app-settings.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NotificationBarComponent } from './notification-bar/notification-bar.component';
import { NotificationService } from './services/notification.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TabsModule.forRoot(),
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        MainComponent,
        TitleBarComponent,
        NotificationBarComponent
      ],
      providers: [
        ElectronService,
        ShellService,
        AppSettingsService,
        NotificationService
     ],
    }).compileComponents();
  }));

  afterEach(() => {
    const fixture = TestBed.createComponent(AppComponent);
    if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
      (fixture.nativeElement as HTMLElement).remove();
    }
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'NetworkSetter'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('NetworkSetter');
  });
});
