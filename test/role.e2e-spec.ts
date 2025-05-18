import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('RoleController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/role/subroles (GET)', () => {
    it('should return 401 Unauthorized if no token provided', () => {
      return request(app.getHttpServer())
        .get('/role/subroles')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/role/all (GET)', () => {
    it('should return all roles', async () => {
      const response = await request(app.getHttpServer())
        .get('/role/all')
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('status', HttpStatus.OK);
      expect(response.body).toHaveProperty('message', 'Successful');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
