// dependencies
import assert from 'power-assert';
import moment from 'moment';
import request from 'supertest';

// target
import npmToday from '../../src/server';

// specs
describe('npmToday middleware', () => {
  describe('.fetchTrending via npmToday middleware', () => {
    it('redirect to last-day of api.npmjs.org', (done) => (
      request(npmToday)
        .get('/downloads')
        .expect(302, /downloads\/\d{4}-\d{2}-\d{2}/, done)
    ));

    it('returns the last-day of api.npmjs.org', (done) => (
      request(npmToday)
        .get('/downloads/last-day')
        .expect(200, /\d{4}-\d{2}-\d{2}/)
        .end((error, { text: lastday }) => {
          const utcYesterday = moment.utc().subtract(1, 'days').startOf('day').format('YYYY-MM-DD');

          assert(lastday === utcYesterday);
          done(error);
        })
    ));

    it('returns the trending top 500 packages of passed date', (done) => (
      request(npmToday)
        .get('/downloads/2016-03-09')
        .expect(200)
        .expect((response) => {
          assert(response.body.length === 500);
        })
        .end(done)
    ));
  });
});
