import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

const AUTH_API_KEY = "AIzaSyDGa-yj7TU0g0RrjfbNSgeyPGxNXNUSG4g"

const SIGN_UP_URL = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="

const SIGN_IN_URL = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}


@Injectable({
  providedIn: "root"
})


export class AuthService {
  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(SIGN_UP_URL + AUTH_API_KEY, {
      email, password, returnSecureToken: true
    });
  }
}

