/**
 * Created by Bridge on 2017/7/31.
 *
 * author: Bridge
 * function: H5 Games——Mine
 * start_data: 2017/7/31
 * end_data: 2017
 */

var Mine = function (ele, faceele, panewidth, paneheight, minenum, tagele, timeele) {
    this.PANE_SIZE  = 16; //每个格子的像素(px)
    this.paneheight = paneheight;  //格子的行数
    this.panewidth  = panewidth;  //格子的列数
    this.minenum    = minenum;  //雷的数量
    this.tagele = tagele;
    this.timeele =timeele;
    this.ele = document.getElementById(ele);
    this.ctx = this.ele.getContext('2d');
    this.faeele = document.getElementById(faceele);

};


//JavaScript数组对比的问题
Mine.prototype = {
    init:function () {
        //画格子

        this.ele.width = this.PANE_SIZE * panewidth;
        this.ele.heigth = this.PANE_SIZE * paneheight;

        this.faeele.src = "res/face_normal.bmp";
        this.oldPos = [0,0];//鼠标上一个停留的位置，默认值，用于处理hover事件。
        this.cellArr  = [];//用于保存格子是不是雷，当前是否有标记。
        this.mineArr = [];  //地雷位置数组

        this.time = 0;
        this.notTag = this.minenum;
        this.numToImage(this.notTag,this.tagele);
        this.numToImage(this.time,this.timeele);


        this.mousedownArr = '';
        this.createCells(); //初始化cellArr数组，并且给涂上颜色。
        this.inited = false;
        clearInterval(this.time);

        //绑定事件
        this.onmousemove(); //鼠标在上面移动，触发每个格子。
        this.onmouseout();  //鼠标移出Canvas事件
        this.onmousedown();
        this.onclick();  //点击方格事件
        this.preRightMenu();  //阻止鼠标右键点击
    },
    onmousemove:function () {
        var that = this;  //传入this对象
        var pos = that.getCellPos(getEventPosition);
        var oldPos = that.oldPos;
        var cellArr = that.cellArr;

        //比较两个数组相等
        if (pos.toString() == oldPos.toString()){
            //当前位置等于上一个位置，return
            return;
        }
        if (that.checkCell(oldPos)&&cellArr[oldPos[0]][oldPos[1]].isOpened == false && cellArr[oldPos[0]][oldPos[1]].tag == 0){
            that.oldPos = pos;
            return;
        }
        that.drawCell(pos,2);
        that.oldPos = pos;
    },
    onclick:function () {
        var that = this;
        this.ele.onmouseup = function (e) {  //点击事件
            var pos = that.getCellpos(getEventPosition(e));
            if (that.inited == false){

                this.createMines(pos); //第一次点击的时候生成雷，并且开始计时
                that.timer = setInterval(function () {
                    that.time = that.time + 1;
                    that.numToIamge(that.time,that.timeele);
                },1000);
                that.inited = true;
            }
            if (!e){e=window.event;}
            that.triggerClick(pos,e);
        }

    },
    onmousedown:function () {
        var that = this;

        this.ele.onmousedown = function (e) {

            var pos = that.getCellPos(getEventPosition(e));
            if (!e){e = window.event;}
            var theCell = that.cellArr[pos[0]][pos[1]];
            if (theCell.isOpened == true){
                var aroundMineNum = that.calAround(pos); //周围有几个雷
                var unKnownArr = that.getAroundunknown(pos);  //周边有几个雷未打开
                var tagNum = that.getAroundTag(pos);   //获取标记了的数量

                if (aroundMineNum != tagNum){  //标记的数量等于周围雷的数量，则直接点击周围的雷
                    for(var t = 0, uLen = unKnownArr.length;t<uLen;t++){
                        that.drawNum(unKnownArr[t],0);
                    }
                    that.mousedownArr = unKnownArr;
                }
            }

        }
    },
    triggerClick:function (pos,e) {
        var theCell = this.cellArr[pos[0]][pso[1]];
        if (theCell.isOpened == true){
            ////已经打开过的，周边操作。2.如果是经真正事件操作到达这里的。则进行周边操作。否则return
            if (e){
                var aroundMineNum = this.calAround(pos);//周边有几个雷。
                var unknownArr = this.getAroundUnknown(pos);//周边有几个未打开的。
                var tagNum = this.getAroundTag(pos);//获取标记了的数量。

            }
            if (aroundMineNum == tagNum){//标记的数量等于周围雷的数量，则可以直接点击周围的格子。
                for(var t=0,uLen = unknownArr.length;t<uLen;t++){
                    this.triggerClick(unknownArr[t]);
                }
            }else{
                var mousedownArr = this.mousedownArr;
                if(mousedownArr != ""){

                    for(var m = 0,mLen = mousedownArr.length; m < mLen; m++ ){
                        this.drawCell(mousedownArr[m],1);
                    }
                }
                this.mousedownArr = "";

            }
        }
        return;
    }
    // var tag = theCell.tag;
};

