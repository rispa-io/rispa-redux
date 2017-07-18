import path from 'path'
import fs from 'fs'
import { transformFileSync } from 'babel-core'
import md5 from 'md5'

const fixturesDir = path.join(__dirname, 'fixtures')

describe('when babel plugin', () => {
  it('should add hash as 3d param for when in production mode', () => {
    process.env.NODE_ENV = 'production'

    const actualPath = path.join(fixturesDir, './when/actual')
    const expectedPath = path.join(fixturesDir, './when/expected')

    const actual = transformFileSync(actualPath).code

    const expected = fs.readFileSync(expectedPath)
      .toString()
      .replace('/*<!--hash-->*/', md5(actualPath.replace(/\\/g, '/')))

    expect(actual.trim()).toEqual(expected.trim())

    process.env.NODE_ENV = 'test'
  })
})
