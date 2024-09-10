class Input {
    static {
        Input.keyMap = [255];
        Input.lastKeyMap = [255];
        for (let i = 0; i < 255; i++) {
            Input.keyMap[i] = 0;
            Input.lastKeyMap[i] = 0;
        }
        let keyDownEvent = function (event) {
            Input.keyMap[event.key.charCodeAt(0)] = 1;
        }
        let keyUpEvent = function (event) {
            Input.keyMap[event.key.charCodeAt(0)] = 0;
        }
        document.addEventListener('keydown', keyDownEvent);
        document.addEventListener('keyup', keyUpEvent);
    }
    static Update() {
        for (let i = 0; i < 256; i++)
            Input.lastKeyMap[i] = Input.keyMap[i];
    }
    static GetKey(key) {
        return Input.keyMap[key.charCodeAt(0)] == 1;
    }
    static GetKeyDown(key) {
        let charCode = key.charCodeAt(0);
        return Input.keyMap[charCode] == 1 && Input.lastKeyMap[charCode] == 0;
    }
    static GetKeyUp(key) {
        let charCode = key.charCodeAt(0);
        return Input.keyMap[charCode] == 0 && Input.lastKeyMap[charCode] == 1;
    }
}