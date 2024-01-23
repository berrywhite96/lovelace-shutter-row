import { customLocalize } from "../localize";

/**
 * Entities which are included
 */
export const INCLUDED_DOMAINS = ["cover"];

/**
 * UI actions
 */
export const UI_SCHEMA = [
    { name: "tap_action", selector: { "ui-action": {} } },
    { name: "double_tap_action", selector: { "ui-action": {} } },
    { name: "hold_action", selector: { "ui-action": {} } },
];

/**
 * Root form schema
 */
export const getRootSchema = (hass) => [
    {
        type: "grid",
        name: "",
        schema: [
            { name: "entity", selector: { entity: { domain: INCLUDED_DOMAINS } } },
            { name: "name", selector: { text: {} } },
        ],
    },
    {
        type: "grid",
        name: "",
        schema: [
            { name: "invert_position", selector: { boolean: {} } },
            { name: "invert_position_label", selector: { boolean: {} } },
            { name: "disable_position", selector: { boolean: {} } },
            { name: "rtl_position", selector: { boolean: {} } },
            { name: "state_color", selector: { boolean: {} } },
            { name: "group", selector: { boolean: {} } },
            { name: "ignore_state", selector: { boolean: {} } },
        ],
    },
    { name: "title_template", selector: { template: {} } },
    { name: "position_template", selector: { template: {} } },
    {
        type: "expandable",
        name: "move_up_button",
        title: customLocalize(hass, "editor.move_up_button_expandable"),
        icon: "mdi:arrow-up",
        schema: UI_SCHEMA,
    },
    {
        type: "expandable",
        name: "move_stop_button",
        title: customLocalize(hass, "editor.move_stop_button_expandable"),
        icon: "mdi:stop-circle-outline",
        schema: UI_SCHEMA,
    },
    {
        type: "expandable",
        name: "move_down_button",
        title: customLocalize(hass, "editor.move_down_button_expandable"),
        icon: "mdi:arrow-down",
        schema: UI_SCHEMA,
    },
];

/**
 * Preset button schema
 */
export const PRESET_SCHEMA = [
    { name: "name", selector: { text: {} } },
    { name: "icon", selector: { icon: {} } },
].concat(UI_SCHEMA);
