import { Component, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import type {
  IntuneMAMAppConfig,
  IntuneMAMGroupName,
  IntuneMAMPolicy,
  IntuneMAMUser,
  IntuneMAMVersionInfo,
} from "@ionic-enterprise/intune/cordova/definitions";

import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tokenInfo: any = null;
  user$: BehaviorSubject<IntuneMAMUser | null> = new BehaviorSubject(null);
  version: IntuneMAMVersionInfo | null = null;
  groupName: IntuneMAMGroupName | null = null;
  appConfig: IntuneMAMAppConfig | null = null;
  policy: IntuneMAMPolicy | null = null;

  constructor(private router: Router, private platform: Platform) {
    platform.ready().then(() => {
      this.getInitialData();
    });
  }

  ngOnInit() {
    const IntuneMAM = window.IntuneMAM;

    this.user$.subscribe(async user => {
      console.log('User changed', user);
      if (user?.upn) {
        this.appConfig = await IntuneMAM.appConfig(user);
        this.groupName = await IntuneMAM.groupName(user);
        this.policy = await IntuneMAM.getPolicy(user);

        await this.getToken();
      }
    });
  }

  async getInitialData() {
    const IntuneMAM = window.IntuneMAM;

    this.version = await IntuneMAM.sdkVersion();

    this.user$.next(await IntuneMAM.enrolledAccount());
  }

  async showConsole() {
    await window.IntuneMAM.displayDiagnosticConsole();
  }

  async getToken() {
    if (this.user$.value?.upn) {
      try {
        const tokenInfo = await window.IntuneMAM.acquireTokenSilent({
          scopes: ["https://graph.microsoft.com/.default"],
          ...this.user$.value,
        });
        this.tokenInfo = tokenInfo;
        console.log("Got token info", tokenInfo);
      } catch {
        console.error(
          "Unable to silently acquire token, getting interactive"
        );
        const tokenInfo = await window.IntuneMAM.acquireToken({
          scopes: ["https://graph.microsoft.com/.default"],
        });
        this.tokenInfo = tokenInfo;
      }
    }
  }

  async logout() {
    if (this.user$.value) {
      await window.IntuneMAM.deRegisterAndUnenrollAccount(this.user$.value);
    }
    this.router.navigate(['/']);
  }

  getTokenInfoJson() {
    return JSON.stringify((this.tokenInfo || {}), null, 2);
  }

  getPolicyJson() {
    return JSON.stringify((this.policy || {}), null, 2);
  }

  getAppConfigJson() {
    return JSON.stringify((this.appConfig || {}), null, 2);
  }
}
