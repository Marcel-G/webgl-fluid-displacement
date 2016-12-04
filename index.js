import 'dom4'
import domready from 'domready'
import frag from './shaders/main.frag'
import vert from './shaders/main.vert'
import twgl from 'twgl-base.js'

var gl, programInfo, bufferInfo

var arrays = {
  position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0]
}

function render (time) {
  twgl.resizeCanvasToDisplaySize(gl.canvas)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  var uniforms = {
    time: time * 0.001,
    resolution: [gl.canvas.width, gl.canvas.height]
  }

  gl.useProgram(programInfo.program)
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo)
  twgl.setUniforms(programInfo, uniforms)
  twgl.drawBufferInfo(gl, bufferInfo)

  requestAnimationFrame(render)
}

domready(() => {
  console.log('ready')
  let canvas = document.createElement('canvas')
  canvas.id = 'c'
  document.body.appendChild(canvas)
  gl = twgl.getWebGLContext(document.getElementById('c'))
  programInfo = twgl.createProgramInfo(gl, [vert, frag])
  bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays)
  requestAnimationFrame(render)
})
