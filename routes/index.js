const express = require('express');
const apicache = require('apicache');

const cache = apicache.middleware;
const router = express.Router();

const wordRoutes = require('../src/word/word.api');
const userRoutes = require('../src/user/user.api');
const voteRoutes = require('../src/vote/vote.api');

const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    const error = new Error('Usuário não autenticado');
    error.status = 401;
    throw error;
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (!req.user.admin) {
    const error = new Error('Permissões insuficientes');
    error.status = 401;
    throw error;
  }
  next();
};

const routeWrapper = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/api', (req, res) => {
  res.send('It works');
});

router.get('/dicionario', cache('12 hours'), routeWrapper(wordRoutes.getDicionario));

router.get('/palavras', routeWrapper(wordRoutes.getPalavras));
router.get('/palavras/:name', isAuthenticated, isAdmin, routeWrapper(wordRoutes.getPalavra));
router.post('/palavras', isAuthenticated, isAdmin, routeWrapper(wordRoutes.addPalavra));

router.get('/voto/palavra', isAuthenticated, routeWrapper(voteRoutes.getPalavraVoto));
router.post('/voto', isAuthenticated, routeWrapper(voteRoutes.votarPalavra));

router.get('/ranking', routeWrapper(userRoutes.getRanking));
router.get('/users/:id', isAuthenticated, isAdmin, routeWrapper(userRoutes.getUser));

module.exports = router;
