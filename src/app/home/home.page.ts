import { Component, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { IntuneMAM, IntuneMAMAppConfig, IntuneMAMGroupName, IntuneMAMPolicy, IntuneMAMUser, IntuneMAMVersionInfo } from '@ionic-enterprise/intune';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tokenInfo: any = null;
  user: IntuneMAMUser | null = null;
  version: IntuneMAMVersionInfo | null = null;
  groupName: IntuneMAMGroupName | null = null;
  appConfig: IntuneMAMAppConfig | null = null;
  policy: IntuneMAMPolicy | null = null;

  constructor(private router: Router) { }

  async ionViewDidEnter() {
    this.version = await IntuneMAM.sdkVersion();

    this.user = await IntuneMAM.enrolledAccount();

    IntuneMAM.addListener('appConfigChange', () => {
      console.log('Policy change here');
    });

    IntuneMAM.addListener('policyChange', () => {
      console.log('Policy change here');
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const c = changes[propName];

      if (propName === "user") {
        const u = c.currentValue;
        if (u?.upn) {
          this.appConfig = await IntuneMAM.appConfig(u);
          this.groupName = await IntuneMAM.groupName(u);
          this.policy = await IntuneMAM.getPolicy(u);

          await this.getToken();
        }
      }
    }
  }

  async showConsole() {
    await IntuneMAM.displayDiagnosticConsole();
  }

  async getToken() {
    if (this.user?.upn) {
      try {
        const tokenInfo = await IntuneMAM.acquireTokenSilent({
          scopes: ["https://graph.microsoft.com/.default"],
          ...this.user,
        });
        this.tokenInfo = tokenInfo;
        console.log("Got token info", tokenInfo);
      } catch {
        console.error(
          "Unable to silently acquire token, getting interactive"
        );
        const tokenInfo = await IntuneMAM.acquireToken({
          scopes: ["https://graph.microsoft.com/.default"],
        });
        this.tokenInfo = tokenInfo;
      }
    }
  }

  async logout() {
    if (this.user) {
      await IntuneMAM.deRegisterAndUnenrollAccount(this.user);
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
