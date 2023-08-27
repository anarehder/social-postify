import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';
import { TestHelper } from '../helpers';
import { PostsFactories } from '../factories/posts.factories';
import { MediasFactories } from '../factories/medias.factories';
//import { PublicationFactories } from '../factories/publications.factories';
import { Publications } from '@prisma/client';

describe('PublicationService (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();
  const postsFactories: PostsFactories = new PostsFactories();
  const mediasFactories: MediasFactories = new MediasFactories();
  //const publcationFactories: PublicationFactories = new PublicationFactories();

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
    describe('when body is invalid', () => {
      it('should respond with status 400 if given body is not valid', async () => {
        await request(app.getHttpServer())
          .post('/publications')
          .send({
            mediaId: '',
            postId: '',
            date: '',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      describe('when body is valid', () => {
        it('should respond with status 201 and return the created item if given body is valid', async () => {
          const media = await mediasFactories.createMedia(prisma);
          const post = await postsFactories.createPost(prisma);
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
              mediaId: media.id,
              postId: post.id,
              date: dateFaker,
            }),
          );
        });
      });
    });
  });
});
