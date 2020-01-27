import React, {useState, useEffect} from 'react'

export type ModuleComponent<P = any> = {
  [property: string]: React.FunctionComponent<P> | React.ClassType<P, any, any>
}
export type ModuleComponentInterop<P> =
  | Promise<ModuleComponent<P>>
  | ModuleComponent<P>
export type AsyncComponentGetter<P> = () => ModuleComponentInterop<P>
export interface AsyncComponentOptions {
  property?: string
  loading?: (props: Record<string, any>) => React.ReactNode | React.ReactNode[]
  error?: (
    exception: any,
    props: Record<string, any>
  ) => React.ReactNode | React.ReactNode[]
}

type AsyncComponentType<P> = React.FC<P> & {
  load: AsyncComponentGetter<P>
}

function createAsyncComponent<P>(
  componentGetter: AsyncComponentGetter<P>,
  options: AsyncComponentOptions = {property: 'default'}
): AsyncComponentType<P> {
  const {property = 'default', loading, error} = options
  let cachedComponent: ModuleComponent<P>
  const PROD =
    typeof process !== 'undefined' && process.env.NODE_ENV === 'production'

  function AsyncComponent(props: P) {
    const [Component, setComponent] = useState<ModuleComponentInterop<P>>(
      cachedComponent || componentGetter
    )
    const [exception, setException] = useState<any>(null)

    useEffect(() => {
      if (typeof Component.then !== 'undefined')
        (Component as Promise<ModuleComponent<P>>)
          .then((mod: ModuleComponent<P>): void => {
            if (PROD) cachedComponent = mod
            setComponent(mod)
          })
          .catch(err => setException(err))
    }, [])

    return typeof Component.then === 'undefined'
      ? React.createElement(Component[property], props)
      : exception
      ? error
        ? error(exception, props)
        : null
      : loading
      ? loading(props)
      : null
  }

  AsyncComponent.load = () => {
    if (PROD)
      return (
        cachedComponent ||
        Promise.resolve(componentGetter()).then(mod => (cachedComponent = mod))
      )
    return Promise.resolve(componentGetter())
  }

  return AsyncComponent as AsyncComponentType<P>
}

export default createAsyncComponent
