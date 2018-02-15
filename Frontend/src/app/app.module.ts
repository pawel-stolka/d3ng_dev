import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { D3Service } from 'd3-ng2-service';
import { ApiService } from './services/api.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ChartComponent } from './components/chart/chart.component';
import { UsersComponent } from './components/users/users.component';
import { ForceComponent } from './components/force/force.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import { Force2Component } from './components/force2/force2.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'chart', component: ChartComponent },
  { path: 'users', component: UsersComponent },
  { path: 'force', component: ForceComponent },
  { path: 'force2', component: Force2Component }
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChartComponent,
    UsersComponent,
    ForceComponent,
    Force2Component
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule
  ],
  providers: [D3Service, ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
