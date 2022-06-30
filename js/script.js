var context;
var canvas;
var sizeCell = 80;
var arrSimbol = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',];
var arrNameFigure = ['king','queen','bishop','rook','knight','pawn'];
var imageLoad = false;
var imageFigures = null;
var arrFigure = [];
var Figure = {
    name:null,
    color:null,
    xSp:0,
    ySp:0,
    spWidth:0,
    spHeight:0,

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
    imageFigures.onload = function () {
        imageLoad = true;
    }
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
    let y = 660;
    for (let i = 0; i < arrFigure.length; i++) 
    {
        if (arrFigure[i].color == 0) 
        {
            drawFigure(arrFigure[i].name, arrFigure[i].color, 20 + sizeCell * i, y);
        }
        else
        {
            drawFigure(arrFigure[i].name, arrFigure[i].color, 20 + sizeCell * (i%arrNameFigure.length), y+sizeCell);
        }
        //drawFigure(arrNameFigure[i], 1, 20 + sizeCell * i, 20);

    }
}
function drawChessBoard()
{
    let x=20;
    let y =20;
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
function update()
{
    
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

