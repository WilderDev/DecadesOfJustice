import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  isLoginMode = true;

  onSwitchAuthMode() {
    this.isLoginMode = !this.isLoginMode;
  }


  onAuthFormSubmit(formObj: NgForm) {
    console.log('Form Values:', formObj.value);
    formObj.reset()
  }
}
