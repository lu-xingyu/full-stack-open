import deepFreeze from 'deep-freeze'
import { describe, expect, test } from 'vitest'
import counterReducer from './counterReducer'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('should return a proper initial state when called with undefined state', () => {
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('good is incremented', () => {
    const action = {
      type: 'GOOD'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
  })

  test('ok, bad and reset is correct', () => {
    const actionOk = {type: 'OK'}
    const state = initialState

    deepFreeze(state)
    const stateOk = counterReducer(state, actionOk)
    expect(stateOk).toEqual({
      good: 0,
      ok: 1,
      bad: 0
    })
    const actionBad = {type: 'BAD'}
    deepFreeze(stateOk)
    const stateOkBad = counterReducer(stateOk, actionBad)
    expect(stateOkBad).toEqual({
      good: 0,
      ok: 1,
      bad: 1
    })
  const actionReset = {type: 'RESET'}
    deepFreeze(stateOkBad)
    const stateReset = counterReducer(stateOkBad, actionReset)
    expect(stateReset).toEqual(initialState)
  })
})
