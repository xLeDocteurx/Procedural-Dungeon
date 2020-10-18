import { Dic } from '../../../utils/types'

export interface Sound {
  path: string
  type: SoundType
  volume: number
}

export type SoundType = 'oneShot' | 'oneShotParallel' | 'loop'

export type SoundsLibrary = Dic<Sound>
