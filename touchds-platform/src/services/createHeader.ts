import HmacSHA256 from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';
import MD5 from 'crypto-js/md5';

/**
 * [获得异步header]
 * @param  {[string]} method     [description]
 * @param  {[string]} requestUrl [description]
 * @param  {[string]} bodyStream [description]
 * @return {[object]} headers [description]
 */
export function createHeaders(method: string, requestUrl: string, bodyStream: string) {
    const Timestamp = new Date().getTime();
    const key = '11111111';
    const secret = '222222222222222222222';
    let headers = {};

    let md5: any;
    let contentMD5 = '';

    if (bodyStream) {
        md5 = MD5(bodyStream);
        contentMD5 = Base64.stringify(md5);
    }

    const stringToSigned = `${method}\n${requestUrl}\n${Timestamp}\n${contentMD5}`;

    const sign = Base64.stringify(HmacSHA256(stringToSigned, secret));

    headers = {
        'Content-Type': 'application/json',
        'X-NAME-Ca-Key': key,
        'X-NAME-Ca-Timestamp': Timestamp,
        'X-NAME-Ca-Signature': sign
    };

    return headers;
}
