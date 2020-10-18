import { Dic } from '../../../utils/types'
import { Channel, Sound } from '../types'

export interface SoundElement {
  htmlAudioElement: HTMLAudioElement
  mediaElementAudioSourceNode: MediaElementAudioSourceNode
}

export class SoundPlayer {
  private _audioElements: Dic<SoundElement> = {}
  private _output: GainNode

  constructor(private _context: AudioContext, private _soundsLibrary: Dic<Sound>, private _channel: Channel) {
    this._output = new GainNode(this._context)
  }

  connect(channel: Channel) {
    this._channel = channel
    this._output.disconnect()
    this._output.connect(channel.input)
  }

  async playSound(name: string, volume = this._soundsLibrary[name].volume) {
    if (!this._audioElements[name]) {
      await this.loadSound(name, volume)
    }
    if (this._soundsLibrary[name].type !== 'oneShotParallel') {
      this.stopSound(name)
    }
    this._audioElements[name].htmlAudioElement.play()
  }

  pauseSound(name: string) {
    this._audioElements[name].htmlAudioElement.pause()
  }

  stopSound(name: string) {
    this._audioElements[name].htmlAudioElement.pause()
    this._audioElements[name].htmlAudioElement.currentTime = 0
  }

  private async loadSound(name: string, volume: number): Promise<void> {
    const sound: Sound = this._soundsLibrary[name]
    const htmlAudioElement = await this.handleSoundLoading(sound.path)

    this._audioElements[name] = {
      htmlAudioElement,
      mediaElementAudioSourceNode: this._context.createMediaElementSource(htmlAudioElement),
    }
    this._audioElements[name].htmlAudioElement.loop = sound.type === 'loop' ? true : false
    this._audioElements[name].htmlAudioElement.volume = volume

    this._audioElements[name].mediaElementAudioSourceNode.connect(this._channel.input)
  }

  private async handleSoundLoading(path: string): Promise<HTMLAudioElement> {
    await new Promise((resolve, reject) => {
      const sound = new Audio(path)
      sound.oncanplaythrough = () => {
        resolve(sound)
      }
    })
    return new Promise((resolve, reject) => {
      const sound = new Audio(path)
      sound.oncanplaythrough = () => {
        resolve(sound)
      }
    })
  }
}
