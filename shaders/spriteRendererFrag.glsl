precision mediump float;

uniform sampler2D sprites;
uniform int numSpritesActive; //this we send back to the cpu, so the cpu can tell us how many objects to render
const vec2 SPRITE_TEXTURE_SIZE = vec2(4096.0);

vec3 checker(float u, float v);

void main() {
    vec2 texCoord = vec2(gl_FragCoord.xy / SPRITE_TEXTURE_SIZE);
    vec4 spriteData = texture2D(texture, texCoord);
    //do stuff with the sprites and update them!

    //reupload back to the texture the updated info
    gl_FragColor = spriteData;
}
