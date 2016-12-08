attribute vec2 position;
varying vec2 v_position;
varying vec2 v_texcoord;

void main() {
  gl_Position = vec4(position, 0, 1);
  v_position = position;
  v_texcoord = position.xy * 0.5 + 0.5;
}
