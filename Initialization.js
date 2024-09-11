async function InitializeProgram() {
    await Texture.Initialize();
    await TerrainGenerator.Initialize();
    GameLoop.Update();
}

InitializeProgram();