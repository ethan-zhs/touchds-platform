
export default function tryJSONParse(input: any, defaultValue: any = null): any {
    try {
        return JSON.parse(input);
    } catch (error) {
        return defaultValue;
    }
}
