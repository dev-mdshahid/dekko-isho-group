import { describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'

const api = vi.fn()
vi.mock('./api', () => ({ api: (...a: unknown[]) => api(...a) }))
const { useApi } = await import('./useApi')

describe('useApi', () => {
  it('loads data and reloads on demand', async () => {
    api.mockResolvedValueOnce({ n: 1 }).mockResolvedValueOnce({ n: 2 })
    const { result } = renderHook(() => useApi<{ n: number }>('/api/hr/jobs', { q: 'a' }))
    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.data).toEqual({ n: 1 }))
    expect(result.current.loading).toBe(false)
    expect(api).toHaveBeenCalledWith('/api/hr/jobs', { query: { q: 'a' } })
    act(() => result.current.reload())
    expect(result.current.loading).toBe(true)
    expect(result.current.data).toEqual({ n: 1 })
    await waitFor(() => expect(result.current.data).toEqual({ n: 2 }))
  })

  it('refetches when the query changes and ignores stale replies', async () => {
    let resolveFirst!: (v: unknown) => void
    api.mockImplementationOnce(() => new Promise((r) => (resolveFirst = r))).mockResolvedValueOnce('second')
    const { result, rerender } = renderHook(({ q }) => useApi<string>('/x', { q }), { initialProps: { q: 'a' } })
    rerender({ q: 'b' })
    await waitFor(() => expect(result.current.data).toBe('second'))
    resolveFirst('first')
    await Promise.resolve()
    expect(result.current.data).toBe('second')
  })

  it('reports errors and does nothing without a path', async () => {
    api.mockRejectedValueOnce(new Error('boom'))
    const { result } = renderHook(() => useApi('/x'))
    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error))
    expect(result.current.loading).toBe(false)

    api.mockClear()
    const idle = renderHook(() => useApi(null))
    expect(idle.result.current.loading).toBe(false)
    expect(api).not.toHaveBeenCalled()
  })
})
