import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class ShellService {

//#region Variables
ps: any;
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

runCommand(command: string): void {
  if (this.isRunningInElectron()) {
    this.ps.addCommand(command);
    this.ps.invoke()
    .then(output => {
      console.log(output);
    })
    .catch(err => {
      console.log(err);
    });
  } else {
    console.log(`In development mode: "${command}" was not executed.`);
  }
}

}
