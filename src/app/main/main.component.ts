import { Component, OnInit, AfterContentInit } from '@angular/core';
import { ShellService } from '../services/shell.service';
import { NetworkSettings } from '../models/network-settings';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, AfterContentInit {

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
    setTimeout(() => {
      this.getAllAvailableInterfaceAdapters();
    }, 2000);
    this.tabs[0].active = true;
  }

  ngAfterContentInit(): void {
    this.addNewTabButton();
    this.editAlTabHeaders();
    this.lockTabContentHeight();
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

  getAllAvailableInterfaceAdapters(): void {
      this.cmd.runCommand('netsh interface ipv4 show interfaces');
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
