
const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Node)
    enemy: cc.Node = null;

    @property(cc.Node)
    bomb: cc.Node = null;


    @property(cc.Label)
    scoreLabel: cc.Label = null;

    score = 0;
    isFire = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.fire, this)
        this.initPlayer();
        this.initEnemy();
        this.scoreLabel.string = this.score.toString();
    }

    
    initPlayer(){
        //初始位置
        this.player.setPosition(0, -this.node.height/8);
        //下落动作
        cc.tween(this.player).to(10, {y: -this.node.height/2 - 32}).start();
    }

    initEnemy(){
        //初始位置
        this.enemy.setPosition(0, this.node.height/2);
        //下落后，左右移动
        let begin = cc.tween().to(1, {position: cc.v2(-this.node.width/2, this.node.height/4)});
        let start = cc.tween().by(5, {x: this.node.width});
        let start2 = cc.tween().by(5, {x: -this.node.width});
        let tween = cc.tween().sequence(start, start2);
        let act = cc.tween().repeatForever(tween);
        cc.tween(this.enemy).then(begin).then(act).start();

    }

    fire(event){
        if (this.isFire){
            return
        }

        this.isFire = true;
        cc.tween(this.player).to(2, {y: this.node.height/2 + 32}).start();
    }


    gameOver(){
        this.isFire = false;
        cc.director.loadScene("game");
    }
    start () {

    }


    playParticles(pos: cc.Vec2, color: cc.Color){
        let part = this.bomb.getComponent(cc.ParticleSystem);
        part.startColor = part.endColor = color;
        this.bomb.setPosition(pos);
        part.resetSystem();
    }
    
    update (dt) {
        let pPos = this.player.getPosition();
        let ePos = this.enemy.getPosition();
        //打到了小怪物
        if (pPos.sub(ePos).mag() < 50 ){
            this.isFire = false;
            this.initEnemy();
            this.initPlayer();
            this.playParticles(pPos, cc.color(0xF1, 0xDC, 0x99));
            this.score++;
            this.scoreLabel.string = this.score.toString();
        }
        //主角 到了上或下边缘
        if ((pPos.y > this.node.height/2 - 70) || (pPos.y < -this.node.height/2 + 70))
        {
            this.playParticles(pPos, cc.color(0x69, 0x6C, 0x71));
            this.enemy.active = false;
            this.player.active = false;
            this.scheduleOnce(this.gameOver, 1);
            this.initEnemy();
            this.initPlayer();
        }
        //if ()
    }
}
