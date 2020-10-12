import 'phaser'
import { MixChannel } from './channels'

export interface AudioEngineContexts {
  soundEffectsChannel: MixChannel
  musicChannel: MixChannel
  ambianceChannel: MixChannel
}

export enum AudioEngineContextsEnum {
  soundEffectsChannel = 'soundEffectsChannel',
  musicChannel = 'musicChannel',
  ambianceChannel = 'ambianceChannel',
}

export class AudioEngineClass {
  private _masterChannel: MixChannel = new MixChannel()

  private _contexts: AudioEngineContexts = {
    soundEffectsChannel: new MixChannel(),
    musicChannel: new MixChannel(),
    ambianceChannel: new MixChannel(),
  }

  constructor() {
    // const AudioContext = window.AudioContext || window.webkitAudioContext
    // const audioContext = new AudioContext()
    // const audioContext = new window.AudioContext()

    // const audioContext = new AudioContext()
    // const audioElement = new Audio()
    // const track = audioContext.createMediaElementSource(audioElement)

    this._contexts.soundEffectsChannel.context.destination.connect(this._masterChannel.input)
    this._contexts.musicChannel.context.destination.connect(this._masterChannel.input)
    this._contexts.ambianceChannel.context.destination.connect(this._masterChannel.input)
  }

  // getSomeContext(contextEnum: AudioEngineContextsEnum) {
  //   return this._contexts[contextEnum].context
  // }

  connectNode(node: AudioNode, context: AudioEngineContextsEnum = AudioEngineContextsEnum.soundEffectsChannel) {
    node.connect(this._contexts[context].input)
  }

  // connectAudioNode(contextEnum: AudioEngineContextsEnum, mediaElement: HTMLMediaElement) {
  //   this._contexts[contextEnum].context.createMediaElementSource()
  // }
}
