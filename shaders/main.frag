precision highp float;
uniform vec2 resolution;
uniform sampler2D u_noiseSampler;
uniform sampler2D u_texSampler;
uniform float Amplitude;
uniform float Frequency;
uniform float Intensity;

varying vec2 v_position;
varying vec2 v_texcoord;

vec3 GetNormal () {
  float sobelX[9];
  sobelX[0] = 1.0; sobelX[1] = 0.0; sobelX[2] = -1.0;
  sobelX[3] = 2.0; sobelX[4] = 0.0; sobelX[5] = -2.0;
  sobelX[6] = 1.0; sobelX[7] = 0.0; sobelX[8] = -1.0;

  float sobelY[9];
  sobelY[0] = 1.0; sobelY[1] = 2.0; sobelY[2] =  1.0;
  sobelY[3] = 0.0; sobelY[4] = 0.0; sobelY[5] =  0.0;
  sobelY[6] = -1.0; sobelY[7] = -2.0; sobelY[8] = -1.0;

  float texelX[9];
  float texelY[9];
  vec2 uv = (v_texcoord) * Frequency;
  for (int i = 0; i < 9; i++)
  {
      vec4 otherTexel = texture2D(u_noiseSampler, uv);
      float average = (otherTexel.x + otherTexel.y + otherTexel.z) / 3.0;
      texelX[i] = average  * sobelX[i];
      texelY[i] = average  * sobelY[i];
  }
  vec3 normal = vec3(
    (texelX[0] + texelX[3] + texelX[6]) +
    (texelX[2] + texelX[5] + texelX[8]),
    (texelY[1] + texelY[2] + texelY[3]) +
    (texelY[6] + texelY[7] + texelY[8]),
    1.0 / Amplitude);

  return normalize(normal);
}

void main() {
  vec3 normal = GetNormal();
  vec2 offset = (normal.xy + vec2(0, 0.25)) * Intensity;
  vec2 uv = v_position * vec2(1.0, -0.5) + vec2(0, 0.5);
  gl_FragColor.xyz = texture2D(u_texSampler, uv + offset).xyz;
  gl_FragColor.w = 1.0;
}
