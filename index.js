import 'dom4'
import frag from './shaders/main.frag'
import vert from './shaders/main.vert'
import image from './midday.jpg'
import {
  getWebGLContext,
  createProgramInfo,
  createBufferInfoFromArrays,
  createTexture,
  resizeCanvasToDisplaySize,
  setBuffersAndAttributes,
  setUniforms,
  drawBufferInfo } from 'twgl-base.js'

const arrays = {
  position: {numComponents: 2, data: [1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1]}
}

class AnimatedBackground {
  constructor () {
    let canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    this.gl = getWebGLContext(canvas)
    this.programInfo = createProgramInfo(this.gl, [vert, frag])
    this.bufferInfo = createBufferInfoFromArrays(this.gl, arrays)
    this.texture = createTexture(this.gl, {src: image}, () => {
      this.render()
    })
  }
  render = time => {
    let uniforms = {
      time: time * 0.001,
      Frequency: 1,
      Amplitude: 0.1,
      Period: 0.03,
      u_mySampler: this.texture,
      resolution: [this.gl.canvas.width, this.gl.canvas.height]
    }
    if (document.hasFocus()) {
      resizeCanvasToDisplaySize(this.gl.canvas)
      this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
      this.gl.useProgram(this.programInfo.program)
      setBuffersAndAttributes(this.gl, this.programInfo, this.bufferInfo)
      setUniforms(this.programInfo, uniforms)
      drawBufferInfo(this.gl, this.bufferInfo)
    }
    requestAnimationFrame(this.render)
  }
}

new AnimatedBackground()
