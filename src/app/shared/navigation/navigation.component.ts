import { Component } from '@angular/core';
import { HTTPService } from '../http/http.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  isAuthenticated = false;

  constructor(private httpService: HTTPService, private authService:AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.isAuthenticated = !!user;
    })
  }

  ngOnDestroy(): void {
    this.authService.currentUser.unsubscribe();
  }
}
