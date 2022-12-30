in vec3 vcsNormal;
in vec3 vcsPosition;

uniform vec3 lightDirection;

uniform samplerCube skybox;

uniform mat4 matrixWorld;

vec3 reflect(vec3 w, vec3 n) {
  return - w + n * (dot(w, n) * 2.0);
}

void main( void ) {
  // Qd : Calculate the vector that can be used to sample from the cubemap

  vec3 normal = normalize(vcsNormal);
  vec3 reflected = reflect(normalize(vec3(-vcsPosition)), normal);
  vec4 texColor0 = textureCube(skybox, reflected);

  gl_FragColor =  vec4(texColor0.r, texColor0.g, texColor0.b, 1.0);
}