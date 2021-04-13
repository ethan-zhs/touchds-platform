
export default function tryJSONStringify(input: any, defaultValue: any = ''): any {
    try {
        return JSON.stringify(input);
    } catch (errorMessage) {
        return defaultValue;
    }
}
