import { useState, forwardRef } from "react";
import { MeshPhysicalMaterial, ShaderChunk } from "three";
import { useFrame } from "@react-three/fiber";

// import headers from "./headers.glsl";
// import displacement from "./displacement.glsl";

export const LOOP_DURATION = 12; // seconds
export const NOISE_PERIOD_REPEAT = 3;

class MagicalMaterialImpl extends MeshPhysicalMaterial {
  constructor(parameters = {}) {
    super(parameters);
    this.setValues(parameters);
    this._time = { value: 0 };
    this._distort = { value: 0.9 };
    this._radius = { value: 1 };
    this._frequency = { value: 2 };
    this._speed = { value: 0 };

    this._surfaceDistort = { value: 0 };
    this._surfaceFrequency = { value: 0 };
    this._surfaceTime = { value: 0 };
    this._surfaceSpeed = { value: 0 };
    this._numberOfWaves = { value: 5 };
    this._fixNormals = { value: true };
    this._surfacePoleAmount = { value: 1 };
    this._gooPoleAmount = { value: 1 };
    this._noisePeriod = { value: LOOP_DURATION / NOISE_PERIOD_REPEAT };
  }

  onBeforeCompile(shader) {
    shader.uniforms.time = this._time;
    shader.uniforms.radius = this._radius;
    shader.uniforms.distort = this._distort;
    shader.uniforms.frequency = this._frequency;
    shader.uniforms.surfaceDistort = this._surfaceDistort;
    shader.uniforms.surfaceFrequency = this._surfaceFrequency;
    shader.uniforms.surfaceTime = this._surfaceTime;
    shader.uniforms.numberOfWaves = this._numberOfWaves;
    shader.uniforms.fixNormals = this._fixNormals;
    shader.uniforms.surfacePoleAmount = this._surfacePoleAmount;
    shader.uniforms.gooPoleAmount = this._gooPoleAmount;
    shader.uniforms.noisePeriod = this._noisePeriod;

    shader.vertexShader = `
      ${headers}
      ${shader.vertexShader}
    `;

    shader.vertexShader = shader.vertexShader.replace(
      "void main() {",
      `
        void main() {
          ${displacement}
      `
    );

    shader.vertexShader = shader.vertexShader.replace(
      "#include <displacementmap_vertex>",
      `transformed = displacedPosition;`
    );

    // fix normals
    // http://tonfilm.blogspot.com/2007/01/calculate-normals-in-shader.html
    // https://codepen.io/marco_fugaro/pen/xxZWPWJ?editors=1010
    shader.vertexShader = shader.vertexShader.replace(
      "#include <defaultnormal_vertex>",
      ShaderChunk.defaultnormal_vertex.replace(
        "vec3 transformedNormal = objectNormal;",
        `vec3 transformedNormal = displacedNormal;`
      )
    );
  }

  get time() {
    return this._time.value;
  }

  set time(v) {
    this._time.value = v;
  }

  get distort() {
    return this._distort.value;
  }

  set distort(v) {
    this._distort.value = v;
  }

  get radius() {
    return this._radius.value;
  }

  set radius(v) {
    this._radius.value = v;
  }

  get frequency() {
    return this._frequency.value;
  }

  set frequency(v) {
    this._frequency.value = v;
  }

  get speed() {
    return this._speed.value;
  }

  set speed(v) {
    this._speed.value = v;
  }

  get surfaceDistort() {
    return this._surfaceDistort.value;
  }

  set surfaceDistort(v) {
    this._surfaceDistort.value = v;
  }

  get surfaceFrequency() {
    return this._surfaceFrequency.value;
  }

  set surfaceFrequency(v) {
    this._surfaceFrequency.value = v;
  }

  get surfaceTime() {
    return this._surfaceTime.value;
  }

  set surfaceTime(v) {
    this._surfaceTime.value = v;
  }

  get surfaceSpeed() {
    return this._surfaceSpeed.value;
  }

  set surfaceSpeed(v) {
    this._surfaceSpeed.value = v;
  }

  get numberOfWaves() {
    return this._numberOfWaves.value;
  }

  set numberOfWaves(v) {
    this._numberOfWaves.value = v;
  }

  get fixNormals() {
    return this._fixNormals.value;
  }

  set fixNormals(v) {
    this._fixNormals.value = v;
  }

  get surfacePoleAmount() {
    return this._surfacePoleAmount.value;
  }

  set surfacePoleAmount(v) {
    this._surfacePoleAmount.value = v;
  }

  get gooPoleAmount() {
    return this._gooPoleAmount.value;
  }

  set gooPoleAmount(v) {
    this._gooPoleAmount.value = v;
  }

  get noisePeriod() {
    return this._noisePeriod.value;
  }

  set noisePeriod(v) {
    this._noisePeriod.value = v;
  }
}

export const MagicalMaterial = forwardRef((props, ref) => {
  const [material] = useState(() => new MagicalMaterialImpl());
  useFrame((_, delta) => {
    // update time with the delta since last frame
    // - this supports rendering at any framerate

    // We don't use clock.getElapsedTime() directly because it looks
    // funny when we animate changes in time with useSpring in Blob.js
    material.time += delta * (material.speed / NOISE_PERIOD_REPEAT);
    material.surfaceTime +=
      delta * (material.surfaceSpeed / NOISE_PERIOD_REPEAT);
  });
  return (
    <primitive
      dispose={undefined}
      object={material}
      ref={ref}
      attach="material"
      {...props}
    />
  );
});

const displacement =
  "#define GLSLIFY 1\n// float displacement = f(position);\nvec3 displacedPosition = position + normalize(normal) * f(position);\nvec3 displacedNormal = normalize(normal);\n\n// gen new normals\n// https://discourse.threejs.org/t/calculating-vertex-normals-after-displacement-in-the-vertex-shader/16989\nif (fixNormals == 1.0) {\n    float offset = .5 / 512.;\n    vec3 tangent = orthogonal(normal);\n    vec3 bitangent = normalize(cross(normal, tangent));\n    vec3 neighbour1 = position + tangent * offset;\n    vec3 neighbour2 = position + bitangent * offset;\n    vec3 displacedNeighbour1 = neighbour1 + normal * f(neighbour1);\n    vec3 displacedNeighbour2 = neighbour2 + normal * f(neighbour2);\n\n    // https://i.ya-webdesign.com/images/vector-normals-tangent-16.png\n    vec3 displacedTangent = displacedNeighbour1 - displacedPosition;\n    vec3 displacedBitangent = displacedNeighbour2 - displacedPosition;\n\n    // https://upload.wikimedia.org/wikipedia/commons/d/d2/Right_hand_rule_cross_product.svg\n    displacedNormal = normalize(cross(displacedTangent, displacedBitangent));\n}";
const headers =
  '#define GLSLIFY 1\n//\n// GLSL textureless classic 3D noise "cnoise",\n// with an RSL-style periodic variant "pnoise".\n// Author:  Stefan Gustavson (stefan.gustavson@liu.se)\n// Version: 2011-10-11\n//\n// Many thanks to Ian McEwan of Ashima Arts for the\n// ideas for permutation and gradient selection.\n//\n// Copyright (c) 2011 Stefan Gustavson. All rights reserved.\n// Distributed under the MIT license. See LICENSE file.\n// https://github.com/ashima/webgl-noise\n//\n\nvec3 mod289(vec3 x)\n{\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289(vec4 x)\n{\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x)\n{\n  return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nvec3 fade(vec3 t) {\n  return t*t*t*(t*(t*6.0-15.0)+10.0);\n}\n\n// Classic Perlin noise, periodic variant\nfloat pnoise(vec3 P, vec3 rep)\n{\n  vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period\n  vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period\n  Pi0 = mod289(Pi0);\n  Pi1 = mod289(Pi1);\n  vec3 Pf0 = fract(P); // Fractional part for interpolation\n  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n  vec4 iy = vec4(Pi0.yy, Pi1.yy);\n  vec4 iz0 = Pi0.zzzz;\n  vec4 iz1 = Pi1.zzzz;\n\n  vec4 ixy = permute(permute(ix) + iy);\n  vec4 ixy0 = permute(ixy + iz0);\n  vec4 ixy1 = permute(ixy + iz1);\n\n  vec4 gx0 = ixy0 * (1.0 / 7.0);\n  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n  gx0 = fract(gx0);\n  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n  vec4 sz0 = step(gz0, vec4(0.0));\n  gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n  gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n\n  vec4 gx1 = ixy1 * (1.0 / 7.0);\n  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n  gx1 = fract(gx1);\n  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n  vec4 sz1 = step(gz1, vec4(0.0));\n  gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n  gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n\n  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);\n  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);\n  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);\n  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);\n  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);\n  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);\n  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);\n  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);\n\n  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n  g000 *= norm0.x;\n  g010 *= norm0.y;\n  g100 *= norm0.z;\n  g110 *= norm0.w;\n  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n  g001 *= norm1.x;\n  g011 *= norm1.y;\n  g101 *= norm1.z;\n  g111 *= norm1.w;\n\n  float n000 = dot(g000, Pf0);\n  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n  float n111 = dot(g111, Pf1);\n\n  vec3 fade_xyz = fade(Pf0);\n  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n  return 2.2 * n_xyz;\n}\n\nuniform float time;\nuniform float radius;\nuniform float distort;\nuniform float frequency;\nuniform float surfaceDistort;\nuniform float surfaceFrequency;\nuniform float surfaceTime;\nuniform float numberOfWaves;\nuniform float fixNormals;\nuniform float surfacePoleAmount;\nuniform float gooPoleAmount;\nuniform float noisePeriod;\n\n#define M_PI 3.1415926538\n\nfloat f(vec3 point) {\n\n    float yPos = smoothstep(-1., 1., point.y);\n    float amount = sin(yPos * M_PI);\n    float wavePoleAmount = mix(amount * 1.0, 1.0, surfacePoleAmount);\n    float gooPoleAmount = mix(amount * 1.0, 1.0, gooPoleAmount);\n\n    // blob noise\n    float goo = pnoise(vec3(point / (frequency) + mod(time, noisePeriod)), vec3(noisePeriod)) * pow(distort, 2.0);\n\n    // wave noise\n    float surfaceNoise = pnoise(vec3(point / (surfaceFrequency) + mod(surfaceTime, noisePeriod)), vec3(noisePeriod));\n    float waves = (point.x * sin((point.y+surfaceNoise)*M_PI*numberOfWaves) + point.z * cos((point.y+surfaceNoise)*M_PI*numberOfWaves)) * 0.01 * pow(surfaceDistort, 2.0);\n\n    // combined noise\n    return waves * wavePoleAmount + goo * gooPoleAmount;\n}\n\nvec3 orthogonal(vec3 v) {\n    return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0) : vec3(0.0, -v.z, v.y));\n}\n';

export default MagicalMaterial;
