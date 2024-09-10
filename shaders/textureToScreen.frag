precision mediump float;
uniform vec2 dimensions;
uniform sampler2D texture;

void main() {
  //put into range 0..1
  vec2 uv = (gl_FragCoord.xy / dimensions);
  gl_FragColor = texture2D(texture, uv);
  //gl_FragColor = vec4(uv.xy, 1.0,1.0);
}