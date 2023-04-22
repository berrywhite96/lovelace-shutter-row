/**
 * Hold needed helper variables
 */
var HOLD_TIMER;
var HOLD_ACTIVED = false;
var HOLD_TIME = 500;

/**
 * On hold pointer down function
 * @param {event} e
 */
export function onHoldPointerDown(e) {
    let timerDone = function () {
        HOLD_ACTIVED = true;
    };
    // Reset
    clearTimeout(HOLD_TIMER);
    HOLD_ACTIVED = false;
    // Start timer
    HOLD_TIMER = setTimeout(timerDone, HOLD_TIME);
}

/**
 * On hold pointer up function
 * @param {event} e
 */
export function onPointerUp(context, onClickCallback, onHoldCallback, e) {
    if (HOLD_ACTIVED) {
        HOLD_ACTIVED = false;
        onHoldCallback.bind(context)(e);
    } else {
        onClickCallback.bind(context)(e);
    }
}

/**
 * Create ripple element
 * @returns html
 */
export function getRippleElement() {
    let ripple = document.createElement("mwc-ripple");
    ripple.setAttribute("primary");
    return ripple;
}

/**
 * Move element in array
 * @param {Array} arr
 * @param {int} fromIndex
 * @param {int} toIndex
 * @returns
 */
export function moveElementInArray(arr, fromIndex, toIndex) {
    let element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
    return arr;
}

/**
 * Localize entity state - HA 2023.4 < downgrade compatible
 * @param {Hass} hass
 * @param {string} state
 * @returns
 */
export function localizeState(hass, state) {
    let newLocalize = hass.localize(`component.cover.entity_component._.state.${state}`);
    if (newLocalize != "") return newLocalize;
    return hass.localize(`component.cover.state._.${state}`);
}
