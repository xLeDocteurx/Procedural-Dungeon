import { keepNumberBetwwen } from '../../utils'
import { EffectContext } from './contexts'

export class Pan {
  private _effectContext: EffectContext
  private _node: StereoPannerNode

  constructor(options: StereoPannerOptions = {}) {
    //   {
    //   // coneInnerAngle?: number;
    //   // coneOuterAngle?: number;
    //   // coneOuterGain?: number;
    //   // distanceModel?: DistanceModelType;
    //   // maxDistance?: number;
    //   // orientationX?: number;
    //   // orientationY?: number;
    //   // orientationZ?: number;
    //   // panningModel?: PanningModelType;
    //   // positionX?: number;
    //   // positionY?: number;
    //   // positionZ?: number;
    //   // refDistance?: number;
    //   // rolloffFactor?: number;
    // }
    options = { ...{ pan: 0 }, ...options }
    this._effectContext = new EffectContext()
    this._node = new StereoPannerNode(this._effectContext.context, options)

    this._effectContext.input
      .connect(this._node)
      .connect(this._effectContext.gain)
      .connect(this._effectContext.context.destination)
  }

  get effectContext() {
    return this._effectContext
  }

  setPan(value: number) {
    this._node.pan.value = keepNumberBetwwen(value, -1, 1)
  }

  setGain(value: number) {
    this._effectContext.setGain(value)
  }
}
