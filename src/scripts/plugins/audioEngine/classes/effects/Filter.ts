import { EffectContext } from './contexts'

export class Filter {
  private _effectContext = new EffectContext()
  private _node: BiquadFilterNode

  constructor(options: BiquadFilterOptions = {}) {
    options = { ...{ type: 'lowpass', frequency: 500, Q: 1, detune: 0, gain: 1 }, ...options }
    this._node = new BiquadFilterNode(this._effectContext.context, options)

    this._effectContext.input
      .connect(this._node)
      .connect(this._effectContext.gain)
      .connect(this._effectContext.context.destination)
  }

  get effectContext() {
    return this._effectContext
  }

  setFrequency(value: number) {
    this._node.frequency.value = value
  }

  setQ(value: number) {
    this._node.Q.value = value
  }

  setFilterGain(value: number) {
    this._node.gain.value = value
  }

  setGain(value: number) {
    this._effectContext.setGain(value)
  }
}
