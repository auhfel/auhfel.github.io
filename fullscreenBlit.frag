precision mediump float;
uniform vec2 dimensions;
uniform sampler2D u_texture;

void main() {
  //put into range 0..1
  vec2 uv = (gl_FragCoord.xy / dimensions);
  gl_FragColor = vec4(uv,0.0,1.0);
  //gl_FragColor = texture2D(u_texture, uv);
}