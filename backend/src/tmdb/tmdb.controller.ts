import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TmdbService } from './tmdb.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('TMDB')
@Controller('movies')
export class TmdbController {
  constructor(private readonly tmdbService: TmdbService) {}

  @Get('popular')
  @ApiOperation({ summary: 'Récupérer les films hype' })
  @ApiResponse({ status: 200, description: 'Films populaires récupérer' })
  async getPopularMovies() {
    return this.tmdbService.getPopularMovies();
  }

  @Get('search')
  @ApiOperation({ summary: 'Rechercher des films par titre' })
  @ApiResponse({ status: 200, description: 'Films trouvés' })
  async searchMovies(@Query('query') query: string) {
    return this.tmdbService.searchMovies(query);
  }

  @Get('popularPaginated')
  async getPopularMoviesPaginated(
    @Query('page') page: number = 1,    
  ) {
    return this.tmdbService.getPopularMoviesPaginated(page);
  }

  @Get('searchPaginated')
  async searchMoviesPaginated(
    @Query('query') query: string, 
    @Query('page') page: number = 1,    
  ) {
    return this.tmdbService.searchMoviesPaginated(query, page);
  }
}
