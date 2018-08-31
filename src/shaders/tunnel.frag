precision mediump float;

uniform float uTime;
uniform sampler2D uTexture;


varying vec2 vTexCoord;
void main() {
  vec2 dist = 0.5 - vTexCoord;

  vec2 uv = vTexCoord;

  uv.x = vTexCoord.x + (dist.y * dist.y * dist.x * 1.1);

  // movement efect
  uv.x = uv.x + uTime * 0.1;
  uv.y = uv.y + uTime * 0.25;

  vec4 tex = texture2D(uTexture, uv);

  float l1 = smoothstep(0.05, 0.4, vTexCoord.y) ;
  float l2 = smoothstep(0.4, 0.05, vTexCoord.y) ;

  float l = (l1 * l2 * 4.0) * 0.6 + 0.4 ;

  gl_FragColor = tex * l;
}