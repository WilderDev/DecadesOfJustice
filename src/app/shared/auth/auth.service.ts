import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, tap } from "rxjs";
import { User } from "./User.model";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";


const AUTH_API_KEY = environment.firebaseAPIKey

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

export interface UserData {
  email: string;
  id: string;
  _token: string;
  _tokenExpirationDate: string;
}


@Injectable({
  providedIn: "root"
})


export class AuthService {
  private tokenExpTimer: any;
  currentUser = new BehaviorSubject<User>(null);
  userToken: string = null;

  constructor(private http: HttpClient, private router: Router) {}

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

  signOut() {
    this.currentUser.next(null);

    localStorage.removeItem("userData");

    if (this.tokenExpTimer) clearTimeout(this.tokenExpTimer);

    this.router.navigate(['auth']);
  }


  automaticSignOut(expDuration: number) {
    console.log("Expiration Duration", expDuration);

    this.tokenExpTimer = setTimeout(() => {
      this.signOut();
    }, expDuration);
  }


  automaticSignIn() {
    const userData: UserData = JSON.parse(localStorage.getItem('userData'));

    if(!userData) return;
    const { email, id, _token, _tokenExpirationDate } = userData;

    const loadedUser = new User(
      email,
      id,
      _token,
      new Date(_tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.currentUser.next(loadedUser);
    }
  }




}

