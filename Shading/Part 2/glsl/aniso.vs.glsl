uniform vec3 spherePosition;

out vec3 interpolatedNormal;
out vec3 lightDirection;
out vec3 viewDirection;

void main() {

    vec3 viewPosition = vec3(viewMatrix * modelMatrix * vec4(position, 1.0));
    vec3 modelPosition = vec3(modelMatrix * vec4(position, 1.0));

    interpolatedNormal = normal;
    lightDirection = normalize(vec3(viewMatrix * vec4(spherePosition, 1.0)) - viewPosition);
    viewDirection = normalize(vec3(viewMatrix * vec4(cameraPosition, 1.0)) - viewPosition);

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
