out vec2 vUv;
out vec3 vPos;
out vec2 vCoord;

attribute vec3 aCoord;
attribute float aSpeed;
attribute float aOffset;
attribute float aPress;
attribute float aDirection;
//attribute vec3 positions;

//attribute vec3 position;

uniform sampler2D t;
uniform sampler2D t1;

uniform float time;
uniform float move;
uniform vec2 mouse;
uniform float mousePressed;
uniform float transition;


float PI = 3.141592653589793238;
void main() {
  vec3 pos = position;

  //not stable
  pos.x += sin(move * aSpeed)*30.;
  pos.y += sin(move * aSpeed)*30.;
  pos.z = mod(position.z + move * 200. * aSpeed + aOffset, 2000.) - 1000.;

  //stable
  vec3 stable = position;
  float dist = distance(stable.xy, mouse);
  float area = 1. - smoothstep(0.,200.,dist);

  stable.x += 30. * sin(0.1*time*aPress) * aDirection * area * mousePressed;
  stable.y += 30. * sin(0.1*time*aPress) * aDirection * area * mousePressed;
  stable.z += 60. * cos(0.1*time*aPress) * aDirection * area * mousePressed;

  vUv = uv;

  vCoord = aCoord.xy;
  vPos = pos;

  pos = mix(pos, stable, transition);

  vec4 mvPosition = modelViewMatrix * vec4( pos, 1. );
  gl_PointSize = 2000. * (1. / - mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;

}