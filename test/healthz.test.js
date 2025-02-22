// const request = require('supertest');
// const app = require('../app'); 
// const { expect } = require('chai');

// describe('Health Check Route', () => {
//     it('should return 405 Method Not Allowed for HEAD requests', (done) => {
//         request(app)
//             .head('/healthz')
//             .expect(405, done);
//     });

//     it('should return 200 OK for valid GET requests', (done) => {
//         request(app)
//             .get('/healthz')
//             .expect(200, done);
//     });

//     it('should return 400 Bad Request for GET requests with query parameters', (done) => {
//         request(app)
//             .get('/healthz?param=value')
//             .expect(400, done);
//     });

//     it('should return 400 Bad Request for GET requests with body data', (done) => {
//         request(app)
//             .get('/healthz')
//             .send({ key: 'value' })
//             .expect(400, done);
//     });

//     it('should return 400 Bad Request for GET requests with authorization header', (done) => {
//         request(app)
//             .get('/healthz')
//             .set('Authorization', 'Bearer token')
//             .expect(400, done);
//     });

//     it('should return 400 Bad Request for GET requests with content length', (done) => {
//         request(app)
//             .get('/healthz')
//             .set('Content-Length', '10')
//             .expect(400, done);
//     });

//     it('should return 405 Method Not Allowed for unsupported methods', (done) => {
//         request(app)
//             .put('/healthz')
//             .expect(405, done);
//     });

//     it('should return 404 Not Found for GET requests to other paths', (done) => {
//         request(app)
//             .get('/unknownpath')
//             .expect(404, done);
//     });
// });
// test/healthz.test.js

const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('Health Check Route', () => {
    let app, healthCheckStub;

    before(() => {
        healthCheckStub = sinon.stub().callsFake((req, res) => res.status(200).send());
        
        const appModule = proxyquire('../app', {
            './middleware/databaseCheck': { healthCheck: healthCheckStub }
        });

        app = appModule.app;
    });

    after(() => {
        sinon.restore();
    });

    it('should return 405 Method Not Allowed for HEAD requests', (done) => {
        request(app)
            .head('/healthz')
            .expect(405, done);
    });

    it('should return 200 OK for valid GET requests', (done) => {
        request(app)
            .get('/healthz')
            .expect(200, done);
    });
});

// ----------x----------

// const request = require('supertest');
// const { app } = require('../app'); 
// const { expect } = require('chai');
// const { sequelize } = require('../db/models/index');
// const sinon = require('sinon');

// describe('Health Check Route', () => {
//     before(() => {
//       sinon.stub(sequelize, 'authenticate').resolves();
//     });
  
//     after(() => {
//       sinon.restore();
//     });
//     it('should return 405 Method Not Allowed for HEAD requests', (done) => {
//         request(app)
//             .head('/healthz')
//             .expect(405, done);
//     });

//     it('should return 200 OK for valid GET requests', (done) => {
//         request(app)
//             .get('/healthz')
//             .expect(200, done);
//     });
// });

// ----------x----------


    // it('should return 400 Bad Request for GET requests with query parameters', (done) => {
    //     request(app)
    //         .get('/healthz?param=value')
    //         .expect(400, done);
    // });

    // it('should return 400 Bad Request for GET requests with body data', (done) => {
    //     request(app)
    //         .get('/healthz')
    //         .send({ key: 'value' })
    //         .expect(400, done);
    // });

    // it('should return 400 Bad Request for GET requests with authorization header', (done) => {
    //     request(app)
    //         .get('/healthz')
    //         .set('Authorization', 'Bearer token')
    //         .expect(400, done);
    // });

    // it('should return 400 Bad Request for GET requests with content length', (done) => {
    //     request(app)
    //         .get('/healthz')
    //         .set('Content-Length', '10')
    //         .expect(400, done);
    // });

    // it('should return 405 Method Not Allowed for unsupported methods', (done) => {
    //     request(app)
    //         .put('/healthz')
    //         .expect(405, done);
    // });

    // it('should return 404 Not Found for GET requests to other paths', (done) => {
    //     request(app)
    //         .get('/unknownpath')
    //         .expect(404, done);
    // });
// });
