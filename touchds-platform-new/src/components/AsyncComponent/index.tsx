import React from 'react'
import Loadable from 'react-loadable'

const AsyncComponent = (component: any) => {
    return Loadable({
        loader: component,
        loading: () => <div>loading</div>
    })
}
export default AsyncComponent
