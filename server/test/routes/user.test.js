import User from '../../../server/app/models/user.model';

describe('User API Routes', () => {
  // beforeEach(() => {
  //   request.post('/api/v1/users')
  //   // TODO: create user
  //   // TODO: intercept create user token
  //   // TODO: verify token
  //   // TODO: sign in, .set('Cookie', [cookie.token])
  //   request.get('/api/v1/sign-in')
  // });

  // describe('GET /users', () => {
  //   it('returns an array of users', done => {
  //     request.get('/api/v1/users').end((err, res) => {
  //       expect(res.statusCode).to.equal(200);
  //       expect(res.body).to.be.an('array');
  //       expect(res.body).to.be.empty;
  //       done();
  //     });
  //   });
  // });

  describe('# POST /users', () => {
    const user = {
      firstName: 'Pat',
      lastName: 'Schneeweis',
      password: 'cb01MK#3',
      email: 'ptb15@example.test.com',
    };
    it('creates a new user', done => {
      request
        .post('/api/v1/users')
        .send(user)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.firstName).to.equal(user.firstName);
          expect(res.body.lastName).to.equal(user.lastName);
          expect(res.body.email).to.equal(user.email);
          expect(res.body).to.not.have.property('password');
          User.findByIdAndRemove({ _id: res.body._id }, (err, data) => {
            if (err) {
              console.log(err);
            }
          });
          done();
        });
    });
  });
});
