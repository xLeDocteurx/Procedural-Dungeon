import { AudioEngineContextsEnum } from '.'
import { Dic } from '../../../utils/types'
import { Sound, SoundType } from '../types/sound'

export interface SoundElement {
  htmlAudioElement: HTMLAudioElement
  mediaElementAudioSourceNode: MediaElementAudioSourceNode
}

export class SoundPlayer {
  private soundsLibrary: Dic<Sound>
  // private audioContext: AudioContext
  private audioElements: Dic<SoundElement> = {}

  constructor(sounds: Dic<Sound>, audioEngineChannel: AudioEngineContextsEnum) {
    this.soundsLibrary = sounds
    // this.audioContext = new AudioContext()
    // this.audioContext.connect()
  }

  async playSound(name: string, volume = this.soundsLibrary[name].volume) {
    const volumeValue = volume

    await this.loadSound(name, volumeValue)
    this.stopSound(name)
    this.audioElements[name].htmlAudioElement.play()
    // return () => this.stopSound(name)
  }

  stopSound(name: string) {
    this.audioElements[name].htmlAudioElement.pause()
    this.audioElements[name].htmlAudioElement.currentTime = 0
  }

  private async loadSound(name: string, volume: number): Promise<void> {
    const sound: Sound = this.soundsLibrary[name]
    if (!this.audioElements[name]) {
      this.audioElements[name].htmlAudioElement = await this.handleSoundLoading(sound.path)
      this.audioElements[name].htmlAudioElement.loop = sound.type === SoundType.loop ? true : false
      this.audioElements[name].htmlAudioElement.volume = volume

      // this.audioElements[name].mediaElementAudioSourceNode = new MediaElementAudioSourceNode()
      // this.audioElements[name].mediaElementAudioSourceNode = this.audioContext.createMediaElementSource(
      //   this.audioElements[name].htmlAudioElement
      // )
      // this.audioElements[name].mediaElementAudioSourceNode.connect(this.audioContext.destination)
    }
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
