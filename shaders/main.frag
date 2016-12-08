precision highp float;
uniform vec2 resolution;
uniform sampler2D u_noiseSampler;
uniform sampler2D u_texSampler;
uniform float Amplitude;
uniform float Frequency;

varying vec2 v_position;
varying vec2 v_texcoord;

vec3 GetNormal () {
  vec2 uv = v_texcoord * Frequency;
  vec2 TexelSize = vec2(3, 3);
  float tl = texture2D(u_noiseSampler, vec2(uv.x - TexelSize.x, uv.y - TexelSize.y)).r;
  float t = texture2D(u_noiseSampler, vec2(uv.x, uv.y - TexelSize.y)).r;
  float tr = texture2D(u_noiseSampler, vec2(uv.x + TexelSize.x, uv.y - TexelSize.y)).r;
  float l = texture2D(u_noiseSampler, vec2(uv.x - TexelSize.x, uv.y)).r;
  float r = texture2D(u_noiseSampler, vec2(uv.x + TexelSize.x, uv.y)).r;
  float bl = texture2D(u_noiseSampler, vec2(uv.x - TexelSize.x, uv.y + TexelSize.y)).r;
  float b = texture2D(u_noiseSampler, vec2(uv.x, uv.y + TexelSize.y)).r;
  float br = texture2D(u_noiseSampler, vec2(uv.x + TexelSize.x, uv.y + TexelSize.y)).r;

  vec3 normal = vec3((-tl - l * 2.0 - bl) + (tr + r * 2.0 + br),
                         (-tl - t * 2.0 - tr) + (bl + b * 2.0 + br),
                         1.0 / Amplitude);
  return normalize(normal);
}

void main() {
  vec3 normal = GetNormal();
  vec2 offset = normal.xy;
  gl_FragColor.xyz = texture2D(u_noiseSampler, v_texcoord).xyz;
  // gl_FragColor.xyz = texture2D(u_texSampler, v_position + offset).xyz;
  gl_FragColor.w = 1.0;
}
