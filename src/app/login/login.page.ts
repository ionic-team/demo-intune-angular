import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import type { IntuneMAMPlugin } from "@ionic-enterprise/intune/cordova/definitions"
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  version = null;

  constructor(private router: Router, private platform: Platform) {
    platform.ready().then(() => {
      this.getVersion();
    });
  }

  async getVersion() {
    this.version = (await window.IntuneMAM.sdkVersion()).version;
  }

  async login() {
    const IntuneMAM = window.IntuneMAM;

    var authInfo = await IntuneMAM.acquireToken({
      scopes: ["https://graph.microsoft.com/.default"],
    });

    console.log("Got auth info", authInfo);

    await IntuneMAM.registerAndEnrollAccount({
      upn: authInfo.upn,
    });

    const user = await IntuneMAM.enrolledAccount();

    if (user.upn) {
      console.log("Got user, going home");
      this.router.navigate(['/home']);
    } else {
      console.log("No user, logging in");
      this.router.navigate(['/login']);
    }
  }

  async showConsole() {
    await window.IntuneMAM.displayDiagnosticConsole();
  }

}
