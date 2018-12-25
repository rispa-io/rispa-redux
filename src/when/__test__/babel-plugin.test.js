import path from 'path'
import fs from 'fs'
import { transformFileSync } from '@babel/core'

const fixturesDir = path.join(__dirname, 'fixtures')

describe('when babel plugin', () => {
  it('should add hash as 3d param for when', () => {
    const actualPath = path.join(fixturesDir, './when/actual')
    const expectedPath = path.join(fixturesDir, './when/expected')

    const actual = transformFileSync(actualPath).code

    const expected = fs.readFileSync(expectedPath)
      .toString()
      .replace('/*<!--hash-->*/', actualPath.replace(/\\/g, '/'))

    expect(actual.trim()).toEqual(expected.trim())
  })

  it('should add hash as 3d param for when.every', () => {
    const actualPath = path.join(fixturesDir, './whenEvery/actual')
    const expectedPath = path.join(fixturesDir, './whenEvery/expected')

    const actual = transformFileSync(actualPath).code

    const expected = fs.readFileSync(expectedPath)
      .toString()
      .replace('/*<!--hash-->*/', actualPath.replace(/\\/g, '/'))

    expect(actual.trim()).toEqual(expected.trim())
  })
})
