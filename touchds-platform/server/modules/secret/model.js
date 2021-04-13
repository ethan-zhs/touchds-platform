const moment = require('moment');

class SecretModel {
    /**
     * 获取token加密对象
     * @param data
     * @returns {Promise<*>}
     */
    static getOssBasicData() {
        try {
            return {
                region: 'oss-cn-shenzhen',
                accessKeyId: '1111111111',
                accessKeySecret: '222222222222222222222',
                bucket: 'bucketName',
                visitHost: "domain",
                directory: `directory/${moment().format('YYYYMMDD')}/`,
                expire: 15 * 60,
                userRole: 'acs:ram::1914286978593386:role/aliyunuploadgrtnossrole',
                extProps: 'userPk'
            };
        } catch (e) {
            throw Error('get oss basic data with error');
        }
    }
}

module.exports = SecretModel