import {
    LitElement,
    html,
    css,
} from "lit";
import { fireEvent } from 'custom-card-helpers';
import {
    HASSIO_CARD_ID,
    HASSIO_CARD_EDITOR_ID,
    HASSIO_CARD_NAME,
} from "./const.js";

function setValue(obj, path, value) {
    const pathFragments = path.split('.')
    let o = obj
    while (pathFragments.length - 1) {
        var fragment = pathFragments.shift()
        if (!o.hasOwnProperty(fragment)) o[fragment] = {}
        o = o[fragment]
    }
    o[pathFragments[0]] = value
}

const cloneDeep = (obj) => JSON.parse(JSON.stringify(obj))

const includeDomains = ["cover"]

class ShutterRowEditor extends LitElement {

    static get properties() {
        return {
            hass: {},
            config: {}
        };
    }

    setConfig(config) {
        this.config = config;
        console.log(config);
    }

    getConfigValue(config) {
        if(!this.config[config])
            return "";
        return this.config[config];
    }

    get allCoverEntities() {
        let entitiyIds = [];
        Object.keys(this.hass.states).forEach(key => {
            if(key.split(".")[0] == "cover")
                return;
            entitiyIds.push(key);
        });
        return entitiyIds;
    }

    valueChanged(ev) {
        if (!this.config || !this.hass) {
          return
        }
        const { target } = ev
        const copy = cloneDeep(this.config)
        if (target.configValue) {
          if (target.value === '') {
            delete copy[target.configValue]
          } else {
            setValue(
              copy,
              target.configValue,
              target.checked !== undefined ? target.checked : target.value
            )
          }
        }
        fireEvent(this, 'config-changed', { config: copy })
    }

    static get styles() {
        return css`
            div.configRow {
                margin-bottom: 1em;
            }
            div.configGrid {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                column-gap: 1em;
                row-gap: 2em;
            }
        `;
    }

    render() {
        return html`
        <div>
            <div class="configRow">
                <ha-entity-picker
                    label="Entity (required)"
                    .hass=${this.hass}
                    .configValue=${'entity'}
                    .value=${this.config.entity}
                    .includeDomains=${includeDomains}
                    @change="${this.valueChanged}"
                    allow-custom-entity
                >
                </ha-entity-picker>
            </div>

            <div class="configGrid configRow">
                <ha-textfield
                    type="text"
                    label="Name"
                    .configValue="${"name"}"
                    .value=${this.getConfigValue("name")}
                    @change=${this.valueChanged}
                >
                </ha-textfield>

                <ha-textfield
                    type="text"
                    label="Title template"
                    .configValue="${"title_template"}"
                    .value=${this.getConfigValue("title_template")}
                    @change=${this.valueChanged}
                >
                </ha-textfield>

                <ha-textfield
                    type="text"
                    label="Position template"
                    .configValue="${"position_template"}"
                    .value=${this.getConfigValue("position_template")}
                    @change=${this.valueChanged}
                >
                </ha-textfield>
            </div>

            <div class="configGrid configRow">
                <ha-formfield label="Inverts position">
                    <ha-switch
                        .configValue="${"invert_position"}"
                        .checked=${this.getConfigValue("invert_position")}
                        @change=${this.valueChanged}
                    >
                    </ha-switch>
                </ha-formfield>

                <ha-formfield label="Inverts position label">
                    <ha-switch
                        .configValue="${"invert_position_label"}"
                        .checked=${this.getConfigValue("invert_position_label")}
                        @change=${this.valueChanged}
                    >
                    </ha-switch>
                </ha-formfield>

                <ha-formfield label="Disables position slider">
                    <ha-switch
                        .configValue="${"disable_position"}"
                        .checked=${this.getConfigValue("disable_position")}
                        @change=${this.valueChanged}
                    >
                    </ha-switch>
                </ha-formfield>

                <ha-formfield label="Switches position slider direction">
                    <ha-switch
                        .configValue="${"rtl_position"}"
                        .checked=${this.getConfigValue("rtl_position")}
                        @change=${this.valueChanged}
                    >
                    </ha-switch>
                </ha-formfield>

                <ha-formfield label="Enables state icon coloring">
                    <ha-switch
                        .configValue="${"state_color"}"
                        .checked=${this.getConfigValue("state_color")}
                        @change=${this.valueChanged}
                    >
                    </ha-switch>
                </ha-formfield>

                <ha-formfield label="Enables group rendering">
                    <ha-switch
                        .configValue="${"group"}"
                        .checked=${this.getConfigValue("group")}
                        @change=${this.valueChanged}
                    >
                    </ha-switch>
                </ha-formfield>
            </div>
        </div>`;
    }    
  }

// Define HTML element
customElements.define(HASSIO_CARD_EDITOR_ID, ShutterRowEditor);
window.customCards = window.customCards || [];
window.customCards.push({
    type: HASSIO_CARD_ID,
    name: HASSIO_CARD_NAME,
    preview: false, // Optional - defaults to false
});