import fs from 'fs';

import Shader from "./shader"

import vsSource from "./shaders/tunnel.vert"
import fsSource from "./shaders/tunnel.frag"

const canvas = document.querySelector("#webgl-canvas");
const gl = canvas.getContext("webgl");

if (gl === null) {
  console.error("!!! WebGL Not Supported !!! ")
}

gl.clearColor(1.0, 1.0, 1.0, 1.0);

// SHADER PROGRAM INIT
const shaderProgram = Shader.initProgram(gl, vsSource, fsSource);
const aVertexPosition = gl.getAttribLocation(shaderProgram, 'aPosition');
const aVertexTexCoord = gl.getAttribLocation(shaderProgram, 'aTexCoord');

const uTime    = gl.getUniformLocation(shaderProgram, 'uTime');
const uTexture = gl.getUniformLocation(shaderProgram, 'uTexture');

if (shaderProgram == null) {
  console.error("!!! Shader Not Loaded !!!")
}
//

// Position Attribute
const positionBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const pos = new Float32Array([
  -1.0, 1.0,
  1.0, 1.0,
  -1.0, -1.0,
  1.0, -1.0,
]);

gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);

gl.enableVertexAttribArray(aVertexPosition);
gl.vertexAttribPointer(aVertexPosition, 2, gl.FLOAT, false, 0, 0);
// ------------------------ //

// Texture Coordinat Attribute
const texCoordBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);

const tex = new Float32Array([
  0.0, 1.0,
  1.0, 1.0,
  0.0, 0.0,
  1.0, 0.0,
]);

gl.bufferData(gl.ARRAY_BUFFER, tex, gl.STATIC_DRAW);

gl.enableVertexAttribArray(aVertexTexCoord);
gl.vertexAttribPointer(aVertexTexCoord, 2, gl.FLOAT, false, 0, 0);
// ------------------------ //

// Bind Texture
const texture = gl.createTexture();
const image = new Image();

const imageBase64 = fs.readFileSync(__dirname + '/CopperTexture.jpg').toString("base64");

image.onload = () => {
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texImage2D(gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    image
  );

  gl.generateMipmap(gl.TEXTURE_2D);

  gl.uniform1i(uTexture, 0);
  
  window.requestAnimationFrame(draw);
}

image.src = "data:image/jpg;base64," + imageBase64;


// ------------------------ //
function draw(timestamp) {

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(shaderProgram);

  gl.uniform1f(uTime, timestamp/1000.0);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  window.requestAnimationFrame(draw);
}

