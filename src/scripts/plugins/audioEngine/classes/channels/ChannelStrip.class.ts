import { Effect } from '../../types'

export class ChannelStrip {
  private _context: AudioContext
  input: ChannelMergerNode
  gain: GainNode
  private _effects: Effect[]

  get context() {
    return this._context
  }

  get effects() {
    return this._effects
  }

  constructor(effect: Effect)
  constructor(effects: Effect[])
  constructor(fx: any) {
    this._context = new AudioContext()
    this.input = this._context.createChannelMerger()
    this.gain = this._context.createGain()

    // TO DO is array
    if (fx) {
      this.addEffects(fx)
    } else {
      this.addEffect(fx)
    }
  }

  addEffect(effect: Effect) {
    this._effects.push(effect)
    this.input.disconnect()
    this._effects.forEach((ef) => {
      ef.effectContext.context.destination.disconnect()
    })
    const channelFlow = this._effects.reduce(
      (prev_node, effect) => prev_node.connect(effect.effectContext.context.destination),
      this.input
    )
    channelFlow.connect(this.gain).connect(this.context.destination)
  }

  addEffects(effects: Effect[]) {
    this._effects = [...this._effects, ...effects]
    this.input.disconnect()
    this._effects.forEach((ef) => {
      ef.effectContext.context.destination.disconnect()
    })
    const channelFlow = this._effects.reduce(
      (prev_node, effect) => prev_node.connect(effect.effectContext.context.destination),
      this.input
    )
    channelFlow.connect(this.gain).connect(this.context.destination)
  }

  setGain(value: number) {
    this.gain.gain.value = value
  }
}
