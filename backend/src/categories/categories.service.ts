import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  findAll() {
    return 'All categories'
  }
}
