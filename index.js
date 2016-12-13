import 'dom4'
import noise from './shaders/noise.frag'
import frag from './shaders/main.frag'
import vert from './shaders/main.vert'
import image from './midday.jpg'
import {
  bindFramebufferInfo,
  getWebGLContext,
  createProgramInfo,
  createBufferInfoFromArrays,
  createTexture,
  resizeCanvasToDisplaySize,
  setBuffersAndAttributes,
  createFramebufferInfo,
  setUniforms,
  drawBufferInfo } from 'twgl-base.js'

const arrays = {
  position: {numComponents: 2, data: [1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1]}
}

class AnimatedBackground {
  constructor () {
    let canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    this.pos = [0, 0]
    this.delta = 0
    this.subsideScale = 500
    canvas.addEventListener('mousemove', this.updateMouse)
    canvas.addEventListener('touchmove', this.updateMouse)
    this.gl = getWebGLContext(canvas)
    this.programInfo = createProgramInfo(this.gl, [vert, frag])
    this.noiseProgramInfo = createProgramInfo(this.gl, [vert, noise])
    this.bufferInfo = createBufferInfoFromArrays(this.gl, arrays)
    this.framebufferInfo = createFramebufferInfo(this.gl)
    this.texture = createTexture(this.gl, {src: image, wrap: this.gl.CLAMP_TO_EDGE}, () => {
      this.render()
    })
  }
  updateMouse = event => {
    if (event.touches && event.touches.length > 1) {
      return
    }
    let touches = event.touches
    if (!touches) {
      touches = [{ clientX: event.clientX, clientY: event.clientY }]
    }
    let pos = [touches[0].clientY / this.gl.canvas.height, touches[0].clientX / this.gl.canvas.width]
    let delta = this.delta + Math.round(this.subsideScale * (Math.abs(this.pos[0] - pos[0]) + Math.abs(this.pos[1] - pos[1])))
    if (delta > this.subsideScale) delta = this.delta
    this.delta = delta
    this.pos = pos
  }
  render = time => {
    if (this.delta > 0) this.delta -= 1
    let noiseUniforms = {
      time,
      Period: 0.0001,
      resolution: [this.gl.canvas.width, this.gl.canvas.height]
    }
    let uniforms = {
      Frequency: 1,
      Amplitude: 1,
      Intensity: this.delta / this.subsideScale,
      u_texSampler: this.texture,
      u_noiseSampler: this.framebufferInfo.attachments[0],
      resolution: [this.gl.canvas.width, this.gl.canvas.height]
    }
    if (document.hasFocus()) {
      resizeCanvasToDisplaySize(this.gl.canvas)
      bindFramebufferInfo(this.gl, this.framebufferInfo)

      this.gl.useProgram(this.noiseProgramInfo.program)
      setBuffersAndAttributes(this.gl, this.noiseProgramInfo, this.bufferInfo)
      setUniforms(this.noiseProgramInfo, noiseUniforms)
      drawBufferInfo(this.gl, this.bufferInfo)

      bindFramebufferInfo(this.gl, null)
      this.gl.useProgram(this.programInfo.program)
      setBuffersAndAttributes(this.gl, this.programInfo, this.bufferInfo)
      setUniforms(this.programInfo, uniforms)
      drawBufferInfo(this.gl, this.bufferInfo)
    }
    requestAnimationFrame(this.render)
  }
}

new AnimatedBackground()
