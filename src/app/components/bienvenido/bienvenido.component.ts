import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { IonicModule } from '@ionic/angular';
//IMPORTAR
import { Flashlight } from '@awesome-cordova-plugins/flashlight/ngx';
@Component({
  selector: 'app-bienvenido',
  templateUrl: './bienvenido.component.html',
  styleUrls: ['./bienvenido.component.scss'],
  standalone: true,
  imports: [IonicModule],
  providers: [Flashlight] //AGREGO ESTO
})
export class BienvenidoComponent implements OnInit {
  //INYECTO
  constructor(private loginService: LoginService, private router: Router, private flashlight: Flashlight) { }
  ngOnInit() { }
  logout() {
    this.loginService.desloguear();
    this.router.navigate(['/login']);
  }
  flash() {
    //ENCIENDO Y APAGO
    this.flashlight.toggle();
  }
}
