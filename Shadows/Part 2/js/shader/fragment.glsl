uniform float time;
uniform float progress;
uniform sampler2D t;
uniform sampler2D t1;
uniform vec4 resolution;
uniform float move;

in vec2 vUv;
in vec3 vPos;
in vec2 vCoord;

float PI = 3.141592653589793238;

void main()	{
	vec2 newUV = vec2(vCoord.x / 512., vCoord.y / 512.);
	vec4 tt1 = texture(t, newUV);
	vec4 tt2 = texture(t1, newUV);

	vec4 final = mix(tt1,tt2,smoothstep(0., 1., fract(move)));

	float alpha = clamp(.0, 1., abs(vPos.z/900.));

	gl_FragColor = final;
//	gl_FragColor = tt2;

	//	gl_FragColor.a = alpha;

}