var HOLD_TIMER;
var HOLD_ACTIVED = false;
var HOLD_TIME = 500;

export function onHoldPointerDown(e) {
    let timerDone = function() {
        HOLD_ACTIVED = true;
    }
    // Reset
    clearTimeout(HOLD_TIMER);
    HOLD_ACTIVED = false;
    // Start timer
    HOLD_TIMER = setTimeout(timerDone, HOLD_TIME);
}

export function onPointerUp(context, onClickCallback, onHoldCallback, e) {
    if(HOLD_ACTIVED) {
        HOLD_ACTIVED = false;
        onHoldCallback.bind(context)(e);
    } else {
        onClickCallback.bind(context)(e);
    }
}

export function getRippleElement() {
    let ripple = document.createElement("mwc-ripple");
    ripple.setAttribute("primary");
    return ripple;
}