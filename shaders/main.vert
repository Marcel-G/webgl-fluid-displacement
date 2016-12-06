attribute vec2 position;
varying vec2 v_position;
void main() {
  gl_Position = vec4(position, 0, 1);
  v_position = position;
}
