import { fromJS } from 'immutable';

function randomHash(size: number) {
    const seed = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
        'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
    ];

    let hashStr = '';

    for (let i = 0; i < size; i++) {
        const num = Math.round(Math.random() * (seed.length - 1));
        hashStr += seed[num];
    }

    return hashStr;
}

function copyObject(obj: object) {
    const newObject = fromJS(obj).toJS();

    return newObject;
}

function base64ToFile(base64Data: string) {
    // base64ToBlob
    const dataURLtoBlob = function(dataurl: string) {
        const arr: any = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new Blob([u8arr], { type: mime });
    };

    // 将blob转换为file
    const blobToFile = function(theBlob: any, fileName: string) {
       theBlob.lastModifiedDate = new Date();
       theBlob.name = `${fileName}.${theBlob.type.split('/')[1]}`;
       return theBlob;
    };

    const blob = dataURLtoBlob(base64Data);
    const file = blobToFile(blob, 'base64转换图片');

    return file;
}

export {
    randomHash,
    copyObject,
    base64ToFile
};
