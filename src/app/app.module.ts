import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AuthComponent } from './shared/auth/auth.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from './shared/auth/auth-interceptor.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimecapsuleFormComponent } from './core/timecapsule/timecapsuleForm/timecapsule-form.component';
import { TimecapsuleViewComponent } from './core/timecapsule/timecapsuleView/timecapsule-view.component';

@NgModule({
  declarations: [
    AppComponent,
    TimecapsuleFormComponent,
    TimecapsuleViewComponent,
    AuthComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
