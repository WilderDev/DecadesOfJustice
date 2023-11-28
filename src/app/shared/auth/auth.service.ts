import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, tap } from "rxjs";
import { User } from "./User.model";


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
  currentUser = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(SIGN_UP_URL + AUTH_API_KEY, {
      email, password, returnSecureToken: true
    })
    .pipe(
      tap(res => {
      const { email, localId, idToken, expiresIn } = res;

      this.handleAuth(email, localId, idToken, +expiresIn);
    })
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(SIGN_IN_URL + AUTH_API_KEY, {
      email, password, returnSecureToken: true,
    })
    .pipe(tap(res => {
      const { email, localId, idToken, expiresIn } = res;

      this.handleAuth(email, localId, idToken, +expiresIn);
    })
    );
  }

  handleAuth(email:string, userId:string, token:string, expiresIn:number) {
    // Expiration Date for Token
    const expDate = new Date(new Date().getTime() + expiresIn * 1000);

    // New User based on form info and emit user
    const formUser = new User(email, userId, token, expDate);
    this.currentUser.next(formUser);

    // Save new user in localStorage
    localStorage.setItem("userData", JSON.stringify(formUser));
  }
}

