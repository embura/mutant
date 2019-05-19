const supertest = require('supertest');
const { setupApp } = require('../../../src/app.js');
const config = require('config');
const nock = require('nock');
const resourceUsersUrl = config.get('recourses.users.url');

describe('Github resource with nock', () => {
  let request;
  let users = [];

  beforeAll( async () => {
    const app = await setupApp();
    request = supertest(app);
    nock.cleanAll();
    
    users = [
        {
            id: 1,
            name: "Leanne Graham",
            username: "Bret",
            email: "Sincere@april.biz",
            website: "hildegard.org",
            company: {
                name: "Romaguera-Crona",
                catchPhrase: "Multi-layered client-server neural-net",
                bs: "harness real-time e-markets"
            }
        },
        {
            id: 2,
            name: "Ervin Howell",
            username: "Antonette",
            email: "Shanna@melissa.tv",
            phone: "010-692-6593 x09125",
            website: "anastasia.net",
            company: {
                name: "Deckow-Crist",
                catchPhrase: "Proactive didactic contingency",
                bs: "synergize scalable supply-chains"
            }
        },
    ]
  });

  afterEach(() => {
    nock.cleanAll();
  });
  

  describe('route /', () => {
    describe('when a GET request is done to / endpoint', () => {
      test('should respond with the followers count', async () => {
        nock(resourceUsersUrl)
          .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
          .get('/users/')
          .reply(200, {
            users
          });

        const response = await request.get('/');
        expect(response.body.users[0].id).toEqual(users[0].id);
      });

      test('should throw error when the user is not found', async () => {
        nock(resourceUsersUrl)
          .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
          .get('/user/')
          .reply(404, 'Not Found');
        const response = await request.get('/');
        expect(response.body).toEqual({ error: 'Not Found' });
      });
    });
  });
});
