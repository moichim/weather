const vertexShaderSource = `
  attribute vec4 aVertexPosition;
  varying vec2 vTextureCoord;

  void main(void) {
    gl_Position = aVertexPosition;
    vTextureCoord = (aVertexPosition.xy + 1.0) / 2.0;
  }
`;
const fragmentShaderSource = `
precision mediump float;

// Uniformy pro předání hodnot z JS
uniform float uMin;
uniform float uMax;

// Vstupní textura (obrazová data)
uniform sampler2D uTexture;

// Velikost obrázku
uniform vec2 uResolution;

void main() {
    // Pozice pixelu v obrazových datech
    vec2 pixelCoord = gl_FragCoord.xy / uResolution;

    // Načtení hodnoty pixelu z každého kanálu
    float r = texture2D(uTexture, pixelCoord).r;
    float g = texture2D(uTexture, pixelCoord).g;
    float b = texture2D(uTexture, pixelCoord).b;
    float a = texture2D(uTexture, pixelCoord).a;

    // Složení hodnoty do jednoho floatu
    float originalValue = r + g + b + a;

    // Mapování hodnoty do rozsahu [uMin, uMax]
    float mappedValue = (originalValue - 0.0) / (1.0 - 0.0) * (uMax - uMin) + uMin;

    // Převod na odstíny šedi
    vec3 grayscaleColor = vec3(mappedValue);

    // Výsledná barva pixelu
    gl_FragColor = vec4(grayscaleColor, 1.0);
}

`;

export const createShader = (
    gl: WebGLRenderingContext,
    type: number,
    source: string
): WebGLShader|null => {

    const shader = gl.createShader( type );

    if ( !shader ) return null;

    gl.shaderSource( shader, source );
    gl.compileShader( shader );

    if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
        console.error( "Shader compilation failed", gl.getShaderInfoLog( shader ) );
        gl.deleteShader( shader );
        return null;
    }

    return shader;

}

export const createPropgram = (
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
): WebGLProgram|null => {

    const program = gl.createProgram();
    if ( !program ) return null;

    gl.attachShader( program, vertexShader );
    gl.attachShader( program, fragmentShader );
    gl.linkProgram( program );

    if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) ) {
        console.error( "Program linking failure", gl.getProgramInfoLog(program) );
        gl.deleteProgram( program );
        return null;
    }

    return program;

}