const expressJwt = require('express-jwt');

function authJwt() {
  const secret = process.env.SECRET;
  const api = process.env.API_URL;

  return expressJwt({
    secret,
    algorithms: ['HS256'],
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

module.exports = authJwt;
