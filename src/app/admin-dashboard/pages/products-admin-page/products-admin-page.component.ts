import { Component, inject, signal } from '@angular/core';
import { ProductTableComponent } from "../../components/product-table/product-table.component";
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { ProductsService } from '@products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.component.html',
  styleUrl: './products-admin-page.component.scss'
})
export class ProductsAdminPageComponent {

  public paginationService = inject(PaginationService);
  private _productsService = inject(ProductsService);

  productsPerPage = signal(10);

  productsResource = rxResource({
    request: () => ({ page: this.paginationService.currentPage() - 1, limit: this.productsPerPage() }),
    loader: ({ request }) => {
      return this._productsService.getProducts({ offset: request.page * 9, limit: request.limit });
    },
  });

}
