import mongoose from '../config/DBHelpler';
import moment from 'dayjs';

const ArticleSchema = new mongoose.Schema(
    {
        uid: { type: String, ref: 'users' },
        title: { type: String },
        content: { type: String },
        catalog: { type: String },
        fav: { type: String },
        isEnd: { type: String, default: '0' },
        reads: { type: Number, default: 0 },
        answer: { type: Number, default: 0 },
        status: { type: String, default: '0' },
        isTop: { type: String, default: '0' },
        sort: { type: String, default: 100 },
        tags: {
            type: Array,
            default: [
                // {
                //   name: '',
                //   class: ''
                // }
            ]
        }
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
);

ArticleSchema.statics = {
    /**
     * 获取文章列表数据
     * @param {Object} options 筛选条件
     * @param {String} sort 排序方式
     * @param {Number} page 分页页数
     * @param {Number} limit 分页条数
     */
    getList: function (options, sort, page, limit) {
        return this.find(options)
            .sort({ [sort]: -1 })
            .skip(page * limit)
            .limit(limit)
            .populate({
                path: 'uid', // 通过uid字段关联users表查询字段
                select: 'name isVip pic'
            });
    },

    getTopWeek: function () {
        return this.find(
            {
                created: {
                    $gte: moment().subtract(7, 'days') // $gte表示大于这些时间的
                }
            },
            {
                answer: 1, // 显示哪些字段，1为显示
                title: 1
            }
        )
            .sort({ answer: -1 }) // 排序方式，倒叙
            .limit(15);
    }
};

const ArticleModel = mongoose.model('article', ArticleSchema);

export default ArticleModel;
