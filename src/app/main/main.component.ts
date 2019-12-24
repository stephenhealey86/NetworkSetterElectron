import { Component, OnInit, AfterContentInit } from '@angular/core';
import { ShellService } from '../services/shell.service';
import { NetworkSettings } from '../models/network-settings';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, AfterContentInit {

  public hideScreen = false;
  interfaceAdaptersList: Array<string>;

  tabs: Array<NetworkSettings> = [
    {
      name: 'Home',
      interface: 'Wi-Fi',
      ipAddress: '192.168.1.20',
      subnet: '255.255.255.0',
      gateway: '192.168.1.1',
      active: false
    },
    {
      name: 'Home',
      interface: 'Wi-Fi',
      ipAddress: '192.168.1.20',
      subnet: '255.255.255.0',
      gateway: '192.168.1.1',
      active: false
    }
  ];

  constructor(private cmd: ShellService) { }

  ngOnInit() {
    this.tabs[0].active = true;
    this.getAllAvailableInterfaceAdapters();
  }

  // Returns true if running in production, Electron is assumed to be true when in production
  private isRunningInElectron(): boolean {
    return environment.production;
  }

  ngAfterContentInit(): void {
    this.addNewTabButton();
    this.editAlTabHeaders();
    this.lockTabContentHeight();
    setTimeout(() => {
      this.hideScreen = true;
    }, 1000);
  }

  async getAllAvailableInterfaceAdapters(): Promise<void> {
    if (this.isRunningInElectron()) {
      const RESULT = await this.cmd.runCommand('Get-NetAdapter -Name "*" -Physical | Format-List -Property "Name"');
      const ARR = RESULT.split('\n');
      const ARR_FILTERED = ARR.filter(str => str.length > 7);
      const ARR_TO_RETURN = ARR_FILTERED.map((arr) => {
          return arr.substring(7, arr.length - 1);
        });
      this.interfaceAdaptersList = ARR_TO_RETURN;
    } else {
      this.interfaceAdaptersList = ['Wi-Fi', 'Ethernet'];
    }
}

  lockTabContentHeight(): void {
    setTimeout(() => {
      const DIV = document.getElementsByClassName('tab-content')[0] as HTMLDivElement;
      const HEIGHT = DIV.clientHeight;
      DIV.style.height = `${HEIGHT}px`;
    }, 20);
  }

  addNewTabButton(): void {
    const UL_ELEMENT = document.getElementsByTagName('ul')[0];
    const BTN_ELEMENT = document.createElement('button');
    BTN_ELEMENT.onclick = () => this.addNewTab();
    BTN_ELEMENT.classList.add('btn-tab');
    BTN_ELEMENT.innerHTML = `<i class="fas fa-plus"></i>`;
    UL_ELEMENT.appendChild(BTN_ELEMENT);
  }

  editAlTabHeaders(): void {
    setTimeout(() => {
      const SPANS = document.getElementsByClassName('bs-remove-tab');
      const ARR = Array.prototype.slice.call(SPANS) as Array<HTMLSpanElement>;
      ARR.forEach(span => {
      span.innerHTML = `<button class="btn-tab"><i class="fas fa-times"></i></button>`;
    });
    }, 20);
  }

  addNewTab(): void {
    if (this.tabs.length >= 10) {
      return;
    }
    this.tabs.forEach(tab => {
      tab.active = false;
    });
    this.tabs.push({
      name: 'Rename Me!',
      interface: '',
      ipAddress: '0.0.0.0',
      subnet: '0.0.0.0',
      gateway: '0.0.0.0',
      active: true
    });
    this.editAlTabHeaders();
  }

  removeTabHandler(tab: any): void {
    this.tabs.splice(this.tabs.indexOf(tab), 1);
    if (this.tabs.length === 0) {
      this.addNewTab();
    }
  }

  setStatic(): void {
    const SETTINGS = this.tabs.find((tab) => tab.active === true);
    // tslint:disable-next-line:max-line-length
    this.cmd.runCommand(`netsh interface ipv4 set address name="${SETTINGS.interface}" static ${SETTINGS.ipAddress} ${SETTINGS.subnet} ${SETTINGS.gateway}`);
  }

  setDHCP(): void {
    const SETTINGS = this.tabs.find((tab) => tab.active === true);
    // tslint:disable-next-line:max-line-length
    this.cmd.runCommand(`netsh interface ipv4 set address name="${SETTINGS.interface}" dhcp`);
  }

}
