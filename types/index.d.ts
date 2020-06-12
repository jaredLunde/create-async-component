import * as React from 'react'
/**
 * A factory function for creating asynchronous React components
 *
 * @param componentGetter A function that returns a React component or a promise that resolves a React component
 * @param options Optionally adds `loading` and `error` state components
 */
declare function createAsyncComponent<P>(
  componentGetter: AsyncComponentGetter<P>,
  options?: AsyncComponentOptions<P>
): AsyncComponent<P>
export declare type AsyncComponentInterop<P> =
  | Promise<React.ComponentType<P>>
  | React.ComponentType<P>
export declare type AsyncComponentGetter<P> = () => AsyncComponentInterop<P>
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
