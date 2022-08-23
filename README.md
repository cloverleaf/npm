# [npm](https://www.npmjs.com/package/cloverleaf)
![CI](https://github.com/cloverleaf/npm/workflows/CI/badge.svg)

The brains behind Cloverleaf

# API

<a name="generate"></a>

## generate(appName, masterPass, [presetToggle], [length], [customPreset]) ⇒ <code>string</code>
**Kind**: global function
**Returns**: <code>string</code> - Output password

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| appName | <code>string</code> |  | Name of the app to generate a password for |
| masterPass | <code>string</code> |  |  |
| [presetToggle] | <code>boolean</code> | <code>false</code> | True if we want to use a preset |
| [length] | <code>number</code> | <code>16</code> | int - Desired length of the password |
| [customPreset] | <code>object</code> |  | JSON object to use as a custom preset |

<a name="siteData"></a>

## siteData
**Returns**: <code>object</code> - Data for preset sites


# Contributing

`
pnpm i
`
