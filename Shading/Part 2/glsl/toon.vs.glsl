// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 spherePosition;

// The shared variable is initialized in the vertex shader and attached to the current vertex being processed,
// such that each vertex is given a shared variable and when passed to the fragment shader,
// these values are interpolated between vertices and across fragments,
// below we can see the shared variable is initialized in the vertex shader using the 'out' classifier
out vec3 interpolatedNormal;
out vec3 lightDirection;
out vec3 viewPosition;
out float fresnel;

void main() {
    // Compute the vertex position in VCS
    viewPosition = vec3(viewMatrix * modelMatrix * vec4(position, 1.0));

    // Compute the light direction in VCS
    lightDirection = normalize(vec3(viewMatrix * vec4(spherePosition, 1.0)) - viewPosition);

    // Interpolate the normal
    interpolatedNormal = normalize(normalMatrix * normal);

    // HINT: Use the surface normal in VCS and the eye direction to determine
    // if the current vertex lies on the silhouette edge of the model, i.e. calculate the fresnel value

    // cameraPosition = camera position in world space
    // Point at camera/eye
    vec3 viewDirection = normalize(vec3(viewMatrix * vec4(cameraPosition, 1.0)) - viewPosition);

    // HINT: Needs to be in VCS
    vec3 viewNormal = interpolatedNormal;

    // ref: https://docs.unrealengine.com/4.27/en-US/RenderingAndGraphics/Materials/HowTo/Fresnel/
    fresnel = dot(viewDirection, viewNormal);

    // Multiply each vertex by the model matrix to get the world position of each vertex, 
    // then the view matrix to get the position in the camera coordinate system, 
    // and finally the projection matrix to get final vertex position
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
