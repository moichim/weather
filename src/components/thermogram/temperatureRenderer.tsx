import React, { useEffect, useRef } from 'react';

interface TemperatureRendererProps {
  min: number;
  max: number;
  temperatureData: number[];
  width: number;
  height: number;
}

const TemperatureRenderer: React.FC<TemperatureRendererProps> = ({ min, max, temperatureData, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shaderProgramRef = useRef<WebGLProgram | null>(null);
  const minRef = useRef(min);
  const maxRef = useRef(max);

  useEffect(() => {
    minRef.current = min;
    maxRef.current = max;
  }, [min, max]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');

    if (!gl) {
      console.error('Unable to initialize WebGL. Your browser may not support it.');
      return;
    }

    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
          gl_Position = vec4(a_position, 0, 1);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform sampler2D u_texture;
      uniform float u_minTemperature;
      uniform float u_maxTemperature;

      uniform float u_width;  // Nově přidaná uniformní proměnná
      uniform float u_height; // Nově přidaná uniformní proměnná

      void main() {
          vec4 color = texture2D(u_texture, gl_FragCoord.xy / vec2(u_width, u_height));
          float temperature = color.r + color.g / 256.0 + color.b / 65536.0 + color.a / 16777216.0;
          temperature = clamp(temperature, u_minTemperature, u_maxTemperature);
          float normalizedTemperature = (temperature - u_minTemperature) / (u_maxTemperature - u_minTemperature);
          vec3 grayscaleColor = vec3(normalizedTemperature);
          gl_FragColor = vec4(grayscaleColor, 1.0);
      }
    `;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
      console.error('Failed to create shaders.');
      return;
    }

    shaderProgramRef.current = createProgram(gl, vertexShader, fragmentShader);

    if (!shaderProgramRef.current) {
      console.error('Failed to create shader program.');
      return;
    }

    gl.useProgram(shaderProgramRef.current);

    const minLocation = gl.getUniformLocation(shaderProgramRef.current, 'u_minTemperature');
    const maxLocation = gl.getUniformLocation(shaderProgramRef.current, 'u_maxTemperature');
    gl.uniform1f(minLocation, minRef.current);
    gl.uniform1f(maxLocation, maxRef.current);

    const widthLocation = gl.getUniformLocation(shaderProgramRef.current, 'u_width');
    const heightLocation = gl.getUniformLocation(shaderProgramRef.current, 'u_height');
    gl.uniform1f(widthLocation, width);
    gl.uniform1f(heightLocation, height);

    const texture = createTexture(gl, temperatureData, width, height);
    const textureLocation = gl.getUniformLocation(shaderProgramRef.current, 'u_texture');
    gl.uniform1i(textureLocation, 0);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const positionAttributeLocation = gl.getAttribLocation(shaderProgramRef.current, 'a_position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }, [temperatureData, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

function createTexture(gl: WebGLRenderingContext, data: number[], width: number, height: number): WebGLTexture | null {
    const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Změna formátu a typu na RGBA a UNSIGNED_BYTE
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(data));

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.bindTexture(gl.TEXTURE_2D, null);

  return texture;
}

export default TemperatureRenderer;
