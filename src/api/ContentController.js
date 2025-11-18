import Article from '@/model/Article';
import Links from '@/model/Links';
import fs from 'fs';
import qs from 'qs';
import moment from 'dayjs';
import config from '@/config';
// import { hwUpload } from '@/common/HwUtils';
// import dirExists from '@/common/Utils';
import makeDirectory from 'make-dir';
import { v4 as uuidv4 } from 'uuid';
// import { wxMsgCheck, wxImgCheck } from '@/common/WxUtils';
class ContentController {
    // 获取文章列表
    async getPostList(ctx) {
        const body = qs.parse(ctx.query);

        const sort = body.sort ? body.sort : 'created';
        const page = body.page ? parseInt(body.page) : 0;
        const limit = body.limit ? parseInt(body.limit) : 20;
        const options = {};

        // const post = await Article({
        //     title: '测试share',
        //     content: '测试内容share',
        //     catalog: 'share',
        //     fav: 20,
        //     isEnd: '0',
        //     reads: '0',
        //     answer: '0',
        //     status: '0',
        //     isTop: '0',
        //     sort: '0',
        //     tags: [{ name: '精华', class: '' }]
        // });

        // const tmp = await post.save();
        // console.log(tmp);

        if (body.title) {
            options.title = { $regex: body.title };
        }
        if (body.catalog && body.catalog.length > 0) {
            options.catalog = { $in: body.catalog };
        }
        if (body.isTop) {
            options.isTop = body.isTop;
        }
        if (body.isEnd) {
            options.isEnd = body.isEnd;
        }
        if (body.status) {
            options.status = body.status;
        }
        if (typeof body.tag !== 'undefined' && body.tag !== '') {
            options.tags = { $elemMatch: { name: body.tag } };
        }
        const result = await Article.getList(options, sort, page, limit);
        // const total = await Article.countList(options);

        ctx.body = {
            code: 0,
            data: result,
            msg: '获取文章列表成功',
            // total: total
        };
    }

    // 查询友链
    async getLinks(ctx) {
        const result = await Links.find({ type: 'links' });
        // const post = await Links({
        //     title: '个人网站',
        //     link: 'https://zzf.net.cn',
        //     type: 'tips',
        //     isTop: '0',
        //     sort: '0'
        // });

        // const tmp = await post.save();
        // console.log(tmp);

        ctx.body = {
            code: 0,
            data: result,
        };
    }

    // 查询温馨提醒
    async getTips(ctx) {
        const result = await Links.find({ type: 'tips' });
        ctx.body = {
            code: 0,
            data: result,
        };
    }

    // 本周热议
    async getTopWeek(ctx) {
        const result = await Article.getTopWeek();
        ctx.body = {
            code: 0,
            data: result,
        };
    }

    // 上传图片
    async uploadImg(ctx) {
        const file = ctx.request.files.file;
        // 图片名称、图片格式、存储的位置，返回前台一可以读取的路径
        // 本地上传
        // const ext = file.name.split('.').pop();
        const ext = file.newFilename.split('.').pop();
        const dir = `${config.uploadPath}/${moment().format('YYYYMMDD')}`;
        // // 判断路径是否存在，不存在则创建
        await makeDirectory(dir);
        // // 存储文件到指定的路径
        // // 给文件一个唯一的名称
        const picname = uuidv4();
        const destPath = `${dir}/${picname}.${ext}`;
        const reader = fs.createReadStream(file.filepath);
        const upStream = fs.createWriteStream(destPath);
        const filePath = `/${moment().format('YYYYMMDD')}/${picname}.${ext}`;
        // // method 1
        reader.pipe(upStream);

        // const stat = fs.statSync(file.filepath);
        // 获取上传文件大小
        // console.log(stat.size);
        // method 2
        // 控制上传进度
        // let totalLength = 0;
        // reader.on('data', chunk => {
        //     totalLength += chunk.length;
        //     console.log(totalLength);
        //     if (upStream.write(chunk) === false) {
        //         reader.pause();
        //     }
        // });

        // upStream.on('drain', () => {
        //     reader.resume();
        // });

        // reader.on('end', () => {
        //     upStream.end();
        // });

        ctx.body = {
            code: 0,
            msg: '图片上传成功',
            data: filePath,
        };

        // 接第三方服务上传
        // const result = await wxImgCheck(file);
        // if (result.errcode === 0) {
        //     const uuid = uuidv4();
        //     // 图片名称、图片格式、存储的位置，返回前台一可以读取的路径
        //     const user = await User.findByID(ctx._id);
        //     const fileName = `${user.username}/${moment().format('YYYY-MM-DD')}/${uuid}-${file.name}`;
        //     try {
        //         const result = await hwUpload(fileName, file.path);
        //         ctx.body = {
        //             code: 0,
        //             msg: '图片上传成功',
        //             data: result,
        //         };
        //     } catch (error) {
        //         ctx.body = {
        //             code: 500,
        //             msg: '图片上传失败' + error.message,
        //         };
        //     }
        // } else {
        //     ctx.body = {
        //         code: 0,
        //         msg: result.errmsg,
        //     };
        // }
    }
}

export default new ContentController();
