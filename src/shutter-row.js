import { LitElement, html } from 'lit';
import { fireEvent } from 'custom-card-helpers';
import style from './style.css';

let PACKAGE_JSON = require('./package.json');
let HASSIO_CARD_ID = "shutter-row";
let HASSIO_CARD_NAME = "Shutter row";
let VERSION = PACKAGE_JSON.version;


class ShutterRow extends LitElement {
    static get properties() {
        return {
            hass: Object,
            config: Object,
        };
    }

    static get styles() {
        return style;
    }

    getConfig() {
        let getConfigAttribute = (attribute, defaultValue) => {
            return attribute in this._config ? this._config[attribute] : defaultValue;
        }

        return {
            type: getConfigAttribute("type", false),
            entity: getConfigAttribute("entity", false),
            name: getConfigAttribute("name", false),
            invert_position: getConfigAttribute("invert_position", false),
        };
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
        }
        this.entityId = this.config.entity;
    }
  
    // Lovelace card height
    getCardSize() {
        return 2;
    }
    getName() {
        if(this.getConfig().name)
            return this.getConfig().name;
        return this.state.attributes.friendly_name;
    }
    getPosition() {
        return this.state.attributes.current_position;
    }
    getPositionDisplay() {
        if( (this.getConfig().invert_position && this.getPosition() == 100) ||
                (!this.getConfig().invert_position && this.getPosition() == 0) )
            return this.hass.localize("component.cover.state._.closed");
        if( (this.config.invert_position && this.getPosition() == 0) ||
                (!this.getConfig().invert_position && this.getPosition() == 100) )
            return this.hass.localize("component.cover.state._.open");
        return `${this.getPosition()} %`;
    }
    setMeta(force=false) {
        // Only on change
        if(this.state == this.hass.states[this.entityId] && !force)
            return;
        this.state = this.hass.states[this.entityId];
        this.stateDisplay = this.state ? this.state.state : 'unavailable';
    }

    render() {
        this.setMeta();

        let config = this.getConfig();
        let position = this.getPosition();

        let upReached = function() {
            if(!config.invert_position && position == 100 ||
                    config.invert_position && position == 0)
                    return true;
            return false;
        }
        let downReached = function() {
            if(config.invert_position && position == 100 ||
                !config.invert_position && position == 0)
                    return true;
            return false;
        }
        return html`
            <ha-card>
                <div class="card-row card-first-row">
                    <div class="entity-icon">
                        <ha-icon icon="mdi:window-shutter-open" class="${downReached() ? 'ghost' : ''}"></ha-icon>
                        <ha-icon icon="mdi:window-shutter" class="${!downReached() ? 'ghost' : ''}"></ha-icon>
                    </div>
                    
                    <span class="entity-name" @click="${this.moreInfo}">${this.getName()}</span>
                    <div class="controls" state="${this.stateDisplay}">
                        <ha-icon icon="mdi:chevron-up" class="${upReached() || this.state.attributes.moving == "UP" ? "disabled": ''}" @click="${this.onUpClick}"></ha-icon>
                        <ha-icon icon="mdi:stop" class="${this.state.attributes.moving == "STOP" ? "disabled": ''}" @click="${this.onStopClick}"></ha-icon>
                        <ha-icon icon="mdi:chevron-down" class="${downReached() || this.state.attributes.moving == "DOWN" ? "disabled": ''}" @click="${this.onDownClick}"></ha-icon>
                    </div>
                </div>
                <div class="card-row card-second-row">
                    <ha-slider ignore-bar-touch="" min="0" max="100" value=${this.getPosition()} step="5" pin dir="ltr" role="slider" @change="${this.onSliderChange}"></ha-slider>
                    <div class="infos">
                        <span class="position">${this.getPositionDisplay()}</span>
                    </div>
                </div>
            </ha-card>
        `;
    }
    getElements() {
        return {
            controls: this.renderRoot.querySelector("div.card-first-row div.controls"),
            slider: this.renderRoot.querySelector("div.card-second-row ha-slider"),
        }
    }

    onUpClick() {
        let elements = this.getElements();
        if(this.state.attributes.moving == "UP" || elements.controls.hasAttribute("up-reached"))
            return;
        this.hass.callService("cover", "open_cover", {
            entity_id: this.entityId,
        });
    }

    onDownClick() {
        let elements = this.getElements();
        if(this.state.attributes.moving == "DOWN" || elements.controls.hasAttribute("down-reached"))
            return;
        this.hass.callService("cover", "close_cover", {
            entity_id: this.entityId,
        });
    }

    onStopClick() {
        if(this.state.attributes.moving == "STOP")
            return;
        this.hass.callService("cover", "stop_cover", {
            entity_id: this.entityId,
        });
    }

    onSliderChange() {
        let elements = this.getElements();
        if(elements.slider.value == this.getPosition())
            return;
        this.hass.callService("cover", "set_cover_position", {
            entity_id: this.entityId,
            position: parseInt(elements.slider.value),
        });
    }

    moreInfo() {
        let entityId = this.getConfig().entity;
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