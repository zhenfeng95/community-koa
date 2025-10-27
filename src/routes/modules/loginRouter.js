import Router from 'koa-router';
const router = new Router();

import loginController from '@/api/LoginController';

router.prefix('/login');

router.post('/forget', loginController.forget);

router.post('/login', loginController.login);

router.post('/reg', loginController.reg);

export default router;
