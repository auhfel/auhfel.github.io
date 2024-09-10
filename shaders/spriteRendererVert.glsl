attribute highp vec4 position;
attribute highp vec4 uv;

attribute int instanceIndex;
sampler2D sprites;

varying vec2 uv;
void main() {
    //we sample the sprite texture at the instanceIndex,
    //then we add it's position to our gl_Position,
    //then we generate UV's for the fragment shader by using the instanceIndex as well
    gl_Position = position;
}