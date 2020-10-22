// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class JoySticks extends cc.Component {

    @property(cc.Node)
    stick: cc.Node = null;

    @property
    max_r: number = 120;
    @property
    min_r: number = 60;


    dir: number;
    radius: number;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.dir = -1;
        this.radius = 0;

        this.stick.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.stick.on(cc.Node.EventType.TOUCH_END, this.onTouchCancel, this);
        this.stick.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        

    }

    onTouchMove(event: cc.Touch){
        let world_pos = event.getLocation();
        let local_pos = this.node.convertToNodeSpaceAR(world_pos);
        let dis = local_pos.mag();
        if (dis > this.max_r){
            local_pos.x = local_pos.x * this.max_r/dis;
            local_pos.y = local_pos.y * this.max_r/dis;
        }
        if (dis < this.min_r){
            return;
        }
        this.dir = 1;
        //cc.log(this.dir);
        this.radius = Math.atan2(local_pos.y, local_pos.x);
        this.stick.setPosition(local_pos);
    }

    onTouchCancel(event: cc.Touch){
        this.stick.setPosition(0, 0);
        this.dir = -1;
    }
    // update (dt) {}
}
