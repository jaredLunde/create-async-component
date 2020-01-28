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

A factory function for creating asynchronous React components

## Quick Start

```jsx harmony
import createAsyncComponent from 'create-async-component'

const AsyncComponent = createAsyncComponent(() => import('./Home'), {
  loading: () => <div>Loading...</div>,
  error: () => <div>Error!</div>,
  property: 'default',
})

// Preload your component
AsyncComponent.load()
```

## API

```typescript
function createAsyncComponent<P>(
  componentGetter: AsyncComponentGetter<P>,
  options: AsyncComponentOptions = {property: 'default'}
): React.FC<P>
```

| Argument        | Type                                              | Required? | Description                                                   |
| --------------- | ------------------------------------------------- | --------- | ------------------------------------------------------------- |
| componentGetter | [`AsyncComponentGetter`](#asynccomponentgetter)   | Yes       | A function that returns a Promise e.g. an `import()` function |
| options         | [`AsyncComponentOptions`](#asynccomponentoptions) | No        | See [`AsyncComponentOptions`](#asynccomponentoptions)         |

### Preload your component

```typescript
// Simply call its load() metod
AsyncComponent.load()
// Real world example
<Link onMouseEnter={AsyncComponent.load}/>
```

### `AsyncComponentGetter`

```typescript
export type AsyncComponentGetter<P> = () => ModuleComponentInterop<P>

export type ModuleComponent<P = any> = {
  [property: string]: React.FunctionComponent<P> | React.ClassType<P, any, any>
}

export type ModuleComponentInterop<P> =
  | Promise<ModuleComponent<P>>
  | ModuleComponent<P>
```

### `AsyncComponentOptions`

```typescript
interface AsyncComponentOptions<P> {
  // The property within the module object where
  // your component resides.
  // Default: "default"
  property?: string
  // A component you'd like to display while the async
  // component is loading.
  loading?: (props: P) => React.ReactNode | React.ReactNode[]
  // A component you'd like to display when the async
  // component is Promise is rejected.
  error?: (exception: any, props: P) => React.ReactNode | React.ReactNode[]
}
```

## LICENSE

MIT
