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

function createAsyncComponent<P>(
  componentGetter: AsyncComponentGetter<P>,
  options: AsyncComponentOptions = {property: 'default'}
): React.FC<P> {
  const {property = 'default', loading, error} = options
  return function AsynComponent(props) {
    const [Component, setComponent] = useState<ModuleComponentInterop<P>>(
      componentGetter
    )
    const [exception, setException] = useState<any>(null)

    useEffect(() => {
      if (typeof Component.then !== 'undefined')
        (Component as Promise<ModuleComponent<P>>)
          .then((value: ModuleComponent<P>): void => {
            setComponent(value)
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
  } as React.FC<P>
}

export default createAsyncComponent
