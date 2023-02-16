const expressJwt = require('express-jwt');

function authJwt() {
  const secret = process.env.SECRET;
  const api = process.env.API_URL;

  return expressJwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: isRevoked, // to get isAdmin from the token
  }).unless({
    path: [
      {
        url: { url: /\/api\/v1\/books(.*)/, methods: ['GET', 'OPTIONS'] },
        url: { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
        methods: ['GET', 'OPTIONS'],
      },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}

// if isAdmin is false, then reject users trying to get into the admin panel
// if true, allow
async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  }
  done();
}

module.exports = authJwt;
