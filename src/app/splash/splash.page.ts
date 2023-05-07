import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SplashPage implements OnInit {
  usuarioLogueado : boolean = false;

  constructor(private router:Router, private angularFireAuth: AngularFireAuth) {
    this.usuarioEstaLogueado();
    setTimeout(() => {
      if(this.usuarioLogueado){
        router.navigate(['home']);
      }else{
        router.navigate(['login']);
      }
    }, 7000);
   }

  ngOnInit() {
  }
  usuarioEstaLogueado(){
    this.angularFireAuth.authState.subscribe(user => {
     //' !! ': Convierte a la variable en booleano. Si es null o undefined, es FALSE, caso contrario TRUE.
     this.usuarioLogueado = !!user; //Null o undefined = No hay usuario logueado = false.
   });
 }
}
