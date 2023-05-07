import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { IonInput, IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario';
import { NativeAudio } from '@capacitor-community/native-audio'
import { Howl, Howler } from 'howler';

//import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';

import { DeviceMotion, DeviceMotionAccelerationData } from '@awesome-cordova-plugins/device-motion/ngx';

import { DeviceOrientation, DeviceOrientationCompassHeading } from '@awesome-cordova-plugins/device-orientation/ngx';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  //YA NO SE USAN MODULOS, POR LO QUE HAY QUE INDICAR QUE 'standalone : true'.
  //Debido a esto, NO SE COLOCA EL 'LoginComponent' en el array de 'declarations' (array de componentes), 
  //si no que AHORA se lo coloca en el array de 'imports' (donde van los modulos),
  //porque al ser 'standalone', sera su propio MODULO en SI MISMO.

  imports: [IonicModule, FormsModule, CommonModule]
})
export class LoginComponent implements OnInit {
  //*AVISO QUE VOY A EMITIR UN EVENTO PARA QUE UN COMPONENTE PADRE ESTE ATENTO.
  @Output() newItemEvent = new EventEmitter<boolean>();

  //SI LOS PONGO PRIVADO, EL HTML NO LO PUEDE LEER.
  email: string = "";
  password: string = "";
  esUsuarioValido: boolean = false;
  mensajeError: string = '';
  mensajePass: string = '';
  mensajeEmail: string = '';
  usuarios: Usuario[] = [];
  ruta: string = "/resources/icon.png";

  x: number = 0;
  y: number = 0;
  z: number = 0;
  t: number = 0;

  headingAccuracy: number = 0;
  magneticHeading: number = 0;
  timestamp: number = 0;
  trueHeading: number = 0;
  isVertical: boolean = false;
  isHorizontal: boolean = false;
  isMovingLeft: boolean = false;
  isMovingRight: boolean = false;

  isVertical2: boolean = false;
  isHorizontal2: boolean = false;
  isMovingLeft2: boolean = false;
  isMovingRight2: boolean = false;

  constructor(private loginService: LoginService, private router: Router, private deviceMotion: DeviceMotion,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private deviceOrientation: DeviceOrientation) {

    this.deviceMotion.getCurrentAcceleration().then(
      (acceleration: DeviceMotionAccelerationData) => console.log(acceleration),
      (error: any) => console.log(error)
    );

  }




  ngOnInit() {
    this.usuarios.push(new Usuario('admin@admin.com', '111111'));
    this.usuarios.push(new Usuario('invitado@invitado.com', '222222'));
    this.usuarios.push(new Usuario('usuario@usuario.com', '333333'));
    this.usuarios.push(new Usuario('tester@tester.com', '555555'));



    // var subscription = this.deviceMotion.watchAcceleration({ frequency: 100 }).subscribe((acceleration: DeviceMotionAccelerationData) => {
    //   console.log(acceleration);
    //   this.x = acceleration.x;
    //   this.y = acceleration.y;
    //   this.z = acceleration.z;
    //   this.t = acceleration.timestamp;
    //   //   alert();

    //   this.isHorizontal = Math.abs(acceleration.x) > Math.abs(acceleration.y) && Math.abs(acceleration.x) > Math.abs(acceleration.z);

    //   this.isVertical = Math.abs(acceleration.y) > Math.abs(acceleration.x) && Math.abs(acceleration.y) > Math.abs(acceleration.z);

    //   const threshold = -1.5; // Umbral negativo para detectar movimiento hacia la izquierda
    //   this.isMovingLeft = acceleration.y < threshold;

    //   const threshold2 = 1.5; // Umbral positivo para detectar movimiento hacia la derecha

    //   this.isMovingRight = acceleration.y > threshold2;

    //   //MIS DATOS

    //   this.isHorizontal2 = (acceleration.x > 0 && acceleration.x < 1) &&
    //     (acceleration.y > 0 && acceleration.y < 1) &&
    //     (acceleration.z > 9 && acceleration.z < 10);

    //   this.isMovingLeft2 = acceleration.x > 1.5;
    //   this.isMovingRight2 = acceleration.x < -1.5;// && acceleration.x;
    // });

    // var subscription = this.deviceOrientation.watchHeading().subscribe(
    //   (data: DeviceOrientationCompassHeading) => {
    //     console.log(data);


    //     this.headingAccuracy = data.headingAccuracy;
    //     this.magneticHeading = data.magneticHeading;
    //     this.timestamp = data.timestamp;
    //     this.trueHeading = data.trueHeading;
    //     /*
    //     magneticHeading: The heading in degrees from 0-359.99 at a single moment in time. (Number)

    //     trueHeading: The heading relative to the geographic North Pole in degrees 0-359.99 at a single moment in time. A negative value indicates that the true heading can't be determined. (Number)

    //     headingAccuracy: The deviation in degrees between the reported heading and the true heading. (Number)

    //     timestamp: The time at which this heading was determined. (DOMTimeStamp)
    //      */
    //   }
    // );

    this.sound = new Howl({
      src: ['assets/prueba.mp3'],
      preload: true
    });


  }


  sound: any;

 async login() {
    let errorEnDatos = false;
    let emailValido = false;

    if (this.email == '') {
      errorEnDatos = true;
      this.mensajeEmail = "Falta ingresar el correo electrónico.";
    } else {
      emailValido = this.validarEmail();
      if (!emailValido)
        this.mensajeEmail = "Formato de correo electrónico inválido.";
      else
        this.mensajeEmail = '';
    }

    if (this.password == '') {
      errorEnDatos = true;
      this.mensajePass = "Falta ingresar la contraseña.";
    } else
      if (this.password.length < 6) {
        errorEnDatos = true;
        this.mensajePass = "La contraseña debe contener al menos 6 caracteres.";
      }
      else
        this.mensajePass = '';

    if (!errorEnDatos && emailValido) {

      const loading = await this.presentLoading();
      this.loginService.loguearUsuario(this.email, this.password)
        .then(() => {
          this.limpiarCampos();
          this.router.navigate(['/home']);
          setTimeout(() => {
            loading.dismiss();            
          }, 2000);
        }).catch(() => {
          this.mensajeError = "Correo o contraseña inválidos.";
          loading.dismiss();
        });
    } else {
      this.mensajeError = 'Corrija los errores y vuelva a intentar.';
    }
  }

  validadCampoVacio(item: IonInput) {
    let errorEnDatos = false;

    if (item.type === "password") {
      if (item.value != '')
        this.mensajePass = '';
      else
        errorEnDatos = true;
    }

    if (item.type === "text") {
      if (item.value != '')
        this.mensajeEmail = '';
      else
        errorEnDatos = true;
    }

    if (this.mensajeEmail == '' && this.mensajePass == '') {
      this.mensajeError = '';
    }
  }

  limpiarCampos() {
    this.email = '';
    this.password = '';
  }
  validarEmail() {
    const patron = /^([a-zA-Z0-9\.]+@+[a-zA-Z]+(\.)+[a-zA-Z]{2,3})$/;
    if (this.email.length > 6) {
      return patron.test(this.email);
    }
    return false;
  };

  addNewItem(value: boolean) {
    //EMITO UN VALOR, PARA QUE LO RECIBA EL PADRE.
    this.newItemEvent.emit(value);
  }

  registrar() {
    this.router.navigate(['/registro']);
  }

  limpiarErrores() {
    this.mensajeEmail = '';
    this.mensajeError = '';
    this.mensajePass = '';
  }

  cargarUsuario(indice: number) {
    if (indice >= 0 && indice < this.usuarios.length) {
      this.limpiarErrores();
      let usuario = this.usuarios[indice];
      this.email = usuario.usuario;
      this.password = usuario.password;
    }
  }

  
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando configuraciones',
      spinner: 'circular',
      translucent: true,
      cssClass: 'custom-class'
    });

    await loading.present();
    return loading;
  }
}
