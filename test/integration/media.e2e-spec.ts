import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';
import { TestHelper } from '../helpers';
import { Medias } from '@prisma/client';
import { MediasFactories } from '../factories/medias.factories';

describe('MediaService (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();
  const mediasFactories: MediasFactories = new MediasFactories();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const { cleanDB } = new TestHelper();
    await cleanDB(prisma);
  });

  describe('POST /medias', () => {
    describe('when body is invalid', () => {
      it('Should respond with status 400 if given body is not valid', async () => {
        await request(app.getHttpServer())
          .post('/medias')
          .send({
            title: '',
            username: '',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });
    });

    describe('when body is valid', () => {
      it('should respond with status 201 and return the created item if given body is valid', async () => {
        const company = faker.company.companyName();
        const username = faker.internet.userName();
        const response = await request(app.getHttpServer())
          .post('/medias')
          .send({
            title: company,
            username: `www.${company}.com.br/${username}`,
          });

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual(
          expect.objectContaining<Medias>({
            id: expect.any(Number),
            title: company,
            username: `www.${company}.com.br/${username}`,
          }),
        );
      });
    });
  });

  describe('GET /medias', () => {
    it('Should respond with status 200 and an empty array when there are no media', async () => {
      const response = await request(app.getHttpServer()).get('/medias');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('Should respond with status 200 and an array of size 4 when there are 4 media', async () => {
      for (let i = 0; i < 4; i++) await mediasFactories.createMedia(prisma);
      const response = await request(app.getHttpServer()).get('/medias');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(4);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining<Medias>({
            id: expect.any(Number),
            title: expect.any(String),
            username: expect.any(String),
          }),
        ]),
      );
    });
  });

  describe('GET /medias/:id', () => {
    it('Should respond with status 404 when id does not exists', async () => {
      const media = await mediasFactories.createMedia(prisma);
      const id = media.id + 1;
      const response = await request(app.getHttpServer()).get(`/medias/${id}`);

      expect(response.statusCode).toBe(404);
    });

    it('Should respond with status 200 and media when id is valid', async () => {
      const media = await mediasFactories.createMedia(prisma);

      const response = await request(app.getHttpServer()).get(
        `/medias/${media.id}`,
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual<Medias>({
        id: media.id,
        title: media.title,
        username: media.username,
      });
    });
  });

  describe('PATCH /medias/:id', () => {
    it('Should respond with status 404 when id does not exists', async () => {
      const media = await mediasFactories.createMedia(prisma);
      const id = media.id + 1;
      const response = await request(app.getHttpServer()).patch(
        `/medias/${id}`,
      );

      expect(response.statusCode).toBe(404);
    });

    it('Should respond with status 400 and not update a media when body is invalid', async () => {
      const media = await mediasFactories.createMedia(prisma);
      await request(app.getHttpServer()).patch(`/medias/${media.id}`).send({
        title: '',
        username: '',
      });
      expect(HttpStatus.BAD_REQUEST);
    });

    it('Should respond with status 200 and media when id is valid', async () => {
      const company = faker.company.companyName();
      const username = faker.internet.userName();
      const media = await mediasFactories.createMedia(prisma);
      const response = await request(app.getHttpServer())
        .patch(`/medias/${media.id}`)
        .send({
          title: company,
          username: `www.${company}.com.br/${username}`,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual<Medias>({
        id: media.id,
        title: company,
        username: `www.${company}.com.br/${username}`,
      });
    });
  });

  describe('DELETE /medias/:id', () => {
    it('Should respond with status 404 when id does not exists', async () => {
      const media = await mediasFactories.createMedia(prisma);
      const id = media.id + 1;
      const response = await request(app.getHttpServer()).delete(
        `/medias/${id}`,
      );

      expect(response.statusCode).toBe(404);
    });

    it('Should respond with status 200 and media when id is valid', async () => {
      const media = await mediasFactories.createMedia(prisma);
      const response = await request(app.getHttpServer()).delete(
        `/medias/${media.id}`,
      );

      expect(response.statusCode).toBe(200);
    });
  });
});
