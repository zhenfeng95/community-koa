import { createClient } from 'redis';
import config from './index';

const options = {
    socket: {
        host: config.REDIS.host, // 服务器地址
        port: config.REDIS.port // Redis 端口
    },
    password: config.REDIS.password,
    no_ready_check: true,
    detect_buffers: true
};

let client = createClient(options);

// 连接 Redis（只执行一次）
const initRedis = async () => {
    if (!client.isOpen) {
        await client.connect();
    }
    return client;
};

client.on('error', err => {
    console.error('❌ Redis Client Error:', err.message);
    setTimeout(async () => {
        await initRedis();
    }, 2000);
});

client.on('connect', () => {
    console.log('✅ Redis connected successfully');
});

client.on('end', () => {
    console.log('redis connection has closed');
});

client.on('reconnecting', o => {
    console.log('redis client reconnecting', o.attempt, o.delay);
});

const setValue = async (key, value, time) => {
    await initRedis();
    if (typeof value === 'undefined' || value == null || value === '') {
        return;
    }
    if (typeof value === 'object') {
        await client.hSet(key, value);
    } else {
        if (time) {
            await client.setEx(key, time, value);
        } else {
            await client.set(key, value);
        }
    }
};

const getValue = async key => {
    await initRedis();
    return client.get(key);
};

const getHValue = async key => {
    await initRedis();
    return client.hGetAll(key);
};

const delValue = async key => {
    await initRedis();
    const res = await client.del(key);
    if (res === 1) {
        console.log('delete successfully');
    } else {
        console.log(`⚠️ Failed to delete key "${key}"`);
    }
};

export { client, setValue, getValue, getHValue, delValue };
