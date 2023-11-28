import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  providers: [HttpClient]
})
export class AuthComponent {
  isLoginMode = true;

constructor(private authService: AuthService) {}

  onSwitchAuthMode() {
    this.isLoginMode = !this.isLoginMode;
  }


  onAuthFormSubmit(formObj: NgForm) {
    if (!formObj.valid) return;

    const { email, password } = formObj.value

    if (this.isLoginMode) {

    } else {
      this.authService.signUp(email, password).subscribe((res) => {
        console.log('Auth Response Success:', res);
      },
      (err) => {
        console.error('Auth Res Error:', err);
      }
      );
    }

    formObj.reset()
  }
}
