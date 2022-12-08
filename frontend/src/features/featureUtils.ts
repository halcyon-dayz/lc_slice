export const isValidIndex = (stateLength: number, index: number): boolean => {
    if (stateLength <= 0 || index < 0 || index >= stateLength) {
        return false;
    }
    return true;
}

export const isStateValid = (stateLength: number): boolean => {
    if (stateLength <= 0) {
        return false;
    }
    return true;
}