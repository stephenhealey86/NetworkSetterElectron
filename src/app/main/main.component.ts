import { Component, OnInit, AfterContentInit } from '@angular/core';
import { ShellService } from '../services/shell.service';
import { NetworkSettings } from '../models/network-settings';
import { environment } from 'src/environments/environment';
import { AppSettingsService } from '../Services/app-settings.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, AfterContentInit {

  public hideScreen = false;
  interfaceAdaptersList: Array<string>;
  formInterfaceDropDownTouched = false;

  get tabs(): Array<NetworkSettings> {
    return this.settings.networkSettings;
  }

  set tabs(value: Array<NetworkSettings>) {
    this.settings.networkSettings = value;
  }

  constructor(private cmd: ShellService, private settings: AppSettingsService) { }

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
      DIV.style.height = `${HEIGHT + 5}px`;
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

  highlightFirstSectionOfIpAddress(event: FocusEvent): void {
    const TEXT_INPUT = event.srcElement as HTMLInputElement;
    TEXT_INPUT.selectionStart = 0;
    for (let i = 0; i < TEXT_INPUT.value.length; i++) {
      if (TEXT_INPUT.value[i] === '.') {
            TEXT_INPUT.selectionEnd = i;
            break;
        }
    }
  }

  onIpTextChanged(event: KeyboardEvent): void {
    if (isFinite(parseInt(event.key, 10))) {
      const TEXT_INPUT = event.srcElement as HTMLInputElement;
      const CURSOR_START = TEXT_INPUT.selectionStart;
      const TEXT = TEXT_INPUT.value;
      // If section is three digits long select next section
      if (CURSOR_START >= 3 && CURSOR_START < TEXT.length) {
          if (TEXT[CURSOR_START] === '.' && TEXT[CURSOR_START - 1] !== '.' && TEXT[CURSOR_START - 2]
              !== '.' && TEXT[CURSOR_START - 3] !== '.') {
              this.getNextSectionOfIpAddress(TEXT_INPUT);
          }
      }
    }
  }

  onIpKeyDown(event: KeyboardEvent): void {
    const TEXT_INPUT = event.srcElement as HTMLInputElement;
    const CURSOR_START = TEXT_INPUT.selectionStart;
    const TEXT = TEXT_INPUT.value;
    const KEY = event.key;
    if (isFinite(parseInt(event.key, 10))) {
      if (CURSOR_START === TEXT.length) {
        /// If at end of ip address stop entry
        if (TEXT[CURSOR_START - 1] !== '.' && TEXT[CURSOR_START - 2] !== '.' && TEXT[CURSOR_START - 3] !== '.') {
          event.returnValue = false;
        }
      }
      return;
    } else if (KEY === '.') {
        this.getNextSectionOfIpAddress(TEXT_INPUT);
        event.returnValue = false;
        return;
    } else if (KEY === 'Delete' || KEY === 'Backspace') {
        /// Delete selction if not containing deicmal
        if (TEXT_INPUT.selectionEnd - CURSOR_START >= 1) {
          for (let i = CURSOR_START; i < TEXT_INPUT.selectionEnd; i++) {
            if (TEXT[i] === '.') {
              event.returnValue = false;
              break;
            }
          }
          return;
        }
        // Delete single if not decimal
        const BACK_SELECTION = CURSOR_START === 0 ? CURSOR_START : CURSOR_START - 1;
        if (TEXT[BACK_SELECTION] === '.' && KEY === 'Backspace') {
          event.returnValue = false;
        } else if (TEXT.length !== CURSOR_START && TEXT[CURSOR_START] === '.' && KEY === 'Delete') {
          event.returnValue = false;
        }
        return;
    } else if (KEY === 'ArrowLeft' || KEY === 'ArrowRight') {
        return;
    } else if (KEY === 'Tab' || KEY === 'Enter') {
        return;
    }

    event.returnValue = false;
}

  private getNextSectionOfIpAddress(textInput: HTMLInputElement): void {
    const CURSOR_START = textInput.selectionStart;
    const TEXT = textInput.value;
    let firstDecimal = false;
    for (let i = CURSOR_START; i < TEXT.length; i++) {
        if (TEXT[i] === '.' && !firstDecimal) {
          textInput.selectionStart = i + 1;
          textInput.selectionEnd = TEXT.length;
          firstDecimal = true;
          continue;
        }
        if (TEXT[i] === '.' && firstDecimal) {
          textInput.selectionEnd = i;
          break;
        }
    }
}

onNameTextFocus(event: FocusEvent): void {
  const TEXT_INPUT = event.srcElement as HTMLInputElement;
  if (TEXT_INPUT.value === 'Rename Me!') {
    TEXT_INPUT.selectionStart = 0;
    TEXT_INPUT.selectionEnd = TEXT_INPUT.value.length;
  }
}

onFormInterfaceDropDownClick(): void {
 this.formInterfaceDropDownTouched = true;
}

onSelectInterface(selectedInterface: string): void {
  const TAB = this.tabs.find((tab) => tab.active === true);
  TAB.interface = selectedInterface;
}

}
