import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', redirectTo: '/Home', pathMatch: 'full'}, //Landing Page

  { path: "", component:,children:[{path:"", component:}]}, //Creating Capsules
  { path: "", component:,children:[{path:"", component:}]}, //Current Capsules
  { path: "", component:,children:[{path:"", component:}]}, //Opening Capsules
  { path: "", component:,children:[{path:"", component:}]}, //Authentication
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
