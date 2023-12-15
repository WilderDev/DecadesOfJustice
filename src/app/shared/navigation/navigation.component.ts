import { Component } from '@angular/core';
import { HTTPService } from '../utils/http/http.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  isAuthenticated: boolean = false;
  collapsed: boolean = true;
  currUserSub: Subscription;

  constructor(
    private httpService: HTTPService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currUserSub = this.authService.currentUser.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy(): void {
    this.authService.currentUser.unsubscribe();
  }

  handleSignOut() {
    this.authService.signOut();
  }
}
