
uniform vec3 ambientColor;
uniform float kAmbient;

uniform vec3 diffuseColor;
uniform float kDiffuse;

uniform vec3 specularColor;
uniform float kSpecular;
uniform float shininess;

uniform mat4 modelMatrix;

uniform vec3 spherePosition;

// The value of our shared variable is given as the interpolation between normals computed in the vertex shader
// below we can see the shared variable we passed from the vertex shader using the 'in' classifier
in vec3 interpolatedNormal; // model frame
in vec3 viewPosition;  // world frame
in vec3 worldPosition; // vPosition in world frame


vec3 calculateAmbient(){
    return ambientColor * kAmbient;
}

vec3 calculateDiffuse(vec3 normal, vec3 lightDirection){
    return diffuseColor * kDiffuse * max(0.0, dot(normal, lightDirection));
}


vec3 calculateSpecular(vec3 normal, vec3 lightDirection){
    // HINT: Make sure to use the Jim Blinn's modification to the Phong Model (Blinn-Phong reflectance)
    // See textbook, Section 14.3
    vec3 viewDirection = normalize(viewPosition);
    vec3 halfway = normalize(viewDirection + lightDirection);
    float specular = pow(max(0.0, dot(halfway, normal)), shininess);
    return specularColor * kSpecular * specular;
}

void main() {

    vec3 normal = normalize(mat3(transpose(inverse(modelMatrix))) * interpolatedNormal); // model frame

    vec3 lightDirection = normalize(spherePosition - worldPosition); // toLight in world frame

    // HINT: Implement the following 3 functions
    vec3 out_Ambient = calculateAmbient();
    vec3 out_Diffuse = calculateDiffuse(normal, lightDirection);
    vec3 out_Specular = calculateSpecular(normal, lightDirection);

    vec3 out_Color = out_Ambient + out_Diffuse + out_Specular;

    gl_FragColor = vec4(clamp(out_Color, 0.0, 1.0), 1.0);
}
