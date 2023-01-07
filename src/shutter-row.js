import {
    LitElement,
    html,
} from "lit";
import {
    fireEvent,
    handleClick,
} from "custom-card-helpers";
import {
    mdiChevronDown,
    mdiStop,
    mdiChevronUp,
} from "@mdi/js";

import {
    onHoldPointerDown,
    onPointerUp,
    getRippleElement,
} from "./helpers.js";
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
import style from "./style.css";
import "./editor.js";


class ShutterRow extends LitElement {
    constructor() {
        super();

        // Define empty 'templated' variable for rendered templates
        this.templated = {};
    }

    /*
        =========================================
        = Lovelace needed functions
        =========================================
    */
    static get properties() {
        return {
            hass: Object,
            config: Object,
            templated_changed: Boolean, // Because 'templated' as variable didn't rerender, there is a boolean which flips on every template changed
        };
    }
    /*
         Returns CSS style
    */
    static get styles() {
        return style;
    }

    /*
        Getter function for shutter row editor element
    */
    static getConfigElement() {
        return document.createElement(HASSIO_CARD_EDITOR_ID);
    }

    /*
        Lovelace function to get card height
    */
    getCardSize() {
        return 2;
    }
    /*
        On user config update
    */
    setConfig(config) {
        let getConfigAttribute = (attribute, defaultValue, array=this._config) => {
            if(!array)
                return;
            return attribute in array ? array[attribute] : defaultValue;
        }
        if (!config.entity) {
            throw new Error('You need to define an entity');
        }

        this._config = config;
        this.config = {
            type: config.type,
            entity: config.entity,
            name: getConfigAttribute("name", false),
            invert_position: getConfigAttribute("invert_position", false),
            invert_position_label: getConfigAttribute("invert_position_label", false) || getConfigAttribute("invert_position", false),
            disable_position: getConfigAttribute("disable_position", false),
            rtl_position: getConfigAttribute("rtl_position", false),
            state_color: getConfigAttribute("state_color", false),
            group: getConfigAttribute("group", false),
            title_template: getConfigAttribute("title_template", false),
            position_template: getConfigAttribute("position_template", false),
            move_down_button: {
                tap_action: getConfigAttribute("tap_action", false, getConfigAttribute("move_down_button", false)),
                double_tap_action: getConfigAttribute("double_tap_action", false, getConfigAttribute("move_down_button", false)),
                hold_action: getConfigAttribute("hold_action", false, getConfigAttribute("move_down_button", false)),
            },
            move_stop_button: {
                tap_action: getConfigAttribute("tap_action", false, getConfigAttribute("move_stop_button", false)),
                double_tap_action: getConfigAttribute("double_tap_action", false, getConfigAttribute("move_stop_button", false)),
                hold_action: getConfigAttribute("hold_action", false, getConfigAttribute("move_stop_button", false)),
            },
            move_up_button: {
                tap_action: getConfigAttribute("tap_action", false, getConfigAttribute("move_up_button", false)),
                double_tap_action: getConfigAttribute("double_tap_action", false, getConfigAttribute("move_up_button", false)),
                hold_action: getConfigAttribute("hold_action", false, getConfigAttribute("move_up_button", false)),
            },
            preset_buttons: getConfigAttribute("preset_buttons", false),
        }
        this.entityId = this.config.entity;
    }
    /*
        Calls custom action if defined
    */
    callCustomAction(config, action) {
        // Check if defined
        if(!config[action])
            return;

        // Run custom action
        // Run function action = "set-position"
        if(config[action].action == "set-position" && config[action]["position"])
            this.hass.callService("cover", "set_cover_position", {
                entity_id: this.entityId,
                position: this.config.invert_position ? (100 - config[action]["position"]) : config[action]["position"],
            });

        // Call HA handle function
        switch(action) {
            case "tap_action": handleClick(this, this.hass, config, false, false); break;
            case "double_tap_action": handleClick(this, this.hass, config, false, true); break;
            case "hold_action": handleClick(this, this.hass, config, true, false); break;
        }
    }

    /*
        =========================================
        = Card functions
        =========================================
    */

    /*
        Get card title
    */
    getName() {
        // Check for custom template
        if(this.getTemplateText("titleLabel"))
            return this.getTemplateText("titleLabel");

        if(this.config.name)
            return this.config.name;
        return this.state.attributes.friendly_name;
    }
    /*
        Get position value
    */
    getPosition() {
        if(this.config.invert_position)
            return (100 - this.state.attributes.current_position);
        return this.state.attributes.current_position;
    }
    /*
        Get position text for label
    */
    getPositionLabel() {
        // Check for custom template
        if(this.getTemplateText("positionLabel"))
            return this.getTemplateText("positionLabel");

        if( (this.config.invert_position_label && this.getPosition() == 100) ||
                (!this.config.invert_position_label && this.getPosition() == 0) )
            return this.hass.localize("component.cover.state._.closed");
        if( (this.config.invert_position_label && this.getPosition() == 0) ||
                (!this.config.invert_position_label && this.getPosition() == 100) )
            return this.hass.localize("component.cover.state._.open");
        return `${this.getPosition()} %`;
    }
    /*
        Sets meta for variables
    */
    setMeta(force=false) {
        // Only on change
        if(this.state == this.hass.states[this.entityId] && !force)
            return;
        this.state = this.hass.states[this.entityId];
        this.stateDisplay = this.state ? this.state.state : 'unavailable';
    } 
    /*
        Checks if cover is fully opened
    */
    upReached() {
        if(!this.config.invert_position_label && this.getPosition() == 100 ||
        this.config.invert_position_label && this.getPosition() == 0)
                return true;
        return false;
    }
    /*
        Checks if cover is fully closed
    */
    downReached() {
        if(this.config.invert_position_label && this.getPosition() == 100 ||
            !this.config.invert_position_label && this.getPosition() == 0)
                return true;
        return false;
    }
    /*
        Returns generalized moving state, returns false if not moving
    */
    currentMoving() {
        if(this.stateDisplay == "opening" || this.state.attributes.moving == "UP")
            return "up";
        if(this.stateDisplay == "closing" || this.state.attributes.moving == "DOWN")
            return "down";
        return false;
    }
    /*
        Render entity icon
    */ 
    renderIcon() {
        let getIconElementById = (icon) => {
            return html`<ha-icon-button icon="${icon}" class="${(this.config.state_color != undefined && this.config.state_color && this.stateDisplay != "closed") ? "active-icon" : ""}"></ha-icon>`;
        };
        let getIconElementByPath = (path) => {
            return html`<ha-icon-button path="${path}" class="${(this.config.state_color != undefined && this.config.state_color && this.stateDisplay != "closed") ? "active-icon" : ""}"></ha-icon>`;
        }

        // Check for moving
        if(this.currentMoving() == "up")
            return getIconElementByPath(PATH_SHUTTER_UP);
        if(this.currentMoving() == "down")
            return getIconElementByPath(PATH_SHUTTER_DOWN);

        // Check for entity defined icon
        if(this.state.attributes.icon != undefined)
            return getIconElementById(this.state.attributes.icon);
        this.getPosition()

        // Use dynamic icon
        if(this.downReached())
            return getIconElementByPath(PATH_SHUTTER_100);
        if(this.getPosition() > 66)
            return getIconElementByPath(PATH_SHUTTER_75);
        if(this.getPosition() > 33)
            return getIconElementByPath(PATH_SHUTTER_50);
        if(this.getPosition() > 0)
            return getIconElementByPath(PATH_SHUTTER_25);

        return getIconElementByPath(PATH_SHUTTER_0);
    }
    /*
        Render first row within card content
    */
    renderFirstRow() {
        let moveUpDisabled = () => {
            if(this.stateDisplay == "unavailable")
                return true;
            if(this.upReached() || this.currentMoving() == "up")
                return true;
            return false;
        };
        let moveStopDisabled = () => {
            if(this.stateDisplay == "unavailable")
                return true;
            if(this.state.attributes.moving == "STOP")
                return true;
            return false;
        };
        let moveDownDisabled = () => {
            if(this.stateDisplay == "unavailable")
                return true;
            if(this.downReached() || this.currentMoving() == "down")
                return true;
            return false;
        };

        return html`
            <div class="card-row first-row">
                <div class="entity-icon">
                    ${this.renderIcon()}
                </div>
                
                <span class="entity-name" @click="${this.moreInfo}">${this.getName()}</span>
                <div class="controls" state="${this.stateDisplay}">
                    <ha-icon-button
                        .label=${this.hass.localize("ui.dialogs.more_info_control.cover.open_cover")}
                        .path="${mdiChevronUp}"
                        .disabled=${moveUpDisabled()}
                        @dblclick="${this.onMoveUpDoubleClick}"
                        @pointerdown="${onHoldPointerDown}"
                        @pointerup="${this.onMoveUpPointerUp}">
                    </ha-icon-button>
                    <ha-icon-button
                        .label=${this.hass.localize("ui.dialogs.more_info_control.cover.stop_cover")}
                        .path="${mdiStop}"
                        .disabled=${moveStopDisabled()}
                        @dblclick="${this.onMoveStopDoubleClick}"
                        @pointerdown="${onHoldPointerDown}"
                        @pointerup="${this.onMoveStopPointerUp}">
                    </ha-icon-button>
                    <ha-icon-button
                        .label=${this.hass.localize("ui.dialogs.more_info_control.cover.close_cover")}
                        .path="${mdiChevronDown}"
                        .disabled=${moveDownDisabled()}
                        @dblclick="${this.onMoveDownDoubleClick}"
                        @pointerdown="${onHoldPointerDown}"
                        @pointerup="${this.onMoveDownPointerUp}">
                    </ha-icon-button>
                </div>
            </div>
        `;
    }
    /*
        Render second row within card content
    */
    renderSecondRow() {
        return html`
            <div class="card-row second-row">
                <ha-slider ignore-bar-touch="" min="0" max="100" value=${this.getPosition()} step="5" pin dir="${this.config.rtl_position ? "rtl": "ltr"}" role="slider" @change="${this.onSliderChange}"></ha-slider>
                <div class="infos">
                    <span class="position">${this.getPositionLabel()}</span>
                </div>
            </div>
        `;
    }
    /*
        Render presets row within card content
    */
    renderPresetsRow() {
        if(!this.config.preset_buttons)
            return;
        let presetsHtml = [];
        this.config.preset_buttons.forEach(presetConfig => {
            presetsHtml.push(this.renderPreset(presetConfig));
        });
        return html`
            <div class="card-row preset-buttons">
               ${presetsHtml}
            </div>
        `;
    }
    /*
        Render one preset for the preset row
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
            }
            let onHoldCallback = () => {
                this.callCustomAction(presetConfig, "hold_action");
            }
            onPointerUp(this, onClickCallback, onHoldCallback);
        };
        let onDoubleClick = () => {
            this.callCustomAction(presetConfig, "double_tap_action");
        };

        return html`
            <div class="button" @dblclick="${onDoubleClick}" @pointerdown="${onPointerDownFunc}" @pointerup="${onPointerUpFunc}">
                <ha-icon icon="${presetConfig.icon}"></ha-icon>
                <span>${presetConfig.name}</span>
                ${ripple}
            </div>
        `;
    }
    /*
        Render card content
    */
    renderContent() {
        if(this.config.disable_position)
            return html`
                ${this.renderFirstRow()}
                ${this.renderPresetsRow()}
            `;

        return html`
            ${this.renderFirstRow()}
            ${this.renderSecondRow()}
            ${this.renderPresetsRow()}
        `;
    }
    /*
        Adds template listener
    */
    addTemplate(attribute, template) {
        // Check if already defined
        if(attribute in this.templated)
            return;

        // Define variables
        let params = {};
        let variables = {
            entity: this.entityId,
            hash: location.hash.substr(1) || ' ',
            ...params.variables,
        };
        var context = this;
        let onChange = function(result) {
            context.templated[attribute] = result;
            context.templated_changed = !context.templated_changed;
        }

        // Set init object and subscribe to connection
        context.templated[attribute] = true;
        this.hass.connection.subscribeMessage(onChange, {
            type: "render_template",
            template,
            variables,
        });
    }
    /*
        Gets rendered template text
    */
    getTemplateText(attribute) {
        if(attribute in this.templated == false)
            return false;
        if(this.templated.attribute)
            return false;
        return this.templated[attribute].result;
    }
    /*
        Before rendering html
    */
    preRender() {
        // Add template renderer
        let addConfigTemplate = (configAttribute, templateId) => {
            let configValue = this.config[configAttribute];
            if(configValue)
                this.addTemplate(templateId, configValue);
        }

        addConfigTemplate("position_template", "positionLabel");
        addConfigTemplate("title_template", "titleLabel");
    }
    /*
        Render lovelace card
    */
    render() {
        this.preRender();
        this.setMeta();

        // If card is part of group, root <ha-card> element is not needed
        if(this.config.group)
            return this.renderContent();
        
        // Render card with <ha-card> element
        return html`
            <ha-card>
                ${this.renderContent()}
            </ha-card>
        `;
    }


    /*
        =========================================
        = DOM element handler
        =========================================
    */

    /*
        Get all important DOM elements
    */
    _getElements() {
        return {
            controls: this.renderRoot.querySelector("div.card-row.first-row div.controls"),
            slider: this.renderRoot.querySelector("div.card-row.second-row ha-slider"),
        }
    }
    /*
        On move up pointer up
    */
    onMoveUpPointerUp() {
        let onClickCallback = (e) => {
            if(this.config.move_up_button && this.config.move_up_button.tap_action) {
                this.callCustomAction(this.config.move_up_button, "tap_action");
                return;
            }
            // Run default action
            if(this.upReached())
                return;
            this.hass.callService("cover", "open_cover", {
                entity_id: this.entityId,
            });
        }
        let onHoldCallback = (e) => {
            this.callCustomAction(this.config.move_up_button, "hold_action");
        }
        onPointerUp(this, onClickCallback, onHoldCallback);
    }
    /*
        On move up double click
    */
    onMoveUpDoubleClick() {
        this.callCustomAction(this.config.move_up_button, "double_tap_action");
    }
    /*
        On move stop pointer up
    */
    onMoveStopPointerUp() {
        let onClickCallback = (e) => {
            if(this.config.move_stop_button && this.config.move_stop_button.tap_action) {
                this.callCustomAction(this.config.move_stop_button, "tap_action");
                return;
            }
            // Run default action
            if(this.state.attributes.moving == "STOP")
                return;
            this.hass.callService("cover", "stop_cover", {
                entity_id: this.entityId,
            });
        }
        let onHoldCallback = (e) => {
            this.callCustomAction(this.config.move_stop_button, "hold_action");
        }
        onPointerUp(this, onClickCallback, onHoldCallback);
    }
    /*
        On move down double click
    */
    onMoveStopDoubleClick() {
        this.callCustomAction(this.config.move_stop_button, "double_tap_action");
    }
    /*
        On move down pointer up
    */
    onMoveDownPointerUp() {
        let onClickCallback = (e) => {
            if(this.config.move_down_button && this.config.move_down_button.tap_action) {
                this.callCustomAction(this.config.move_down_button, "tap_action");
                return;
            }
            // Run default action
            if(this.downReached())
                return;
            this.hass.callService("cover", "close_cover", {
                entity_id: this.entityId,
            });
        }
        let onHoldCallback = (e) => {
            this.callCustomAction(this.config.move_down_button, "hold_action");
        }
        onPointerUp(this, onClickCallback, onHoldCallback);
    }
    /*
        On move down double click
    */
    onMoveDownDoubleClick() {
        this.callCustomAction(this.config.move_down_button, "double_tap_action");
    }
    /*
        On position input change
    */
    onSliderChange() {
        let elements = this._getElements();
        let value = parseInt(elements.slider.value);
        if(value == this.getPosition())
            return;
        this.hass.callService("cover", "set_cover_position", {
            entity_id: this.entityId,
            position: this.config.invert_position ? (100 - value) : value,
        });
    }
    /*
        Open HA more info
    */
    moreInfo() {
        let entityId = this.config.entity;
        fireEvent(this, 'hass-more-info', {
            entityId,
        }, {
            bubbles: false,
            composed: true,
        });
    }
}

customElements.define(HASSIO_CARD_ID, ShutterRow);
console.info("%c" + HASSIO_CARD_NAME.toLocaleUpperCase() + " " + VERSION, "color: #ffa500");