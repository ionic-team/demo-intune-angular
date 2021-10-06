import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IntuneMAM } from '@ionic-enterprise/intune';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    const user = await IntuneMAM.enrolledAccount();

    if (user.upn) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }

}
