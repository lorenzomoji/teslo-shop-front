import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment.development';

const baseUrl = environment.baseUrl;

@Pipe({
   name: 'productImage'
})

export class ProductImagePipe implements PipeTransform {
   transform(value: string | string[] | null, ...args: any[]): string {

      if(value === null) {
         return './assets/images/112815904-no-hay-icono-de-imagen-disponible-ilustración-vectorial-plana.jpg'
      }

      if (typeof value === 'string' && value.startsWith('blob:')) {
         return value;
      }

      if (typeof value === 'string') {
         return `${baseUrl}/files/product/${value}`;
      }

      const image = value.at(0);
      if (!image) {
         return './assets/images/112815904-no-hay-icono-de-imagen-disponible-ilustración-vectorial-plana.jpg';
      }

      return `${baseUrl}/files/product/${image}`
   }
}