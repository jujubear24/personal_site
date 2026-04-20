/**
 * GLSL Shaders for Sentient UI
 * 
 * Dithering post-processing effect and agent mesh shaders.
 */

/**
 * Dithering Fragment Shader for Postprocessing Effect
 * Refined for a "High-End Editorial" look.
 */
export const ditherEffectFragmentShader = `
uniform float uTime;
uniform float uScale;
uniform vec3 uInkColor;
uniform vec3 uPaperColor;

// Bayer matrix 8x8 for finer, cleaner dithering
const float bayer8x8[64] = float[](
    0.0/64.0, 32.0/64.0, 8.0/64.0, 40.0/64.0, 2.0/64.0, 34.0/64.0, 10.0/64.0, 42.0/64.0,
    48.0/64.0, 16.0/64.0, 56.0/64.0, 24.0/64.0, 50.0/64.0, 18.0/64.0, 58.0/64.0, 26.0/64.0,
    12.0/64.0, 44.0/64.0, 4.0/64.0, 36.0/64.0, 14.0/64.0, 46.0/64.0, 6.0/64.0, 38.0/64.0,
    60.0/64.0, 28.0/64.0, 52.0/64.0, 20.0/64.0, 62.0/64.0, 30.0/64.0, 54.0/64.0, 22.0/64.0,
    3.0/64.0, 35.0/64.0, 11.0/64.0, 43.0/64.0, 1.0/64.0, 33.0/64.0, 9.0/64.0, 41.0/64.0,
    51.0/64.0, 19.0/64.0, 59.0/64.0, 27.0/64.0, 49.0/64.0, 17.0/64.0, 57.0/64.0, 25.0/64.0,
    15.0/64.0, 47.0/64.0, 7.0/64.0, 39.0/64.0, 13.0/64.0, 45.0/64.0, 5.0/64.0, 37.0/64.0,
    63.0/64.0, 31.0/64.0, 55.0/64.0, 23.0/64.0, 61.0/64.0, 29.0/64.0, 53.0/64.0, 21.0/64.0
);

float getBayer(vec2 uv) {
    int x = int(mod(uv.x, 8.0));
    int y = int(mod(uv.y, 8.0));
    int index = y * 8 + x;
    return bayer8x8[index];
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec4 color = inputColor;
    
    // Luminance with slightly higher weight on green for perception
    float lum = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    
    // Pixel coordinates
    vec2 pixel = gl_FragCoord.xy / uScale;
    
    // Get threshold from Bayer matrix
    float threshold = getBayer(pixel);
    
    // Soft Dither: Blend the step function to reduce harsh noise
    float dithered = step(threshold, lum + 0.1); 
    
    // Use dynamic theme colors passed via uniforms
    vec3 finalColor = mix(uInkColor, uPaperColor, dithered);
    
    // Ultra-subtle grain, only visible in mid-tones
    float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
    float midToneMask = 1.0 - abs(lum - 0.5) * 2.0;
    
    // Adjust grain intensity based on brightness of final color to prevent washing out darks
    finalColor -= noise * 0.015 * midToneMask;
    
    // Scanline effect
    float scanline = sin(uv.y * 1200.0) * 0.01;
    finalColor -= scanline;

    outputColor = vec4(finalColor, 1.0);
}
`;

/**
 * Agent Vertex Shader
 * Liquid marble aesthetic with noise-based displacement.
 */
export const agentVertexShader = `
uniform float uTime;
uniform float uActivity; 
varying vec2 vUv;
varying float vDisplacement;
varying vec3 vNormal;
varying vec3 vPosition;

// Simplex noise function
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {
    vUv = uv;
    vNormal = normal;
    vPosition = position;
    
    // Liquid movement
    float time = uTime * (0.2 + uActivity * 1.5);
    float noise = snoise(position * 1.2 + time * 0.4);
    
    // Gentle breathing displacement
    float displacement = noise * (0.15 + uActivity * 0.25); 
    vDisplacement = displacement;
    
    vec3 newPosition = position + normal * displacement;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

/**
 * Agent Fragment Shader
 * Polished dark stone with metallic highlights.
 */
export const agentFragmentShader = `
uniform float uTime;
uniform float uActivity;
varying float vDisplacement;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
    // Elegant lighting setup
    vec3 lightDir1 = normalize(vec3(1.0, 1.0, 1.0));
    vec3 lightDir2 = normalize(vec3(-1.0, 0.5, -0.5));
    
    float diff1 = max(dot(vNormal, lightDir1), 0.0);
    float diff2 = max(dot(vNormal, lightDir2), 0.0) * 0.5;
    
    // Base Material: Dark Polished Stone
    vec3 baseColor = vec3(0.2, 0.22, 0.25);
    
    // Highlight Material: Metallic / Silver
    vec3 highlightColor = vec3(0.9, 0.9, 0.95);
    
    // Fresnel rim light for 3D definition
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 4.0);
    
    // Mix lighting
    float lighting = diff1 + diff2 + fresnel;
    
    // The "Activity" adds an inner glow
    vec3 glowColor = vec3(1.0, 0.8, 0.4); // Warm Gold Glow
    float glow = uActivity * smoothstep(0.0, 0.3, vDisplacement);
    
    vec3 finalColor = mix(baseColor, highlightColor, lighting * 0.6 + vDisplacement * 0.4);
    finalColor += glowColor * glow;

    gl_FragColor = vec4(finalColor, 1.0);
}
`;