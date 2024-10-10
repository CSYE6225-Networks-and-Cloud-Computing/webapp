// test/authController.test.js
const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const user = require('../db/models/user'); 
const authController = require('../controller/authController'); 

describe('authController', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {}, headers: {}, user: {} };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
            send: sinon.stub(),
        };
        next = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('signup', () => {
        

        it('should return 400 if fields are missing', async () => {
            req.body = {
                firstName: 'John',
                lastName: '',
                email: 'john.doe@example.com',
                password: 'password123',
                confirmPassword: 'password123',
            };

            await authController.signup(req, res);
            expect(res.status.calledWith(400)).to.be.true;
        });

        
    });

    describe('basicAuth', () => {
        it('should return 401 if authorization header is missing', async () => {
            await authController.basicAuth(req, res, next);
            expect(res.status.calledWith(401)).to.be.true;
        });        
        
    });

    describe('loadDetails', () => {
        it('should return user details', () => {
            req.user = {
                id: 'uuid-1234',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                account_created: new Date(),
                account_updated: new Date(),
            };

            authController.loadDetails(req, res);
            expect(res.json.calledOnce).to.be.true;
        });
    });

    describe('updateUser', () => {        

        it('should return 400 if email is not provided', async () => {
            req.body = {
                firstName: 'Johnny',
                lastName: 'Doe',
                password: 'newpassword123',
            };

            await authController.updateUser(req, res);
            expect(res.status.calledWith(400)).to.be.true;
        });
    });
});
