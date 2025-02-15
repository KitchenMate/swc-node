import { xxh64 } from '@node-rs/xxhash'
import { Options, transformJest } from '@swc-node/core'
import type { Output } from '@swc/core'

interface JestConfig26 {
  transform: [match: string, transformerPath: string, options: Options][]
}

interface JestConfig27 {
  transformerConfig: Options
}

function getJestTransformConfig(jestConfig: JestConfig26 | JestConfig27): Options {
  if ('transformerConfig' in jestConfig) {
    // jest 27
    return jestConfig.transformerConfig
  }

  if ('transform' in jestConfig) {
    // jest 26
    return jestConfig.transform.find(([, transformerPath]) => transformerPath === __filename)?.[2] ?? {}
  }

  return {}
}

export = {
  process(src: string, path: string, jestConfig: JestConfig26 | JestConfig27): Output | string {
    if (/\.(tsx?|jsx?|mjs)$/.test(path)) {
      return transformJest(src, path, getJestTransformConfig(jestConfig))
    }
    return src
  },
  getCacheKey(src: string, _filepath: string, config: Options) {
    return xxh64(src + JSON.stringify(config)).toString(16)
  },
}
