const SecretModel = require('./model')
const OSS = require('ali-oss');

class SecretController {
    constructor() {
        const STS = OSS.STS;
        const data = SecretModel.getOssBasicData();
        this.sts = new STS({
            accessKeyId: data.accessKeyId,
            accessKeySecret: data.accessKeySecret
        });
        this.create = this.create.bind(this);
    }
    /**
     * 获取token
     * @param ctx
     * @returns {Promise.<void>}
     */
    async create(ctx) {
        try {
            const { userRole, policy, expire, extProps, region, bucket, visitHost, directory } = SecretModel.getOssBasicData();
            const { credentials: { AccessKeyId, AccessKeySecret, SecurityToken } } = await this.sts.assumeRole(
                userRole, policy, expire, extProps
            );
            ctx.response.status = 200;
            ctx.body = {
                code: 200,
                message: 'success',
                data: {
                    region,
                    accessKeyId: AccessKeyId,
                    accessKeySecret: AccessKeySecret,
                    stsToken: SecurityToken,
                    bucket,
                    visitHost,
                    directory
                }
            }
        } catch (err) {
            const status = 503;
            ctx.response.status = status;
            ctx.body = {
                code: status,
                message: err.toString(),
            }
        }
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new SecretController();
        }
        return this._instance;
    }
}

module.exports = SecretController
