import '@testing-library/jest-dom'
import 'whatwg-fetch'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './msw/server'

// MSW: start mock server for Vitest (node)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
