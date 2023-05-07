import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  suscripcion : any;
  usuario : any;
  constructor(private auth: AngularFireAuth) { 

    if(this.suscripcion)
    this.suscripcion.subscribe();

    this.auth.authState.subscribe(x =>{
      this.usuario = x;
    });
  }

  registrarUsuario(usuario:string, password:string){
    return this.auth.createUserWithEmailAndPassword(usuario, password);
  }

  loguearUsuario(usuario:string, password:string){
    return this.auth.signInWithEmailAndPassword(usuario, password);
  }

  desloguear(){
    return this.auth.signOut();
  }


}
