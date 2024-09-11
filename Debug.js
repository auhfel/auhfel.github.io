class Debug {
    static {
        Debug.timeCounter = 0;
        Debug.frameCounter = 0;
    }   
    static DisplayFPS() {
        Debug.timeCounter += Time.delta;
        Debug.frameCounter++;
        if (Debug.timeCounter > 2000) {
            console.clear();
            console.log("FPS is " + (Debug.frameCounter / 2) + "fps");
            Debug.frameCounter = 0;
            Debug.timeCounter = 0;
        }
    }
}