import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import {
  Gender,
  Product,
  ProductsResponse,
} from '@products/interfaces/product.interface';
import { delay, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User,
};

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private _http = inject(HttpClient);

  private _productsCache = new Map<string, ProductsResponse>();
  private _productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;

    const key = `${limit}-${offset}-${gender}`;
    if (this._productsCache.has(key)) {
      return of(this._productsCache.get(key)!);
    }

    return this._http
      .get<ProductsResponse>(`${baseUrl}/products`, {
        params: {
          limit,
          offset,
          gender,
        },
      })
      .pipe(tap((resp) => this._productsCache.set(key, resp)));
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    if (idSlug === 'new') {
      return of(emptyProduct);
    }

    if (this._productCache.has(idSlug)) {
      return of(this._productCache.get(idSlug)!);
    }

    return this._http.get<Product>(`${baseUrl}/products/${idSlug}`).pipe(
      delay(1500),
      tap((resp) => this._productCache.set(idSlug, resp))
    );
  }

  getProductById(id: string): Observable<Product> {
    console.log('Id: ', id);

    if (this._productCache.has(id)) {
      return of(this._productCache.get(id)!);
    }

    return this._http.get<Product>(`${baseUrl}/products/${id}`).pipe(
      delay(1500),
      tap((resp) => this._productCache.set(id, resp))
    );
  }

  updateProduct(
    id: string,
    productLike: Partial<Product>,
    imageFileList?: FileList
  ): Observable<Product> {
    const currentImages = productLike.images ?? [];

    return this.uploadImages(imageFileList).pipe(
      map((imageNames) => ({
        ...productLike,
        images: [...currentImages, ...imageNames],
      })),
      switchMap((updatedProduct) =>
        this._http.patch<Product>(`${baseUrl}/products/${id}`, updatedProduct)
      ),
      tap((product) => this.updateProductCache(product))
    );
  }

  createProduct(
    productLike: Partial<Product>,
    imageFileList?: FileList
  ): Observable<Product> {
    return this._http
      .post<Product>(`${baseUrl}/products`, productLike)
      .pipe(tap((product) => this.updateProductCache(product)));
  }

  updateProductCache(product: Product) {
    const productId = product.id;

    this._productCache.set(productId, product);

    this._productsCache.forEach((productResponse) => {
      productResponse.products = productResponse.products.map(
        (currentProduct) => {
          return currentProduct.id == productId ? product : currentProduct;
        }
      );
    });
  }

  uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);

    const uploadObservables = Array.from(images).map((imageFile) => {
      this.uploadImage(imageFile);
    });
    return forkJoin(uploadObservables as unknown as string[]);
  }

  uploadImage(imageFile: File): Observable<string> {
    const formData = new FormData();

    formData.append('file', imageFile);
    return this._http
      .post<{ fileName: string }>(`${baseUrl}/files/product`, formData)
      .pipe(map((resp) => resp.fileName));
  }
}
