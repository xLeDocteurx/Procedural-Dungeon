import 'phaser'
import { AudioEngine } from './classes'

export class AudioEnginePlugin extends Phaser.Plugins.BasePlugin {
  audioEngine: AudioEngine = new AudioEngine()

  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager)
  }

  createSoundPlayer() {}

  createChannelStrip() {}
}
