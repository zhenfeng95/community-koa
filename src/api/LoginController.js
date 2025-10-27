import send from '@/config/MailConfig';
import bcrypt from 'bcrypt';
import moment from 'dayjs';
import config from '@/config';
import { checkCode, generateToken, checkRedisAccountCode, getTempName } from '@/common/Utils';
import jwt from 'jsonwebtoken';
import md5 from 'md5';
import User from '@/model/User';

class LoginController {
    // 忘记密码，发送邮件
    async forget(ctx) {
        const { body } = ctx.request;
        // const user = await User.findOne({ username: body.username });
        // if (!user) {
        //     ctx.body = {
        //         code: 404,
        //         msg: '请检查账号！'
        //     };
        //     return;
        // }
        try {
            // const key = uuidv4();
            // setValue(
            //     key,
            //     jsonwebtoken.sign({ _id: user._id }, config.JWT_SECRET, {
            //         expiresIn: '30m'
            //     }),
            //     30 * 60
            // );
            // body.username -> database -> email
            const result = await send({
                // type: 'reset',
                // data: {
                //     key: key,
                //     username: body.username
                // },
                code: 123456,
                expire: moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
                email: body.username,
                user: '小皮球'
                // user: user.name ? user.name : body.username
            });
            ctx.body = {
                code: 0,
                data: result,
                msg: '邮件发送成功'
            };
        } catch (e) {
            console.log(e);
        }
    }

    // 登录
    async login(ctx) {
        // 接收用户的数据
        // 返回token
        const { body } = ctx.request;
        const sid = body.sid;
        const code = body.code;
        // 验证图片验证码的时效性、正确性
        const result = await checkCode(sid, code);
        if (result) {
            // 验证用户账号密码是否正确
            let checkUserPasswd = false;
            const user = await User.findOne({ username: body.username });
            if (user === null) {
                ctx.body = {
                    code: 500,
                    msg: '用户名或者密码错误'
                };
                return;
            }
            if (await bcrypt.compare(body.password, user.password)) {
                checkUserPasswd = true;
            }
            if (checkUserPasswd) {
                const token = jwt.sign({ username: 'admin' }, md5(process.env.JWT_SECRET), { expiresIn: 60 * 60 * 24 });
                ctx.body = {
                    code: 0,
                    data: {
                        token
                    },
                    msg: '登录成功'
                };
            } else {
                // 用户名 密码验证失败，返回提示
                ctx.body = {
                    code: 500,
                    msg: '用户名或者密码错误'
                };
            }
        } else {
            // 图片验证码校验失败
            ctx.body = {
                code: 401,
                msg: '图片验证码不正确,请检查！'
            };
        }
    }

    // 注册接口
    async reg(ctx) {
        // 接收客户端的数据
        const { body } = ctx.request;
        // 校验验证码的内容（时效性、有效性）
        const sid = body.sid;
        const code = body.code;
        let msg = {};
        // 验证图片验证码的时效性、正确性
        const result = await checkCode(sid, code);
        let check = true;
        if (result) {
            // 查库，看username是否被注册
            const user1 = await User.findOne({ username: body.username });
            if (user1 !== null && typeof user1.username !== 'undefined') {
                msg.username = '此邮箱已经注册，可以通过邮箱找回密码';
                check = false;
            }
            const user2 = await User.findOne({ name: body.name });
            // 查库，看name是否被注册
            if (user2 !== null && typeof user2.name !== 'undefined') {
                msg.name = '此昵称已经被注册，请修改';
                check = false;
            }
            // 写入数据到数据库
            if (check) {
                body.password = await bcrypt.hash(body.password, 5);
                const user = new User({
                    username: body.username,
                    name: body.name,
                    password: body.password,
                    created: moment().format('YYYY-MM-DD HH:mm:ss')
                });
                const result = await user.save();
                ctx.body = {
                    code: 0,
                    data: result,
                    msg: '注册成功'
                };
                return;
            }
        } else {
            // veevalidate 显示的错误
            msg.code = '验证码已经失效，请重新获取！';
        }
        ctx.body = {
            code: 500,
            msg: msg
        };
    }
}

export default new LoginController();
