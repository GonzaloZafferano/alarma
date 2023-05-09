import { Component } from '@angular/core';
import { IonicModule, LoadingController } from '@ionic/angular';
import { LoginComponent } from '../components/login/login.component';
import { FormsModule } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroComponent } from '../components/registro/registro.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { BienvenidoComponent } from '../components/bienvenido/bienvenido.component';
import { Flashlight } from '@awesome-cordova-plugins/flashlight/ngx';
import { Haptics } from '@capacitor/haptics';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';
import { DeviceMotion, DeviceMotionAccelerationData } from '@awesome-cordova-plugins/device-motion/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule,
    CommonModule,
    FormsModule,
    LoginComponent,
    RegistroComponent,
    BienvenidoComponent], //Array de MODULOS Y 'COMPONENTES QUE SEAN STANDALONE:true'
  providers: [Flashlight, ScreenOrientation]
})

export class HomePage {
  rutaImagen = '';
  rutaAbierto = 'assets/imagenes/abierto.png';
  rutaCerrado = 'assets/imagenes/cerrado.png';
  abierto: boolean = true;
  ocultar: boolean = true;
  afAuth: AngularFireAuth;
  clave: string = '';
  moviendo: boolean = false;
  naturalH: boolean = true;
  naturalV: boolean = false;
  naturalI: boolean = false;
  naturalD: boolean = false;
  subscription: any;
  asegurar: boolean = false;
  errorPass: boolean = false;

  constructor(private screenOrientation: ScreenOrientation, private deviceMotion: DeviceMotion, private nativeAudio: NativeAudio, private loginService: LoginService, private angularFireAuth: AngularFireAuth, public loadingController: LoadingController, private router: Router, private flashlight: Flashlight) {
    this.afAuth = angularFireAuth;
    // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);//HORIZONTAL
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

  }

  ngOnInit() {
    this.rutaImagen = this.rutaAbierto;
    this.abierto = true;
    this.asegurar = false;
    this.nativeAudio.preloadSimple('izq', 'assets/sonidos/izquierda.mp3');
    this.nativeAudio.preloadSimple('der', 'assets/sonidos/derecha.mp3');
    this.nativeAudio.preloadSimple('hor', 'assets/sonidos/horizontal.mp3');
    this.nativeAudio.preloadSimple('ver', 'assets/sonidos/vertical.mp3');
    this.nativeAudio.preloadSimple('error', 'assets/sonidos/errorPass.mp3');

    this.subscription = this.deviceMotion.watchAcceleration({ frequency: 100 }).subscribe((acceleration: DeviceMotionAccelerationData) => {

      //   alert();

      //isHorizontal = Math.abs(acceleration.x) > Math.abs(acceleration.y) && Math.abs(acceleration.x) > Math.abs(acceleration.z);


      // const threshold = -1.5; // Umbral negativo para detectar movimiento hacia la izquierda
      // this.isMovingLeft = acceleration.y < threshold;

      //const threshold2 = 1.5; // Umbral positivo para detectar movimiento hacia la derecha

      // this.isMovingRight = acceleration.y > threshold2;

      //MIS DATOS

      if (!this.moviendo && this.asegurar) {
        let isVertical = Math.abs(acceleration.y) > Math.abs(acceleration.x) && Math.abs(acceleration.y) > Math.abs(acceleration.z);
        let isHorizontal2 = (acceleration.x > 0 && acceleration.x < 1) &&
          (acceleration.y > 0 && acceleration.y < 1) &&
          (acceleration.z > 9 && acceleration.z < 10);

        let isMovingLeft2 = acceleration.x > 2.5;
        let isMovingRight2 = acceleration.x < -2.5;

        if (isHorizontal2) {
          if (!this.naturalH && !this.moviendo) {
            this.moviendo = true;
            this.naturalH = true;
            this.naturalD = false;
            this.naturalI = false;
            this.naturalV = false;

            Haptics.vibrate({ duration: 5000 });
            this.nativeAudio.loop('hor').then(x => {
              //this.nativeAudio.play('hor');//NO FUNCA
            });

            setTimeout(() => {
              this.nativeAudio.stop('hor');
              this.moviendo = false;
            }, 6200);
          }
        } else if (isMovingLeft2) {
          if (!this.naturalI && !this.moviendo) {
            this.moviendo = true;
            this.naturalH = false;
            this.naturalD = false;
            this.naturalI = true;
            this.naturalV = false;

            this.nativeAudio.play('izq');

            setTimeout(() => {
              this.moviendo = false;
            }, 5000);
          }

        } else if (isMovingRight2) {
          if (!this.naturalD && !this.moviendo) {
            this.moviendo = true;
            this.naturalH = false;
            this.naturalD = true;
            this.naturalI = false;
            this.naturalV = false;
            this.nativeAudio.play('der');

            setTimeout(() => {
              this.moviendo = false;
            }, 5000);
          }
        } else if (isVertical) {
          if (!this.naturalV && !this.moviendo) {
            this.moviendo = true;
            this.naturalH = false;
            this.naturalD = false;
            this.naturalI = false;
            this.naturalV = true;
            this.flash();
            this.nativeAudio.loop('ver');

            setTimeout(() => {
              this.flash();
              this.nativeAudio.stop('ver');
              this.moviendo = false;
            }, 7000);
          }

        }

      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  flash() {
    //ENCIENDO Y APAGO
    this.flashlight.toggle();
  }

  async logout() {
    if (!this.asegurar) {
      const loading = await this.presentLoading();
      //this.rutaImagen = this.rutaAbierto;
      //this.abierto = true;
      //this.asegurar = false;

      setTimeout(() => {
        this.loginService.desloguear();
        this.router.navigate(['/login']);
        loading.dismiss();
      }, 2000);
    }
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'SALIENDO',
      spinner: 'circular',
      translucent: true,
      cssClass: 'custom-class'
    });

    await loading.present();
    return loading;
  }

  async presentChats() {
    const loading = await this.loadingController.create({
      message: 'Cargando chats',
      spinner: 'circular',
      translucent: true,
      cssClass: 'custom-class'
    });

    await loading.present();
    return loading;
  }


  alarma() {
    if (!this.abierto)
      this.ocultar = !this.ocultar;

    this.abierto = false;
    this.rutaImagen = this.rutaCerrado;
    this.asegurar = true;
  }

  async validar() {
    try {
      let usuario = this.loginService.usuario;

      if (usuario) {
        await this.angularFireAuth.signInWithEmailAndPassword(usuario.email, this.clave);
        this.rutaImagen = this.rutaAbierto;
        this.abierto = true;
        this.asegurar = false;
      }
    } catch (err) {

      if (!this.errorPass) {
        this.moviendo = true;
        this.errorPass = true;
        this.nativeAudio.loop('error').then(x => {
          // this.nativeAudio.play('error'); NO FUNCA
        });
      }
      Haptics.vibrate({ duration: 5000 });
      this.flash();

      setTimeout(() => {
        this.flash();
        this.nativeAudio.stop('error');
        this.moviendo = false;
        this.errorPass = false;
      }, 7000);
    };
    this.clave = '';
    this.ocultar = true;
  }
}
