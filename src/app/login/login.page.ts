import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IntuneMAM } from '@ionic-enterprise/intune';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  version = null;

  constructor(private router: Router) { }

  async ionViewDidEnter() {
    this.version = (await IntuneMAM.sdkVersion()).version;
  }

  async login() {
    const authInfo = await IntuneMAM.acquireToken({
      scopes: ['https://graph.microsoft.com/.default'],
    });

    console.log('Got auth info', authInfo);

    await IntuneMAM.registerAndEnrollAccount({
      upn: authInfo.upn,
    });

    const user = await IntuneMAM.enrolledAccount();
    console.log('user', user);
    if (user.upn) {
      console.log('Got user, going home');
      this.router.navigate(['/home']);
    } else {
      console.log("No user, logging in");
      this.router.navigate(['/login']);
    }
  }

  async showConsole() {
    await IntuneMAM.displayDiagnosticConsole();
  }

}
