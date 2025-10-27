const svgCaptcha = require('svg-captcha');
import { setValue, getValue } from '../config/RedisConfig';
class PublicController {
    // 获取图片验证码
    async getCaptcha(ctx) {
        const body = ctx.query;
        const newCaptca = svgCaptcha.create({
            size: 4,
            ignoreChars: '0oO1ilLI',
            color: true,
            noise: Math.floor(Math.random() * 5),
            width: 150,
            height: 38
        });
        if (typeof body.sid === 'undefined') {
            ctx.body = {
                code: 500,
                msg: '参数不全！'
            };
            return;
        }
        // 保存图片验证码数据，设置超时时间，单位: s
        // 设置图片验证码超时10分钟
        await setValue(body.sid, newCaptca.text, 10 * 60);
        ctx.body = {
            code: 0,
            data: newCaptca.data
        };
    }
}

export default new PublicController();
