/* jest */
import React from 'react'
import {render, act} from '@testing-library/react'
import createAsyncComponent from './index'

jest.useFakeTimers()

const FunctionComponent = (props: {foo: 'bar' | 'baz'}) => (
  <div>Hello world {props.foo}</div>
)

class ClassComponent extends React.Component<{foo: 'bar' | 'baz'}> {
  render() {
    return <div>Hello world {this.props.foo}</div>
  }
}

describe('createAsyncComponent', () => {
  it('works w/ class component', async () => {
    const Component = createAsyncComponent(() =>
      Promise.resolve(ClassComponent)
    )

    let result

    await act(async () => {
      result = render(<Component foo='bar' />)
    })

    expect(result.asFragment()).toMatchSnapshot()
  })

  it('works w/ function component', async () => {
    const Component = createAsyncComponent(() =>
      Promise.resolve(FunctionComponent)
    )

    let result

    await act(async () => {
      result = render(<Component foo='bar' />)
    })

    expect(result.asFragment()).toMatchSnapshot()
  })

  it('returns loading state', async () => {
    const Component = createAsyncComponent(
      () =>
        new Promise<typeof FunctionComponent>((resolve) => {
          setTimeout(() => resolve(FunctionComponent), 1000)
        }),
      {loading: ({foo}) => <div>Loading {foo}...</div>}
    )

    const result = render(<Component foo='bar' />)
    expect(result.asFragment()).toMatchSnapshot('Loading bar...')
    await act(async () => jest.advanceTimersByTime(1000))
    expect(result.asFragment()).toMatchSnapshot('Hello world bar')
  })

  it('returns error state', async () => {
    const Component = createAsyncComponent(
      () =>
        new Promise<typeof FunctionComponent>((_, reject) => {
          setTimeout(() => reject('Error!'), 1000)
        }),
      {
        error: (error, {foo}) => (
          <div>
            Error loading {foo}: {error}
          </div>
        ),
      }
    )

    const result = render(<Component foo='bar' />)
    await act(async () => jest.advanceTimersByTime(1000))
    expect(result.asFragment()).toMatchSnapshot('Error loading bar: Error!')
  })

  it('returns null error state', async () => {
    const Component = createAsyncComponent(
      () =>
        new Promise<typeof FunctionComponent>((_, reject) => {
          setTimeout(() => reject('Error!'), 1000)
        })
    )

    const result = render(<Component foo='bar' />)
    await act(async () => jest.advanceTimersByTime(1000))
    expect(result.asFragment()).toMatchSnapshot('Empty DocumentFragment')
  })

  it('should cache component in production', async () => {
    process.env.NODE_ENV = 'production'
    const Component = createAsyncComponent(() =>
      Promise.resolve(FunctionComponent)
    )

    let result

    await act(async () => {
      result = await render(<Component foo='bar' />)
    })

    expect(result.asFragment()).toMatchSnapshot('Hello world bar')
    expect(render(<Component foo='bar' />).asFragment()).toMatchSnapshot(
      'Hello world bar [cached]'
    )
    process.env.NODE_ENV = 'test'
  })

  it('should preload component', async () => {
    const Component = createAsyncComponent(() =>
      Promise.resolve(FunctionComponent)
    )

    const promise = Component.load()
    expect(promise).toBeInstanceOf(Promise)
    expect(await promise).toBe(FunctionComponent)
    let result

    await act(async () => {
      result = await render(<Component foo='bar' />)
    })

    expect(result.asFragment()).toMatchSnapshot('Hello world bar')
  })

  it('should preload and cache component in production', async () => {
    process.env.NODE_ENV = 'production'
    const Component = createAsyncComponent(() =>
      Promise.resolve(FunctionComponent)
    )

    const promise = Component.load()
    expect(promise).toBeInstanceOf(Promise)
    expect(await promise).toBe(FunctionComponent)
    let result

    await act(async () => {
      result = await render(<Component foo='bar' />)
    })

    expect(result.asFragment()).toMatchSnapshot('Hello world bar')
    process.env.NODE_ENV = 'test'
  })

  it('should not reload cached component in production', async () => {
    process.env.NODE_ENV = 'production'
    const Component = createAsyncComponent(() =>
      Promise.resolve(FunctionComponent)
    )

    let promise = Component.load()
    expect(promise).toBeInstanceOf(Promise)
    expect(await promise).toBe(FunctionComponent)
    promise = Component.load()
    expect(promise).toBeInstanceOf(Promise)
    expect(await promise).toBe(FunctionComponent)
    process.env.NODE_ENV = 'test'
  })
})
