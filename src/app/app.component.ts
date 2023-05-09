import { Component } from '@angular/core';
import { AnimationController, IonicModule, Platform } from '@ionic/angular';
import { HomePage } from './home/home.page';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AnimationTriggerMetadata, animate, style, transition, trigger } from '@angular/animations';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, HomePage],
})
export class AppComponent {
  constructor(private platform : Platform, private router : Router,private screenOrientation: ScreenOrientation) {
      // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);//BLOQUEO HORIZONTAL
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT); //BLOQUEO VERTICAL
  }

  initializeApp(){
    this.platform.ready()
    .then(()=>{
      this.router.navigateByUrl('splash');
    });   
  } 
}
