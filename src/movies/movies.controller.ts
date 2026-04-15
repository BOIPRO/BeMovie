import { Controller, Get, Param, Post } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
    constructor (private readonly moviesService : MoviesService ) {}
    @Get('page/:number')
    async getAnimes(@Param('number') page :number) {
       return await this.moviesService.getAnimes(`page:${page}`,page)
    }
}
