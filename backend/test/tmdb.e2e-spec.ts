import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TmdbService } from './../src/tmdb/tmdb.service';

describe('TmdbController (e2e)', () => {
  let app: INestApplication;
  let tmdbService: TmdbService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    tmdbService = moduleFixture.get<TmdbService>(TmdbService);

    await app.init();
  });

  it('should retrieve popular movies', async () => {
    const popularMoviesResponse = [{ id: 1, title: 'Inception' }];
    jest.spyOn(tmdbService, 'getPopularMovies').mockResolvedValue(popularMoviesResponse);

    return request(app.getHttpServer())
      .get('/movies/popular')
      .expect(200)
      .expect(popularMoviesResponse);
  });

  it('should search movies by title', async () => {
    const query = 'Inception';
    const searchMoviesResponse = [{ id: 1, title: 'Inception' }];
    jest.spyOn(tmdbService, 'searchMovies').mockResolvedValue(searchMoviesResponse);

    return request(app.getHttpServer())
      .get('/movies/search')
      .query({ query })
      .expect(200)
      .expect(searchMoviesResponse);
  });

  it('should retrieve popular movies with pagination', async () => {
    const page = 2;
    const paginatedPopularMoviesResponse = {
      movies: [{ id: 2, title: 'The Dark Knight' }],
      page: page,
      resultsPerPage: 1,
      totalPages: 10,
      totalResults: 100,
    };

    jest.spyOn(tmdbService, 'getPopularMoviesPaginated').mockResolvedValue(paginatedPopularMoviesResponse);

    return request(app.getHttpServer())
      .get('/movies/popularPaginated')
      .query({ page })
      .expect(200)
      .expect(paginatedPopularMoviesResponse);
  });

  it('should search movies with pagination', async () => {
    const query = 'Inception';
    const page = 1;
    const paginatedSearchMoviesResponse = {
      movies: [{ id: 1, title: 'Inception' }],
      page: page,
      resultsPerPage: 1,
      totalPages: 10,
      totalResults: 100,
    };

    jest.spyOn(tmdbService, 'searchMoviesPaginated').mockResolvedValue(paginatedSearchMoviesResponse);

    return request(app.getHttpServer())
      .get('/movies/searchPaginated')
      .query({ query, page })
      .expect(200)
      .expect(paginatedSearchMoviesResponse);
  });

  afterAll(async () => {
    await app.close();
  });
});
