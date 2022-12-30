in vec3 vcsNormal;
in vec3 vcsPosition;
in vec2 texCoord;
in vec4 lightSpaceCoords;

uniform vec3 lightColor;
uniform vec3 ambientColor;

uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;
uniform float shininess;

uniform vec3 cameraPos;
uniform vec3 lightPosition;
uniform vec3 lightDirection;

// Textures are passed in as uniforms
uniform sampler2D colorMap;
uniform sampler2D normalMap;

// Added ShadowMap
uniform sampler2D shadowMap;
uniform float textureSize;
uniform bool shadowOn;

// FOR PCF: Returns a value in [0, 1] range, 1 indicating all sample points are occluded
float calculateShadow() {

	// perform perspective divide
	vec3 projCoords = lightSpaceCoords.xyz / lightSpaceCoords.w;
	// transform to [0,1] range
	projCoords = projCoords * 0.5 + 0.5;
	// get depth of current fragment from light's perspective
	float currentDepth = projCoords.z;

	// HINT: define a "stepAmount", so texels you sample from the texture are some "stepAmount" number of texels apart
	float stepAmount = 1.0;
	// HINT: the number of texels you sample from the texture
	float sampleSize = 121.0;
	// HINT: the number of samples determind to be in shadow
	float count = 0.0;

	vec2 texelSize = vec2(1.0 / textureSize, 1.0 / textureSize);

	for(float x = -5.0; x <= 5.0; x += stepAmount)
	{
		for(float y = -5.0; y <= 5.0; y += stepAmount)
		{
			float pcfDepth = texture(shadowMap, projCoords.xy + vec2(x, y) * texelSize).r;
			count += currentDepth > pcfDepth  ? 1.0 : 0.0;
		}
	}
	float smoother = count / sampleSize;

	// keep the shadow at 0.0 when outside the far_plane region of the light's frustum.
	if (projCoords.z > 1.0) smoother = 0.0;

	return smoother;
}

void main() {
	//Q1a compleme the implementation of the Blinn-Phong reflection model
	//PRE-CALCS
	vec3 N = normalize(vcsNormal);
	vec3 Nt = normalize(texture(normalMap, texCoord).xyz * 2.0 - 1.0);
	vec3 L = normalize(vec3(viewMatrix * vec4(lightDirection, 0.0)));
	vec3 V = normalize(-vcsPosition);
	vec3 H = normalize(V + L);

	//AMBIENT
	vec3 light_AMB = ambientColor * kAmbient;

	//DIFFUSE
	vec3 diffuse = kDiffuse * lightColor;
	vec3 light_DFF = diffuse * max(0.0, dot(N, L));

	//SPECULAR
	vec3 specular = kSpecular * lightColor;
	vec3 light_SPC = specular * pow(max(0.0, dot(H, N)), shininess);

	//SHADOW
	//Q1e do the shadow mapping
	//Q1f PCF HINTS: see calculate shadow helper function
	float shadow = 0.0;

	if (shadowOn) shadow = calculateShadow();

	//Qa add diffuse and specular components
	//Q1e incorporate shadow value into the calculation
	light_DFF *= texture(colorMap, texCoord).xyz;
	vec3 TOTAL = light_AMB + (1.0 - shadow) * (light_DFF + light_SPC);

	gl_FragColor = vec4(TOTAL, 1.0);
}