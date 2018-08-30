const express = require('express');
const apicache = require('apicache');

const cache = apicache.middleware;
const router = express.Router();

const wordApi = require('../src/word/word.api');
const userApi = require('../src/user/user.api');
const voteApi = require('../src/vote/vote.api');

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

// This amazing method will wrap a route with the
// designated method and take care of error handling!
const routeWrapper = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/hello', (req, res) => {
  res.send('Hello World');
});

router.get('/dicionario', cache('6 hours'), routeWrapper(wordApi.getDicionario));

router.get('/palavras', routeWrapper(wordApi.getPalavras));
router.get('/palavras/:name', isAuthenticated, isAdmin, routeWrapper(wordApi.getPalavra));
router.post('/palavras', isAuthenticated, isAdmin, routeWrapper(wordApi.addPalavra));

router.get('/voto/palavra', isAuthenticated, routeWrapper(voteApi.getPalavraVoto));
router.post('/voto', isAuthenticated, routeWrapper(voteApi.votarPalavra));

router.get('/ranking', routeWrapper(userApi.getRanking));
router.get('/users/:id', isAuthenticated, isAdmin, routeWrapper(userApi.getUser));

module.exports = router;
