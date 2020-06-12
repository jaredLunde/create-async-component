import * as React from 'react'

/**
 * A factory function for creating asynchronous React components
 *
 * @param componentGetter A function that returns a React component or a promise that resolves a React component
 * @param options Optionally adds `loading` and `error` state components
 */
function createAsyncComponent<P>(
  componentGetter: AsyncComponentGetter<P>,
  options: AsyncComponentOptions<P> = {}
): AsyncComponent<P> {
  const {loading, error} = options
  let cachedComponent: React.ComponentType<P>
  const PROD =
    typeof process !== 'undefined' && process.env.NODE_ENV === 'production'

  return Object.assign(
    function AsyncComponent(props: P) {
      const [Component, setComponent] = React.useState<
        AsyncComponentInterop<P>
      >(cachedComponent ? () => cachedComponent : componentGetter)
      const [exception, setException] = React.useState<any>(null)

      React.useEffect(() => {
        if ('then' in Component)
          Component.then((component): void => {
            if (PROD) cachedComponent = component
            setComponent(() => component)
          }).catch((err) => setException(err))
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

      return exception
        ? error?.(exception, props) || null
        : 'then' in Component
        ? loading?.(props) || null
        : React.createElement(Component, props)
    },
    {
      load: () => {
        if (PROD)
          return cachedComponent
            ? Promise.resolve(cachedComponent)
            : Promise.resolve(componentGetter()).then(
                (component) => (cachedComponent = component)
              )
        return Promise.resolve(componentGetter())
      },
    }
  )
}

export type AsyncComponentInterop<P> =
  | Promise<React.ComponentType<P>>
  | React.ComponentType<P>

export type AsyncComponentGetter<P> = () => AsyncComponentInterop<P>

export interface AsyncComponentOptions<P> {
  /**
   * This component will be renderered while the async component is loading
   */
  loading?: React.FC<P>
  /**
   * This component will be renderered when there is an error getting
   * the async component
   */
  error?: (exception: any, props: P) => ReturnType<React.FC<P>>
}

export interface AsyncComponent<P> extends React.FC<P> {
  /**
   * Starts preloading the asynchronous component
   */
  load: () => Promise<React.ComponentType<P>>
}

export default createAsyncComponent
