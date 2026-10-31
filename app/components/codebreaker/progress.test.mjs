import test from 'node:test'
import assert from 'node:assert/strict'
import { strandProgress } from './progress.ts'

const run = (values, targets) => strandProgress(values.split(' '), targets.map(values => ({ values: values.split(' '), solved: false, progress: 0 })))

test('prefix completes or breaks into a new pending strand', () => {
  assert.deepEqual(run('11 22', ['11 22 33']).states, ['pending', 'pending'])
  assert.deepEqual(run('11 22 33', ['11 22 33']).states, ['complete', 'complete', 'complete'])
  assert.deepEqual(run('11 22 44', ['11 22 33']).states, ['broken', 'broken', 'pending'])
})

test('shared suffix takes pending precedence and retains earned completion on break', () => {
  const targets = ['11 22 33', '33 44']
  assert.deepEqual(run('11 22 33', targets).states, ['complete', 'complete', 'pending'])
  assert.deepEqual(run('11 22 33 44', targets).states, ['complete', 'complete', 'complete', 'complete'])
  assert.deepEqual(run('11 22 33 55', targets).states, ['complete', 'complete', 'complete', 'pending'])
})

test('all suffixes survive repeated values and overlapping prefixes', () => {
  const result = run('11 11 11 22', ['11 11 22', '11 22 33'])
  assert.deepEqual(result.states, ['broken', 'complete', 'pending', 'pending'])
  assert.equal(result.sequences[0].solved, true)
  assert.equal(result.sequences[1].progress, 2)
})

test('duplicate values retain distinct move identities', () => {
  assert.deepEqual(run('11 22 44 11', ['11 22 33']).states, ['broken', 'broken', 'broken', 'pending'])
})

test('does not mutate targets or carry completion into a fresh buffer', () => {
  const targets = [{ values: ['11'], solved: true, progress: 1 }]
  assert.equal(strandProgress([], targets).sequences[0].solved, false)
  assert.equal(targets[0].solved, true)
})
