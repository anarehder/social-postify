import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';
import { TestHelper } from '../helpers';
import { PostsFactories } from '../factories/posts.factories';
import { MediasFactories } from '../factories/medias.factories';
import { PublicationFactories } from '../factories/publications.factories';
import { Publications } from '@prisma/client';

describe('PublicationService (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();
  const postsFactories: PostsFactories = new PostsFactories();
  const mediasFactories: MediasFactories = new MediasFactories();
  const publcationFactories: PublicationFactories = new PublicationFactories();

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

  describe('POST /publications', () => {
    it('Should respond with status 400 if given body is not valid', async () => {
      await request(app.getHttpServer()).post('/publications').send({
        mediaId: '',
        postId: '',
        date: '',
      });
      expect(HttpStatus.BAD_REQUEST);
    });

    it('should respond with status 201 and return the created item if given body is valid', async () => {
      const media = await mediasFactories.createMedia(prisma);
      const post = await postsFactories.createPostWithImage(prisma);
      const dateFaker = faker.date.future();

      const response = await request(app.getHttpServer())
        .post('/publications')
        .send({
          mediaId: media.id,
          postId: post.id,
          date: dateFaker,
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining<Publications>({
          id: expect.any(Number),
          mediaId: expect.any(Number),
          postId: expect.any(Number),
          date: expect.any(String),
        }),
      );
    });
  });

  describe('GET /publications', () => {
    it('Should respond with status 200 and an empty array when there are no publications', async () => {
      const response = await request(app.getHttpServer()).get('/publications');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('Should respond with status 200 and an array of size 4 when there are 4 publications', async () => {
      for (let i = 0; i < 4; i++) {
        const media = await mediasFactories.createMedia(prisma);
        const mediaId = media.id;
        const post = await postsFactories.createPostWithImage(prisma);
        const postId = post.id;
        await publcationFactories.createFuturePublication(
          prisma,
          mediaId,
          postId,
        );
      }

      const response = await request(app.getHttpServer()).get('/publications');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(4);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining<Publications>({
            id: expect.any(Number),
            mediaId: expect.any(Number),
            postId: expect.any(Number),
            date: expect.any(String),
          }),
        ]),
      );
    });
  });

  describe('GET /publications/:id', () => {
    it('Should respond with status 404 when id does not exists', async () => {
      const media = await mediasFactories.createMedia(prisma);
      const mediaId = media.id;
      const post = await postsFactories.createPostWithImage(prisma);
      const postId = post.id;
      const publication = await publcationFactories.createFuturePublication(
        prisma,
        mediaId,
        postId,
      );
      const id = publication.id + 1;
      const response = await request(app.getHttpServer()).get(
        `/publications/${id}`,
      );

      expect(response.statusCode).toBe(404);
    });

    it('Should respond with status 200 and posts when id is valid', async () => {
      const media = await mediasFactories.createMedia(prisma);
      const mediaId = media.id;
      const post = await postsFactories.createPostWithImage(prisma);
      const postId = post.id;
      const publication = await publcationFactories.createFuturePublication(
        prisma,
        mediaId,
        postId,
      );

      const response = await request(app.getHttpServer()).get(
        `/publications/${publication.id}`,
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining<Publications>({
          id: expect.any(Number),
          mediaId: mediaId,
          postId: postId,
          date: expect.any(String),
        }),
      );
    });
  });

  describe('PATCH /publications/:id', () => {
    it('Should respond with status 404 when id does not exists', async () => {
      const media = await mediasFactories.createMedia(prisma);
      const mediaId = media.id;
      const post = await postsFactories.createPostWithImage(prisma);
      const postId = post.id;
      const publication = await publcationFactories.createFuturePublication(
        prisma,
        mediaId,
        postId,
      );
      const id = publication.id + 1;
      const response = await request(app.getHttpServer()).patch(
        `/publications/${id}`,
      );

      expect(response.statusCode).toBe(404);
    });

    it('Should respond with status 400 and not update a publication when body is invalid', async () => {
      const media = await mediasFactories.createMedia(prisma);
      const mediaId = media.id;
      const post = await postsFactories.createPostWithImage(prisma);
      const postId = post.id;
      const publication = await publcationFactories.createFuturePublication(
        prisma,
        mediaId,
        postId,
      );

      await request(app.getHttpServer())
        .patch(`/publications/${publication.id}`)
        .send({
          mediaId: '',
          postId: '',
          date: '',
        });
      expect(HttpStatus.BAD_REQUEST);
    });

    it('Should respond with status 200 and publications when id is valid', async () => {
      const media = await mediasFactories.createMedia(prisma);
      const mediaId = media.id;
      const post = await postsFactories.createPostWithImage(prisma);
      const postId = post.id;
      const dateFaker = faker.date.future();
      const publication = await publcationFactories.createFuturePublication(
        prisma,
        mediaId,
        postId,
      );

      const post2 = await postsFactories.createPostWithImage(prisma);
      const response = await request(app.getHttpServer())
        .patch(`/publications/${publication.id}`)
        .send({
          mediaId,
          postId: post2.id,
          date: dateFaker,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining<Publications>({
          id: expect.any(Number),
          mediaId: mediaId,
          postId: post2.id,
          date: expect.any(String),
        }),
      );
    });
  });

  describe('DELETE /publications/:id', () => {
    it('Should respond with status 404 when id does not exists', async () => {
      const media = await mediasFactories.createMedia(prisma);
      const mediaId = media.id;
      const post = await postsFactories.createPostWithImage(prisma);
      const postId = post.id;
      const publication = await publcationFactories.createFuturePublication(
        prisma,
        mediaId,
        postId,
      );
      const id = publication.id + 1;
      const response = await request(app.getHttpServer()).delete(
        `/publications/${id}`,
      );

      expect(response.statusCode).toBe(404);
    });

    it('Should respond with status 200 and publications when id is valid', async () => {
      const media = await mediasFactories.createMedia(prisma);
      const mediaId = media.id;
      const post = await postsFactories.createPostWithImage(prisma);
      const postId = post.id;
      const publication = await publcationFactories.createFuturePublication(
        prisma,
        mediaId,
        postId,
      );
      const response = await request(app.getHttpServer()).delete(
        `/publications/${publication.id}`,
      );

      expect(response.statusCode).toBe(200);
    });
  });
});
