import 'phaser'
import { Dic } from '../../utils/types'
import { SoundPlayer } from './classes'
import { ChannelStrip, MixChannel } from './classes/channels'
import { Delay, Distortion, Filter, Pan, Reverb, _3BandEQ, _3BandEQBreakPoints } from './classes/effects'
import { Effect, EffectOptions, EffectType, Sound } from './types'

export interface EngineContexts {
  soundEffectsChannel: MixChannel
  musicChannel: MixChannel
  ambianceChannel: MixChannel
}

export type EngineMixChannels = 'soundEffectsChannel' | 'musicChannel' | 'ambianceChannel'

export class AudioEnginePlugin extends Phaser.Plugins.BasePlugin {
  // private _masterContext: AudioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  private _masterContext: AudioContext = new AudioContext()
  private _masterChannel: MixChannel = new MixChannel(this._masterContext)
  private _mixChannels: EngineContexts = {
    soundEffectsChannel: new MixChannel(this._masterContext),
    musicChannel: new MixChannel(this._masterContext),
    ambianceChannel: new MixChannel(this._masterContext),
  }

  _channelStrips: Dic<ChannelStrip> = {}
  _soundPlayers: Dic<SoundPlayer> = {}

  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager)

    this._mixChannels.soundEffectsChannel.output.connect(this._masterChannel.input)
    this._mixChannels.musicChannel.output.connect(this._masterChannel.input)
    this._mixChannels.ambianceChannel.output.connect(this._masterChannel.input)
    this._masterChannel.output.connect(this._masterContext.destination)
  }

  get master() {
    return this._masterChannel
  }

  get mixChannels() {
    return this._mixChannels
  }

  get channelStrips() {
    return this._channelStrips
  }

  createSoundPlayer(playerName: string, sounds: Dic<Sound>, mixChannelName?: EngineMixChannels): SoundPlayer
  createSoundPlayer(playerName: string, sounds: Dic<Sound>, channelStripName?: string): SoundPlayer
  createSoundPlayer(playerName: string, sounds: Dic<Sound>, channelName: any = 'soundEffectsChannel'): SoundPlayer {
    this._soundPlayers[playerName] = new SoundPlayer(
      this._masterContext,
      sounds,
      Object.keys(this._mixChannels).some((key) => key === channelName)
        ? this._mixChannels[channelName]
        : this._channelStrips[channelName]
    )

    return this._soundPlayers[playerName]
  }

  createEffect(effectType: 'Delay', effectOptions?: EffectOptions): Delay
  createEffect(effectType: 'Distortion', effectOptions?: EffectOptions): Distortion
  createEffect(effectType: 'Filter', effectOptions?: EffectOptions): Filter
  createEffect(effectType: 'Pan', effectOptions?: EffectOptions): Pan
  createEffect(effectType: 'Reverb', effectOptions?: EffectOptions): Reverb
  createEffect(effectType: '_3BandEQ', breakpoints?: _3BandEQBreakPoints): _3BandEQ
  createEffect(effectType: EffectType, options: any = {}): Effect {
    if (effectType === 'Delay') {
      return new Delay(this._masterContext, options)
    } else if (effectType === 'Distortion') {
      return new Distortion(this._masterContext, options)
    } else if (effectType === 'Filter') {
      return new Filter(this._masterContext, options)
    } else if (effectType === 'Pan') {
      return new Pan(this._masterContext, options)
    } else if (effectType === 'Reverb') {
      return new Reverb(this._masterContext, options)
    } else if (effectType === '_3BandEQ') {
      return new _3BandEQ(this._masterContext, options)
    }
  }

  createChannelStrip(channelName: string, effects?: Effect[], mixChannelName?: EngineMixChannels): ChannelStrip
  createChannelStrip(channelName: string, effects?: Effect[], channelStripName?: string): ChannelStrip
  createChannelStrip(name: string, effects: Effect[] = [], channelName: any = 'soundEffectsChannel'): ChannelStrip {
    this._channelStrips[name] = new ChannelStrip(this._masterContext, effects)
    // this._channelStrips[name].context.destination.connect(
    this._channelStrips[name].output.connect(
      Object.keys(this._mixChannels).some((key) => key === channelName)
        ? this._mixChannels[channelName].input
        : this._channelStrips[channelName].input
    )

    return this._channelStrips[name]
  }
}
