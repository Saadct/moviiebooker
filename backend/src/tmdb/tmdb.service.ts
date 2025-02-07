import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios'; 

@Injectable()
export class TmdbService {
  private readonly apiKey: string;
  private readonly apiUrl: string = 'https://api.themoviedb.org/3';

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('TMDB_API_KEY');
    if (!apiKey) {
      throw new Error('TMDB_API_KEY is not defined');
    }
    this.apiKey = apiKey;
  }

  async getPopularMovies() {
    const response = await axios.get(`${this.apiUrl}/movie/popular`, {
      params: {
        api_key: this.apiKey,
        language: 'fr-FR', 
      },
    });

    return response.data.results; 
  }

  async searchMovies(query: string) {
    const response = await axios.get(`${this.apiUrl}/search/movie`, {
      params: {
        api_key: this.apiKey,
        query,
        language: 'fr-FR',
      },
    });

    return response.data.results; 
  }


  async getPopularMoviesPaginated(page: number = 1) {
    const response = await axios.get(`${this.apiUrl}/movie/popular`, {
      params: {
        api_key: this.apiKey,
        language: 'fr-FR',
        page, 
      },
    });

    return {
      movies: response.data.results,  
      page: response.data.page,    
      resultsPerPage: response.data.results.length, 
      totalPages: response.data.total_pages,  
      totalResults: response.data.total_results,
    };
  }

      async searchMoviesPaginated(query: string, page: number = 1) {
        const response = await axios.get(`${this.apiUrl}/search/movie`, {
          params: {
            api_key: this.apiKey,
            query,
            language: 'fr-FR',
            page,
          },
        });
    
        return {
            movies: response.data.results,  
            page: response.data.page,       
            resultsPerPage: response.data.results.length,
            totalPages: response.data.total_pages,  
            totalResults: response.data.total_results, 
          };
    }
}

