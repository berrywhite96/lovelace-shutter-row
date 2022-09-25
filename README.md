# Shutter Row Card

Simple shutter card with preset buttons and button customization for Home Assistant.

<img width="496" alt="Shutter row card example" src="https://user-images.githubusercontent.com/24818127/192158290-8d833fa2-912d-4232-996a-ef4ff99f660c.png">

## Install

### HACS
This lovelace card is available on the [HACS](https://hacs.xyz/) (Home Assistant Community Store).

Go to the `Frontend` section and search for `Shutter Row`.

### Manual
1. Download `shutter-row.js` file from [latest release](https://github.com/berrywhite96/lovelace-shutter-row/releases).
2. Put `shutter-row.js` file into your `config/www` folder.
3. Add reference to `shutter-row.js` in Lovelace. There's two ways to do that:
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
Card example with inverted slider position, state color and one preset button.
```yaml
type: "custom:shutter-row"
entity: cover.cover_entity
name: Friendly name
invert_position: true
state_color: true
preset_buttons:
- name: Open
  icon: mdi:window-shutter-open
  tap_action:
    action: call-service
    service: cover.set_cover_position
    service_data:
      entity_id: cover.cover_entity 
      position: 100
```

#### Main configuration
| Name              | Type      | Default      | Description                                                                                    |
|-------------------|-----------|--------------|------------------------------------------------------------------------------------------------|
| `type`            | `string`  | **Required** | "custom:shutter-row" to use shutter row |
| `entity`          | `string`  | **Required** | Existing cover entity id |
| `name`            | `string`  | Optional     | Overwrites friendly name from entity |
| `invert_position` | `boolean` | false        | Inverts position value (0% => 100%, 30% => 70%), forces also `invert_position_label` to `true` |
| `invert_position_label` | `boolean` | false        | Inverts position label (if `false` => 0% = closed, 100% = open; if `true` => 0% = open, 100% = closed) |
| `state_color` | `boolean` | false        | Enables icon coloring if entity is active |
| `move_down_button` | [`action`](https://www.home-assistant.io/dashboards/actions/) | Optional        | Custom action for the move down button (overwrites default functions) |
| `move_stop_button` | [`action`](https://www.home-assistant.io/dashboards/actions/) | Optional        | Custom action for the move stop button (overwrites default functions) |
| `move_up_button` | [`action`](https://www.home-assistant.io/dashboards/actions/) | Optional        | Custom action for the move up button (overwrites default functions) |
| `preset_buttons` | `list` |  Optional     | List of [preset buttons](#preset-button) |

#### Preset button
| Name              | Type      | Default      | Description                                                                                    |
|-------------------|-----------|--------------|------------------------------------------------------------------------------------------------|
| `icon`            | [`icon`](https://materialdesignicons.com/)  | Optional | Icon e.g. mdi:window-shutter |
| `name`            | `string`  | Optional | Label for button |
| `tap_action` | [`action`](https://www.home-assistant.io/dashboards/actions/) | Optional        | Action on tap |
| `double_tap_action` | [`action`](https://www.home-assistant.io/dashboards/actions/) | Optional        | Action on double tap |
| `hold_action` | [`action`](https://www.home-assistant.io/dashboards/actions/) | Optional        | Action on hold |


## License
This project is under the [MIT](https://opensource.org/licenses/MIT) license.
