import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginPageComponent } from "../../pages/login-page/login-page.component";

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, LoginPageComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {

}
