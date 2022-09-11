import { LitElement, html } from 'lit';
import { fireEvent } from 'custom-card-helpers';
import style from './style.css';

let HASSIO_CARD_ID = "shutter-row-dev";
let HASSIO_CARD_NAME = "Shutter row";
let VERSION = "0.1.1"


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
        let getConfigAttribute = (attribute, defaultValue) => {
            return attribute in this._config ? this._config[attribute] : defaultValue;
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
        }
        this.entityId = this.config.entity;
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
    upReached() {
        if(!this.config.invert_position_label && this.getPosition() == 100 ||
        this.config.invert_position_label && this.getPosition() == 0)
                return true;
        return false;
    }
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
        return html`<ha-icon icon="${icon}" class="${this.config.state_color != undefined && this.config.state_color ? "active-icon" : ""}"></ha-icon>`;
    }
    // Render lovelace card
    render() {
        this.setMeta();

        return html`
            <ha-card>
                <div class="card-row card-first-row">
                    <div class="entity-icon">
                        ${this.renderIcon()}
                    </div>
                    
                    <span class="entity-name" @click="${this.moreInfo}">${this.getName()}</span>
                    <div class="controls" state="${this.stateDisplay}">
                        <ha-icon icon="mdi:chevron-up" class="${this.upReached() || this.stateDisplay == "opening" ? "disabled" : ''}" @click="${this.onUpClick}"></ha-icon>
                        <ha-icon icon="mdi:stop" class="${(this.stateDisplay == "open" || this.stateDisplay == "closed") ? "disabled" : ''}" @click="${this.onStopClick}"></ha-icon>
                        <ha-icon icon="mdi:chevron-down" class="${this.downReached() || this.stateDisplay == "closing" ? "disabled" : ''}" @click="${this.onDownClick}"></ha-icon>
                    </div>
                </div>
                <div class="card-row card-second-row">
                    <ha-slider ignore-bar-touch="" min="0" max="100" value=${this.getPosition()} step="5" pin dir="ltr" role="slider" @change="${this.onSliderChange}"></ha-slider>
                    <div class="infos">
                        <span class="position">${this.getPositionLabel()}</span>
                    </div>
                </div>
            </ha-card>
        `;
    }

    /*
        DOM element handler
    */
   // Get all important DOM elements
    _getElements() {
        return {
            controls: this.renderRoot.querySelector("div.card-first-row div.controls"),
            slider: this.renderRoot.querySelector("div.card-second-row ha-slider"),
        }
    }
    // On move up button click
    onUpClick() {
        let elements = this._getElements();
        if(this.stateDisplay == "opening" || elements.controls.hasAttribute("up-reached"))
            return;
        this.hass.callService("cover", "open_cover", {
            entity_id: this.entityId,
        });
    }
    // On move down button click
    onDownClick() {
        let elements = this._getElements();
        if(this.stateDisplay == "closing" || elements.controls.hasAttribute("down-reached"))
            return;
        this.hass.callService("cover", "close_cover", {
            entity_id: this.entityId,
        });
    }
    // On stop button click
    onStopClick() {
        if(this.stateDisplay == "open" || this.stateDisplay == "closed")
            return;
        this.hass.callService("cover", "stop_cover", {
            entity_id: this.entityId,
        });
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