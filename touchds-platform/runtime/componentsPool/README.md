- 1) 获取组件元数据列表 (组件名称，组件名称KEY，组件类型，组件预览图, 最新的版本等等)

查询组件列表的接口，如：`GET -/verdaccio/packages`

```json
[
  { 
    "name": "div", 
    "nameComponent": "用于显示的组件名称",
    "thumb": "https://xxx/xxx.png",
    "version": "0.1.2",
    "type": "others"
  }
]
```

- 2) 根据组件KEY和组件版本获取组件

- 2.1) 根据用户选择的组件版本，从

查询对应版本组件数据的接口，如以下流程：

`GET /${NAME}/${VERSION}` => `GET /${NAME}/-/${NAME}-${VERSION}.tgz`

获取到组件的`package.json`; 

- 2.1.1) 再从`package.json`中获取`CDN`的地址
- 2.1.2) 或者直接获取具体的js通过`eval(...)`执行 **<-- 实现这个 --**

- 2.2) 执行JS后，JS中组件通过全局方法定义

```js
window.itouchtvDataPageDefineComponent(
  'div', 
  { version: '0.1.2' }, 
  { optionsMenu: [ /* ... */ ] }, 
  function() {
    return function() {
      return document.createElement('div');
    }
  }
);
```

- 3) 单个组件通过发布到私有仓库后即可通过上述流程被加载 
