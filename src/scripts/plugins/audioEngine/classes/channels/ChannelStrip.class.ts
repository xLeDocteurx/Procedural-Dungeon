import { Channel } from '.'
import { Effect } from '../../types'

export class ChannelStrip implements Channel {
  input: ChannelMergerNode
  output: GainNode
  private _effects: Effect[] = []

  constructor(_context: AudioContext, effect: Effect)
  constructor(_context: AudioContext, effects: Effect[])
  constructor(private _context: AudioContext, fx: any) {
    this.input = new ChannelMergerNode(this._context)
    this.output = new GainNode(this._context)

    if (Array.isArray(fx)) {
      this.addEffects(fx)
    } else {
      this.addEffect(fx)
    }
  }

  connect(channel: Channel): AudioNode {
    this.output.connect(channel.input)
    return channel.output
  }

  addEffect(effect: Effect) {
    this._effects.push(effect)
    this.rootEffects()
  }

  addEffects(effects: Effect[]) {
    this._effects = [...this._effects, ...effects]
    this.rootEffects()
  }

  rootEffects() {
    this.input.disconnect()
    this._effects.forEach((ef) => {
      ef.output.disconnect()
    })
    this.input.connect(this._effects[0].input)
    if (this._effects.length > 1) {
      for (let i = 0; i < this._effects.length - 1; i++) {
        this._effects[i].output.connect(this._effects[i + 1].input)
      }
    }

    this._effects[this._effects.length - 1].output.connect(this.output)
  }

  setGain(value: number) {
    this.output.gain.value = value
  }
}
