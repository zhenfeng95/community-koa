// 手动补全 Web Streams API
global.ReadableStream = require('stream/web').ReadableStream;
global.WritableStream = require('stream/web').WritableStream;
global.TransformStream = require('stream/web').TransformStream;
global.Blob = require('buffer').Blob;
global.File = require('buffer').File;

const Koa = require('koa');
const koaJWT = require('koa-jwt');
const app = new Koa();
const path = require('path');
const Router = require('koa-router');
// const router = new Router();
const router = require('./routes/index');
const cors = require('@koa/cors');
const { koaBody } = require('koa-body');
const json = require('koa-json');
const helmet = require('koa-helmet');
const statics = require('koa-static');
const compose = require('koa-compose');
const compress = require('koa-compress');
import config from './config/index';
import errorHandle from './common/ErrorHandle';
import md5 from 'md5';

import dotenv from 'dotenv';
dotenv.config();

import User from './model/User';
import { setValue, getValue, delValue, getHValue } from './config/RedisConfig';

// setValue('express', '5.0.0');
// const val = await getValue('express');
// console.log(val);

async function testRedis() {
    // await setValue('imoocObj12', { name: 'node', age: 18 });
    // const val = await getHValue('imoocObj');
    // console.log(val);
    await delValue('name1');
}
// testRedis();

// const mongoose = require('mongoose');

// main()
//     .then(() => {
//         console.log('✅ MongoDB connected');
//     })
//     .catch(err => console.log(err));
// async function main() {
//     await mongoose.connect('mongodb://koa:925926@47.95.36.160:27018/koa');
// }

// const UserSchema = new mongoose.Schema({
//     name: String,
//     age: Number
// });

// const User = mongoose.model('users', UserSchema);

async function test() {
    // let u = await User.findOne({ name: 'Node' });
    // 创建
    // const u = new User({ name: '李四', age: 28 });
    // await u.save();

    // 更新一个
    // await User.updateOne({ name: '李四' }, { age: 26 });
    // 通过ID更新
    // await User.findByIdAndUpdate('68f5cf8223e1c36ef8c7d8f2', { name: '王五' });

    // 删除一个
    // await User.deleteOne({ name: 'Node' });

    // 查询所有
    const users = await User.find();
    console.log(users);
}

// test();

const isDevMode = process.env.NODE_ENV === 'production' ? false : true;

// router.prefix('/api');

// router.get('/', async (ctx, next) => {
//     ctx.body = 'Hello World';
// });

// router.get('/msg', async (ctx, next) => {
//     let params = ctx.request.query;
//     console.log(params);
//     ctx.body = `
//     {
//         code: 0,
//         data: ${JSON.stringify(params)},
//         message: '请求成功'
//     }
//     `;
// });

// router.post('/post', async (ctx, next) => {
//     let { body } = ctx.request;
//     console.log(ctx.request);

//     ctx.body = `{
//         code: 0,
//         data: ${JSON.stringify(body)},
//         message: '请求成功'
//     }`;
// });

// 定义公共路径，不需要jwt鉴权
const jwt = koaJWT({ secret: md5(process.env.JWT_SECRET) }).unless({
    path: [/^\/v1\/public/, /^\/v1\/login/]
});

/**
 * 使用koa-compose 集成中间件
 */
const middleware = compose([
    koaBody(),
    cors(),
    json({ pretty: false, param: 'pretty' }),
    helmet(),
    statics(path.join(__dirname, '../public')),
    errorHandle,
    jwt
]);

if (!isDevMode) {
    app.use(compress());
}

app.use(middleware);

// app.use(router.routes()).use(router.allowedMethods());

app.use(router());

app.listen(3002);
