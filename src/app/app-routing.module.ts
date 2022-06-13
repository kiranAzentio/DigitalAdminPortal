import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserRoleGuard } from './services/shared/auth/user-role-guard.guard';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login'},
  { path: 'login', loadChildren: './pages/user-authentication/login/login.module#LoginPageModule'},
  { path: 'menu', loadChildren: './pages/shared/menu/menu.module#MenuPageModule',
  canActivate: [UserRoleGuard],
},  
  { path: '404-not-found', loadChildren: './pages/shared/error-pages/page-not-found/page-not-found.module#PageNotFoundModule'},
  { path: '**', redirectTo:'404-not-found'},
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/entities/kastle/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
