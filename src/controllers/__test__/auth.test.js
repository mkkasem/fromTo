const mongoose = require('mongoose');

const request = require('supertest');

const bcrypt = require('bcrypt');

const server = require('../../app');

const { closeDatabase, clearDatabase } = require('../../db/connection');

const mockUser = {
  username: 'ahmad.kasem',
  firstName: 'ahmad',
  lastName: 'kasem',
  email: 'ahmad1997@gmail.com',
  password: 'Password1234',
  passwordConfirm: 'Password1234',
  phone: '+90535555555',
  acceptTerms: true,
};

const userWithUsedEmail = {
  username: 'ali.hasan',
  firstName: 'ali',
  lastName: 'kasem',
  email: 'ahmad1997@gmail.com',
  password: 'Password1234',
  passwordConfirm: 'Password1234',
  phone: '+90535555555',
  acceptTerms: true,
};

const userWithEmptyUsername = {
  username: '',
  firstName: 'ali',
  lastName: 'hasan',
  email: 'ali1997@gmail.com',
  password: 'Password1234',
  passwordConfirm: 'Password1234',
  phone: '+90535555555',
  acceptTerms: true,
};

const userWithEmptyEmail = {
  username: 'ali.hasan',
  firstName: 'ali',
  lastName: 'kasem',
  email: '',
  password: 'Password1234',
  passwordConfirm: 'Password1234',
  phone: '+90535555555',
  acceptTerms: true,
};

const userWithNotMatchingPasswords = {
  username: 'ali.hasan',
  firstName: 'ali',
  lastName: 'kasem',
  email: 'ali1997@gmail.com',
  password: 'Password1234',
  passwordConfirm: 'Password12345',
  phone: '+90535555555',
  acceptTerms: true,
};
const userNotAcceptTerms = {
  username: 'ali.hasan',
  firstName: 'hasan',
  lastName: 'bey',
  email: 'ali1997@gmail.com',
  password: 'Password1234',
  passwordConfirm: 'Password1234',
  phone: '+90535555555',
  acceptTerms: false,
};
beforeAll(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await closeDatabase();
  server.close();
});

describe('Auth Endpoints', () => {
  describe('POST /api/auth/signup', () => {
    test('Should sign up a new user', async () => {
      const res = await request(server).post('/api/auth/signup').send(mockUser);

      expect(res.statusCode).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body.firstName).toBe(mockUser.firstName);

      const user = await mongoose.connection
        .collection('users')
        .findOne({ username: mockUser.username });

      expect(user).toBeDefined();
      expect(user.username).toEqual(mockUser.username);
      expect(user.firstName).toEqual(mockUser.firstName);
      expect(user.lastName).toEqual(mockUser.lastName);
      expect(user.email).toEqual(mockUser.email);
      expect(user.phone).toEqual(mockUser.phone);
    });

    test('Should hash password with bcrypt', async () => {
      const user = await mongoose.connection
        .collection('users')
        .findOne({ username: mockUser.username });

      expect(user).toBeDefined();

      const validHashedPassword =
        user && (await bcrypt.compare(mockUser.password, user.password_hash));

      expect(validHashedPassword).toBe(true);
    });

    test('Should throw an error if the username is already used', async () => {
      const res = await request(server).post('/api/auth/signup').send(mockUser);

      expect(res.header.location).toBe(undefined);
      expect(res.statusCode).toBe(422);
      expect(res.text).toMatch(/username already used/i);
    });

    test('Should throw an error if the username is empty', async () => {
      const res = await request(server)
        .post('/api/auth/signup')
        .send(userWithEmptyUsername);

      expect(res.header.location).toBe(undefined);
      expect(res.statusCode).toBe(422);
      expect(res.text).toMatch(/Username is required/i);
    });

    test('Should throw an error if the email is already used', async () => {
      const res = await request(server)
        .post('/api/auth/signup')
        .send(userWithUsedEmail);

      expect(res.header.location).toBe(undefined);
      expect(res.statusCode).toBe(422);
      expect(res.text).toMatch(/email already used/i);
    });

    test('Should throw an error if the email is empty', async () => {
      const res = await request(server)
        .post('/api/auth/signup')
        .send(userWithEmptyEmail);

      expect(res.header.location).toBe(undefined);
      expect(res.statusCode).toBe(422);
      expect(res.text).toMatch(/Email is required/i);
    });

    test('Should throw an error if the passwords do not match', async () => {
      const res = await request(server)
        .post('/api/auth/signup')
        .send(userWithNotMatchingPasswords);

      expect(res.header.location).toBe(undefined);
      expect(res.statusCode).toBe(422);
      expect(res.text).toMatch(/Passwords do not match/i);
    });

    test('Should throw an error if the user does not accept terms', async () => {
      const res = await request(server)
        .post('/api/auth/signup')
        .send(userNotAcceptTerms);

      expect(res.header.location).toBe(undefined);
      expect(res.statusCode).toBe(422);
      expect(res.text).toMatch(/You must accept the terms and conditions/i);
    });
  });
});
