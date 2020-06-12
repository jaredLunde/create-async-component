<hr>
<div align="center">
  <h1 align="center">
    create-async-component
  </h1>
</div>

<p align="center">
  <a href="https://bundlephobia.com/result?p=create-async-component">
    <img alt="Bundlephobia" src="https://img.shields.io/bundlephobia/minzip/create-async-component?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Types" href="https://www.npmjs.com/package/create-async-component">
    <img alt="Types" src="https://img.shields.io/npm/types/create-async-component?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Code coverage report" href="https://codecov.io/gh/jaredLunde/create-async-component">
    <img alt="Code coverage" src="https://img.shields.io/codecov/c/gh/jaredLunde/create-async-component?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Build status" href="https://travis-ci.com/jaredLunde/create-async-component">
    <img alt="Build status" src="https://img.shields.io/travis/com/jaredLunde/create-async-component?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/create-async-component">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/create-async-component?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="License" href="https://jaredlunde.mit-license.org/">
    <img alt="MIT License" src="https://img.shields.io/npm/l/create-async-component?style=for-the-badge&labelColor=24292e">
  </a>
</p>

<pre align="center">npm i create-async-component</pre>
<hr>

A factory function for creating asynchronous React components.

## Quick Start

```jsx harmony
import * as React from 'react'
import createAsyncComponent from 'create-async-component'

const AsyncComponent = createAsyncComponent(
  () => import('./Home').then((mod) => mod.default),
  {
    loading: (homeProps) => <div>Loading...</div>,
    error: (exception, homeProps) => <div>Error!</div>,
  }
)

// Optionally preload the component
AsyncComponent.load()

// Use the component as you would any other component
<AsyncComponent foo='bar'/>
```

## API

```typescript
function createAsyncComponent<P>(
  componentGetter: AsyncComponentGetter<P>,
  options: AsyncComponentOptions<P> = {}
): AsyncComponent<P>
```

| Argument        | Type                                              | Required? | Description                                                                                                   |
| --------------- | ------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------- |
| componentGetter | [`AsyncComponentGetter`](#asynccomponentgetter)   | Yes       | A function that returns a React component or a promise that resolves a React component                        |
| options         | [`AsyncComponentOptions`](#asynccomponentoptions) | No        | Optionally adds `loading` and `error` state components. See [`AsyncComponentOptions`](#asynccomponentoptions) |

### Returns [`AsyncComponent`](#asynccomponent)

### Preload your component

```tsx
// Simply call its load() method
AsyncComponent.load()
// Real world example
<Link onMouseEnter={AsyncComponent.load}/>
```

### `AsyncComponentGetter`

```typescript
export type AsyncComponentGetter<P> = () => AsyncComponentInterop<P>
export type AsyncComponentInterop<P> =
  | Promise<React.ComponentType<P>>
  | React.ComponentType<P>
```

### `AsyncComponentOptions`

```typescript
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
```

### `AsyncComponent`

```typescript
export interface AsyncComponent<P> extends React.FC<P> {
  /**
   * Starts preloading the asynchronous component
   */
  load: () => Promise<React.ComponentType<P>>
}
```

## LICENSE

MIT
