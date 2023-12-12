import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './shared/auth/auth.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { TimecapsuleFormComponent } from './core/timecapsule/timecapsuleForm/timecapsule-form.component';
import { AuthGuard } from './shared/auth/auth.guard';
import { TimecapsuleViewComponent } from './core/timecapsule/timecapsuleView/timecapsule-view.component';
import { ViewTimecapsuleComponent } from './core/timecapsule/timecapsuleView/view-timecapsule/view-timecapsule.component';

//routing for navbar

const routes: Routes = [

  { path: "", component:LandingPageComponent , pathMatch: 'full'}, //Landing Page
  { path: "creating-capsules", component: TimecapsuleFormComponent, canActivate: [AuthGuard] },  //Creating Capsules
  { path: "current-capsules", component: TimecapsuleViewComponent, canActivate: [AuthGuard] }, //Current Capsules
  {path: "view-capsule/:uuid", component: ViewTimecapsuleComponent, canActivate: [AuthGuard] }, // * BG: View Selected Capsule

  //OPENING ROUTES NEEDS TO BE CREATED FOR WHEN THEIR CAPSULE OPEN
  //{ path: "opening-capsules", component:,children:[{path:"", component:}]}, //Opening Capsules
  { path: "authentication", component: AuthComponent }  //Authentication
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

