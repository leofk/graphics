// HINT: Don't forget to define the uniforms here after you pass them in in A3.js
uniform vec3 spherePosition;
uniform float ticks;
uniform vec3 gradColor;
uniform vec3 gradColor2;

// The value of our shared variable is given as the interpolation between normals computed in the vertex shader
// below we can see the shared variable we passed from the vertex shader using the 'in' classifier
in vec3 interpolatedNormal;
in vec3 lightDirection;
in vec3 vertexPosition;

void main() {
    // HINT: Compute the light intensity the current fragment by determining
    // the cosine angle between the surface normal and the light vector.
    float intensity = dot(interpolatedNormal, lightDirection);

    int divisor = 8;
    int gridPosX = int(vertexPosition.x * 100.0) % divisor;
    int gridPosY = int((vertexPosition.y + ticks / 15.0) * 100.0) % divisor;
    int gridPosZ = int(vertexPosition.z * 100.0) % divisor;

    if (gridPosX == 0 || gridPosY == 0 || gridPosZ == 0) discard;

    vec3 out_grad = mix(gradColor, gradColor2, intensity);
    vec3 out_Stripe = out_grad;

    gl_FragColor = vec4(out_Stripe, 1.0);

    // HINT: Pick any two colors and blend them based on light intensity
    // to give the 3D model some color and depth.
    // HINT: Set final rendered colour
}
