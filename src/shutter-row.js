import {
    LitElement,
    html,
} from "lit";
import {
    fireEvent,
    handleClick,
} from "custom-card-helpers";

import {
    onHoldPointerDown,
    onPointerUp,
    getRippleElement,
} from "./helpers.js"
import style from "./style.css";

let HASSIO_CARD_ID = "shutter-row";
let HASSIO_CARD_NAME = "Shutter row";
let VERSION = "0.2.1";


class ShutterRow extends LitElement {
    /*
        Lovelace needed functions
    */
    static get properties() {
        return {
            hass: Object,
            config: Object,
        };
    }
    // Lovelace card height
    getCardSize() {
        return 2;
    }
    // On user config update
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
            state_color: getConfigAttribute("state_color", false),
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
    // Calls custom action if defined
    callCustomAction(config, action) {
        // Check if defined
        if(!config[action])
            return;
        // Run custom action
        switch(action) {
            case "tap_action": handleClick(this, this.hass, config, false, false); break;
            case "double_tap_action": handleClick(this, this.hass, config, false, true); break;
            case "hold_action": handleClick(this, this.hass, config, true, false); break;
        }
    }

    /*
        Card functions
    */
    // Returns CSS style
    static get styles() {
        return style;
    }
    // Get entity name
    getName() {
        if(this.config.name)
            return this.config.name;
        return this.state.attributes.friendly_name;
    }
    // Get position value
    getPosition() {
        if(this.config.invert_position)
            return (100 - this.state.attributes.current_position);
        return this.state.attributes.current_position;
    }
    // Get position text for label
    getPositionLabel() {
        if( (this.config.invert_position_label && this.getPosition() == 100) ||
                (!this.config.invert_position_label && this.getPosition() == 0) )
            return this.hass.localize("component.cover.state._.closed");
        if( (this.config.invert_position_label && this.getPosition() == 0) ||
                (!this.config.invert_position_label && this.getPosition() == 100) )
            return this.hass.localize("component.cover.state._.open");
        return `${this.getPosition()} %`;
    }
    // Sets meta for variables
    setMeta(force=false) {
        // Only on change
        if(this.state == this.hass.states[this.entityId] && !force)
            return;
        this.state = this.hass.states[this.entityId];
        this.stateDisplay = this.state ? this.state.state : 'unavailable';
    }
    // Checks if cover is fully opened
    upReached() {
        if(!this.config.invert_position_label && this.getPosition() == 100 ||
        this.config.invert_position_label && this.getPosition() == 0)
                return true;
        return false;
    }
    // Checks if cover is fully closed
    downReached() {
        if(this.config.invert_position_label && this.getPosition() == 100 ||
            !this.config.invert_position_label && this.getPosition() == 0)
                return true;
        return false;
    }

    // Render entity icon
    renderIcon() {
        let icon = "";
        // Check for entity defined icon
        if(this.state.attributes.icon != undefined)
            icon = this.state.attributes.icon;
        else {
            // Use dynamic icon
            if(this.downReached())
                icon = "mdi:window-shutter";
            else
                icon = "mdi:window-shutter-open";
        }
        return html`<ha-icon icon="${icon}" class="${(this.config.state_color != undefined && this.config.state_color && this.stateDisplay != "closed") ? "active-icon" : ""}"></ha-icon>`;
    }
    renderFirstRow() {
        let moveUpDisabled = () => {
            if(this.stateDisplay == "unavailable")
                return true;
            if(this.upReached() || this.stateDisplay == "opening" || this.state.attributes.moving == "UP")
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
            if(this.downReached() || this.stateDisplay == "closing" || this.state.attributes.moving == "DOWN")
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
                    <ha-icon icon="mdi:chevron-up" class="${moveUpDisabled() ? "disabled" : ''}" @dblclick="${this.onMoveUpDoubleClick}" @pointerdown="${onHoldPointerDown}" @pointerup="${this.onMoveUpPointerUp}"></ha-icon>
                    <ha-icon icon="mdi:stop" class="${moveStopDisabled() ? "disabled" : ''}" @dblclick="${this.onMoveStopDoubleClick}" @pointerdown="${onHoldPointerDown}" @pointerup="${this.onMoveStopPointerUp}"></ha-icon>
                    <ha-icon icon="mdi:chevron-down" class="${moveDownDisabled() ? "disabled" : ''}" @dblclick="${this.onMoveDownDoubleClick}" @pointerdown="${onHoldPointerDown}" @pointerup="${this.onMoveDownPointerUp}"></ha-icon>
                </div>
            </div>
        `;
    }
    renderSecondRow() {
        return html`
            <div class="card-row second-row">
                <ha-slider ignore-bar-touch="" min="0" max="100" value=${this.getPosition()} step="5" pin dir="ltr" role="slider" @change="${this.onSliderChange}"></ha-slider>
                <div class="infos">
                    <span class="position">${this.getPositionLabel()}</span>
                </div>
            </div>
        `;
    }
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
    // Render lovelace card
    render() {
        this.setMeta();
        
        return html`
            <ha-card>
                ${this.renderFirstRow()}
                ${this.renderSecondRow()}
                ${this.renderPresetsRow()}
            </ha-card>
        `;
    }
    /*
        DOM element handler
    */
    // Get all important DOM elements
    _getElements() {
        return {
            controls: this.renderRoot.querySelector("div.card-row.first-row div.controls"),
            slider: this.renderRoot.querySelector("div.card-row.second-row ha-slider"),
        }
    }

    // On move up pointer up
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
    // On move up double click
    onMoveUpDoubleClick() {
        this.callCustomAction(this.config.move_up_button, "double_tap_action");
    }
    // On move stop pointer up
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
    // On move down double click
    onMoveStopDoubleClick() {
        this.callCustomAction(this.config.move_stop_button, "double_tap_action");
    }
    // On move down pointer up
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
    // On move down double click
    onMoveDownDoubleClick() {
        this.callCustomAction(this.config.move_down_button, "double_tap_action");
    }

    // On position input change
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
    // Open HA more info
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