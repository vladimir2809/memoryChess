var context;
var canvas;
var canvasWidth = 1800;
var canvasHeight = 1000;
var sizeCellNormal = 80;
var sizeCell = sizeCellNormal;
var arrSimbol = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',];
var arrNameFigure = ['king','queen','bishop','knight','rook','pawn'];
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
var quantityFigure = 3;
var ADV = {
    timerOn:false,
    time: 0,
    timeOld:0,
    maxTime: 180000,
};
var FigureCheck = {
    xCell:null,
    yCell:null,
    numFigure:null,
    name: '',
    color:null,
    result:0,
}
var FigureRand = {
    xCell:null,
    yCell:null,
    numFigure:null,
    name:'',
    color:null,
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
    using: false,
    //xStartMove: null,
    //yStartMove: null,
    fromBoard: false,
    x: null,
    y: null,
    numFigure: null,
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
var ListCheckRand = 
    [
        {name:'king',plan:1,fact:[0,0]},
        {name:'queen',plan:1,fact:[0,0]},
        {name:'rook',plan:2,fact:[0,0]},
        {name:'bishop',plan:2,fact:[0,0]},
        {name:'knight',plan:2,fact:[0,0]},
        {name:'pawn',plan:8,fact:[0,0]},
    ]
var listCheck;
var button = {
    x: ofsX+sizeCell * 6+15,
    y: ofsY+sizeCell * 8+15,
    width:100,
    height: 30,
    text: 'Проверить',
    fontSizeNormal: 26,
    fontSize: this.fontSizeNormal,
}
var yButtonPlusMinus = 64;
var buttonPlusFigure = {
    x: ofsX+sizeCell * 6+15+70,
    y: ofsY+sizeCell * 8+15+yButtonPlusMinus,
    width:30,
    height: 30,
    text: '+',
    fontSizeNormal: 36,
    fontSize: this.fontSizeNormal,
}
var buttonMinusFigure = {
    x: ofsX+sizeCell * 6+15,
    y: ofsY+sizeCell * 8+15+yButtonPlusMinus,
    width:30,
    height: 30,
    text: '-',
    fontSizeNormal: 36,
    fontSize: this.fontSizeNormal,
}
var bigText = {
    being:false,
    x:null,
    y:null,
    text:'',
    timerOn:false,
    maxTime:2000,
    time:0,
    timeOld:0,
}
window.addEventListener('load', function () {
    YaGames
    .init()
    .then(ysdk => {
        console.log('Yandex SDK initialized');
        window.ysdk = ysdk;
        //ysdk.adv.showFullscreenAdv({
        //    callbacks: {
        //        onClose: function () {
        //            modeGame = 1;
        //            console.log('adversting close');

        //        },
        //        onOpen: function () {
        //            //modeGame = 1;
        //            console.log('adversting open');
        //        },
        //        onError: function () {
        //            modeGame = 1;
        //            console.log('adversting Error');

        //        },
        //        onOffline: function () {
        //            modeGame = 1;
        //        }
        //    },
        //});
        initGame();
    });
  
});
function initGame()
{
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    console.log(canvasWidth);
    
    updatePropertyForResize(canvasWidth, canvasHeight);
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
function updatePropertyForResize(canvasWidth,canvasHeight)
{
    if (canvasWidth<700 || canvasHeight<sizeCellNormal*10)
    {
        if (canvasWidth<canvasHeight)
        {
            sizeCell = canvasWidth / 10;;
        }
        else 
        {
            sizeCell = canvasHeight/ 10;;
        }
         console.log('sizeno2');
    }
    //else if (canvasHeight<sizeCellNormal*10.5)
    //{
    //    sizeCell = canvasHeight / 10.5;
    //     console.log('sizeno1');
    //}

    else
    {
        sizeCell = sizeCellNormal;
        console.log('sizenorm');
    }
    ofsX = (canvasWidth / 2 - (sizeCell * 8) / 2);//* sizeCell/sizeCellNormal;
    ofsY = (canvasHeight/ 2 - (sizeCell * 10) / 2)//20 * sizeCell/sizeCellNormal;
    xSetFigure = ofsX;
    ySetFigure = sizeCell * 8 + ofsY;

    button.x = ofsX + sizeCell * 6 + 15 * sizeCell/sizeCellNormal;
    button.y = ofsY + sizeCell * 8 + 15 * sizeCell/sizeCellNormal;
    button.width = 133 * sizeCell/sizeCellNormal; 
    button.height = 40 * sizeCell/sizeCellNormal;  
    button.fontSize = button.fontSizeNormal * sizeCell / sizeCellNormal;
    yButtonPlusMinus = 85;

    buttonPlusFigure.x = ofsX + sizeCell * 6 + (15 + 93)* sizeCell / sizeCellNormal,
    buttonPlusFigure.y = ofsY + sizeCell * 8 + (15 + yButtonPlusMinus)* sizeCell / sizeCellNormal,
    buttonPlusFigure.width = 40 * sizeCell / sizeCellNormal;
    buttonPlusFigure.height = 40 * sizeCell / sizeCellNormal;
    buttonPlusFigure.fontSize = buttonPlusFigure.fontSizeNormal * sizeCell / sizeCellNormal;

    buttonMinusFigure.x = ofsX + sizeCell * 6 + 15 * sizeCell / sizeCellNormal;
    buttonMinusFigure.y = ofsY + sizeCell * 8 + (15 + yButtonPlusMinus) * sizeCell / sizeCellNormal;
    buttonMinusFigure.width = 40* sizeCell / sizeCellNormal;
    buttonMinusFigure.height = 40* sizeCell / sizeCellNormal;
    buttonMinusFigure.fontSize =buttonMinusFigure.fontSizeNormal * sizeCell / sizeCellNormal;
    
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
    if (modeGame==4 && resultCheck==2)
    {
        for (let i = 0; i < arrCheckFigure.length;i++)
        {
            for (let j= 0; j < arrFigureRand.length;j++)
            {
                if (arrCheckFigure[i].xCell==arrFigureRand[j].xCell &&
                    arrCheckFigure[i].yCell==arrFigureRand[j].yCell && arrCheckFigure[i].result==2)
                {
                    drawFigure(arrCheckFigure[i].name, arrCheckFigure[i].color,
                                ofsX + sizeCell * arrCheckFigure[i].xCell,
                                ofsY + sizeCell *  arrCheckFigure[i].yCell, 0.38);
                }
            }
        }
        
    }
        
    drawButton(button);// рисуем кнопку
    drawButton(buttonMinusFigure);
    drawButton(buttonPlusFigure);
    drawText('Число фигур:', 22 * sizeCell / sizeCellNormal, ofsX + sizeCell * 6 + 15 * sizeCell / sizeCellNormal, ofsY + sizeCell * 8 + (15 + 78) * sizeCell / sizeCellNormal);
    let xText = Math.trunc(quantityFigure) < 10 ? ofsX + sizeCell * 6 + (15 + 58) * sizeCell / sizeCellNormal :
                                                ofsX + sizeCell * 6 +( 15 + 48) * sizeCell / sizeCellNormal;
    drawText(Math.trunc(quantityFigure)+'', 35 * sizeCell / sizeCellNormal, xText, ofsY + sizeCell * 8 + (15 + 117) * sizeCell / sizeCellNormal);
    if (bigText.being==true)// рисуем текс по середине
    {    
        context.fillStyle = "rgba(100,100,255,0.5)";
        context.fillRect(1,canvasHeight/2 - 200 * sizeCell / sizeCellNormal,canvasWidth,100 * sizeCell / sizeCellNormal);
        drawTextCenterScreen(bigText.text, 'Arial', 35 * sizeCell / sizeCellNormal, resultCheck==1?'#33FF33':'#FF3333',/*ofsY +*/ canvasHeight/2 - 140 * sizeCell / sizeCellNormal);
    }
    if (modeGame==0)
    {
        let x = ofsX + sizeCell*0-20;
        let y = ofsY + sizeCell*4;
        let yStep = 40;
        color = 'white'//'rgb(100,255,100)';
        font = "Arial";
        fontSize = 25;
        if (canvasWidth>750 || canvasWidth/canvasHeight>1.3)
        {
            context.fillStyle = "rgba(100,100,255,0.5)";
            context.fillRect(1,y-yStep * sizeCell / sizeCellNormal,canvasWidth ,yStep*4 * sizeCell / sizeCellNormal);
            drawTextCenterScreen('Здравствуйте! Это приложение для тренировки памяти.', font, fontSize * sizeCell / sizeCellNormal, color, y);
            drawTextCenterScreen('Сначала на поле появится фигуры, а затем исчезнут.', font, fontSize * sizeCell / sizeCellNormal, color, y+yStep * sizeCell / sizeCellNormal)
            drawTextCenterScreen('Вам нужно будет раставить фигуры, так как они стояли ранее.', font , fontSize * sizeCell / sizeCellNormal, color, y+yStep*2 * sizeCell / sizeCellNormal);
        }
        else
        {
            y = ofsY + sizeCell*2;
            context.fillStyle = "rgba(100,100,255,0.5)";
            context.fillRect(1,y-yStep * sizeCell / sizeCellNormal,canvasWidth ,yStep*8 * sizeCell / sizeCellNormal);
            drawTextCenterScreen('Здравствуйте! Это приложение', font, fontSize * sizeCell / sizeCellNormal, color, y);
            drawTextCenterScreen('для тренировки памяти. Сначала ', font, fontSize * sizeCell / sizeCellNormal, color, y+yStep * sizeCell / sizeCellNormal)
            drawTextCenterScreen('на поле появится фигуры,', font , fontSize * sizeCell / sizeCellNormal, color, y+yStep*2 * sizeCell / sizeCellNormal);
            drawTextCenterScreen('а затем изчеснут.', font , fontSize * sizeCell / sizeCellNormal, color, y+yStep*3 * sizeCell / sizeCellNormal);
            drawTextCenterScreen('Вам нужно будет раставить ', font , fontSize * sizeCell / sizeCellNormal, color, y+yStep*4 * sizeCell / sizeCellNormal);
            drawTextCenterScreen('фигуры, так как они стояли ранее.', font , fontSize * sizeCell / sizeCellNormal, color, y+yStep*5* sizeCell / sizeCellNormal);
        
        }

        //drawText('Здравствуйте! Это приложение для тренировки памяти.', 20,x,y,color);
        //drawText('Сначала на поле появится фигуры, а затем исчезнут.', 20,x,y+30,color);
        //drawText('Вам нужно будет раставить фигуры, так как они стояли ранее.', 20,x,y+60,color);
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
    context.font = 12*sizeCell/sizeCellNormal+'px Arial';
    for (let i = 0; i < 8;i++)
    {
        
        context.fillText(arrSimbol[i],ofsX+sizeCell/2+i*sizeCell,ofsY-5)
    }
    for (let i = 0; i <8; i++) 
    {

        context.fillText(8 - i + '', ofsX + 5 + sizeCell * 8, ofsY + sizeCell / 2 + i * sizeCell);
    }
}
function drawFigure(name,color,x,y,scale=1)// нарисовать фигуру
{
    for (let i = 0; i < arrFigure.length; i++) 
    {
        if (color == arrFigure[i].color && name == arrFigure[i].name) 
        {
            context.drawImage(imageFigures, arrFigure[i].xSp, arrFigure[i].ySp, arrFigure[i].spWidth, arrFigure[i].spHeight,
                               x, y, sizeCell*scale, sizeCell*scale);
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
function drawText(text,fontSize,x,y,color='rgb(255,128,0')
{
    context.fillStyle=color;
    context.font = fontSize+'px Arial';
   // context.strokeRect(this.widthTab*i,this.y,this.widthTab,20);
    context.fillText(text,x,y);
}
function drawTextCenterScreen(text,font,fontSize,color='rgb(255,128,0)',yText=null)// нарисоваать текст по середине экрана
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
    context.fillText(text, x + width / 2 - metrics.width / 2, yText == null ? y + canvasHeight / 2 + fontSize / 3 : yText);
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
                checkFigureOne.numFigure = board[j][k];
                checkFigureOne.name= arrFigure[ board[j][k] ].name;
                checkFigureOne.color = board[j][k] < arrFigure.length/2 ? 0 : 1;
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
    //let quantity = 0;
    listCheck=JSON.parse(JSON.stringify(ListCheckRand));
    for (let i = 0; i < quantity;i++)
    {
        let figureRandOne = clone(FigureRand);
        let flag = false;
        let num = null;
        let color = null;
        do {
            do {
                flag = false;
                if (i == 0) figureRandOne.numFigure = 0;
                else if (i == 1) figureRandOne.numFigure = 6;
                else figureRandOne.numFigure = randomInteger(0, 11);
               // else figureRandOne.numFigure = randomInteger(0, 11) > 5 ?  5: 11;
                figureRandOne.color= (figureRandOne.numFigure < arrFigure.length/2) ?  0: 1;
                figureRandOne.name = arrFigure[figureRandOne.numFigure].name;
                figureRandOne.xCell = randomInteger(0, 7);
                figureRandOne.yCell = randomInteger(0, 7);

                for (let j = 0; j < arrFigureRand.length; j++) 
                {
                    if (figureRandOne.xCell == arrFigureRand[j].xCell &&
                        figureRandOne.yCell == arrFigureRand[j].yCell)
                    {
                        flag = true;
                    }
                }
               // if (figureRandOne.numFigure % (arrFigure.length / 2)==5)
                if (figureRandOne.name=='pawn') 
                {
                    if (figureRandOne.yCell==0 || figureRandOne.yCell==7 )
                    {
                        flag = true;
                    }
                }
               // if (figureRandOne.numFigure % (arrFigure.length / 2)==0)
                if (figureRandOne.name=='king')
                {
                    for (let j = 0; j < arrFigureRand.length;j++)
                    {
                        if (arrFigureRand[j].name=='king')
                        {
                            if (Math.abs(figureRandOne.xCell-arrFigureRand[j].xCell)<2 ||
                                Math.abs(figureRandOne.yCell-arrFigureRand[j].yCell)<2)
                            {
                                flag = true;
                            }
                        }
                    }
                }
                for (let j = 0; j < arrFigureRand.length;j++)// цикл проверки шахов королес с другими фигурами
                {
                    if (arrFigureRand[j].name=='king' && arrFigureRand[j].color != figureRandOne.color)
                    {
                        if (figureRandOne.name=='queen')
                        {
                            if (checkStraightLine(figureRandOne.xCell,figureRandOne.yCell,
                                                  arrFigureRand[j].xCell,arrFigureRand[j].yCell)==true)
                            {
                                flag = true;
                            }
                            if (checkDiagonaleLine(figureRandOne.xCell,figureRandOne.yCell,
                                                  arrFigureRand[j].xCell,arrFigureRand[j].yCell)==true)
                            {
                                flag = true;
                            }
                        }
                        if (figureRandOne.name=='rook')
                        {
                            if (checkStraightLine(figureRandOne.xCell,figureRandOne.yCell,
                                                  arrFigureRand[j].xCell,arrFigureRand[j].yCell)==true)
                            {
                                flag = true;
                            }
                        }  
                        if (figureRandOne.name=='bishop')
                        {
                            if (checkDiagonaleLine(figureRandOne.xCell,figureRandOne.yCell,
                                                  arrFigureRand[j].xCell,arrFigureRand[j].yCell)==true)
                            {
                                flag = true;
                            }
                        }   
                        if (figureRandOne.name=='knight')
                        {
                            if (checkKnightAttack(figureRandOne.xCell,figureRandOne.yCell,
                                                  arrFigureRand[j].xCell,arrFigureRand[j].yCell)==true)
                            {
                                flag = true;
                            }
                        }
                        if (figureRandOne.name=='pawn')
                        {
                            let color = figureRandOne.color;
                            if (checkPawnAttack(figureRandOne.xCell,figureRandOne.yCell,
                                            arrFigureRand[j].xCell,arrFigureRand[j].yCell,color)==true)
                            {
                                flag = true;
                            }
                        }
                    }
                }
                
            } while (flag == true);
            if (num!=null && color!=null && listCheck[num].fact[color]>0 )
            {
                listCheck[num].fact[color]--;
            }
            num = (figureRandOne.numFigure % (arrFigure.length / 2))
            color = figureRandOne.color;//figureRandOne.numFigure < (arrFigure.length / 2) ? 0 : 1;
            listCheck[num].fact[color]++;
        } while (listCheck[num].fact[color]>listCheck[num].plan);
        arrFigureRand.push(figureRandOne);
    }
    //console.log(listCheck);
}
function checkStraightLine(x,y,x1,y1)
{
    if (x==x1 || y==y1)
    {
        return true;
    }
    return false;
}
function check2Point(x,y,x1,y1)
{
    if (x==x1 && y==y1)
    {
               
        return true;
    }
    return false;
}
function checkDiagonaleLine(x,y,x1,y1)
{
    let pointX = x;
    let pointY = y;
    for (let i = 0; i < 8; i++)
    {
        if (pointX>0 && pointY>0) 
        {
            pointX--;
            pointY--;
            if (check2Point(pointX, pointY, x1, y1))
            {
                return true;
            }
        }
        else
        {
            break;
        }
    }
    pointX = x;
    pointY = y;
    for (let i = 0; i < 8; i++)
    {
        if (pointX<8 && pointY>0) 
        {
            pointX++;
            pointY--;
            if (check2Point(pointX, pointY, x1, y1))
            {
                return true;
            }
        }
        else
        {
            break;
        }
    }
    pointX = x;
    pointY = y;
    for (let i = 0; i < 8; i++)
    {
        if (pointX<8 && pointY<8) 
        {
            pointX++;
            pointY++;
            if (check2Point(pointX, pointY, x1, y1))
            {
                return true;
            }
        }
        else
        {
            break;
        }
    }
    pointX = x;
    pointY = y;
    for (let i = 0; i < 8; i++)
    {
        if (pointX>0 && pointY<8) 
        {
            pointX--;
            pointY++;
            if (check2Point(pointX, pointY, x1, y1))
            {
                return true;
            }
        }
        else
        {
            break;
        }
    }
    return false;
}
function checkKnightAttack(x,y,x1,y1)
{
    if (x + 2 == x1 && y + 1 == y1) return true;
    if (x + 2 == x1 && y - 1 == y1) return true;
    if (x - 2 == x1 && y + 1 == y1) return true;
    if (x - 2 == x1 && y - 1 == y1) return true;
    if (x + 1 == x1 && y + 2 == y1) return true;
    if (x - 1 == x1 && y + 2 == y1) return true;
    if (x + 1 == x1 && y - 2 == y1) return true;
    if (x - 1 == x1 && y - 2 == y1) return true;
    return false;

}
function checkPawnAttack(x,y,x1,y1,color)
{
    if (color == 0) 
    {
        if ((x + 1 == x1 && y - 1 == y1) || (x - 1 == x1 && y - 1 == y1)) return true;
    }
    if (color == 1) 
    {
        if ((x + 1 == x1 && y + 1 == y1) || (x - 1 == x1 && y + 1 == y1)) return true;
    }
    return false;

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
    let flagClick = false;
    if (mouseLeftClick())
    {
        flagClick = true;
    }
    window.onresize = function(){

        canvasWidth=canvas.width = document.documentElement.clientWidth;
        canvasHeight=canvas.height = document.documentElement.clientHeight;
        updatePropertyForResize(canvasWidth,canvasHeight);
    }
    if (modeGame==0)// режим приветствия
    {
        button.text = 'Старт';
        if (flagClick==true && checkInObj(button,mouseX,mouseY))
        { 
            flagClick = false;
            ysdk.adv.showFullscreenAdv({
                callbacks: {
                    onClose: function (){
                        modeGame = 1;
                        console.log('adversting close');
                  
                    },
                    onOpen: function (){
                      //modeGame = 1;
                      console.log('adversting open');
                    },
                    onError: function (){
                        modeGame = 1;
                        console.log('adversting Error');
                  
                    },
                    onOffline: function (){
                      modeGame = 1;
                      console.log('adversting offline');
                  
                    },
                }
            });
        }

    }
    if (modeGame==1)// режим создания нового игрового цикла
    {
        clearBoard();
        updateFiguresRand(Math.trunc(quantityFigure));
        fillRandFigureOnBoard();
        
        modeGame = 2;
    }
    if (modeGame==2)//режим запоминания игроком
    {
        button.text = 'Готов';

        //for (let i = 0; i < arrFigureRand.length;i++)
        //{
        //    if (arrFigureRand[i].name=='knight')
        //    {
        //        if (checkKnightAttack(arrFigureRand[i].xCell,arrFigureRand[i].yCell,
        //                        Math.trunc((mouseX-ofsX) / sizeCell),Math.trunc((mouseY-ofsY) / sizeCell)))
        //        {
        //            console.log('knight');
        //            break;
        //        }
        //    }
        //    if (arrFigureRand[i].name=='pawn')
        //    {
        //       let color = arrFigureRand[i].numFigure < (arrFigure.length / 2) ? 0 : 1;
        //       if (checkPawnAttack(arrFigureRand[i].xCell,arrFigureRand[i].yCell,
        //                           Math.trunc((mouseX-ofsX) / sizeCell),Math.trunc((mouseY-ofsY) / sizeCell),color))
        //       {
        //           console.log('pawn '+color);
        //           break;
        //       }
        //    }
        //}
        //console.log(Math.trunc((mouseX - ofsX) / sizeCell)+'  '+ Math.trunc((mouseY - ofsY) / sizeCell));
        if (flagClick==true && checkInObj(button,mouseX,mouseY))
        {
            clearBoard();
            modeGame = 3;
            flagClick = false;
        }
    }
    if (modeGame==3)// режим растановки фигур
    {
        button.text = 'Проверить';
        moveFigures();
        if (bigText.timerOn == false)
        {
            bigText.timerOn = true;
            bigText.being = true;
            bigText.time = bigText.timeOld = new Date().getTime();
            bigText.text = 'Раставьте фигуры.';
        }
        bigText.time = new Date().getTime();
        if (bigText.timerOn==true && bigText.time>bigText.timeOld+bigText.maxTime)
        {
            bigText.being = false;
        }
        if (flagClick==true && checkInObj(button,mouseX,mouseY) && calcFigureOnBoard()>0)
        {
            checkFigureOnBoard();
            flagClick = false;
            fillRandFigureOnBoard();
            bigText.being = true;
            if (resultCheck==1)
            {
                bigText.text ='Все верно!';
            }
            else if (resultCheck==2)
            {
                bigText.text= 'Не верно, есть ошибки!';
            }
            modeGame = 4;
        }
    }
    if (modeGame==4)// режим показа результатов 
    {
        bigText.timerOn = false;
        button.text = 'Далее';
      
        if (flagClick==true && checkInObj(button,mouseX,mouseY))
        {
            flagClick = false;
            while (arrCheckFigure.length>0)
            {
                arrCheckFigure.splice(0,1);
            }
            resultCheck = 0;
            bigText.being = false;
            if (ADV.timerOn==false)
            {
                ADV.timerOn = true;
                ADV.time = ADV.timeOld = new Date().getTime();
            }
            if (ADV.timerOn==true)
            {
                ADV.time = new Date().getTime();
                console.log(ADV.time - ADV.timeOld);
            }
            if (ADV.time > ADV.timeOld + ADV.maxTime)
            {
                ADV.timeOld = new Date().getTime();
                ysdk.adv.showFullscreenAdv({
                    callbacks: {
                        onClose: function () {
                            modeGame = 1;
                            console.log('adversting close');

                        },
                        onOpen: function () {
                            //modeGame = 1;
                            console.log('adversting open');
                        },
                        onError: function () {
                            modeGame = 1;
                            console.log('adversting Error');

                        },
                        onOffline: function () {
                            modeGame = 1;
                            console.log('adversting offline');

                        },
                    }
                });
            }
            else
            {
                modeGame = 1;
            }
           

        }
    }

    if (leftPressMouseTime()>0)
    {
        let step = 0;
        if (leftPressMouseTime() > 350) step = 0.1;
        if (leftPressMouseTime() > 1500) step = 0.3;
        if (flagClick==true) step = 1;
        if ( checkInObj(buttonPlusFigure,mouseX,mouseY))
        {
            if (quantityFigure<32)quantityFigure+=step; else quantityFigure = 32;
        }
        if (checkInObj(buttonMinusFigure,mouseX,mouseY))
        {
            if (quantityFigure > 1+step) quantityFigure -= step; else quantityFigure = 1;
    
        }
    }
    
   // console.log(mouseX+" "+mouseY);
}
function initFigure()// инициализировать фигуры нарезка из тайтла
{
    //let width = 33.3;
    //let dist = 19.75;
    let width = 60;
    let dist = 0;
    let color = 0;
    for (let i = 0; i <arrNameFigure.length*2;i++)
    {
        if (i > arrNameFigure.length-1) color = 1;
        let figureOne = clone(Figure);
        figureOne.name = arrNameFigure[i % arrNameFigure.length];
        figureOne.color = color;
        figureOne.xSp = -3.25 + (dist + width) * (i % arrNameFigure.length);
        figureOne.ySp = color == 0 ? -3 : 57;
        figureOne.spWidth = width;
        figureOne.spHeight = width;
        arrFigure.push(figureOne);
    }
    console.log(arrFigure);
}

