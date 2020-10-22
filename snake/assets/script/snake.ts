// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import JoySticks from './joysticks';

@ccclass
export default class NewClass extends cc.Component {

    //方向控制节点
    @property(cc.Node)
    joyNode: cc.Node = null;
     //方向控制组件
    joyScript: JoySticks = null;

    //随机出现在各个位置的蛇的节点，被吃点后，挂在蛇上
    @property(cc.Node)
    snakeNode:cc.Node = null;

    //移动速度
    speed: number = 100;

    

    //每节蛇的距离
    snake_node_dis: number = 30;

    //固定刷新时间
    fix_update_time: number = 0.03;

    //记录用了多少时间了，用来对比是否到了固定刷新时间
    fix_time: number = 0;

    theNewNode: cc.Node = null;
    
    //存放每节的位置
    pos_set: cc.Vec2[] = [];

    //每个蛇节点，占多少个位置
    bloack_size_every_snake_mode: number = 0;

   
    // onLoad () {}

    start () {
        this.joyScript = this.joyNode.getComponent("joysticks");
        //从蛇尾到蛇头的距离
        let total_dis = this.snake_node_dis * (this.node.childrenCount - 1);



        //每次update 蠕动的距离
        let block = this.fix_update_time * this.speed;

        //所有蛇占多少个 bloack
        let bloackSize = Math.ceil(total_dis/block) + 1;
        for (let i=0; i < bloackSize; i++){
            this.pos_set.push(cc.v2(0 + i*block, 0));
        }

        //每节蛇占多少个block
        this.bloack_size_every_snake_mode = Math.floor(this.snake_node_dis/block);
        for (let i=0; i < this.node.childrenCount; i++){
            this.node.children[i].setPosition(this.pos_set[i*this.bloack_size_every_snake_mode])
        }
        
        this.spwanNewNode();
        


    }

    fix_update(dt){
        if (this.joyScript.dir == -1){
            return;
        } 
        //cc.log("1111");
        let s = dt * this.speed;
        let head = this.node.children[0];
        head.x += s * Math.cos(this.joyScript.radius);
        head.y += s * Math.sin(this.joyScript.radius);
        //防止走出4周
        const edge_left_right = this.node.parent.width/2
        if (head.x < -edge_left_right){
            head.x = -edge_left_right;
        }
        if (head.x > edge_left_right){
            head.x = edge_left_right;
        }
        const edge_up_down = this.node.parent.height/2
        if (head.y > edge_up_down){
            head.y = edge_up_down;
        }
        if (head.y < -edge_up_down){
            head.y = -edge_up_down;
        }
        
        //蛇头位置放内 位置数组，后面蛇身跟着
        this.pos_set.unshift(head.getPosition());

        // let angle = this.joyScript.radius * 180/Math.PI;
        // head.angle = 360 - angle;

        if (this.theNewNode){
            let headPos = head.getPosition();
            let thePos = this.theNewNode.getPosition()
            let dis = headPos.sub(thePos).mag();
            cc.log(dis);
            if (dis < this.snake_node_dis){
                this.theNewNode.parent = this.node;
                this.theNewNode.setPosition((this.node.childrenCount-1)*this.bloack_size_every_snake_mode);
                this.theNewNode = null;
                this.spwanNewNode();
            }
        }

        for (let i=1; i<this.node.childrenCount; i++){
            let item = this.node.children[i];
            item.setPosition(this.pos_set[i*this.bloack_size_every_snake_mode]);
        }
        //
        //this.pos_set 内  多出3个蛇节点的位置，方便后面吃了存放
        if ((this.node.childrenCount + 3)* this.bloack_size_every_snake_mode < this.pos_set.length){
            this.pos_set.pop();
        }
        
    }

    update (dt) {
        this.fix_time += dt;
        if (this.fix_time > this.fix_update_time){
            this.fix_update(this.fix_update_time);
            this.fix_time -= dt;
        }


    }

    spwanNewNode(){
        this.theNewNode = cc.instantiate(this.snakeNode);
        this.theNewNode.color = cc.color(this.getRandomInt(100, 255), this.getRandomInt(1, 255), this.getRandomInt(1, 255));
        this.theNewNode.parent = this.node.parent;

        this.theNewNode.setPosition(this.getRandomInt(-this.node.parent.width/2 + 10, this.node.parent.width/2 - 10), 
        this.getRandomInt(-this.node.parent.height/2 + 10, this.node.parent.height/2 - 10));
    
    }

    /**范围内获取整数随机数*/ 
     getRandomInt(min: number, max: number): number {  
        var Range = max - min;  
        var Rand = Math.random();  
        return(min + Math.round(Rand * Range));  
    }
}
