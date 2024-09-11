class Time{
    static {
        Time.delta = 0;
        Time.sinceStart = 0;
        Time.lastTimeStep = 0;
    }
    static Update() {
        let thisTimestamp = performance.now();
        Time.delta = thisTimestamp - Time.lastTimeStep;
        Time.lastTimeStep = thisTimestamp;
        Time.sinceStart += Time.delta;
    }
}