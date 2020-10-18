import { AudioEnginePlugin } from '../../../../plugins/audioEngine/AudioEngine.plugin'
import { SoundPlayer } from '../../../../plugins/audioEngine/classes'
import { ChannelStrip } from '../../../../plugins/audioEngine/classes/channels'
import { sounds } from './phaserLogo.sounds'

export class PhaserLogo extends Phaser.Physics.Arcade.Sprite {
  soundPlayer: SoundPlayer
  effectsChannel: ChannelStrip

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private ae: AudioEnginePlugin = scene.plugins.get('AudioEngine') as AudioEnginePlugin
  ) {
    super(scene, x, y, 'phaser-logo')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    const filter = this.ae.createEffect('Filter')
    this.effectsChannel = this.ae.createChannelStrip('logoEffects', [filter])

    const delay = this.ae.createEffect('Delay')
    this.effectsChannel.addEffect(delay)

    this.soundPlayer = this.ae.createSoundPlayer('logoPlayer', sounds)
    this.soundPlayer.connect(this.effectsChannel)

    this.setCollideWorldBounds(true)
      .setBounce(0.6)
      .setInteractive()
      .on('pointerdown', () => {
        this.soundPlayer.playSound('jump')
        this.setVelocityY(-400)
      })
  }
}
