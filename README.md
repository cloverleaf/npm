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

Schema (How the JSON is structured):

```json
"App Name": {
  "alias": "Real app", // Makes passwords as if this was the app name
  "minLength": 4, // The minimum length of a password allowed on this preset (inclusive)
  "maxLength": 512, // The maximum length of a password allowed on this preset (inclusive)
  "chars": "abc123", // The password will be made out of a random selection of these characters.
  "deprecated": false, // Used to hide presets
  "regex": "^(?!.*(.)\\1{2,}).+", // A regex the password must match. This one disallows repetitions of 3 or more of the same character
  "requirements": ["cap", "low", "num", "special"], // Passwords must have at least one of these character types
}
```

The only requirements for a valid preset is an alias or minimum length, the rest is optional.


# Contributing

## Creating a new preset
Making a new preset is pretty easy. All data for presets is kept in [sites.json](/data/sites.json). There's a json schema that describes what is needed but the tl;dr is this:

Add a new key in the JSON object (in alphabetical order) with the name of the site/app you're making a preset for.

### Working out a site's restrictions
#### Character restrictions
A good first test is pasting this in and seeing if it's upset about any characters:

``0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~``

If it is then you need to work out which it doesn't like. This can take a long time but can be sped up if you use a kind of binary search and half the string until you can pinpoint what is causing an issue.

#### Length restrictions
You also then need to work out if there are any minimum and maximum lengths. The first is easily discovered by attempting to use just "a" or something like that. For the maximum length I generally try a string that's over 512 characters (the default max for cloverleaf passwords).

#### Other restrictions
Some sites have basic restrictions such as "must have a special character" or "must use a number and a capital". For these we use the "requirements" key and an array or required character types ("cap", "low", "num" and "special")

Some websites disallow repeated characters (EG. `aaa`) or common phrases like `qwerty`, `abc` or `123`. If a site has these restrictions you will need to add a regex.
