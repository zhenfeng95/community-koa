import Router from 'koa-router';
const router = new Router();

import contentController from '@/api/ContentController';

router.prefix('/content');

export default router;
