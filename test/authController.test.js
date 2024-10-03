// test/authController.test.js
const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const user = require('../db/models/user');
const authController = require('../controller/authController'); // Adjust path accordingly

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
        sinon.restore(); // Restore all stubs after each test
    });

    describe('signup', () => {
        it('should create a new user with valid input', async () => {
            req.body = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                confirmPassword: 'password123',
            };

            sinon.stub(user, 'findOne').returns(Promise.resolve(null)); // No user found
            sinon.stub(bcrypt, 'hash').returns(Promise.resolve('hashedPassword'));
            sinon.stub(user, 'create').returns(Promise.resolve({ toJSON: () => ({
                id: 'uuid-1234',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                account_created: new Date(),
                account_updated: new Date(),
            }) }));

            await authController.signup(req, res);
            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledOnce).to.be.true;

            user.findOne.restore();
            bcrypt.hash.restore();
            user.create.restore();
        });

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

        it('should return 400 if password and confirmPassword do not match', async () => {
            req.body = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                confirmPassword: 'password321',
            };

            await authController.signup(req, res);
            expect(res.status.calledWith(400)).to.be.true;
        });

        it('should return 400 if email already exists', async () => {
            req.body = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                confirmPassword: 'password123',
            };

            sinon.stub(user, 'findOne').returns(Promise.resolve({})); // User exists

            await authController.signup(req, res);
            expect(res.status.calledWith(400)).to.be.true;

            user.findOne.restore();
        });
    });

    describe('basicAuth', () => {
        // it('should authenticate user with valid credentials', async () => {
        //     const password = 'password123'; // Plaintext password
        //     const hashedPassword = await bcrypt.hash(password, 10); // Hash it
        
        //     const userData = {
        //         id: 'uuid',
        //         firstName: 'John',
        //         lastName: 'Doe',
        //         email: 'john.doe@example.com',
        //         password: hashedPassword, // Use the hashed password
        //     };
        
        //     // Stub the findOne method to return the mocked user
        //     sinon.stub(user, 'findOne').returns(Promise.resolve(userData));
        
        //     // Create the authorization header
        //     req.headers['authorization'] = `Basic ${Buffer.from('john.doe@example.com:' + password).toString('base64')}`;
        
        //     await authController.basicAuth(req, res, next);
        
        //     sinon.assert.calledOnce(next);
        //     sinon.assert.notCalled(res.status);
        // });
        
        it('should return 401 if authorization header is missing', async () => {
            await authController.basicAuth(req, res, next);
            expect(res.status.calledWith(401)).to.be.true;
        });

        // it('should return 401 if credentials are invalid', async () => {
        //     req.headers['authorization'] = 'Basic ' + Buffer.from('john.doe@example.com:wrongpassword').toString('base64');
        
        //     // Stub the findOne method to return the user with a correct hashed password
        //     const validUser = {
        //         email: 'john.doe@example.com',
        //         password: await bcrypt.hash('password123', 10), // Correct hashed password
        //     };
        
        //     sinon.stub(user, 'findOne').returns(Promise.resolve(validUser)); // Return the user
        
        //     await authController.basicAuth(req, res, next);
        //     expect(res.status.calledWith(401)).to.be.true;
        
        //     user.findOne.restore(); // Ensure to restore the stub
        // });
        
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
        it('should update user with valid input', async () => {
            req.body = {
                email: 'john.doe@example.com',
                firstName: 'Johnny',
                lastName: 'Doe',
                password: 'newpassword123',
            };

            const foundUser = {
                id: 'uuid-1234',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                update: sinon.stub().returns(Promise.resolve()),
            };

            sinon.stub(user, 'findOne').returns(Promise.resolve(foundUser));
            sinon.stub(bcrypt, 'hash').returns(Promise.resolve('newHashedPassword'));

            await authController.updateUser(req, res);
            expect(res.status.calledWith(204)).to.be.true;

            user.findOne.restore();
            bcrypt.hash.restore();
        });

        it('should return 400 if email is not provided', async () => {
            req.body = {
                firstName: 'Johnny',
                lastName: 'Doe',
                password: 'newpassword123',
            };

            await authController.updateUser(req, res);
            expect(res.status.calledWith(400)).to.be.true;
        });

        it('should return 400 if user does not exist', async () => {
            req.body = {
                email: 'john.doe@example.com',
            };

            sinon.stub(user, 'findOne').returns(Promise.resolve(null)); // No user found

            await authController.updateUser(req, res);
            expect(res.status.calledWith(400)).to.be.true;

            user.findOne.restore();
        });
    });
});
