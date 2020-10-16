import { makeDistortionCurve } from '../../utils'
import { EffectContext } from './contexts'

export class Distortion {
  private _effectContext = new EffectContext()
  private _node: WaveShaperNode

  constructor(options: WaveShaperOptions = {}) {
    options = { ...{ curve: makeDistortionCurve(), oversample: '2x' }, ...options }
    this._node = new WaveShaperNode(this._effectContext.context, options)

    this._effectContext.input
      .connect(this._node)
      .connect(this._effectContext.gain)
      .connect(this._effectContext.context.destination)
  }

  get effectContext() {
    return this._effectContext
  }

  setCurve(amount: number)
  setCurve(curve: number[])
  setCurve(curve: Float32Array)
  setCurve(input: any) {
    if (typeof input === 'number') {
      this._node.curve = makeDistortionCurve(input)
    } else {
      this._node.curve = input
    }
  }

  setOversample(oversample: OverSampleType) {
    this._node.oversample = oversample
  }

  setGain(value: number) {
    this._effectContext.setGain(value)
  }
}
