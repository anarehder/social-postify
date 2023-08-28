import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';
import { TestHelper } from '../helpers';
import { Posts } from '@prisma/client';
import { PostsFactories } from '../factories/posts.factories';

describe('PostService (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();
  const postsFactories: PostsFactories = new PostsFactories();

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

  describe('POST /posts', () => {
    describe('when body is invalid', () => {
      it('should respond with status 400 if given body is not valid', async () => {
        await request(app.getHttpServer())
          .post('/posts')
          .send({
            title: '',
            text: '',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });
    });

    describe('when body is valid', () => {
      it('should respond with status 201 and return the created item if given body is valid', async () => {
        const title = faker.lorem.sentence();
        const text = faker.lorem.text();
        const image = faker.internet.avatar();
        const response = await request(app.getHttpServer())
          .post('/posts')
          .send({
            title,
            text,
            image,
          });

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual(
          expect.objectContaining<Posts>({
            id: expect.any(Number),
            title: title,
            text: text,
            image: image,
          }),
        );
      });
    });
  });

  describe('GET /posts', () => {
    it('Should respond with status 200 and an empty array when there are no posts', async () => {
      const response = await request(app.getHttpServer()).get('/posts');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('Should respond with status 200 and an array of size 4 when there are 4 posts', async () => {
      for (let i = 0; i < 4; i++)
        await postsFactories.createPostWithImage(prisma);
      const response = await request(app.getHttpServer()).get('/posts');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(4);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining<Posts>({
            id: expect.any(Number),
            title: expect.any(String),
            text: expect.any(String),
            image: expect.any(String),
          }),
        ]),
      );
    });
  });

  describe('GET /posts/:id', () => {
    it('Should respond with status 404 when id does not exists', async () => {
      const posts = await postsFactories.createPost(prisma);
      const id = posts.id + 1;
      const response = await request(app.getHttpServer()).get(`/posts/${id}`);

      expect(response.statusCode).toBe(404);
    });

    it('Should respond with status 200 and posts when id is valid', async () => {
      const posts = await postsFactories.createPostWithImage(prisma);

      const response = await request(app.getHttpServer()).get(
        `/posts/${posts.id}`,
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual<Posts>({
        id: expect.any(Number),
        title: expect.any(String),
        text: expect.any(String),
        image: expect.any(String),
      });
    });
  });

  describe('PATCH /posts/:id', () => {
    it('Should respond with status 404 when id does not exists', async () => {
      const posts = await postsFactories.createPost(prisma);
      const id = posts.id + 1;
      const response = await request(app.getHttpServer()).patch(`/posts/${id}`);

      expect(response.statusCode).toBe(404);
    });

    it('Should respond with status 400 and not update a posts when body is invalid', async () => {
      const posts = await postsFactories.createPost(prisma);
      await request(app.getHttpServer()).patch(`/posts/${posts.id}`).send({
        title: '',
        text: '',
      });
      expect(HttpStatus.BAD_REQUEST);
    });

    it('Should respond with status 200 and posts when id is valid', async () => {
      const post = await postsFactories.createPost(prisma);
      const title = faker.lorem.sentence();
      const text = faker.lorem.text();
      const image = faker.internet.avatar();
      const response = await request(app.getHttpServer())
        .patch(`/posts/${post.id}`)
        .send({
          title,
          text,
          image,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining<Posts>({
          id: post.id,
          title: title,
          text: text,
          image: image,
        }),
      );
    });
  });

  describe('DELETE /posts/:id', () => {
    it('Should respond with status 404 when id does not exists', async () => {
      const posts = await postsFactories.createPost(prisma);
      const id = posts.id + 1;
      const response = await request(app.getHttpServer()).delete(
        `/posts/${id}`,
      );

      expect(response.statusCode).toBe(404);
    });

    it('Should respond with status 200 and posts when id is valid', async () => {
      const posts = await postsFactories.createPost(prisma);
      const response = await request(app.getHttpServer()).delete(
        `/posts/${posts.id}`,
      );

      expect(response.statusCode).toBe(200);
    });
  });
});
