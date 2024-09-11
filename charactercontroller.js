
let camera = {
    characterOffset: new Vector3(0,10,-10),
    direction: new Vector3(0,-10,10),
};

let character = {position: new Vector3()};

character.Update = function() {
    let movement = new Vector3();
    movement.z += Input.GetKey("w") ? 1 : 0;
    movement.z += Input.GetKey("s") ? -1 : 0;
    movement.x += Input.GetKey("a") ? -1 : 0;
    movement.x += Input.GetKey("d") ? 1 : 0;
    character.position.Add(movement);
    let cameraPosition = camera.characterOffset.Add(character.position);
}

