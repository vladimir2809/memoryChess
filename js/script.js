var context;
var canvas;
var canvasWidth = 1000;
var canvasHeight = 800;
var sizeCell = 60;
var arrSimbol = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',];
var arrNameFigure = ['king','queen','rook','bishop','knight','pawn'];
var modeGame = 0;
var countLoad = 0;
var imageLoad = false;
var imageFigures = null;
var imageLabel = null;
var arrFigure = [];
//var  x = 120;
//var  y = 20;
var ofsX = canvasWidth/2-(sizeCell*8)/2;
var ofsY = 20;
var xSetFigure = ofsX;
var ySetFigure = sizeCell * 8 + ofsY;
var arrFigureRand = [];
var arrCheckFigure = [];
var resultCheck = 0;
var FigureCheck = {
    xCell:null,
    yCell:null,
    result:0,
}
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
    fontSize: 18,
}
var bigText = {
    being:false,
    x:null,
    y:null,
    text:'',
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
    imageLabel = new Image();
    imageLabel.src = 'img/label.png';
    let timeNow=new Date().getTime()
    srand(timeNow);
    imageFigures.onload = function () {
        countLoad++;
        //imageLoad = true;
    }
    initKeyboardAndMouse();
    imageFigures.onerror = function () {
        alert("во время загрузки произошла ошибка");
        //alert(pair[0].name);

    }
    imageLabel.onload = function () {
        if (countLoad==1)  
        {
            imageLoad = true;
            console.log("Загрузка успешна");
        }
    }
    imageFigures.onerror = function () {
        alert("во время загрузки произошла ошибка");
        //alert(pair[0].name);

    }
    initFigure();
    setInterval(drawAll, 16);
    setInterval(update, 16);
}
function drawAll() //нарисовать все
{
    context.fillStyle = 'rgb(210,210,210)';
    context.fillRect(0, 0, canvas.width, canvas.height);// очистка экрана
    drawChessBoard();
    //let y = sizeCell * 8 + ofsY;
    for (let i = 0; i < arrFigure.length; i++) // рисуем набор фигур
    {
        if (arrFigure[i].color == 0) {
            drawFigure(arrFigure[i].name, arrFigure[i].color, ofsX + sizeCell * i, ySetFigure);
        }
        else
        {
            drawFigure(arrFigure[i].name, arrFigure[i].color, ofsX + sizeCell * (i % arrNameFigure.length), ySetFigure + sizeCell);
        }
    }
    for (let i = 0; i < 8;i++)// рисуем фигуры на доске
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
    if (bufferFigure.using==true)// рисуем перемешающию фигуру
    {
        let n = bufferFigure.numFigure;
        drawFigure(arrFigure[n].name, arrFigure[n].color, bufferFigure.x,bufferFigure.y);
    }
    for (let i = 0; i < arrCheckFigure.length;i++)// рисуем метки галочка и крестик при проверке 
    {
        var xCell = arrCheckFigure[i].xCell;
        var yCell = arrCheckFigure[i].yCell;
        if (arrCheckFigure[i].result==1)
        {
            context.drawImage(imageLabel, 0, 0, 40, 40, ofsX+xCell * sizeCell + sizeCell / 2,ofsY+yCell * sizeCell + sizeCell / 2, sizeCell / 2, sizeCell / 2);
        }
        if (arrCheckFigure[i].result==2)
        {
            context.drawImage(imageLabel, 40, 0, 40, 40, ofsX+xCell * sizeCell + sizeCell / 2,ofsY+yCell * sizeCell + sizeCell / 2, sizeCell / 2, sizeCell / 2);
        }
    }
    drawButton(button);// рисуем кнопку
    if (bigText.being==true)// рисуем текс по середине
    {    
        drawTextCenterScreen(bigText.text, 'Arial', 35, resultCheck==1?'Green':'Red');
    }
}
function drawChessBoard()// нарисовать доску
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
           
            
            context.fillRect(ofsX + i * sizeCell, ofsY + j * sizeCell, sizeCell, sizeCell);
        }
    }
    context.fillStyle = 'rgb(0,0,0)';
    context.font = '12px Arial';
    for (let i = 0; i < 8;i++)
    {
        
        context.fillText(arrSimbol[i],ofsX+sizeCell/2+i*sizeCell,ofsY-5)
    }
    for (let i = 0; i <8; i++) 
    {

        context.fillText(8 - i + '', ofsX + 5 + sizeCell * 8, ofsY + sizeCell / 2 + i * sizeCell);
    }
}
function drawFigure(name,color,x,y)// нарисовать фигуру
{
    for (let i = 0; i < arrFigure.length; i++) 
    {
        if (color == arrFigure[i].color && name == arrFigure[i].name) 
        {
            context.drawImage(imageFigures, arrFigure[i].xSp, arrFigure[i].ySp, arrFigure[i].spWidth, arrFigure[i].spHeight, x, y, sizeCell, sizeCell);
        }
    }
}
function drawButton(obj)// нарисовать кнопку
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
function drawTextCenterScreen(text,font,fontSize,color='rgb(255,128,0)')// нарисоваать текст по середине экрана
{
    context.fillStyle=color;
    let heightText=fontSize;
    context.beginPath();
    context.font = fontSize+'px '+font;;
    let metrics = context.measureText(text);
    
    let x=1;
    let y=1;
    let width=canvasWidth;
   // context.strokeRect(this.widthTab*i,this.y,this.widthTab,20);
    context.fillText(text,x+width/2-metrics.width/2,y+canvasHeight/2+fontSize/3);
}
function moveFigures()// функция отвечающия за перемещение фигур
{
    let numFigure = null;
    if (checkMouseLeft()==true)
    {
        // если из набора
        for (let i = 0; i < arrFigure.length;i++)
        {
            if (mouseX > ofsX + sizeCell * Math.trunc(i % (arrFigure.length/2)) && mouseX < ofsX + sizeCell * Math.trunc((i % (arrFigure.length/2)) + 1))
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
        // если перемешаем из доски
        if (bufferFigure.using == false)
        {
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
                //console.log(xCellBoard + ' ' + yCellBoard);
            }
        }
        // перемешение фигуры
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
    // что делать если отпустили кнопку мыши
    if (checkMouseLeft() == false && bufferFigure.using == true)
    {
        bufferFigure.using = false;
        if (mouseX > ofsX && mouseX< ofsX + sizeCell * 8 &&
            mouseY > ofsY && mouseY < ofsY + sizeCell * 8)
        {
           // console.log('klcds');
            for (let i = 0; i < 8;i++)
            {
                for (let j = 0; j < 8; j++)
                {
                    //if (bufferFigure.x- sizeCell / 2 > ofsX + i * sizeCell  && bufferFigure.x - sizeCell / 2<=ofsX + i * sizeCell+sizeCell  &&
                    //    bufferFigure.y- sizeCell / 2 > ofsY + j * sizeCell  && bufferFigure.y - sizeCell / 2<= ofsY + j * sizeCell + sizeCell )
                    if (mouseX > ofsX + i * sizeCell  && mouseX <=ofsX + i * sizeCell + sizeCell  &&
                        mouseY > ofsY + j * sizeCell  && mouseY <= ofsY + j * sizeCell + sizeCell )
                    {
                        board[i][j] = bufferFigure.numFigure;
                        
                    }
                }
            }
        }
    }
    //console.log(bufferFigure.numFigure);
}
function checkFigureOnBoard()// проверить на фигуры на доске с тем что есть в памяти
{
    while (arrCheckFigure.length>0)// удалим массив с проверенными фигурами
    {
        arrCheckFigure.splice(0,1);
    }
    
    var xCell=null;
    var yCell=null;
        // цикл по фигурам на доске
    for (let j = 0; j < 8; j++)
    {
        for (let k = 0; k < 8; k++)
        {
            if (board[j][k]>=0 && board[j][k] <= arrFigure.length)// если на доске есть фигура
            {
                let checkFigureOne = clone(FigureCheck);
                xCell = j;
                yCell = k; 
                checkFigureOne.xCell = xCell;
                checkFigureOne.yCell = yCell;
                let flag = false;
             
                for (let i = 0; i < arrFigureRand.length;i++)// цикл по фигурам в памяти
                {   // если совпадает номер и координаты фигуры
                    if (arrFigureRand[i].numFigure==board[xCell][yCell] && 
                        arrFigureRand[i].xCell==xCell && arrFigureRand[i].yCell==yCell)
                    {
                        flag = true;
                        break;
                    }
                        
                }
                if (flag==true)
                {
                    checkFigureOne.result = 1;
                }
                else
                {
                    checkFigureOne.result = 2;
                }
                arrCheckFigure.push(checkFigureOne);
            }
        }
    }
    // если на доске есть то количество фигур которрое в памяти то присвоем все верно
    if (calcFigureOnBoard() == arrFigureRand.length) resultCheck = 1; else resultCheck = 2;
    // если есть хоть один отрицательный результат проверенныйх фигур  то не присвоем не верно результату проверки
    for (let i = 0; i < arrCheckFigure.length;i++)
    {
        if (arrCheckFigure[i].result==2)
        {
            resultCheck = 2;
            break;
        }
    }
    
    //console.log(arrCheckFigure);
    //console.log(arrFigureRand);
}
function updateFiguresRand(quantity)// обновить фигруы в памяти
{
    while (arrFigureRand.length>0)
    {
        arrFigureRand.splice(0,1);
    }
    for (let i = 0; i < quantity;i++)
    {
        let figureRandOne = clone(FigureRand);
        let flag = false;
        do {
            flag = false;
            figureRandOne.xCell = randomInteger(0, 7);
            figureRandOne.yCell = randomInteger(0, 7);
            figureRandOne.numFigure = randomInteger(0, 11);
            for (let i = 0; i < arrFigureRand.length; i++) {
                if (figureRandOne.xCell == arrFigureRand[i].xCell &&
                    figureRandOne.yCell == arrFigureRand[i].yCell) {
                    flag = true;
                }
            }
        } while (flag == true);
        arrFigureRand.push(figureRandOne);
    }
}

function clearBoard()// очистить доску
{
      for (let i = 0; i < 8;i++)
      {
            for (let j = 0; j < 8; j++)
            {
                board[i][j] = 15;
            }
      }
}
function fillRandFigureOnBoard()// заполнить доску фигурами из памяти
{
    for (let i = 0; i < arrFigureRand.length;i++)
    {
        let xCell = arrFigureRand[i].xCell;
        let yCell = arrFigureRand[i].yCell;   
        board[xCell][yCell] = arrFigureRand[i].numFigure;
    }
}
function calcFigureOnBoard()// посчитать фигуры на доске
{
    let count = 0;
    for (let i = 0; i < 8;i++)
    {
        for (let j = 0; j < 8; j++)
        {
             if(board[i][j]>=0 && board[i][j]<=arrFigure.length)
             {
                 count++;
             }
        }
    }
    return count;
}
function update()// обновление
{
    if (modeGame==0)// режим создания нового игрового цикла
    {
        clearBoard();
        updateFiguresRand(3);
        fillRandFigureOnBoard();
        
        modeGame = 1;
    }
    if (modeGame==1)//режим запоминания игроком
    {
        button.text = 'Готов';
        if (mouseLeftClick() && checkInObj(button,mouseX,mouseY))
        {
            clearBoard();
            modeGame = 2;
        }
    }
    if (modeGame==2)// режим растановки фигур
    {
        button.text = 'Проверить';
        moveFigures();
        if (mouseLeftClick() && checkInObj(button,mouseX,mouseY) && calcFigureOnBoard()>0)
        {
            checkFigureOnBoard();
            fillRandFigureOnBoard();
            bigText.being = true;
            if (resultCheck==1)
            {
                bigText.text ='все верно';
            }
            else if (resultCheck==2)
            {
                bigText.text= 'Не верно есть ошибки';
            }
            modeGame = 3;
        }
    }
    if (modeGame==3)// режим показа результатов 
    {
        button.text = 'Далее';

        if (mouseLeftClick() && checkInObj(button,mouseX,mouseY))
        {
            while (arrCheckFigure.length>0)
            {
                arrCheckFigure.splice(0,1);
            }
            resultCheck = 0;
            bigText.being = false;
            modeGame = 0;
        }
    }
   // console.log(mouseX+" "+mouseY);
}
function initFigure()// инициализировать фигуры нарезка из тайтла
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
    //console.log(arrFigure);
}

