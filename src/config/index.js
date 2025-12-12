import path from 'path';

const MONGO_USERNAME = process.env.DB_USER || 'koa';
const MONGO_PASSWORD = process.env.DB_PASS || '925926';
const MONGO_HOSTNAME = process.env.DB_HOST || '47.95.36.160';
const MONGO_PORT = process.env.DB_PORT || '27018';
const DB_NAME = process.env.DB_NAME || 'koa';

const DB_URL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${DB_NAME}`;

// console.log('DB_URL', DB_URL)

const REDIS = {
    host: process.env.REDIS_HOST || '47.95.36.160',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASS || '925926',
};

const JWT_SECRET = 'zzf';

const baseUrl = process.env.NODE_ENV === 'production' ? 'https://tech.zzf.net.cn' : 'http://localhost:8080';

const uploadPath = process.env.NODE_ENV === 'production' ? '/app/public' : path.join(path.resolve(__dirname), '../../public');

const adminEmail = ['285273676@qq.com'];

const publicPath = [/^\/v1\/public/, /^\/v1\/login/, /^\/v1\/content/, /^\/v1\/user/, /^\/v1\/comments/];

const isDevMode = process.env.NODE_ENV !== 'production';

const port = 3002;
const wsPort = 3003;

const AppID = 'wxc47d78881f2e620c';
const AppSecret = 'your-app-secret';

const SubIds = [
    'e1vWHQiTOW9_cP6l31RtO_SDc41hOfhcqhWFCb0cquk',
    '3icSr0YIBLcMSYXchHBTWgCiAAom4lrkJqZAf2pVc-4',
    '6q9Rrn0uekifZbdMuhfzmvexEnZh0Qcv2gfHUBsi1kk',
    'xVA_zdzgM8zPtpDOO92rpK9kQumz4O84E7sTy9Ihfds',
    'sG80CJj2GvArifGRCWOJhumIyY5mQnM94RWGQkdctGc',
];

export default {
    DB_NAME,
    MONGO_HOSTNAME,
    DB_URL,
    REDIS,
    JWT_SECRET,
    baseUrl,
    uploadPath,
    adminEmail,
    publicPath,
    isDevMode,
    port,
    wsPort,
    AppID,
    AppSecret,
    SubIds,
};
