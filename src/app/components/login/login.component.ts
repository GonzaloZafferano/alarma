import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { IonInput, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario';


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
  usuarios : Usuario [] = [];
  ruta : string = "/resources/icon.png";
  constructor(private loginService: LoginService, private router:Router) { }
  ngOnInit() {
    this.usuarios.push(new Usuario('gonzalo@prueba.com', '123456'));
    this.usuarios.push(new Usuario('silas@prueba.com', '654321'));
    this.usuarios.push(new Usuario('nico@prueba.com','111111'));
   }

  login() {   
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
      this.loginService.loguearUsuario(this.email, this.password)
      .then(() => {
        this.limpiarCampos();
        this.router.navigate(['/home']);

        //this.addNewItem(true);
      }).catch(() => {
        this.mensajeError = "Correo o contraseña inválidos.";
      });
    } else {
      this.mensajeError = 'Corrija los errores y vuelva a intentar.';
    }
  }

  validadCampoVacio(item : IonInput) {  
    if (item.type === "password" && item.value != '') 
      this.mensajePass = '';    

      if (item.type === "text" && item.value != '') 
      this.mensajeEmail = '';    
  }

  limpiarCampos(){
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

  registrar(){  
    this.router.navigate(['/registro']);
  }

  limpiarErrores(){
    this.mensajeEmail = '';
    this.mensajeError = '';
    this.mensajePass = '';
  }
  
  cargarUsuario(indice : number){
    if(indice >= 0 && indice < this.usuarios.length){
      this.limpiarErrores();
      let usuario = this.usuarios[indice];
      this.email = usuario.usuario;
      this.password = usuario.password;
    }
  }
}
