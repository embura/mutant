const supertest = require('supertest');
const config = require('config');
const nock = require('nock');
const resourceUsersUrl = config.get('recourses.users.url');
const { setupApp } = require('../../../src/app.js');

describe('Users resource with nock', () => {
  let request;
  let users = [];

  beforeAll( async () => {
    const app = await setupApp();
    request = supertest(app);
    nock.cleanAll();
    
    users = [
      {
        "id": 1,
        "name": "Leanne Graham",
        "username": "Bret",
        "email": "Sincere@april.biz",
        "address": {
            "street": "Kulas Light",
            "suite": "Apt. 556",
            "city": "Gwenborough",
            "zipcode": "92998-3874",
            "geo": {
                "lat": "-37.3159",
                "lng": "81.1496"
            }
        },
        "phone": "1-770-736-8031 x56442",
        "website": "hildegard.org",
        "company": {
            "name": "Romaguera-Crona",
            "catchPhrase": "Multi-layered client-server neural-net",
            "bs": "harness real-time e-markets"
        }
      },
      {
        "id": 2,
        "name": "Ervin Howell",
        "username": "Antonette",
        "email": "Shanna@melissa.tv",
        "address": {
            "street": "Victor Plains",
            "suite": "Suite 879",
            "city": "Wisokyburgh",
            "zipcode": "90566-7771",
            "geo": {
                "lat": "-43.9509",
                "lng": "-34.4618"
            }
        },
        "phone": "010-692-6593 x09125",
        "website": "anastasia.net",
        "company": {
            "name": "Deckow-Crist",
            "catchPhrase": "Proactive didactic contingency",
            "bs": "synergize scalable supply-chains"
        }
      }
    ]
  });

  afterEach(() => {
    nock.cleanAll();
  });
  

  describe('route /', () => {
    describe('when a GET request is done to / endpoint', () => {
      test('should respond with the list users', async () => {
        console.log('resourceUsersUrl: ', resourceUsersUrl);
        nock('https://jsonplaceholder.typicode.com')
          .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
          .get('/users')
          .reply(200, users);

        const response = await request.get('/users');

        users.sort( (userA, userB) => userA.name > userB.name);

        expect(response.body[0].name).toEqual(users[0].name);
      });

      test('should throw error when the user is not found', async () => {
        nock('https://jsonplaceholder.typicode.com')
          .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
          .get('/usersall')
          .reply(404, 'Not Found');
        const response = await request.get('/usersall');
        expect(response.status).toEqual(404);
      });
    });
  });
});
