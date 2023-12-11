import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  providers: [HttpClient]
})
export class AuthComponent {
  isLoginMode = true;
  errMsg: string = null;
  authObserv: Observable<AuthResponseData>;

  constructor(private authService: AuthService, private router: Router) {}

  onSwitchAuthMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  registerSuccess: boolean = false;
  loginSuccess: boolean = false;


  onAuthFormSubmit(formObj: NgForm) {
    if (!formObj.valid) return;

    const { email, password } = formObj.value


    if (this.isLoginMode) {
      // Sign In
      this.authObserv = this.authService.login(email, password);
      this.loginSuccess = true;
    } else {
      // Sign Up
      this.authObserv = this.authService.signUp(email, password);
      this.registerSuccess = true;
    }

    this.authObserv.subscribe((res) => {
      console.log('Auth Res Success', res);
      if (this.errMsg) this.errMsg = null;

      this.router.navigate(['creating-capsules'])
    },
    (err) =>{
      console.error('Auth Res Error', err);
      this.errMsg = 'Incorrect Email or Password';
    }
    );

    formObj.reset()
  }
}
