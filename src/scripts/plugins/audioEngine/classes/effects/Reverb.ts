import { keepNumberBetwwen } from '../../utils'
import { MixChannel } from '../channels'
import { EffectContext } from './contexts'

export class Reverb {
  private _dryChannel = new MixChannel()
  private _effectChannel = new MixChannel()
  private _effectContext: EffectContext
  private _node: ConvolverNode

  private _dryWetRatio: number

  constructor(options: ConvolverOptions = {}, dryWetRatio: number = 0.5) {
    options = { ...{}, ...options }
    this.setDryWetRatio(dryWetRatio)
    this._effectContext = new EffectContext()
    this._node = new ConvolverNode(this._effectContext.context, options)
    // {
    //   // buffer?: AudioBuffer | null;
    //   // disableNormalization?: boolean;
    // })

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

  setGain(value: number) {
    this._effectContext.setGain(value)
  }
}
