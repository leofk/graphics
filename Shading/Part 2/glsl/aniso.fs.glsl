
uniform vec3 ambientColor;
uniform float kAmbient;

uniform vec3 diffuseColor;
uniform float kDiffuse;

uniform vec3 specularColor;
uniform float kSpecular;
uniform float shininess;

uniform mat4 modelMatrix;

uniform vec3 spherePosition;

uniform vec3 lightColor;
uniform vec3 tangentDirection;

// The value of our shared variable is given as the interpolation between normals computed in the vertex shader
// below we can see the shared variable we passed from the vertex shader using the 'in' classifier
in vec3 interpolatedNormal;
in vec3 worldPosition;

in vec3 lightDirection;
in vec3 viewDirection;

void main() {

    float s = shininess;
    vec3 D = vec3(viewMatrix * vec4(tangentDirection, 1.0));
    vec3 N = normalize(mat3(transpose(inverse(modelMatrix))) * interpolatedNormal);
    vec3 L = lightDirection;
    vec3 V = viewDirection;

    vec3 T = normalize(D + dot(-D, N) * N);
    vec3 P = normalize(L + dot(-L, T) * T);
    vec3 R = normalize(-L + 2.0 * dot(L, P) * P);

    float diff = dot(L, P);
    float spec = pow(dot(V, R), s);

    vec3 out_Ambient = ambientColor * kAmbient;
    vec3 out_Diffuse = diffuseColor * kDiffuse * diff;
    vec3 out_Specular = specularColor * kSpecular * spec;

    vec3 out_Color = out_Ambient + out_Diffuse + out_Specular;

    if (dot(N,V) == 0.0 || dot(P,V) == 0.0 || dot(R,V) == 0.0) { out_Color = vec3(0.0); }

    gl_FragColor = vec4(clamp(out_Color, 0.0, 1.0), 1.0);
}
