import { LitElement, html } from "lit";
import { fireEvent, handleClick } from "custom-card-helpers";
import { mdiChevronDown, mdiStop, mdiChevronUp } from "@mdi/js";

import {
    HASSIO_CARD_ID,
    HASSIO_CARD_EDITOR_ID,
    HASSIO_CARD_NAME,
    VERSION,
    PATH_SHUTTER_100,
    PATH_SHUTTER_75,
    PATH_SHUTTER_50,
    PATH_SHUTTER_25,
    PATH_SHUTTER_0,
    PATH_SHUTTER_UP,
    PATH_SHUTTER_DOWN,
} from "./const.js";
import "./editor/editor.js";
import { onHoldPointerDown, onPointerUp, getRippleElement } from "./helpers.js";
import style from "./style.css";

class ShutterRow extends LitElement {
    constructor() {
        super();

        // Define empty 'templated' variable for rendered templates
        this.templated = {};
    }

    /**
     * Define properties to react
     * @returns Array
     */
    static get properties() {
        return {
            hass: Object,
            config: Object,
            templated_changed: Boolean, // Because 'templated' as variable didn't rerender, there is a boolean which flips on every template changed
        };
    }

    /**
     * Define CSS styles
     * @returns CSS styles
     */
    static get styles() {
        return style;
    }

    /**
     * Getter function for shutter row editor element
     * @returns html
     */
    static getConfigElement() {
        return document.createElement(HASSIO_CARD_EDITOR_ID);
    }

    /**
     * Lovelace function to get card height
     * @returns int
     */
    getCardSize() {
        return 2;
    }

    /**
     * HA function on editor config set
     * @param {Array} config
     */
    setConfig(config) {
        let getConfigAttribute = (attribute, defaultValue, array = this._config) => {
            if (!array) return;
            return attribute in array ? array[attribute] : defaultValue;
        };
        if (!config.entity) {
            throw new Error("You need to define an entity");
        }

        this._config = config;
        this.config = {
            type: config.type,
            entity: config.entity,
            name: getConfigAttribute("name", false),
            invert_position: getConfigAttribute("invert_position", false),
            invert_position_label:
                getConfigAttribute("invert_position_label", false) || getConfigAttribute("invert_position", false),
            disable_position: getConfigAttribute("disable_position", false),
            rtl_position: getConfigAttribute("rtl_position", false),
            state_color: getConfigAttribute("state_color", false),
            group: getConfigAttribute("group", false),
            title_template: getConfigAttribute("title_template", false),
            position_template: getConfigAttribute("position_template", false),
            move_down_button: {
                tap_action: getConfigAttribute("tap_action", false, getConfigAttribute("move_down_button", false)),
                double_tap_action: getConfigAttribute(
                    "double_tap_action",
                    false,
                    getConfigAttribute("move_down_button", false)
                ),
                hold_action: getConfigAttribute("hold_action", false, getConfigAttribute("move_down_button", false)),
            },
            move_stop_button: {
                tap_action: getConfigAttribute("tap_action", false, getConfigAttribute("move_stop_button", false)),
                double_tap_action: getConfigAttribute(
                    "double_tap_action",
                    false,
                    getConfigAttribute("move_stop_button", false)
                ),
                hold_action: getConfigAttribute("hold_action", false, getConfigAttribute("move_stop_button", false)),
            },
            move_up_button: {
                tap_action: getConfigAttribute("tap_action", false, getConfigAttribute("move_up_button", false)),
                double_tap_action: getConfigAttribute(
                    "double_tap_action",
                    false,
                    getConfigAttribute("move_up_button", false)
                ),
                hold_action: getConfigAttribute("hold_action", false, getConfigAttribute("move_up_button", false)),
            },
            preset_buttons: getConfigAttribute("preset_buttons", false),
        };
        this.entityId = this.config.entity;
    }

    /**
     * Calls custom action if defined
     * @param {Array} config
     * @param {action} action
     * @returns
     */
    callCustomAction(config, action) {
        // Check if defined
        if (!config[action]) return;

        // Deep copy
        config = JSON.parse(JSON.stringify(config));

        // Run custom action
        // Run function action = "set-position"
        if (config[action].action == "set-position" && config[action]["position"])
            this.hass.callService("cover", "set_cover_position", {
                entity_id: this.entityId,
                position: this.config.invert_position ? 100 - config[action]["position"] : config[action]["position"],
            });

        // Add legacy service data support, removed in later versions
        if ("service_data" in config[action]) config[action]["data"] = config[action]["service_data"];

        // Call HA handle function
        switch (action) {
            case "tap_action":
                handleClick(this, this.hass, config, false, false);
                break;
            case "double_tap_action":
                handleClick(this, this.hass, config, false, true);
                break;
            case "hold_action":
                handleClick(this, this.hass, config, true, false);
                break;
        }
    }

    /*
        =========================================
        = Card functions
        =========================================
    */

    /**
     * Get card title
     * @returns string
     */
    getName() {
        // Check for custom template
        if (this.getTemplateText("titleLabel")) return this.getTemplateText("titleLabel");

        if (this.config.name) return this.config.name;
        return this.state.attributes.friendly_name;
    }

    /**
     * Get position value
     * @returns string
     */
    getPosition() {
        if (this.config.invert_position) return 100 - this.state.attributes.current_position;
        return this.state.attributes.current_position;
    }

    /**
     * Get position text for label
     * @returns string
     */
    getPositionLabel() {
        // Check for custom template
        if (this.getTemplateText("positionLabel")) return this.getTemplateText("positionLabel");

        if (
            (this.config.invert_position_label && this.getPosition() == 100) ||
            (!this.config.invert_position_label && this.getPosition() == 0)
        )
            return this.hass.localize("component.cover.state._.closed");
        if (
            (this.config.invert_position_label && this.getPosition() == 0) ||
            (!this.config.invert_position_label && this.getPosition() == 100)
        )
            return this.hass.localize("component.cover.state._.open");
        return `${this.getPosition()} %`;
    }

    /**
     * Sets meta for variables
     * @param {bool} force
     * @returns string
     */
    setMeta(force = false) {
        // Only on change
        if (this.state == this.hass.states[this.entityId] && !force) return;
        this.state = this.hass.states[this.entityId];
        this.stateDisplay = this.state ? this.state.state : "unavailable";
    }

    /**
     * Checks if cover is fully opened
     * @returns bool
     */
    upReached() {
        if (
            (!this.config.invert_position_label && this.getPosition() == 100) ||
            (this.config.invert_position_label && this.getPosition() == 0)
        )
            return true;
        return false;
    }

    /**
     * Checks if cover is fully closed
     * @returns bool
     */
    downReached() {
        if (
            (this.config.invert_position_label && this.getPosition() == 100) ||
            (!this.config.invert_position_label && this.getPosition() == 0)
        )
            return true;
        return false;
    }

    /**
     * Returns generalized moving state, returns false if not moving
     * @returns bool
     */
    currentMoving() {
        if (this.stateDisplay == "opening" || this.state.attributes.moving == "UP") return "up";
        if (this.stateDisplay == "closing" || this.state.attributes.moving == "DOWN") return "down";
        return false;
    }

    /**
     * Render entity icon
     * @returns html
     */
    renderIcon() {
        let getClassName = () => {
            if (this.config.state_color != undefined && this.config.state_color && this.stateDisplay != "closed")
                return "active-icon";
            return "";
        };

        let getIconElementById = (icon) => {
            return html`<ha-icon icon="${icon}" class="${getClassName()}"></ha-icon>`;
        };
        let getIconElementByPath = (path) => {
            return html`
                <ha-svg-icon-box>
                    <ha-svg-icon path="${path}" class="${getClassName()}"></ha-icon-button>
                </ha-svg-icon-box>
            `;
        };

        // Check for moving
        if (this.currentMoving() == "up") return getIconElementByPath(PATH_SHUTTER_UP);
        if (this.currentMoving() == "down") return getIconElementByPath(PATH_SHUTTER_DOWN);

        // Check for entity defined icon
        if (this.state.attributes.icon != undefined) return getIconElementById(this.state.attributes.icon);

        // Use dynamic icon
        if (this.downReached()) return getIconElementByPath(PATH_SHUTTER_100);
        if (this.getPosition() > 66) return getIconElementByPath(PATH_SHUTTER_75);
        if (this.getPosition() > 33) return getIconElementByPath(PATH_SHUTTER_50);
        if (this.getPosition() > 0) return getIconElementByPath(PATH_SHUTTER_25);

        return getIconElementByPath(PATH_SHUTTER_0);
    }

    /**
     * Render first row within card content
     * @returns html
     */
    renderFirstRow() {
        let moveUpDisabled = () => {
            if (this.stateDisplay == "unavailable") return true;
            if (this.upReached() || this.currentMoving() == "up") return true;
            return false;
        };
        let moveStopDisabled = () => {
            if (this.stateDisplay == "unavailable") return true;
            if (this.state.attributes.moving == "STOP") return true;
            return false;
        };
        let moveDownDisabled = () => {
            if (this.stateDisplay == "unavailable") return true;
            if (this.downReached() || this.currentMoving() == "down") return true;
            return false;
        };

        return html`
            <div class="card-row first-row">
                <div class="entity-icon">${this.renderIcon()}</div>

                <span class="entity-name" @click="${this.onMoreClick}">${this.getName()}</span>
                <div class="controls" state="${this.stateDisplay}">
                    <ha-icon-button
                        class="exclude-on-click"
                        .label=${this.hass.localize("ui.dialogs.more_info_control.cover.open_cover")}
                        .path="${mdiChevronUp}"
                        .disabled=${moveUpDisabled()}
                        @dblclick="${this.onMoveUpDoubleClick}"
                        @pointerdown="${onHoldPointerDown}"
                        @pointerup="${this.onMoveUpPointerUp}"
                    >
                    </ha-icon-button>
                    <ha-icon-button
                        class="exclude-on-click"
                        .label=${this.hass.localize("ui.dialogs.more_info_control.cover.stop_cover")}
                        .path="${mdiStop}"
                        .disabled=${moveStopDisabled()}
                        @dblclick="${this.onMoveStopDoubleClick}"
                        @pointerdown="${onHoldPointerDown}"
                        @pointerup="${this.onMoveStopPointerUp}"
                    >
                    </ha-icon-button>
                    <ha-icon-button
                        class="exclude-on-click"
                        .label=${this.hass.localize("ui.dialogs.more_info_control.cover.close_cover")}
                        .path="${mdiChevronDown}"
                        .disabled=${moveDownDisabled()}
                        @dblclick="${this.onMoveDownDoubleClick}"
                        @pointerdown="${onHoldPointerDown}"
                        @pointerup="${this.onMoveDownPointerUp}"
                    >
                    </ha-icon-button>
                </div>
            </div>
        `;
    }

    /**
     *  Render second row within card content
     * @returns html
     */
    renderSecondRow() {
        return html`
            <div class="card-row second-row">
                <ha-slider
                    class="exclude-on-click"
                    ignore-bar-touch=""
                    min="0"
                    max="100"
                    value=${this.getPosition()}
                    step="5"
                    pin
                    dir="${this.config.rtl_position ? "rtl" : "ltr"}"
                    role="slider"
                    @change="${this.onSliderChange}"
                ></ha-slider>
                <div class="infos">
                    <span class="position">${this.getPositionLabel()}</span>
                </div>
            </div>
        `;
    }

    /**
     * Render presets row within card content
     * @returns html
     */
    renderPresetsRow() {
        if (!this.config.preset_buttons) return;
        let presetsHtml = [];
        this.config.preset_buttons.forEach((presetConfig) => {
            presetsHtml.push(this.renderPreset(presetConfig));
        });
        return html`<div class="card-row preset-buttons">${presetsHtml}</div>`;
    }

    /**
     * Render one preset for the preset row
     * @param {Array} presetConfig
     * @returns html
     */
    renderPreset(presetConfig) {
        // Ripple effect
        let ripple = getRippleElement();
        // Events
        let onPointerDownFunc = () => {
            ripple.startPress();
            onHoldPointerDown();
        };
        let onPointerUpFunc = () => {
            ripple.endPress();
            let onClickCallback = () => {
                this.callCustomAction(presetConfig, "tap_action");
            };
            let onHoldCallback = () => {
                this.callCustomAction(presetConfig, "hold_action");
            };
            onPointerUp(this, onClickCallback, onHoldCallback);
        };
        let onDoubleClick = () => {
            this.callCustomAction(presetConfig, "double_tap_action");
        };

        return html`
            <div
                class="button exclude-on-click"
                @dblclick="${onDoubleClick}"
                @pointerdown="${onPointerDownFunc}"
                @pointerup="${onPointerUpFunc}"
            >
                <ha-icon class="exclude-on-click" icon="${presetConfig.icon}"></ha-icon>
                <span class="exclude-on-click">${presetConfig.name}</span>
                ${ripple}
            </div>
        `;
    }

    /**
     * Render card content
     * @returns html
     */
    renderContent() {
        if (this.config.disable_position) return html` ${this.renderFirstRow()} ${this.renderPresetsRow()} `;

        return html`${this.renderFirstRow()} ${this.renderSecondRow()} ${this.renderPresetsRow()}`;
    }

    /**
     * Render card container with content
     * @returns html
     */
    renderContainer() {
        return html`<div class="content" @click="${this.onMoreClick}">${this.renderContent()}</div>`;
    }

    /**
     * Adds template listener
     * @param {String} attribute
     * @param {String} template
     */
    addTemplate(attribute, template) {
        // Check if already defined
        if (attribute in this.templated) return;

        // Define variables
        let params = {};
        let variables = {
            entity: this.entityId,
            hash: location.hash.substr(1) || " ",
            ...params.variables,
        };
        var context = this;
        let onChange = function (result) {
            context.templated[attribute] = result;
            context.templated_changed = !context.templated_changed;
        };

        // Set init object and subscribe to connection
        context.templated[attribute] = true;
        this.hass.connection.subscribeMessage(onChange, {
            type: "render_template",
            template,
            variables,
        });
    }

    /**
     * Gets rendered template text
     * @param {string} attribute
     * @returns string
     */
    getTemplateText(attribute) {
        if (attribute in this.templated == false) return false;
        if (this.templated.attribute) return false;
        return this.templated[attribute].result;
    }

    /**
     * Before rendering html
     */
    preRender() {
        // Add template renderer
        let addConfigTemplate = (configAttribute, templateId) => {
            let configValue = this.config[configAttribute];
            if (configValue) this.addTemplate(templateId, configValue);
        };

        addConfigTemplate("position_template", "positionLabel");
        addConfigTemplate("title_template", "titleLabel");
    }

    /**
     * Render lovelace card
     * @returns html
     */
    render() {
        this.preRender();
        this.setMeta();

        // If card is part of group, root <ha-card> element is not needed
        if (this.config.group) return this.renderContainer();

        // Render card with <ha-card> element
        return html`<ha-card>${this.renderContainer()}</ha-card>`;
    }

    /*
        =========================================
        = DOM element handler
        =========================================
    */

    /**
     *  Get all important DOM elements
     * @returns Array
     */
    _getElements() {
        return {
            controls: this.renderRoot.querySelector("div.card-row.first-row div.controls"),
            slider: this.renderRoot.querySelector("div.card-row.second-row ha-slider"),
        };
    }

    /**
     * On move up pointer up
     */
    onMoveUpPointerUp() {
        let onClickCallback = (e) => {
            if (this.config.move_up_button && this.config.move_up_button.tap_action) {
                this.callCustomAction(this.config.move_up_button, "tap_action");
                return;
            }
            // Run default action
            if (this.upReached()) return;
            this.hass.callService("cover", "open_cover", {
                entity_id: this.entityId,
            });
        };
        let onHoldCallback = (e) => {
            this.callCustomAction(this.config.move_up_button, "hold_action");
        };
        onPointerUp(this, onClickCallback, onHoldCallback);
    }

    /**
     *  On move up double click
     */
    onMoveUpDoubleClick() {
        this.callCustomAction(this.config.move_up_button, "double_tap_action");
    }

    /**
     * On move stop pointer up
     */
    onMoveStopPointerUp() {
        let onClickCallback = (e) => {
            if (this.config.move_stop_button && this.config.move_stop_button.tap_action) {
                this.callCustomAction(this.config.move_stop_button, "tap_action");
                return;
            }
            // Run default action
            if (this.state.attributes.moving == "STOP") return;
            this.hass.callService("cover", "stop_cover", {
                entity_id: this.entityId,
            });
        };
        let onHoldCallback = (e) => {
            this.callCustomAction(this.config.move_stop_button, "hold_action");
        };
        onPointerUp(this, onClickCallback, onHoldCallback);
    }

    /**
     * On move down double click
     */
    onMoveStopDoubleClick() {
        this.callCustomAction(this.config.move_stop_button, "double_tap_action");
    }

    /**
     * On move down pointer up
     */
    onMoveDownPointerUp() {
        let onClickCallback = (e) => {
            if (this.config.move_down_button && this.config.move_down_button.tap_action) {
                this.callCustomAction(this.config.move_down_button, "tap_action");
                return;
            }
            // Run default action
            if (this.downReached()) return;
            this.hass.callService("cover", "close_cover", {
                entity_id: this.entityId,
            });
        };
        let onHoldCallback = (e) => {
            this.callCustomAction(this.config.move_down_button, "hold_action");
        };
        onPointerUp(this, onClickCallback, onHoldCallback);
    }

    /**
     * On move down double click
     */
    onMoveDownDoubleClick() {
        this.callCustomAction(this.config.move_down_button, "double_tap_action");
    }

    /**
     * On position input change
     */
    onSliderChange() {
        let elements = this._getElements();
        let value = parseInt(elements.slider.value);
        if (value == this.getPosition()) return;
        this.hass.callService("cover", "set_cover_position", {
            entity_id: this.entityId,
            position: this.config.invert_position ? 100 - value : value,
        });
    }

    /**
     * Open HA more info
     */
    onMoreClick(event) {
        // Exclude already binded elements
        if (event.target.classList.contains("exclude-on-click")) return;

        let entityId = this.config.entity;
        fireEvent(
            this,
            "hass-more-info",
            {
                entityId,
            },
            {
                bubbles: false,
                composed: true,
            }
        );
    }
}

customElements.define(HASSIO_CARD_ID, ShutterRow);
console.info("%c" + HASSIO_CARD_NAME.toLocaleUpperCase() + " " + VERSION, "color: #ffa500");
