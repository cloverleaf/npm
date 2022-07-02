import * as Cloverleaf from '../index.js'
import results from './results.json' assert {type: 'json'}
import configs from './configs.json' assert {type: 'json'}
import { writeFile } from 'fs'

const chai = await import ("chai")
const assert = chai.assert
const sites = Cloverleaf.siteData

// Test lengths
for (let length = Cloverleaf.defaultMinLength; length <= Cloverleaf.defaultMaxLength; length++) {
  assert.strictEqual(Cloverleaf.generate("a", "a", false, length).length, length, "Output length incorrect")
}

// Test all presets
for (let config in configs) {
  for (let site in sites) {

    let result = Cloverleaf.generate(site, configs[config].password, true, configs[config].length)

    // If not already in results
    if (!config in results) {
      results[config] = {}
      console.log(`Adding ${config} config`)
    }

    // If the site already exists in the results
    if (site in results[config]) {
      assert.strictEqual(result, results[config][site].result,  `Preset ${site} not functioning correctly`)
    } else {
      console.log(`Adding ${site} to config ${config}`)
      results[config][site] = {"result": result}
    }

  }

  // Write results to file
  await writeFile("test/results.json", JSON.stringify(results, null, 2), function(err, result) {
    if (err) console.error(err)
  })
}

// Requirements lengths
// Make sure the minimum length is more characters than the requirements
for (let site in sites) {
  if ("requirements" in sites[site]) {
    assert.isAtLeast(sites[site]["minLength"], sites[site]["requirements"].length, `Minimum length is less than requirements for ${site}`)
  }
}

console.log("All tests passed")
