import User from './User';

const test = async () => {
    // let u = await User.findOne({ name: 'Node' });
    // const u = new User({ name: '李四', age: 28 });
    // await u.save();

    // await User.findByIdAndUpdate('670a3f2e4b5e2b1234567890', { name: '王五' });
    const users = await User.find();
    console.log(users);
};

test();
