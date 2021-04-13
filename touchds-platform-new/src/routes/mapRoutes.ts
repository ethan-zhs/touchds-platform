import AsyncComponent from '@components/AsyncComponent'

export interface IRoutesProps {
    /**
     * 路由
     */
    path: string
    /**
     * 精确匹配路由
     */
    exact: boolean
    /**
     * 组件
     */
    component: any
    /**
     * 权限匹配的唯一标识
     */
    key: string
}

/**
 * 路由配置，配置路由，可以拥有相同的key，
 * 表示这个key具有两个路由的权限 例如频道
 * 文章的编辑页面 只要拥有频道文章的权限就
 * 可以拥有编辑页面的权限，所以他们就具有
 * 相同的key
 * breadcrumb的配置必须和路由的path有关
 */

const routes: IRoutesProps[] = [
    {
        path: '/screen/:id',
        exact: true,
        component: AsyncComponent(() => import('@pages/ScreenPage')),
        key: 'screen'
    },
    {
        path: '/login',
        exact: true,
        component: AsyncComponent(() => import('@pages/LoginPage')),
        key: 'login'
    },
    {
        path: '/error',
        exact: true,
        component: AsyncComponent(() => import('@pages/ErrorPage')),
        key: 'error'
    }
]

export default routes
