import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a movie', () => {
      service.create({
        title: 'Test Movie',
        year: 2020,
        genres: ['test', 'nope'],
      });

      expect(service.getAll().length).toEqual(1);
    });
  });

  describe('getAll', () => {
    it('should return an empty array', () => {
      const result = service.getAll();

      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    it('should return a movie', () => {
      service.create({
        title: 'Test Movie',
        year: 2020,
        genres: ['test', 'nope'],
      });
      const movie = service.getOne(1);

      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
      expect(movie.title).toBe('Test Movie');
      expect(movie.genres.length).toEqual(2);
    });

    it('should throw a 404 error', () => {
      try {
        service.getOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Movie 999 not found');
      }
    });
  });

  describe('deleteOne', () => {
    it('should delete a movie', () => {
      service.create({
        title: 'Test Movie',
        year: 2020,
        genres: ['test', 'nope'],
      });

      const allMovies = service.getAll();

      service.deleteOne(1);

      const afterDelete = service.getAll();

      expect(afterDelete).toEqual([]);
    });

    it('should return a 404 error', () => {
      try {
        service.deleteOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Movie 999 not found');
      }
    });
  });

  describe('update', () => {
    it('should update a movie', () => {
      service.create({
        title: 'Test Movie',
        year: 2020,
        genres: ['test', 'nope'],
      });

      const testTitle = 'updated test';

      service.update(1, {
        title: testTitle,
      });

      const movie = service.getOne(1);

      expect(movie.title).toEqual(testTitle);
    });

    it('should return a 404 error', () => {
      try {
        service.update(999, {});
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Movie 999 not found');
      }
    });
  });
});
