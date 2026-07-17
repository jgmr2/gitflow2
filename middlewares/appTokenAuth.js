const jwt = require('jsonwebtoken');

const APP_TOKEN_SCOPE = 'app-token';

function appTokenAuth(req, res, next) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'JWT_SECRET no está configurado en el servidor' });
  }

  const token = req.header('app-token');
  if (!token) {
    return res.status(401).json({ error: 'Falta el application token (header app-token)' });
  }

  try {
    const payload = jwt.verify(token, secret);
    if (payload.scope !== APP_TOKEN_SCOPE) {
      return res.status(401).json({ error: 'Application token inválido' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Application token inválido' });
  }
}

module.exports = appTokenAuth;
