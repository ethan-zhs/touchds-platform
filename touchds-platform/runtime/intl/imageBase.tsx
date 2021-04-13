/**
 * Created by tommyZZM.OSX on 2019/12/17.
 */
const KEY = '--image-base';

const VERSION = '0.1.0';

export function define() {
    const { itouchtvDataPageDefineComponent } = (window as any);
    itouchtvDataPageDefineComponent(KEY, {
        version: VERSION
    }, async function({ React }: any) {
        return class extends React.Component<any, any> {
            render() {
                const { src } = this.props;
                return (
                    <img src={src} style={{ width: '100%', height: '100%' }}/>
                );
            }
        };
    });
}

export default {
    name: KEY,
    nameComponent: '基础图片',
    version: VERSION,
    typeComponent: 'others',
    categoryComponent: 'regular',
    initialProps: {
        src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQ4AAACgBAMAAAAP/p+8AAAAIVBMVEX///8z4dIVxfpe4e421+cdz+op1uIEvvsMxPQWy+wh0+IApHV4AAAAB3RSTlMN/noqW9WqzWP+OAAAAf5JREFUeNrt1r1v1DAYBvBHl1x2l48h09GpdAoSRdApCImqTJGQKDBRsUBnIDcX0DkborSKMxHxIZ3/ytpOokZVdbfZrfT87HOeu+V9L7GsgIiIiIiIiIiIiIiIiIiIbrjn4lWG8B4JIW4juEhYOUJLhHULoT0V1l2Edk84CO2QfVyxP+4gtAfC2sBIjgBiYRW4kBQI4TBNU5GNn1SQ09XdkPe4EIXaLPHmM4xMRTvDNbCdpuFPeSBudbqB8HZ0qttr8D5ylLatfofQJtpo/yC0XW39R2hvtZMjrER3CoT1Qnf+IoCHGES69w8BHGXoJcuensG7ybJAb7tpltrO5je8223O0InMnWiUncuf8O6NUjmcaaNU10jTZPAsUUt1AuejapRjLt6P9n1T9xRWrEZO4FdkHkv/75+okTP4lSjrV7dRxjJ4db+qalXZqhNlgzKrudaqgE+RLWqYqvuyNmRddb7Bp6msbPnqGNHr2qnMD9YpfNoyVaXpReaJ7NRmODn8ieXg5ZZ0/Rh9+AF/duTgu7zsGP58kCvAm1jO5wtpmWCWPttkxgy+PJ4b5cJ+FnaVJpfmi0uLr/DlYFGaMXe13XQdDekLPJmUpW1kYMsPXMrgx165WgE/DsrVPsGLpFzjM7zYK9fJ4cPmWjmIiIiIiIiIiIiIiIiIiOiGOgcRpFj4HHQEMgAAAABJRU5ErkJggg=='
    },
    define
};
