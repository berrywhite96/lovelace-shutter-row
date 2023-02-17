import { LitElement, html } from "lit";
import { fireEvent } from "custom-card-helpers";
import { mdiArrowLeft, mdiArrowRight, mdiDelete, mdiPlus } from "@mdi/js";
import { HASSIO_CARD_ID, HASSIO_CARD_EDITOR_ID, HASSIO_CARD_NAME } from "../const.js";
import { ROOT_SCHEMA, PRESET_SCHEMA } from "./editor_schema.js";
import { moveElementInArray } from "../helpers.js";
import { customLocalize } from "../localize.js";
import style from "./style.css";

class ShutterRowEditor extends LitElement {
    /**
     * Define properties to react
     * @returns Array
     */
    static get properties() {
        return {
            hass: {},
            config: {},
            _config: {},
            _preset_button_selected: Number,
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
     * Adds new preset button
     */
    _addPresetItem() {
        // Check if defined, if not add one
        if (!this._config) return;

        if (!this._config.preset_buttons) {
            this._preset_button_selected = 0;
            this._config.preset_buttons = [{}];
            return;
        }

        this._config.preset_buttons.push({});
        fireEvent(this, "config-changed", { config: this._config });
        this._preset_button_selected = this._config.preset_buttons.length - 1;
    }

    /**
     * Renders all items in the preset tab bar
     * @returns html
     */
    renderPresetItemTabs() {
        if (!this._config || !this._config.preset_buttons) return;

        return this._config.preset_buttons.map(
            (preset_button, index) => html` <paper-tab
                class="iron-selected"
                tabindex="${index}"
                @click=${() => (this._preset_button_selected = index)}
            >
                ${index + 1}
            </paper-tab>`
        );
    }

    /**
     * Renders preset editor form
     * @returns html
     */
    renderPresetItemContent() {
        if (!this._config || !this._config.preset_buttons || this._config.preset_buttons.length == 0) return;

        return html` <ha-form
            .hass=${this.hass}
            .data=${this._config.preset_buttons[this._preset_button_selected]}
            .schema=${PRESET_SCHEMA}
            .computeLabel=${this._computeLabel}
            @value-changed=${this._presetChanged}
        ></ha-form>`;
    }

    /**
     * Renders tab control button
     * @returns html
     */
    renderPresetButtonsTabControls() {
        let basicControls = html`<ha-icon-button
            .label=${this.hass.localize("ui.components.area-picker.add_dialog.add")}
            .path="${mdiPlus}"
            @click=${this._addPresetItem}
        ></ha-icon-button>`;

        // Return only basic controls if preset buttons were not set
        if (!this._config || !this._config.preset_buttons) return basicControls;
        if (this._config.preset_buttons.length == 0) return basicControls;

        // Define event listener
        let onMoveLeftClick = () => {
            if (this._preset_button_selected == 0) return;

            this._config.preset_buttons = moveElementInArray(
                this._config.preset_buttons,
                this._preset_button_selected,
                --this._preset_button_selected
            );
            fireEvent(this, "config-changed", { config: this._config });
        };
        let onMoveRightClick = () => {
            if (this._preset_button_selected >= this._config.preset_buttons.length - 1) return;

            this._config.preset_buttons = moveElementInArray(
                this._config.preset_buttons,
                this._preset_button_selected,
                ++this._preset_button_selected
            );
            fireEvent(this, "config-changed", { config: this._config });
        };
        let onDeleteClick = () => {
            // Select other tab
            this._preset_button_selected = this._preset_button_selected == 0 ? 0 : this._preset_button_selected - 1;

            this._config.preset_buttons.splice(this._preset_button_selected, 1);
            fireEvent(this, "config-changed", { config: this._config });
        };

        return html`
            <ha-icon-button
                .label=${customLocalize(this.hass, "editor.move_left")}
                .path="${mdiArrowLeft}"
                @click=${onMoveLeftClick}
            ></ha-icon-button>
            <ha-icon-button
                .label=${customLocalize(this.hass, "editor.move_right")}
                .path="${mdiArrowRight}"
                @click=${onMoveRightClick}
            ></ha-icon-button>
            <ha-icon-button
                .label=${this.hass.localize("ui.common.remove")}
                .path="${mdiDelete}"
                @click=${onDeleteClick}
            ></ha-icon-button>
            <div class="tab-divider"></div>
            ${basicControls}
        `;
    }

    /**
     * Render preset button editor part
     * @returns html
     */
    renderPresetButtons() {
        return html`
            <h3>${customLocalize(this.hass, "editor.preset_buttons")}</h3>

            <div class="editor-items-bar">
                <paper-tabs scrollable="" tabindex="0" selected="${this._preset_button_selected}" dir="ltr">
                    ${this.renderPresetItemTabs()}
                </paper-tabs>

                ${this.renderPresetButtonsTabControls()}
            </div>
            <div class="editor-item-content">${this.renderPresetItemContent()}</div>
        `;
    }

    /**
     * Main render function
     * @returns html
     */
    render() {
        if (!this.hass || !this._config) {
            return html``;
        }

        return html`
            <ha-form
                .hass=${this.hass}
                .data=${this._config}
                .schema=${ROOT_SCHEMA}
                .computeLabel=${this._computeLabel}
                @value-changed=${this._valueChanged}
            ></ha-form>
            ${this.renderPresetButtons()}
        `;
    }

    /**
     * HA function on editor config set
     * @param {Array} config
     */
    setConfig(config) {
        this._config = config;
    }

    /**
     * HA editor form on value changed
     * @param {*} ev
     */
    _valueChanged(ev) {
        fireEvent(this, "config-changed", { config: ev.detail.value });
    }

    /**
     * HA editor preset form on value changed
     * @param {*} ev
     */
    _presetChanged(ev) {
        this._config.preset_buttons[this._preset_button_selected] = ev.detail.value;
        fireEvent(this, "config-changed", { config: this._config });
    }

    /**
     * Computes localized label
     * @param {*} schema
     * @returns String
     */
    _computeLabel(schema) {
        let customLocal = customLocalize(this.hass, "editor." + schema.name);
        if (customLocal) return customLocal;
        return this.hass.localize(`ui.panel.lovelace.editor.card.generic.${schema.name}`);
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
