import 'dom4'
import noise from './shaders/noise.frag'
import frag from './shaders/main.frag'
import vert from './shaders/main.vert'

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

const baseStyle = {display: 'block', backgroundColor: 'black', height: '100%', width: '100%'}

const applyStyles = (element, styles) => {
  Object.keys(styles).forEach(style => {
    element.style[style] = styles[style]
  })
}

const arrays = {
  position: {numComponents: 2, data: [1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1]}
}

class ImageDisplacement {
  constructor (options) {
    this.pos = [0, 0]
    this.parralax = [0, 0]
    this.intensity = this.intensityD = 0
    this.subsideScale = 500
    this.imageSrc = options.imageSrc
    this.element = options.element || document.body
    let canvas = document.createElement('canvas')
    applyStyles(canvas, baseStyle)
    try {
      this.gl = getWebGLContext(canvas)
    } catch (error) { this.gl = null }
    if (this.gl !== null) {
      this.element.appendChild(canvas)
      canvas.addEventListener('mousemove', this.updateMouse)
      canvas.addEventListener('touchmove', this.updateMouse)
      this.programInfo = createProgramInfo(this.gl, [vert, frag])
      this.noiseProgramInfo = createProgramInfo(this.gl, [vert, noise])
      this.bufferInfo = createBufferInfoFromArrays(this.gl, arrays)
      this.framebufferInfo = createFramebufferInfo(this.gl)
      this.texture = createTexture(this.gl, {src: this.imageSrc, wrap: this.gl.CLAMP_TO_EDGE}, () => {
        this.render()
      })
    } else {
      let fallBackImage = document.createElement('img')
      applyStyles(fallBackImage, baseStyle)
      fallBackImage.src = this.imageSrc
      this.element.appendChild(fallBackImage)
    }
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
    let intensity = Math.abs(pos[0] - 0.5) * 2
    if (intensity < 0.1) intensity = 0
    this.intensity = intensity
    this.pos = pos
  }
  render = time => {
    if (document.hasFocus()) {
      this.intensityD -= (this.intensityD - this.intensity) / 20
      this.parralax[1] -= (this.parralax[1] - ((this.pos[1] - 0.5) / 5)) / 20
      this.parralax[0] -= (this.parralax[0] - ((this.pos[0] - 0.5) / 5)) / 20
      if (this.delta > 0) this.delta -= 1
      let noiseUniforms = {
        time,
        Period: 0.0002,
        Parralax: [this.parralax[1], this.parralax[0]],
        resolution: [this.gl.canvas.width, this.gl.canvas.height]
      }
      let uniforms = {
        Frequency: 0.7,
        Amplitude: 0.5,
        Intensity: this.intensityD,
        u_texSampler: this.texture,
        u_noiseSampler: this.framebufferInfo.attachments[0],
        resolution: [this.gl.canvas.width, this.gl.canvas.height]
      }
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

module.exports = options => new ImageDisplacement(options)
