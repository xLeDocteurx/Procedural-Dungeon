import { MixChannel } from '../channels'
import { EffectContext } from './contexts'

export interface _3BandEQBreakPoints {
  lowMid?: number
  midHigh?: number
}

export class _3BandEQ {
  private _effectContext: EffectContext
  private _lowFilterNode: BiquadFilterNode
  private _lowFilterChannel = new MixChannel()
  private _midFilterNode: BiquadFilterNode
  private _midFilterChannel = new MixChannel()
  private _highFilterNode: BiquadFilterNode
  private _highFilterChannel = new MixChannel()

  constructor(breakPoints: _3BandEQBreakPoints = {}) {
    breakPoints = { ...{ lowMid: 200, midHigh: 2000 }, ...breakPoints }
    const options: BiquadFilterOptions = { Q: 1, detune: 0 }
    this._effectContext = new EffectContext()
    this._lowFilterNode = new BiquadFilterNode(this._effectContext.context, {
      // Q: options.Q,
      detune: options.detune,
      frequency: breakPoints.lowMid,
      type: 'lowpass',
    })
    this._midFilterNode = new BiquadFilterNode(this._effectContext.context, {
      // Q: options.Q,
      detune: options.detune,
      frequency: (breakPoints.lowMid + breakPoints.midHigh) / 2,
      type: 'bandpass',
    })
    this._highFilterNode = new BiquadFilterNode(this._effectContext.context, {
      // Q: options.Q,
      detune: options.detune,
      frequency: breakPoints.midHigh,
      type: 'highpass',
    })

    this._effectContext.input
      .connect(this._lowFilterChannel.input)
      .connect(this._lowFilterNode)
      .connect(this._lowFilterChannel.gain)
      .connect(this._effectContext.gain)
      .connect(this._effectContext.context.destination)
    this._effectContext.input
      .connect(this._midFilterChannel.input)
      .connect(this._midFilterNode)
      .connect(this._midFilterChannel.gain)
      .connect(this._effectContext.gain)
      .connect(this._effectContext.context.destination)
    this._effectContext.input
      .connect(this._highFilterChannel.input)
      .connect(this._highFilterNode)
      .connect(this._highFilterChannel.gain)
      .connect(this._effectContext.gain)
      .connect(this._effectContext.context.destination)
  }

  get effectContext() {
    return this._effectContext
  }

  setLowGain(value: number) {
    this._lowFilterChannel.gain.gain.value = value
  }

  setLowFrequency(value: number) {
    this._lowFilterNode.frequency.value = value
  }

  setLowQ(value: number) {
    this._lowFilterNode.Q.value = value
  }

  setMidGain(value: number) {
    this._midFilterChannel.gain.gain.value = value
  }

  setMidFrequency(value: number) {
    this._midFilterNode.frequency.value = value
  }

  setMidQ(value: number) {
    this._midFilterNode.Q.value = value
  }

  setHighGain(value: number) {
    this._highFilterChannel.gain.gain.value = value
  }

  setHighFrequency(value: number) {
    this._highFilterNode.frequency.value = value
  }

  setHighQ(value: number) {
    this._highFilterNode.Q.value = value
  }

  setGain(value: number) {
    this._effectContext.setGain(value)
  }
}
