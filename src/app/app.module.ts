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

@NgModule({
   declarations: [
      AppComponent,
      MainComponent,
      TitleBarComponent
   ],
   imports: [
      TabsModule.forRoot(),
      BrowserModule,
      AppRoutingModule,
      FormsModule,
      TooltipModule.forRoot()
   ],
   providers: [
      ElectronService,
      ShellService,
      AppSettingsService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
