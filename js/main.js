(()=>{
    'use strict'
    let cas = document.getElementById('cas'),
        ctx = cas.getContext('2d');
    const PI = Math.PI;
    const CW = cas.width;
    const CH = cas.height;

    let lastTime,
        deltaTime,
        mouseX,
        mouseY,
        bigBox,
        boxImg;

    let bigBoxObj = function () {
        this.width;
        this.height;
        this.left;
        this.top;
        this.topStart;
        this.rootX = [];//列表盒子数组
        this.rootY = [];//列表盒子数组
        
    }
    function getWidth(num){
        return (CW / num / 3 * 2);
    }
    function getHeight(num){
        return CH - getWidth(num);
    }
    bigBoxObj.prototype.init = function () {
        this.width = getWidth(this.num)//获得盒子宽度
        this.height = getHeight(this.num);//获取盒子高度
        this.top =  CH - CW/this.num;
        this.topStart = 0;
        // 均匀分配每个盒子的位置
        for(let i=0; i < this.num; i++){
            this.rootX[i] = CW/this.num * i + this.width/6;
            if( i % 2 == 0 )
                this.rootY[i] = this.width - this.height;
            else
                this.rootY[i] = this.height;
        }
    }
    bigBoxObj.prototype.draw = function () {
        ctx.save();
        // ctx.strokeStyle = "#3b154e";
        // ctx.globalAlpha = 0.6;
        // ctx.lineCap = "round";
            
        for(let i=0; i < this.num; i++){
            if( mouseX>0 || mouseY>0 ){
                this.topStart = lerpDistance(this.top,this.topStart,0.99);
                // if(Math.abs(this.topStart) == Math.abs(this.top*bigBoxFilter(i))){
                //     console.log(1);
                //     this.topStart = this.top * bigBoxFilter(i);
                //     ctx.translate( 20, 0);
                // }
                ctx.translate( 0, this.topStart*bigBoxFilter(i));
            }else{
                this.topStart = lerpDistance( 0, this.topStart, 0.99);
                ctx.translate( 0, this.topStart*bigBoxFilter(i));
            }
            ctx.beginPath();
            ctx.moveTo(this.rootX[i], this.rootY[i]);
            ctx.lineTo(this.rootX[i] + this.width, this.rootY[i]);
            ctx.lineTo(this.rootX[i] + this.width, this.rootY[i] + this.height);
            ctx.lineTo(this.rootX[i], this.rootY[i] + this.height);
            ctx.lineTo(this.rootX[i], this.rootY[i]);
            ctx.stroke();
        }
        ctx.restore();
    }
    bigBoxObj.prototype.num = 5;

    let boxImgObj = function () {
        this.r;
        this.top = 0;
        this.x = [];//初始化距离左侧坐标X
        this.y = [];//初始化距离顶部坐标y
        this.img = [];
        this.padding;
        this.textX;
        this.textY;
        this.textSize;
        this.textStyle;
    }
    boxImgObj.prototype.init = function () {
        this.padding = 9;
        this.r = getWidth(this.num)/2-this.padding;
        this.top = CW/this.num - this.r*2;
        this.textX=0;
        this.textY = CH -CW/this.num;
        this.textSize = 40;
        this.textStyle = '#000';
        for(let i = 0; i < this.num; i++){
            this.y[i] = i%2==0 ? this.padding : getHeight(this.num)+this.padding;
            this.x[i] = CW/this.num * i + this.r/3 + this.padding
            this.img[i] = new Image();
            this.img[i].src = '../3821.jpg';
        }
    }
    boxImgObj.prototype.draw = function () {
        // console.log(deltaTime);
        for(let i = 0; i < this.num; i++){
            this.textX = this.x[i] + this.r;
            ctx.save();
            if( mouseX>0 || mouseY>0 ){
                this.textStyle = rgbNum(i/this.num,i/this.num,i/this.num)+',1)';
                this.y[i] = lerpDistance(this.top,this.y[i],0.9);
            }else{
                this.textStyle = 'rgba(0,0,0,0)';
                if(i%2==0){
                    this.y[i] = lerpDistance(this.padding,this.y[i],0.9);
                }else{
                    this.y[i] = lerpDistance(getHeight(this.num)+this.padding,this.y[i],0.9);
                }
            }
            ctx.beginPath();
            // 直接使用 `arc` 接口
            ctx.arc( this.x[i] + this.r, this.y[i] + this.r, this.r, 0, 2 * PI);
            // 从画布上裁剪出这个圆形
            ctx.clip();
            ctx.drawImage(this.img[i], (this.x[i]), (this.y[i]),this.r*2,this.r*2);
            ctx.restore();
            ctx.font = this.textSize + 'px Arial';
            ctx.fillStyle=this.textStyle;
            ctx.fillText(i+1, this.textX-this.textSize/4, this.textY);
        }
    }
    boxImgObj.prototype.num = 5;

    function init(){
        // 创建盒子bigbox
        bigBox = new bigBoxObj();
        //初始化盒子
        bigBox.init();
        // 创建盒子内容
        boxImg = new boxImgObj();
        //初始化盒子内容
        boxImg.init();
        systemLoop();
        cas.addEventListener('mousemove',onMouseMove,false);
        cas.addEventListener('mouseleave', onMouseLeave,false);
    }
    function systemLoop(){
        //创建定时器调用 systemLoop
        requestAnimFrame(systemLoop);
        //两帧之间时间差
        let now = Date.now();
        deltaTime = now - lastTime;
        lastTime = now;
        if(deltaTime > 40)
            deltaTime = 40;
        
        //初始化画布
        ctx.clearRect( 0, 0, CW, CH);
        //绘制列表个盒子
        bigBox.draw();
        //绘制盒子内容
        boxImg.draw();
    }
    function systemctlStart(){
        // 初始化
        init();
        lastTime = Date.now();
        deltaTime = 0;
    }
    //获取鼠标位置
    function onMouseMove(e){
        if( e.offsetX || e.layerX ){
            mouseX = e.offsetX == undefined ? e.layerX : e.offsetX;
        }
        if( e.offsetY || e.layerY ){
            mouseY = e.offsetY == undefined ? e.layerY : e.offsetY;
        }
    }
    function onMouseLeave(e){
        mouseX = 0;
        mouseY = 0;
    }
    function nPow(p,n){
        if(!n > 0)return 1;
        for(let i = 0; i< n; i++){
            p = p * p;
        }
        return p;
    }
    function bigBoxFilter(index){
        if(index == 0){
            index = 1;
        }else if(index%2 == 0){
            index = 2;
        }else if(index%2 != 0){
            index = -2;
        }
        return index;
    }


    //页面加载完毕后调用此函数
    document.body.onload = systemctlStart;
})()