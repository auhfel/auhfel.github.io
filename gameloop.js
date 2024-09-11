class GameLoop {
    static Update() {
        Time.Update();
        Debug.DisplayFPS();
        TerrainGenerator.Draw();
        Input.Update();
        requestAnimationFrame(GameLoop.Update);
    }
}
