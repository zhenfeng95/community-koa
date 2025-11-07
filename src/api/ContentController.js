import Article from '@/model/Article';
import Links from '@/model/Links';
import qs from 'qs';
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
            msg: '获取文章列表成功'
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
            data: result
        };
    }

    // 查询温馨提醒
    async getTips(ctx) {
        const result = await Links.find({ type: 'tips' });
        ctx.body = {
            code: 0,
            data: result
        };
    }

    // 本周热议
    async getTopWeek(ctx) {
        const result = await Article.getTopWeek();
        ctx.body = {
            code: 0,
            data: result
        };
    }
}

export default new ContentController();
