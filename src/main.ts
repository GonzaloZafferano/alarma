import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

//Agregamos ESTO
import { AngularFireModule } from '@angular/fire/compat';
import { DeviceMotion } from '@awesome-cordova-plugins/device-motion/ngx';
import { DeviceOrientation } from '@awesome-cordova-plugins/device-orientation/ngx';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot({})),
    NativeAudio,
    DeviceOrientation,
    DeviceMotion,

    
    //Y ESTO
    importProvidersFrom(AngularFireModule.initializeApp(environment.firebaseConfig)),
    provideRouter(routes)
  ],
});
