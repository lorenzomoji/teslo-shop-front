import { Routes } from "@angular/router";
import { AdminDashboardLayoutComponent } from "./layouts/admin-dashboard-layout/admin-dashboard-layout.component";
import { ProductAdminPageComponent } from "./pages/product-admin-page/product-admin-page.component";
import { ProductsAdminPageComponent } from "./pages/products-admin-page/products-admin-page.component";
import { IdAdminGuard } from "@auth/guards/is-admin.guard";
export const adminDashboardRoutes: Routes = [
   {
      path: '',
      component: AdminDashboardLayoutComponent,
      canMatch: [IdAdminGuard],
      children: [
         {
            path: 'products',
            component: ProductsAdminPageComponent
         },
         {
            path: 'product/:id',
            component: ProductAdminPageComponent
         },
         {
            path: '**',
            redirectTo: 'products'
         }
      ]
   },
];