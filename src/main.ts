import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { IntuneMAMPlugin } from '@ionic-enterprise/intune/cordova/definitions';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

declare global {
  interface Window { IntuneMAM: IntuneMAMPlugin; }
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
