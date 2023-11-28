import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { exhaustMap, tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";


@Injectable({
  providedIn: "root"
})
export class HTTPService {
  // *VARIABLES**
//   firebaseRootURL = ;

  // *INJECTIONS*
  constructor(
    private http: HttpClient,
    private authService: AuthService

  ) {}

  // *METHOD* Fetch Data



}






