import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { debug, log } from 'console';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  standalone: true,
  //YA NO SE USAN MODULOS, POR LO QUE HAY QUE INDICAR QUE 'standalone : true'.
  //Debido a esto, NO SE COLOCA EL 'LoginComponent' en el array de 'declarations' (array de componentes), 
  //si no que AHORA se lo coloca en el array de 'imports' (donde van los modulos),
  //porque al ser 'standalone', sera su propio MODULO en SI MISMO.

  imports: [IonicModule, FormsModule, CommonModule]
})
export class RegistroComponent implements OnInit {
  //*AVISO QUE VOY A EMITIR UN EVENTO PARA QUE UN COMPONENTE PADRE ESTE ATENTO.
  @Output() newItemEvent = new EventEmitter<boolean>();

  //SI LOS PONGO PRIVADO, EL HTML NO LO PUEDE LEER.
  email: string = "";
  password: string = "";
  esUsuarioValido: boolean = false;
  mensajeError: string = '';
  mensajePass: string = '';
  mensajeEmail: string = '';
  confirmPassword: string = '';
  mensajeConfirmPassword: string = '';

  constructor(private loginService: LoginService, private router:Router) { }
  ngOnInit() { }

  registrar() {
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

    if (this.confirmPassword == '') {
      errorEnDatos = true;
      this.mensajeConfirmPassword = "Falta confirmar la contraseña.";
    } else
      if (this.confirmPassword.length < 4) {
        errorEnDatos = true;
        this.mensajeConfirmPassword = "La contraseña debe contener al menos 6 caracteres.";
      }
      else
        this.mensajeConfirmPassword = '';

    if (this.password != this.confirmPassword) {
      errorEnDatos = true;
      this.mensajeConfirmPassword = "La contraseña debe coincidir con la confirmacion.";
    }

    if (!errorEnDatos && emailValido) {     
      this.loginService.registrarUsuario(this.email, this.password)
        .then(async() => {

          await Swal.fire({
            title: '¡Registro exitoso!',
            text: 'Se ha registrado exitosamente, por favor, inicie sesión a continuación para acceder.',
            icon: 'success',        
            confirmButtonText: 'Ok',   
            heightAuto: false,             
          });

          this.loginService.desloguear();
          this.limpiarCampos();
          this.router.navigate(['/login']);
        }).catch((e) => {
          switch (e.code) {
            case 'auth/invalid-email':
              this.mensajeError = "Formato de correo electrónico inválido.";
              break;
            case 'auth/missing-password':
              this.mensajeError = "Falta ingresar la contraseña.";
              break;
            case 'auth/weak-password':
              this.mensajeError = "La contraseña debe contener al menos 6 caracteres.";
              break;
            case 'auth/email-already-in-use':
              this.mensajeError = "El correo electrónico ingresado ya está en uso.";
              break;
            default:
              this.mensajeError = "Ha ocurrido un error y no se pudo registrar el usuario.";
              break;
          }
        });
    } else {
      this.mensajeError = 'Corrija los errores y vuelva a intentar.';
    }
  }

  validadCampoVacio() {
    if (this.password != '')
      this.mensajePass = '';

    if (this.email != '')
      this.mensajeEmail = '';

    if (this.confirmPassword != '')
      this.mensajeConfirmPassword = '';
  }

  validarEmail() {
    const pattern = /^([a-zA-Z0-9\.]+@+[a-zA-Z]+(\.)+[a-zA-Z]{2,3})$/;
    if (this.email.length > 6) {
      return pattern.test(this.email);
    }
    return false;
  };

  limpiarCampos(){
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }
  addNewItem(value: boolean) {
    //EMITO UN VALOR, PARA QUE LO RECIBA EL PADRE.
    this.newItemEvent.emit(value);
  }

  login(){  
    this.router.navigate(['/login']);
  }
}
