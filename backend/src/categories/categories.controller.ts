import { Body, Controller, Get, Post } from "@nestjs/common";
import { CategoriesService } from "./categories.service.js";
import { CreateCategoryDto } from "./dto/create-category.dto.js";

@Controller("categories")
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  create(@Body() payload: CreateCategoryDto) {
    return this.categoriesService.create(payload);
  }
}
