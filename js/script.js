var context;
var canvas;
var sizeCell = 60;
var arrSimbol = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',];
var arrNameFigure = ['king','queen','rook','bishop','knight','pawn'];
var modeGame = 0;
var imageLoad = false;
var imageFigures = null;
var arrFigure = [];
var  x = 20;
var  y = 20;
var ofsX = 20;
var ofsY = 20;
var xSetFigure = ofsX;
var ySetFigure = sizeCell * 8 + ofsY;
var arrFigureRand = [];
var FigureRand = {
    xCell:null,
    yCell:null,
    numFigure:null,
}
var Figure = {
    name:null,
    color:null,
    xSp:0,
    ySp:0,
    spWidth:0,
    spHeight:0,

}
var bufferFigure = {
    using:false,
    //xStartMove: null,
    //yStartMove: null,
    fromBoard: false,
    x:null,
    y:null,
    numFigure:null,
};
var board = 
    [
        [15, 15, 15, 15, 15, 15, 15, 15],
        [15, 15, 15, 15, 15, 15, 15, 15], 
        [15, 15, 15, 15, 15, 15, 15, 15],
        [15, 15, 15, 15, 15, 15, 15, 15], 
        [15, 15, 15, 15, 15, 15, 15, 15],
        [15, 15, 15, 15, 15, 15, 15, 15], 
        [15, 15, 15, 15, 15, 15, 15, 15],
        [15, 15, 15, 15, 15, 15, 15, 15],

    ];
var button = {
    x: ofsX+sizeCell * 6+15,
    y: ofsY+sizeCell * 8+15,
    width:100,
    height: 30,
    text: 'Проверить',
    fontSize: 15,
}
window.addEventListener('load', function () {
    init();
});
function init()
{
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    imageFigures = new Image();
    imageFigures.src = 'img/setFigures3.png';
    let timeNow=new Date().getTime()
    srand(timeNow);
    imageFigures.onload = function () {
        imageLoad = true;
    }
    initKeyboardAndMouse();
    imageFigures.onerror = function () {
        alert("во время загрузки произошла ошибка");
        //alert(pair[0].name);

    }
    initFigure();
    setInterval(drawAll, 16);
    setInterval(update, 16);
}
function drawAll() 
{
    context.fillStyle = 'rgb(210,210,210)';
    context.fillRect(0, 0, canvas.width, canvas.height);// очистка экрана
    drawChessBoard();
    //let y = sizeCell * 8 + ofsY;
    for (let i = 0; i < arrFigure.length; i++) 
    {
        if (arrFigure[i].color == 0) {
            drawFigure(arrFigure[i].name, arrFigure[i].color, ofsX + sizeCell * i, ySetFigure);
        }
        else
        {
            drawFigure(arrFigure[i].name, arrFigure[i].color, ofsX + sizeCell * (i % arrNameFigure.length), ySetFigure + sizeCell);
        }
    }
    for (let i = 0; i < 8;i++)
    {
        for (let j = 0; j < 8; j++) 
        {
            if (board[i][j] >= 0 && board[i][j] <= arrFigure.length)
            {
                n = board[i][j];
                drawFigure(arrFigure[n].name, arrFigure[n].color, ofsX + sizeCell * i, ofsY+sizeCell*j);
            }
        }
    }
    if (bufferFigure.using==true)
    {
        let n = bufferFigure.numFigure;
        drawFigure(arrFigure[n].name, arrFigure[n].color, bufferFigure.x,bufferFigure.y);
    }
    drawButton(button);
}
function drawChessBoard()
{
  
    context.fillStyle = "green";
    for (let i = 0; i < 8; i++)
    {
        for (let j = 0; j < 8; j++) 
        {
            if (i % 2 == 0 ) 
            {
                context.fillStyle = j%2==0?"rgb(240,217,181)":"rgb(181,136,99)";
            }
            else 
            {
                context.fillStyle = j % 2 != 0 ? "rgb(240,217,181)" : "rgb(181,136,99)";
            }
           
            
            context.fillRect(x + i * sizeCell, y + j * sizeCell, sizeCell, sizeCell);
        }
    }
    context.fillStyle = 'rgb(0,0,0)';
    context.font = '12px Arial';
    for (let i = 0; i < 8;i++)
    {
        
        context.fillText(arrSimbol[i],x+sizeCell/2+i*sizeCell,y-5)
    }
    for (let i = 0; i <8; i++) 
    {

        context.fillText(8 - i + '', x + 5 + sizeCell * 8, y + sizeCell / 2 + i * sizeCell);
    }
}
function drawFigure(name,color,x,y)
{
    for (let i = 0; i < arrFigure.length; i++) 
    {
        if (color == arrFigure[i].color && name == arrFigure[i].name) 
        {
            context.drawImage(imageFigures, arrFigure[i].xSp, arrFigure[i].ySp, arrFigure[i].spWidth, arrFigure[i].spHeight, x, y, sizeCell, sizeCell);
        }
    }
}
function drawButton(obj)
{
    context.strokeStyle='rgb(0,0,255)';
    context.fillStyle='rgb(255,128,0)';
    context.strokeRect(obj.x,obj.y,obj.width,obj.height);
    let heightText=obj.fontSize;
    context.beginPath();
    context.font = obj.fontSize+'px Arial';
    let text=obj.text;
    let metrics = context.measureText(text);
    
    let x=obj.x;
    let y=obj.y;
    let width=obj.width;
   // context.strokeRect(this.widthTab*i,this.y,this.widthTab,20);
    context.fillText(text,x+width/2-metrics.width/2,y+obj.height/2+obj.fontSize/3);
    context.closePath()
                      
}
function moveFigures()
{
    let numFigure = null;
    if (checkMouseLeft()==true)
    {
        for (let i = 0; i < arrFigure.length;i++)
        {
            if (mouseX > ofsX + sizeCell * (i % (arrFigure.length/2)) && mouseX < ofsX + sizeCell * ((i % (arrFigure.length/2)) + 1))
            {
                if (i < (arrFigure.length / 2)) 
                {
                    if ( mouseY > ySetFigure && mouseY < ySetFigure + sizeCell) 
                    {
                        numFigure = i;
                    }
                }
                else
                {
                    if (mouseY > ySetFigure + sizeCell && mouseY < ySetFigure + sizeCell*2) 
                    {
                        numFigure = i;
                    }
                }
            }
        }
        if (numFigure != null) bufferFigure.fromBoard = false;
        let xCellBoard;//= Math.trunc((mouseX - ofsX) / sizeCell);
        let yCellBoard;//= Math.trunc((mouseY - ofsY) / sizeCell);
        if (bufferFigure.using == false)
        if (mouseX > ofsX && mouseX < ofsX + sizeCell * 8 && mouseY > ofsY && mouseY < ofsY + sizeCell * 8) 
        {
            xCellBoard = Math.trunc((mouseX - ofsX) / sizeCell);
            yCellBoard = Math.trunc((mouseY - ofsY) / sizeCell);
            if (board[xCellBoard][yCellBoard] >= 0 && board[xCellBoard][yCellBoard] <= arrFigure.length)
            {
            
            
                if (mouseX > ofsX + xCellBoard * sizeCell && mouseX < ofsX + xCellBoard * sizeCell + sizeCell &&
                    mouseY > ofsY + yCellBoard * sizeCell && mouseY < ofsY + yCellBoard * sizeCell + sizeCell) 
                {
                    numFigure = board[xCellBoard][yCellBoard];
                    board[xCellBoard][yCellBoard] = 15;
                   // bufferFigure.using = true;
                    bufferFigure.fromBoard = true;
                }
            }
            console.log(xCellBoard + ' ' + yCellBoard);
        }
        
        if (numFigure!=null && bufferFigure.using==false  )
        {
            if (bufferFigure.fromBoard == false) 
            {
                bufferFigure.using = true;
                bufferFigure.x = ofsX + sizeCell * numFigure;
                if (numFigure < arrFigure.length / 2) {
                    bufferFigure.y = ySetFigure;
                }
                else {
                    bufferFigure.y = ySetFigure + sizeCell;
                }
                bufferFigure.numFigure = numFigure;
            }
            else
            {
                bufferFigure.using = true;
                bufferFigure.x = ofsX + sizeCell * xCellBoard;
                bufferFigure.y = ofsY + sizeCell * yCellBoard;
                bufferFigure.numFigure = numFigure;
            }
            //bufferFigure.xStartMove = bufferFigure.x - sizeCell +100;//mouseX;
            //bufferFigure.yStartMove = bufferFigure.y - sizeCell+100;//mouseY;
        }
        if (bufferFigure.using==true)
        {
            //bufferFigure.x = bufferFigure.xStartMove + (mouseX - bufferFigure.xStartMove);
            //bufferFigure.y = bufferFigure.yStartMove + (mouseY - bufferFigure.yStartMove);
            bufferFigure.x = mouseX - sizeCell / 2;
            bufferFigure.y = mouseY - sizeCell / 2;
         
        }
    }   
    if (checkMouseLeft() == false && bufferFigure.using == true)
    {
        bufferFigure.using = false;
        if (bufferFigure.x > ofsX && bufferFigure.x < ofsX + sizeCell * 8 &&
            bufferFigure.y > ofsY && bufferFigure.y < ofsY + sizeCell * 8)
        {
            console.log('klcds');
            for (let i = 0; i < 8;i++)
            {
                for (let j = 0; j < 8; j++)
                {
                    if (bufferFigure.x > i * sizeCell && bufferFigure.x <= i * sizeCell+sizeCell &&
                        bufferFigure.y > j * sizeCell && bufferFigure.y <= j * sizeCell + sizeCell)
                    {
                        board[i][j] = bufferFigure.numFigure;
                    }
                }
            }
        }
    }
}
function updateFiguresRand(quantity)
{
    while (arrFigureRand.length>0)
    {
        arrFigureRand.splice(0,1);
    }
    for (let i = 0; i < quantity;i++)
    {
        let figureRandOne = clone(FigureRand);
        figureRandOne.xCell = randomInteger(0,7);
        figureRandOne.yCell = randomInteger(0,7);
        figureRandOne.numFigure = randomInteger(0,11);
        arrFigureRand.push(figureRandOne);
    }

}
function clearBoard()
{
      for (let i = 0; i < 8;i++)
      {
            for (let j = 0; j < 8; j++)
            {
                board[i][j] = 15;
            }
      }
}
function update()
{
    if (modeGame==0)
    {
        updateFiguresRand(5);
        for (let i = 0; i < arrFigureRand.length;i++)
        {
            let xCell = arrFigureRand[i].xCell;
            let yCell = arrFigureRand[i].yCell;
            board[xCell][yCell] = arrFigureRand[i].numFigure;
        }
        modeGame = 1;
    }
    if (modeGame==1)
    {
        if (mouseLeftClick())
        {
            clearBoard();
            modeGame = 2;
        }
    }
    if (modeGame==2)
    {
        moveFigures();
    }
}
function initFigure()
{
    let width = 33.3;
    let dist = 19.75;
    let color = 0;
    for (let i = 0; i <arrNameFigure.length*2;i++)
    {
        if (i > arrNameFigure.length-1) color = 1;
        let figureOne = clone(Figure);
        figureOne.name = arrNameFigure[i % arrNameFigure.length];
        figureOne.color = color;
        figureOne.xSp = 0 + (dist + width) * (i % arrNameFigure.length);
        figureOne.ySp = color == 0 ? 0 : 42;
        figureOne.spWidth = width;
        figureOne.spHeight = width;
        arrFigure.push(figureOne);
        

    }
    console.log(arrFigure);
}

