precision mediump float;

uniform sampler2D sprites;
uniform sampler2D spritesheet;

varying float spriteIndex;
varying vec2 uv;

void main() {
    vec2 texCoord = vec2(gl_FragCoord.xy / SPRITE_TEXTURE_SIZE);
    vec4 spriteData = texture2D(texture, texCoord);
    //do stuff with the sprites and update them!

    //reupload back to the texture the updated info
    gl_FragColor = spriteData;
}
