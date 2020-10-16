import { keepNumberBetwwen } from '../../utils'
import { MixChannel } from '../channels'
import { EffectContext } from './contexts'

export class Delay {
  private _dryChannel = new MixChannel()
  private _effectChannel = new MixChannel()
  private _effectContext = new EffectContext()
  private _node: DelayNode

  private _dryWetRatio: number

  constructor(options: DelayOptions = {}, dryWetRatio: number = 0.5) {
    options = { ...{ delayTime: 0.5 }, ...options }
    this.setDryWetRatio(dryWetRatio)
    this._node = new DelayNode(this._effectChannel.context, options)

    this._effectContext.input
      .connect(this._dryChannel.input)
      .connect(this._dryChannel.gain)
      .connect(this._effectContext.gain)

    this._effectContext.input
      .connect(this._effectChannel.input)
      .connect(this._node)
      .connect(this._effectChannel.gain)
      .connect(this._effectContext.gain)

    this._effectContext.gain.connect(this._effectContext.context.destination)
  }

  get effectContext() {
    return this._effectContext
  }

  setDryWetRatio(ratio: number) {
    this._dryWetRatio = keepNumberBetwwen(ratio, 0, 1)
    this._dryChannel.gain.gain.value = 1 - this._dryWetRatio
    this._effectChannel.gain.gain.value = this._dryWetRatio
  }

  setDelayTime(time: number) {
    this._node.delayTime.value = time
  }

  setGain(value: number) {
    this._effectContext.setGain(value)
  }
}
