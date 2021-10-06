import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

import type { IntuneMAMPlugin } from "@ionic-enterprise/intune/cordova/definitions";

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage {

  constructor(private router: Router, private platform: Platform) {
    platform.ready().then(() => {
      this.checkUser();
    });
  }

  async checkUser() {
    const user = await window.IntuneMAM.enrolledAccount();

    if (user.upn) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
