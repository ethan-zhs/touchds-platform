const schema = require("../../schema")

const { users } = schema;

class UserModel {
    static async queryUserById(data = {}) {
        const { id } = data;
        return await users.findOne({
            attributes: ['id', 'name', 'account', 'email'],
            where: { id }
        });
    }

    /**
     * 用户登录查询
     * @param data
     * @returns {Promise<*>}
     */
    static async queryUser(data = {}) {
        const { account, password } = data;
        return await users.findOne({
            attributes: ['id', 'name', 'account', 'email'],
            where: {
                account,
                password
            }
        });
    }

    static async createUser(data) {
        await users.create({
            name: data.name,
            account: data.account,
            password: data.password
        })
    }
}

module.exports = UserModel
