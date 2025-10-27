export default async (ctx, next) => {
    return next().catch(err => {
        if (401 == err.status) {
            ctx.status = 401;
            console.log('我到了这里了');
            ctx.body = {
                code: 401,
                message: 'Protected resource, use Authorization header to get access\n'
            };
        } else {
            ctx.status = err.status || 500;
            ctx.body = Object.assign(
                {
                    code: err.code || 500,
                    msg: err.message
                },
                process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}
            );
            // console.log(err.stack);
        }
    });
};
