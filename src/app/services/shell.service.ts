import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ElectronService } from 'ngx-electron';
import { delay } from 'q';

@Injectable({
  providedIn: 'root'
})
export class ShellService {

//#region Variables
private ps: any;
private output: string;
//#endregion

constructor(private electronService: ElectronService) {
  if (this.isRunningInElectron()) {
    this.ps = this.electronService.remote.getGlobal('ps');
  }
}

// Returns true if running in production, Electron is assumed to be true when in production
private isRunningInElectron(): boolean {
  return environment.production;
}

async getLastCommandOutput(): Promise<string> {
  const TIME_OUT_ID = setTimeout(() => { this.output = 'Timeout'; }, 5000);
  while (this.output === null || this.output === undefined) {
    // Do nothing
    await delay(100);
  }
  clearTimeout(TIME_OUT_ID);
  const VALUE_TO_RETURN = this.output;
  this.output = null;
  return VALUE_TO_RETURN;
}

async runCommand(command: string): Promise<string> {
  if (this.isRunningInElectron()) {
    this.ps.addCommand(command);
    this.ps.invoke()
    .then(output => {
      this.output = output;
      console.log(output);
    })
    .catch(err => {
      this.output = err;
      console.log(err);
    });
  } else {
    this.output = `In development mode: "${command}" was not executed.`;
    console.log(this.output);
  }

  return await this.getLastCommandOutput();
}

async checkIfAdmin(): Promise<boolean> {
  let returnValue = null;
  if (this.isRunningInElectron()) {
    this.ps.addCommand('NET SESSION');
    this.ps.invoke()
    .then(output => {
      returnValue = true;
    })
    .catch(err => {
      console.log('Not Admin');
      returnValue = false;
    });
    while (returnValue === null) {
      // Do nothing
      await delay(500);
      console.log(`Return value: ${returnValue}`);
    }
    return returnValue;
  } else {
    return true;
  }
}

}
