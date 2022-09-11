# Shutter Row Card

Simple shutter card for Home Assistant

<img width="600" alt="Shutter row example" src="https://user-images.githubusercontent.com/24818127/184556542-2ab3696a-e037-436e-b83a-fe0d3102e2cf.png">

## Install

### HACS
This lovelace card is available on the [HACS](https://hacs.xyz/) (Home Assistant Community Store).

Go to the `Frontend` section and search for `Shutter Row`.

### Manual
1. Download `shutter-row.js` file from the [latest-release].
2. Put `shutter-row.js` file into your `config/www` folder.
3. Add reference to `shutter-row.js` in Lovelace. There's two way to do that:
   1. ~~**Using UI:** _Configuration_ → _Lovelace Dashboards_ → _Resources Tab_ → Click Plus button → Set _Url_ as `/local/shutter-row.js` → Set _Resource type_ as `JavaScript Module`.
      **Note:** If you do not see the Resources Tab, you will need to enable _Advanced Mode_ in your _User Profile_~~
   2. **Using YAML:** Add following code to `lovelace` section.
      ```yaml
      resources:
        - url: /local/shutter-row.js
          type: module
      ```
4. Add `custom:shutter-row` to Lovelace UI as any other card (using either editor or YAML configuration).

## Usage

### YAML mode
Example with all possible arguments
```yaml
type: "custom:shutter-row"
entity: cover.cover_entity
name: Friendly name
invert_position: false
```

The documentation of all attributes
| Name              | Type      | Default      | Description                                                                                    |
|-------------------|-----------|--------------|------------------------------------------------------------------------------------------------|
| `type`            | `string`  | **Required** | "custom:shutter-row" to use shutter row                                                        |
| `entity`          | `string`  | **Required** | Existing cover entity id                                                                       |
| `name`            | `string`  | Optional     | Overwrites name from entity                                                                    |
| `invert_position` | `boolean` | false        | Inverts position (if false => 0% = closed, 100% = open or if true => 0% = open, 100% = closed) |

## License
This project is under the [MIT](https://opensource.org/licenses/MIT) license.
