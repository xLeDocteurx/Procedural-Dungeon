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

export enum EngineMixChannels {
  soundEffectsChannel = 'soundEffectsChannel',
  musicChannel = 'musicChannel',
  ambianceChannel = 'ambianceChannel',
}

export class AudioEnginePlugin extends Phaser.Plugins.BasePlugin {
  private _masterChannel: MixChannel = new MixChannel()
  private _mixChannels: EngineContexts = {
    soundEffectsChannel: new MixChannel(),
    musicChannel: new MixChannel(),
    ambianceChannel: new MixChannel(),
  }

  _channelStrips: Dic<ChannelStrip> = {}
  _soundPlayers: Dic<SoundPlayer> = {}

  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager)

    this._mixChannels.soundEffectsChannel.context.destination.connect(this._masterChannel.input)
    this._mixChannels.musicChannel.context.destination.connect(this._masterChannel.input)
    this._mixChannels.ambianceChannel.context.destination.connect(this._masterChannel.input)
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
  createSoundPlayer(
    playerName: string,
    sounds: Dic<Sound>,
    channelName: any = EngineMixChannels.soundEffectsChannel
  ): SoundPlayer {
    this._soundPlayers[playerName] = new SoundPlayer(
      sounds,
      Object.keys(this._mixChannels).some((key) => key === channelName)
        ? this._mixChannels[channelName]
        : this._channelStrips[channelName]
    )

    return this._soundPlayers[playerName]
  }

  createEffect(effectType: EffectType, breakpoints: _3BandEQBreakPoints)
  createEffect(effectType: EffectType, effectOptions: EffectOptions)
  createEffect(effectType: EffectType, options: any = {}) {
    if (effectType === EffectType.Delay) {
      return new Delay(options)
    } else if (effectType === EffectType.Distortion) {
      return new Distortion(options)
    } else if (effectType === EffectType.Filter) {
      return new Filter(options)
    } else if (effectType === EffectType.Pan) {
      return new Pan(options)
    } else if (effectType === EffectType.Reverb) {
      return new Reverb(options)
    } else if (effectType === EffectType._3BandEQ) {
      return new _3BandEQ(options)
    }
  }

  createChannelStrip(playerName: string, effects: Effect[], mixChannelName?: EngineMixChannels): ChannelStrip
  createChannelStrip(playerName: string, effects: Effect[], channelStripName?: string): ChannelStrip
  createChannelStrip(name: string, effects: Effect[], channelName: any): ChannelStrip {
    this._channelStrips[name] = new ChannelStrip(effects)
    this._channelStrips[name].context.destination.connect(
      Object.keys(this._mixChannels).some((key) => key === channelName)
        ? this._mixChannels[channelName].input
        : this._channelStrips[channelName].input
    )

    return this._channelStrips[channelName]
  }
}
