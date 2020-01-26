/* jest */
import React from 'react'
import {render, act} from '@testing-library/react'
import createAsyncComponent from './index'

const FunctionComponent = () => <div>Hello world</div>
class ClassComponent extends React.Component {
  render() {
    return <div>Hello world</div>
  }
}

describe('createAsyncComponent', () => {
  it('works w/ class component', () => {
    const Component = createAsyncComponent(() => ({default: ClassComponent}))
    const result = render(<Component />)
    expect(result.asFragment()).toMatchSnapshot()
  })

  it('works w/ function component', () => {
    const Component = createAsyncComponent(() => ({default: FunctionComponent}))
    const result = render(<Component />)
    expect(result.asFragment()).toMatchSnapshot()
  })

  it('resolves promise', async () => {
    const Component = createAsyncComponent(() =>
      Promise.resolve({default: FunctionComponent})
    )

    let result
    await act(async () => {
      result = render(<Component />)
    })

    expect(result.asFragment()).toMatchSnapshot()
  })

  it('displays loading state', async () => {
    const Component = createAsyncComponent(
      () => Promise.resolve({default: ClassComponent}),
      {loading: () => 'Loading...'}
    )

    let result
    act(() => {
      result = render(<Component />)
    })

    expect(result.asFragment()).toMatchSnapshot()
  })

  it('displays error state', async () => {
    const Component = createAsyncComponent(() => Promise.reject('Error!'), {
      error: exception => exception,
    })

    let result
    await act(async () => {
      result = render(<Component />)
    })

    expect(result.asFragment()).toMatchSnapshot()
  })

  it('returns null if error occured without error handling component', async () => {
    const Component = createAsyncComponent(() => Promise.reject('Error!'))

    let result
    await act(async () => {
      result = render(<Component />)
    })

    expect(result.asFragment()).toMatchSnapshot()
  })
})
