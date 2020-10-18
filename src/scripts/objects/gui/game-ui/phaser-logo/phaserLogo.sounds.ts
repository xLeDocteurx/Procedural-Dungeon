import { Sound } from '../../../../plugins/audioEngine/types'
import { Dic } from '../../../../utils/types'

export const sounds: Dic<Sound> = {
  bomb: {
    path: '../../../../../assets/sounds/wav/Bomb_Explosion.wav',
    type: 'oneShot',
    volume: 1,
  },
  jump: {
    path: '../../../../../assets/sounds/wav/Jump.wav',
    type: 'oneShot',
    volume: 1,
  },
  punch: {
    path: '../../../../../assets/sounds/wav/Punch.wav',
    type: 'oneShot',
    volume: 1,
  },
  shoot: {
    path: '../../../../../assets/sounds/wav/Shoot.wav',
    type: 'oneShot',
    volume: 1,
  },
}
