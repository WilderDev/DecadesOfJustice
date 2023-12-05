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


  onAuthFormSubmit(formObj: NgForm) {
    if (!formObj.valid) return;

    const { email, password } = formObj.value


    if (this.isLoginMode) {
      // Sign In
      this.authObserv = this.authService.login(email, password);
    } else {
      // Sign Up
      this.authObserv = this.authService.signUp(email, password);
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


    // if (this.isLoginMode) {
    //   this.authService.login(email, password).subscribe(
    //     res => {
    //       console.log("Auth Sign in Response:", res);
    //       if (this.errMsg) this.errMsg=null;
    //     },
    //     err => {
    //       console.error("Auth Res Error:", err);
    //       this.errMsg = err.message;
    //     }
    //   );
    // } else {
    //   this.authService.signUp(email, password).subscribe((res) => {
    //     console.log('Auth Response Success:', res);
    //     if (this.errMsg) this.errMsg=null;
    //   },
    //   (err) => {
    //     console.error('Auth Res Error:', err);
    //     this.errMsg = err.message;
    //   }
    //   );
    // }

    formObj.reset()
  }
}
