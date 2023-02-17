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
export const ROOT_SCHEMA = [
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
        ],
    },
    { name: "title_template", selector: { template: {} } },
    { name: "position_template", selector: { template: {} } },
    {
        type: "grid",
        name: "move_down_button",
        schema: UI_SCHEMA,
    },
    {
        type: "grid",
        name: "move_down_button",
        schema: UI_SCHEMA,
    },
    {
        type: "grid",
        name: "move_down_button",
        schema: UI_SCHEMA,
    },
];

/**
 * Preset button schema
 */
export const PRESET_SCHEMA = [
    { name: "name", selector: { text: {} } },
    { name: "icon", selector: { icon: {} } },
    UI_SCHEMA,
];
