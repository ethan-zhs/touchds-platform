## 大屏配置config的格式

```typescript
interface IConfig {
    layers: Map<string, {
        id,
        type,
        comName,
        version,
        attr: {
        
        },
        staticProps: {
            
        },
        envInterface: {
            envGetter: (ctx, env, envDataSource) => any
            envSetter: (ctx, param) => any
        }             
    }>,
    layerList: Array<{
        id: number, // layer Id
        type: string
    }>,
    dataSourceConfigRaw: "{}",
    screenConfig: {
        width: number,
        height: number,
        grid: number,
        display: number,
        backgroundColor: string,
        backgroundImage: string
    },
    lines: {
        v: Array<number>,
        h: Array<number>
    }   
}
```
