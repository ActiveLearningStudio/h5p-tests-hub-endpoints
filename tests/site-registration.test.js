import test from 'ava';
import fetch from 'node-fetch';

test.beforeEach(async t => {
  t.context.data = await fetch('https://api.h5p.org/v1/sites')
    .then(data => data.json());
});

test('Site registration endpoint should yield a unique site key', t => {
  const uuid = t.context.data.uuid;
  t.truthy(uuid.length);
});

test('Site registration endpoint should yield a uuid that is 36 characters long', t => {
  const uuid = t.context.data.uuid;
  t.truthy(uuid.length === 36);
});
