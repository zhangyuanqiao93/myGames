/**
 * Created by Bridge on 2017/7/31.
 *
 * author: Bridge
 * function: H5 Games——Mine
 * start_data: 2017/7/31
 * end_data: 2017
 */

var Mine = function (ele, faceele, panewidth, paneheight, minenum, tagele, timeele) {
    this.PANE_SIZE = 16; //每个格子的像素(px)
    this.paneheight = paneheight;  //格子的行数
    this.panewidth = panewidth;  //格子的列数
    this.minenum = minenum;  //雷的数量
    this.tagele = tagele;
    this.timeele = timeele;
    this.ele = document.getElementById(ele);
    this.ctx = this.ele.getContext('2d');
    this.faeele = document.getElementById(faceele);

};


//JavaScript数组对比的问题
Mine.prototype = {
    init: function () {
        //画格子

        this.ele.width = this.PANE_SIZE * panewidth;
        this.ele.heigth = this.PANE_SIZE * paneheight;

        this.faeele.src = "res/face_normal.bmp";
        this.oldPos = [0, 0];//鼠标上一个停留的位置，默认值，用于处理hover事件。
        this.cellArr = [];//用于保存格子是不是雷，当前是否有标记。
        this.mineArr = [];  //地雷位置数组

        this.time = 0;
        this.notTag = this.minenum;
        this.numToImage(this.notTag, this.tagele);
        this.numToImage(this.time, this.timeele);


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
    onmousemove: function () {
        var that = this;  //传入this对象
        var pos = that.getCellPos(getEventPosition);
        var oldPos = that.oldPos;
        var cellArr = that.cellArr;

        //比较两个数组相等
        if (pos.toString() == oldPos.toString()) {
            //当前位置等于上一个位置，return
            return;
        }
        if (that.checkCell(oldPos) && cellArr[oldPos[0]][oldPos[1]].isOpened == false && cellArr[oldPos[0]][oldPos[1]].tag == 0) {
            that.oldPos = pos;
            return;
        }
        that.drawCell(pos, 2);
        that.oldPos = pos;
    },
    onclick: function () {
        var that = this;
        this.ele.onmouseup = function (e) {  //点击事件
            var pos = that.getCellpos(getEventPosition(e));
            if (that.inited == false) {

                this.createMines(pos); //第一次点击的时候生成雷，并且开始计时
                that.timer = setInterval(function () {
                    that.time = that.time + 1;
                    that.numToIamge(that.time, that.timeele);
                }, 1000);
                that.inited = true;
            }
            if (!e) {
                e = window.event;
            }
            that.triggerClick(pos, e);
        }

    },
    onmousedown: function () {
        var that = this;

        this.ele.onmousedown = function (e) {

            var pos = that.getCellPos(getEventPosition(e));
            if (!e) {
                e = window.event;
            }
            var theCell = that.cellArr[pos[0]][pos[1]];
            if (theCell.isOpened == true) {
                var aroundMineNum = that.calAround(pos); //周围有几个雷
                var unKnownArr = that.getAroundunknown(pos);  //周边有几个雷未打开
                var tagNum = that.getAroundTag(pos);   //获取标记了的数量

                if (aroundMineNum != tagNum) {  //标记的数量等于周围雷的数量，则直接点击周围的雷
                    for (var t = 0, uLen = unKnownArr.length; t < uLen; t++) {
                        that.drawNum(unKnownArr[t], 0);
                    }
                    that.mousedownArr = unKnownArr;
                }
            }

        }
    },
    triggerClick: function (pos, e) {
        var theCell = this.cellArr[pos[0]][pso[1]];
        if (theCell.isOpened == true) {
            ////已经打开过的，周边操作。2.如果是经真正事件操作到达这里的。则进行周边操作。否则return
            if (e) {
                var aroundMineNum = this.calAround(pos);//周边有几个雷。
                var unknownArr = this.getAroundUnknown(pos);//周边有几个未打开的。
                var tagNum = this.getAroundTag(pos);//获取标记了的数量。

                if (aroundMineNum == tagNum) {//标记的数量等于周围雷的数量，则可以直接点击周围的格子。
                    for (var t = 0, uLen = unknownArr.length; t < uLen; t++) {
                        this.triggerClick(unknownArr[t]);
                    }
                } else {
                    var mousedownArr = this.mousedownArr;
                    if (mousedownArr != "") {

                        for (var m = 0, mLen = mousedownArr.length; m < mLen; m++) {
                            this.drawCell(mousedownArr[m], 1);
                        }
                    }
                    this.mousedownArr = "";
                }
            }
            return;
        }
        var tag = theCell.tag;
        if (e && e.button == 2){//右键标记雷

            if(tag == 0){

             this.drawCell(pos,3);
             theCell.tag = 1;
             this.notTag --;
             this.numToImage(this.notTag,this.tagele);
            }else if (tag == 1){
                this.drawCell(pos,4)
                theCell.tag == 22;
                this.notTag ++;
                this.numToIamge(this.notTaged,this.tagele);
            }else if(tag == 2){
                this.drawCell(pos,1);
                theCell.tag = 0;
            }
            return;
        }
        if (tag != 0){
            return;
        }
        /**
         * Description： 如果是点击到雷，游戏结束
         * Date: 2017/08/03
         */
        //如果鼠标点击是雷就算输，结束本次游戏。
        if (theCell.isMime == true){
            this.faceele.src = "res/face_fail.bmp";
            this.showMine;
            this.drawCell(pos,6);//点点中的雷
            // this.drawCell(pos,6);
            this.showWrongTag(); //将标记错误的显示出来
            this.ele.onmouseup ='';
            this.ele.onmousedown ='';
            this.ele.onmousemove ='';
            clearInterval(this.timer);

        }else{//不是雷，显示周边有几个雷
            this.drawNum(pos,0);
            var aroundMineNum = this.calAround(pos); //求数量

            if (aroundMineNum != 0){
                this.drawNum(pos,aroundMineNum);  //求绘制不同颜色的数字

            }else{ //如果等于0，计算周边
                var zeroArr = [];
                zeroArr.push(pos);
                zeroArr = this.calZeroArr(pos,zeroArr);  //获取所有的周边雷为0的。
                //将周边雷为0的周边的打开。
                this.openZeroArr(zeroArr);
            }
        }
        theCell.isOpened = true;
        //验证是否win.

        var okNum = this.panewidth * this.paneheight-this.minenum;
        var openNum = 0 ;
        for(var i=1;i<=this.panewidth;i++){

            for (var j = 1; j <= this.paneheight; j++) {
                if(this.cellArr[i][j].isOpened == true){
                    openNum ++;
                }
            }
        }

        if(openNum == okNum){
            this.faceele.src = "res/face_success.bmp";
            alert("you win!");
            clearInterval(this.timer);
            this.ele.onmouseup = '';
            this.ele.onmousedown = '';
            this.ele.onmousemove = '';
        }

    },
    getAroundUnknown:function (pos) {//计算周边有几个雷
        
            var unKownArr = [];
            var cellArr = this.cellArr;
             //-1,-1;-1,0;-1,+1;0,-1;0,+1,+1,-1;+1,0;+1,+1
            var arroundArr = [
                [pos[0]-1,pos[1]-1],[pos[0]-1,pos[1]],
                [pos[0]-1,pos[1]+1],[pos[0],pos[1]-1],
                [pos[0],pos[1]+1],[pos[0]+1,pos[1]-1],
                [pos[0]+1,pos[1]],[pos[0]+1,pos[1]+1]];
        // var aroundUnknownNum = 0;
        for(let i = 0;i< arroundArr.length;i++){
            if (this.checkCell(arroundArr[i]) && cellArr[arroundArr[i][0]][arroundArr[i][1]].tag==0 &&
                cellArr[arroundArr[i][0]][arroundArr[i][1]].isOpened ==false){
                unKownArr.push(arroundArr[i]);
            }
        }
        return unKownArr;
    },
    getArountTag:function (pos) {
        var cellArr = this.cellArr;
        // -1,-1;-1,0;-1,+1;0,-1;0+1;+1,-1;+1,0;+1,+1;
        var aroundArr = [[pos[0]-1,pos[1]-1],[pos[0]-1,pos[1]],[pos[0]-1,pos[1]+1],[pos[0],pos[1]-1],[pos[0],pos[1]+1],[pos[0]+1,pos[1]-1],[pos[0]+1,pos[1]],[pos[0]+1,pos[1]+1]];
        var tagNum = 0;
        for(let i = 0;i<aroundArr.length;i++){
            if (this.checkCell(aroundArr[i]) && cellArr[aroundArr[i][0]][aroundArr[i][1]].tag == 1){
                tagNum++;
            }
        }
        return tagNum;
    },
    onmouseout:function () {
        var that = this;
        this.ele.onmouseout = function (e) {
            var pos = that.oldPos;
            if (that.checkCell(pos) && (that.cellArr[pos[0]][pos[1]].isOpened == true ||
                that.cellArr[pos[0]][pos[1]].tag != 0)) {
                return;
            }
            that.drawCell(pos, 1);
            pos = [0, 0];

        }
    },
    /**
     * 初始化每个格子的状态
     */
    createCells:function () {
        var paneheight = this.paneheight;
        var panewidth = this.panewidth;
        for(let i= 1; i<= panewidth.length;i++){
            this.cellArr[i] = [];
            for (let j = 1;j<= paneheight;j++){
                this.cellArr[i][j]= {
                    isMine: false,
                    isOpened:false,
                    tag:0
                };
                this.drawCell([i,j],1);
            }

        }

    },
    /**
     * 点击雷，show Mine,引爆所有雷
     */
    showMine:function () {
        var mineArr = this.mineArr;
        var pos='';
        var area;
        for (let i = 0; i < mineArr.length; i++) {
            pos = mineArr[i];
            this.drawCell(pos,5);
            this.cellArr[pos[0]][pos[1]].isOpened = true;//让所有雷变成已打开。
        }
    },
    /**
     * 将标记错误的显示出来
     */
    showWrongTag:function () {
        var  paneheight = 	this.paneheight;
        var  panewidth = this.panewidth;

        for(let i=1;i<=panewidth;i++){
            for (let j = 1; j <= paneheight; j++) {
                if(this.cellArr[i][j].isMine == false && this.cellArr[i][j].tag == 1){
                    this.drawCell([i,j],7);
                }
            }
        }
    },
    /**
     * 计算周边有几个雷
     * @param pos
     * @returns {number}
     */
    calAround:function(pos){//计算周边一共有几个雷
        var cellArr = this.cellArr;
        var aroundArr = [[pos[0]-1,pos[1]-1],[pos[0]-1,pos[1]],[pos[0]-1,pos[1]+1],[pos[0],pos[1]-1],[pos[0],pos[1]+1],[pos[0]+1,pos[1]-1],[pos[0]+1,pos[1]],[pos[0]+1,pos[1]+1]];
        var aroundMineNum = 0;
        for (let i = 0; i < aroundArr.length; i++) {
            aroundMineNum += this.checkMine(aroundArr[i]);
        }
        return aroundMineNum;
    },
    openZero:function(pos){//显示一个周边雷数量为0的格子周边8个格子包含几个雷。
        var cellArr = this.cellArr;
        var aroundArr = [[pos[0]-1,pos[1]-1],[pos[0]-1,pos[1]],[pos[0]-1,pos[1]+1],[pos[0],pos[1]-1],[pos[0],pos[1]+1],[pos[0]+1,pos[1]-1],[pos[0]+1,pos[1]],[pos[0]+1,pos[1]+1]];
        var aroundMineNum = 0;
        for (var i = 0; i < aroundArr.length; i++) {
            if(this.checkCell(aroundArr[i])){
                cellArr[aroundArr[i][0]][aroundArr[i][1]].isOpened = true;
                aroundMineNum = this.calAround(aroundArr[i]);//附近雷的数量
                this.drawNum(aroundArr[i],aroundMineNum);
            }

        }

    },
    drawCell:function(pos,type){//绘制不同种类的格子。
        var area =  this.getCellArea(pos);
        var cxt = this.cxt;
        var image = new Image();
        var src;
        var srcArr = ["res/blank.bmp","res/0.bmp","res/flag.bmp","res/ask.bmp","res/mine.bmp","res/blood.bmp","res/error.bmp"];
        //1正常格 2mouseover格子 3旗子格 4问号格 5正常雷格 6点中雷格 7.错误标记
        var index  = type -1;
        image.src =srcArr[index];
        image.onload = function(){
            cxt.drawImage(image,area[0],area[1],16,16);
        }
    },
    drawNum:function(pos,num){//绘制数字
        var area =  this.getCellArea(pos);
        var cxt = this.cxt;
        var image = new Image();
        image.src = "res/"+num+".bmp";
        image.onload = function(){
            cxt.drawImage(image,area[0],area[1],16,16);
        }
    },
    checkCell:function(pos){//检测位置有效性。
        return this.cellArr[pos[0]] && this.cellArr[pos[0]][pos[1]] ;
    },
    createMines:function(pos){	//生成雷的位置。保存到一个数组[[2,3],[4,6]];

        var minenum = this.minenum;
        var mineArr = this.mineArr;
        var mineItem='';
        var cellArr = this.cellArr;

        for (var i = 0; i < minenum; i++) {
            //如果生成的重复了就重新生成。
            do{
                mineItem = [getRandom(this.panewidth),getRandom(this.paneheight)];
            }while(in_array(mineItem,mineArr)||pos.toString()== mineItem.toString());
            cellArr[mineItem[0]][mineItem[1]].isMine = true;
            mineArr.push(mineItem);
        };

    },
    checkMine:function(pos){//返回该位置是不是雷。
        var cellArr = this.cellArr;
        if(this.checkCell(pos) && cellArr[pos[0]][pos[1]].isMine == true){
            return  true;
        }
        return false;
    },
    getCellArea:function(pos){//根据格子坐标返回一个格子左上角的像素坐标[32,666];
        return [(pos[0]-1)*this.PANE_SIZE+1,(pos[1]-1)*this.PANE_SIZE+1];
    },
    getCellPos:function(coordinate){//根据像素坐标返回格子坐标。[3,5];
        return [Math.ceil(coordinate.x/this.PANE_SIZE),Math.ceil(coordinate.y/this.PANE_SIZE)];
    },
    preRightMenu:function(){//阻止右键菜单
        this.ele.oncontextmenu=function(event) {
            if (document.all) window.event.returnValue = false;// for IE
            else event.preventDefault();
        }
    },numToImage:function (num,ele){
        if(num>999){
            num = 999;
        }else if(num<0){
            //noinspection JSAnnotator
            num = 000;
        }else if(num<10){
            num = "00"+num;
        }	else if(num< 100){
            num = "0"+num;
        }
        var ele = document.getElementsByClassName(ele)[0].getElementsByTagName('img');

        for (var i = 0,eLen=ele.length; i < eLen; i++) {
            ele[i].src="res/d"+num.toString().charAt(i)+".bmp";
        };
    }
};


/**
 * 获取坐标：解决canvas在高分屏缩放150%之后坐标计算不准确的问题。
 * https://github.com/zbinlin/blog/blob/master/getting-mouse-position-in-canvas.md
 * @param evt
 * @returns {{x: (number|Number), y: (number|Number)}}
 */
function getEventPosition(evt){
    var x, y;
    var x = evt.clientX;
    var y = evt.clientY;
    var rect =  document.getElementById('mine1').getBoundingClientRect();
    x -= rect.left;
    y -= rect.top;
    return {x: x, y: y};
}

//生成随机正整数
function getRandom(n){
    return Math.floor(Math.random()*n+1)
}

//判断一个数组是否在另一个数组中。
function in_array(stringToSearch, arrayToSearch) {
    for (s = 0; s < arrayToSearch.length; s++) {
        thisEntry = arrayToSearch[s].toString();
        if (thisEntry == stringToSearch.toString()) {
            return true;
        }
    }
    return false;
}


