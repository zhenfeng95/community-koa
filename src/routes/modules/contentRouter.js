import Router from 'koa-router';
const router = new Router();

import contentController from '@/api/ContentController';

router.prefix('/v1/content');

// 上传图片
router.post('/upload', contentController.uploadImg);

export default router;
