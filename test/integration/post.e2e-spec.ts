import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';
import { TestHelper } from '../helpers';
import { Posts } from '@prisma/client';

describe('PostService (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();

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
  });
});
