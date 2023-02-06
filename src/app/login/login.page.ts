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
  busy = false;
  message = '';

  constructor(private router: Router) { }

  async ionViewDidEnter() {
    this.version = (await IntuneMAM.sdkVersion()).version;
  }

  async login() {
    try {
      this.busy = true;
      this.message = 'Acquiring token...';
      const authInfo = await IntuneMAM.acquireToken({
        scopes: ['https://graph.microsoft.com/.default'],
      });
      console.log('Got auth info', authInfo);
      this.message = 'Registering and Enrolling...';
      await IntuneMAM.registerAndEnrollAccount({
        upn: authInfo.upn,
      });
      console.log('Registered and enrolled');
      this.message = 'Getting enrolled Account...';
      const user = await IntuneMAM.enrolledAccount();
      console.log('user', user);

      if (user.upn) {
        this.message = 'Finishing...';
        console.log('Got user, going home');
        this.router.navigate(['/home']);
      } else {
        console.log('No user, logging in');
        this.message = 'No user';
        this.router.navigate(['/login']);
      }

    } catch (err) {
      alert(err);
    }
    this.busy = false;
  }

  async loginOnly() {
    try {
      this.busy = true;
      this.message = 'Acquiring token...';
      const authInfo = await IntuneMAM.acquireToken({
        scopes: ['https://graph.microsoft.com/.default'],
      });
      console.log('Got auth info', authInfo);
      console.log('Got user, going home');
      this.router.navigate(['/home']);

    } catch (err) {
      alert(err);
    }
    this.busy = false;
  }

  async loginAndEnroll() {
    try {
      this.busy = true;
      this.message = 'Logging in and enrolling...';
      await IntuneMAM.loginAndEnrollAccount();
      console.log('loginAndEnrollAccounted');
      this.message = 'Checking enrolled account...';
      const user = await IntuneMAM.enrolledAccount();
      console.log('user', user);

      if (user.upn) {
        console.log('Got user, going home');
        this.router.navigate(['/home']);
      } else {
        console.log('No user, logging in');

        this.router.navigate(['/login']);
      }

    } catch (err) {
      alert(err);
    }
    this.busy = false;
  }

  async showConsole() {
    await IntuneMAM.displayDiagnosticConsole();
  }

}
