import { Routes } from '@angular/router';
import { notAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [
   {
      path: 'auth',
      loadChildren: () => import('./auth/auth.routes').then(r => r.authRoutes),
      canMatch: [notAuthenticatedGuard]
   },
   {
      path: 'admin',
      loadChildren: () => import('./admin-dashboard/admin-dashboard.routes').then(r => r.adminDashboardRoutes),
   },
   {
      path: '',
      loadChildren: () => import('./store-front/store-front.route').then(r => r.storeFrontRoutes)
   },
   // {
   //    path: '',
   //    component: 
   // },
   // {
   //    path: '**',
   //    redirectTo: '' 
   // },
];
