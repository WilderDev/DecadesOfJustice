import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './shared/auth/auth.component';

const routes: Routes = [
  {
    path: '', redirectTo: '/Home', pathMatch: 'full'}, //Landing Page

  { path: "", component:,children:[{path:"", component:}]}, //Creating Capsules
  { path: "", component:,children:[{path:"", component:}]}, //Current Capsules
  { path: "", component:,children:[{path:"", component:}]}, //Opening Capsules
  { path: "auth", component: AuthComponent}, //Authentication
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
