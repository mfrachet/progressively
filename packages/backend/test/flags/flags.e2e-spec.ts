import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { seedDb, cleanupDb } from '../helpers/seed';
import { prepareApp } from '../helpers/prepareApp';
import { verifyAuthGuard } from '../helpers/verify-auth-guard';
import { authenticate } from '../helpers/authenticate';

jest.mock('nanoid', () => ({
  nanoid: () => '12345-marvin',
}));

describe('FlagsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await prepareApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await seedDb();
  });

  afterEach(async () => {
    await cleanupDb();
  });

  describe('/flags/sdk/unknown-key (GET)', () => {
    it('gives an empty array when the key is invalid', async () => {
      const response = await request(app.getHttpServer()).get(
        '/flags/sdk/unknown-key',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({});
    });
  });

  describe('/flags/sdk/valid-sdk-key (GET)', () => {
    it('gives a list of flags when the key is valid for anonymous user (no field id, no cookies)', async () => {
      const response = await request(app.getHttpServer()).get(
        '/flags/sdk/valid-sdk-key',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ newHomepage: false, newFooter: false });
      expect(response.headers['set-cookie']).toMatchInlineSnapshot(`
        Array [
          "progressively-id=12345-marvin; Path=/; Secure; SameSite=Lax",
        ]
      `);
    });

    it('gives a list of flags when the key is valid for an authenticated user (field is passed as query param and match a strategy)', async () => {
      const response = await request(app.getHttpServer()).get(
        '/flags/sdk/valid-sdk-key?id=1',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ newHomepage: false, newFooter: true });
      expect(response.headers['set-cookie']).toMatchInlineSnapshot(`
        Array [
          "progressively-id=1; Path=/; Secure; SameSite=Lax",
        ]
      `);
    });

    it('gives a list of flags when the key is valid for an authenticated user (field is passed as query param and does NOT match a strategy)', async () => {
      const response = await request(app.getHttpServer()).get(
        '/flags/sdk/valid-sdk-key?id=2',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ newHomepage: false, newFooter: false });
      expect(response.headers['set-cookie']).toMatchInlineSnapshot(`
        Array [
          "progressively-id=2; Path=/; Secure; SameSite=Lax",
        ]
      `);
    });

    it('gives a list of flags when the key is valid for an authenticated user (field is passed as cookie and match a strategy)', async () => {
      const response = await request(app.getHttpServer())
        .get('/flags/sdk/valid-sdk-key')
        .set('Cookie', ['progressively-id=1; Path=/; Secure; SameSite=Lax']);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ newHomepage: false, newFooter: true });
      expect(response.headers['set-cookie']).toMatchInlineSnapshot(`
        Array [
          "progressively-id=1; Path=/; Secure; SameSite=Lax",
        ]
      `);
    });

    it('gives a list of flags when the key is valid for an authenticated user (field is passed as cookie and does NOT match a strategy)', async () => {
      const response = await request(app.getHttpServer())
        .get('/flags/sdk/valid-sdk-key')
        .set('Cookie', ['progressively-id=2; Path=/; Secure; SameSite=Lax']);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ newHomepage: false, newFooter: false });
      expect(response.headers['set-cookie']).toMatchInlineSnapshot(`
        Array [
          "progressively-id=2; Path=/; Secure; SameSite=Lax",
        ]
      `);
    });
  });

  describe('/projects/1/environments/1/flags/1 (PUT)', () => {
    it('gives a 401 when the user is not authenticated', () =>
      verifyAuthGuard(app, '/projects/1/environments/1/flags/1', 'put'));

    it('gives a 403 when trying to access a valid project but an invalid env', async () => {
      const access_token = await authenticate(app);

      return request(app.getHttpServer())
        .put('/projects/1/environments/3/flags/1')
        .set('Authorization', `Bearer ${access_token}`)
        .send({
          status: 'ACTIVATED',
        })
        .expect(403)
        .expect({
          statusCode: 403,
          message: 'Forbidden resource',
          error: 'Forbidden',
        });
    });

    it('gives a 403 when the user requests a forbidden project', async () => {
      const access_token = await authenticate(
        app,
        'jane.doe@gmail.com',
        'password',
      );

      return request(app.getHttpServer())
        .put('/projects/1/environments/1/flags/1')
        .set('Authorization', `Bearer ${access_token}`)
        .expect(403)
        .expect({
          statusCode: 403,
          message: 'Forbidden resource',
          error: 'Forbidden',
        });
    });

    it('gives 400 when status is not activated, inactive or not activated', async () => {
      const access_token = await authenticate(
        app,
        'marvin.frachet@gmail.com',
        'password',
      );

      return request(app.getHttpServer())
        .put('/projects/1/environments/1/flags/1')
        .set('Authorization', `Bearer ${access_token}`)
        .send({
          status: 'invalid status',
        })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'Invalid status code',
          error: 'Bad Request',
        });
    });

    ['ACTIVATED', 'INACTIVE', 'NOT_ACTIVATED'].forEach((status) => {
      it(`gives 200 when setting the status of a flag to "${status}"`, async () => {
        const access_token = await authenticate(
          app,
          'marvin.frachet@gmail.com',
          'password',
        );

        const response = await request(app.getHttpServer())
          .put('/projects/1/environments/1/flags/1')
          .set('Authorization', `Bearer ${access_token}`)
          .send({
            status,
          });

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          flagId: '1',
          environmentId: '1',
          status,
          environment: {
            uuid: '1',
            name: 'Production',
            projectId: '1',
            clientKey: 'valid-sdk-key',
          },
          flag: {
            uuid: '1',
            name: 'New homepage',
            key: 'newHomepage',
            description: 'Switch the new homepage design',
          },
        });
      });
    });
  });

  describe('/projects/1/environments/1/flags/1/hits (GET)', () => {
    it('gives a 401 when the user is not authenticated', () =>
      verifyAuthGuard(app, '/projects/1/environments/1/flags/1/hits', 'get'));

    it('gives a 403 when trying to access a valid project but an invalid env', async () => {
      const access_token = await authenticate(app);

      return request(app.getHttpServer())
        .get('/projects/1/environments/3/flags/1/hits')
        .set('Authorization', `Bearer ${access_token}`)
        .expect(403)
        .expect({
          statusCode: 403,
          message: 'Forbidden resource',
          error: 'Forbidden',
        });
    });

    it('gives a 403 when the user requests a forbidden project', async () => {
      const access_token = await authenticate(
        app,
        'jane.doe@gmail.com',
        'password',
      );

      return request(app.getHttpServer())
        .get('/projects/1/environments/1/flags/1/hits')
        .set('Authorization', `Bearer ${access_token}`)
        .expect(403)
        .expect({
          statusCode: 403,
          message: 'Forbidden resource',
          error: 'Forbidden',
        });
    });

    it('gives the strategies information when the user is authenticated and authorized', async () => {
      const access_token = await authenticate(app);

      return request(app.getHttpServer())
        .get('/projects/1/environments/1/flags/1/hits')
        .set('Authorization', `Bearer ${access_token}`)
        .expect(200)
        .expect([
          { count: 10, date: '1992-01-01T02:02:02.002Z' },
          { count: 40, date: '1992-01-02T02:02:02.002Z' },
          { count: 20, date: '1992-01-03T02:02:02.002Z' },
          { count: 10, date: '1992-01-06T02:02:02.002Z' },
        ]);
    });
  });

  describe('/projects/1/environments/1/flags/1 (DELETE)', () => {
    it('gives a 401 when the user is not authenticated', () =>
      verifyAuthGuard(app, '/projects/1/environments/1/flags/1', 'delete'));

    it('gives a 403 when trying to access a valid project but an invalid env', async () => {
      const access_token = await authenticate(app);

      return request(app.getHttpServer())
        .delete('/projects/1/environments/3/flags/1')
        .set('Authorization', `Bearer ${access_token}`)
        .expect(403)
        .expect({
          statusCode: 403,
          message: 'Forbidden resource',
          error: 'Forbidden',
        });
    });

    it('gives a 403 when the user requests a forbidden project', async () => {
      const access_token = await authenticate(
        app,
        'jane.doe@gmail.com',
        'password',
      );

      return request(app.getHttpServer())
        .delete('/projects/1/environments/1/flags/1')
        .set('Authorization', `Bearer ${access_token}`)
        .expect(403)
        .expect({
          statusCode: 403,
          message: 'Forbidden resource',
          error: 'Forbidden',
        });
    });

    it('gives a 200 when the flag has been deleted', async () => {
      const access_token = await authenticate(app);

      const prevResponse = await request(app.getHttpServer())
        .get('/projects/1/environments/1/flags')
        .set('Authorization', `Bearer ${access_token}`);

      expect(prevResponse.body[0]).toMatchObject({
        environment: {
          clientKey: 'valid-sdk-key',
          name: 'Production',
          projectId: '1',
          uuid: '1',
        },
        environmentId: '1',
        flag: {
          description: 'Switch the new homepage design',
          key: 'newHomepage',
          name: 'New homepage',
          uuid: '1',
        },
        flagId: '1',
        status: 'NOT_ACTIVATED',
      });

      const response = await request(app.getHttpServer())
        .delete('/projects/1/environments/1/flags/1')
        .set('Authorization', `Bearer ${access_token}`);
      expect(response.status).toBe(200);

      const afterResponse = await request(app.getHttpServer())
        .get('/projects/1/environments/1/flags')
        .set('Authorization', `Bearer ${access_token}`);

      expect(afterResponse.body.length).toBe(1);
    });
  });
});
