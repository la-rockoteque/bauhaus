import { describe, expect, it } from 'vitest'
import { shouldMount } from './shouldMount'

const conditions = (over: Partial<Parameters<typeof shouldMount>[0]> = {}) => ({
  isTest: false,
  askedFor: false,
  flagged: false,
  ...over,
})

describe('shouldMount', () => {
  it('stays off when nothing asks for it — running the app is not asking', () => {
    expect(shouldMount(conditions())).toBe(false)
  })

  it('draws when the dev server was launched with VITE_DEV_OVERLAY', () => {
    expect(shouldMount(conditions({ askedFor: true }))).toBe(true)
  })

  it('draws when the feature flag is on, which is how Staging turns it on', () => {
    expect(shouldMount(conditions({ flagged: true }))).toBe(true)
  })

  it('stays off in the test run even when both doors are open', () => {
    expect(shouldMount(conditions({ isTest: true, askedFor: true, flagged: true }))).toBe(false)
  })
})
