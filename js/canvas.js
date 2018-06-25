'use strict';

var canvas;
var ctx;
var currImg = null;
var gBottomTbY;
var gBottomTbX;


var gAlignLeft;
var gAlignCenter;
var gAlignRight;
var gCurrAlign;
var gCurrLineIdx = 0;

function initCanvas() {

    canvas = document.querySelector('.canvas');
    ctx = canvas.getContext('2d');

    var currLine = gMeme.txts[gCurrLineIdx];

    setAlignCoords();

    renderNumLine(gCurrLineIdx);
    ctx.font = `${currLine.size}px Impact`;
    ctx.textAlign = currLine.align;
    ctx.fillStyle = currLine.color;
    ctx.stroleStyle = 'black';
    ctx.shadowColor = 'black';
}

function setAlignCoords() {
    gAlignLeft = 15;
    gAlignCenter = (canvas.width / 2) - 20;
    gAlignRight = (canvas.width / 2) + 150;
}

function drawImg(imgUrl) {
    initCanvas();

    if (!currImg || currImg !== imgUrl) {
        currImg = imgUrl;
        var img = new Image();
        img.src = imgUrl.src;
        canvas.width = img.width;
        canvas.height = img.height;
        gMeme.txts[gCurrLineIdx].align = gAlignCenter;
        gCurrAlign = gAlignCenter;
        gBottomTbY = (canvas.height - 50) - 10;
        gBottomTbX = canvas.width - 20;
        img.crossOrigin = "Anonymous";
        img.onload = function () {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };

    } else {
        ctx.drawImage(currImg, 0, 0, canvas.width, canvas.height);
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawImg(currImg);
}

function drawText(ev, txtStr) {
    var elInputTxt = document.querySelector('.meme-input-line');
    var currMeme = gMeme.txts[gCurrLineIdx];
    elInputTxt.maxLength = gBottomTbX;

    gMeme.txts[gCurrLineIdx].line = txtStr;

    var currTxtWidth = ctx.measureText(txtStr).width;

    if (ev.inputType === 'deleteContentBackward' && txtStr !== ' ') {
        clearCanvas();
    }
    //check center
    if (gCurrAlign === currMeme.align) {
        var center = calcCenter(txtStr)
        gMeme.txts[gCurrLineIdx].align = center;
        gCurrAlign = center;
    }

    //check right 
    if (currMeme.align + currTxtWidth > canvas.width - 10) {
        var shiftWidth = ctx.measureText(txtStr[txtStr.length - 1]).width;
        moveLeft(shiftWidth);
    }

    if ((currTxtWidth >= gBottomTbX - 20)) {
        elInputTxt.maxLength = elInputTxt.value.length;
        return;
    }

    clearCanvas();
    renderText(txtStr);

}

function renderText(inputValue) {

    for (var i = 0; i < gMeme.txts.length; i++) {
        var currLine = gMeme.txts[i];
        ctx.fillStyle = currLine.color;

        //BOLD
        if (currLine.isBold) ctx.font = `bold ${currLine.size}px ${currLine.font}`;
        else ctx.font = `${currLine.size}px ${currLine.font}`;

        //SHADOW
        if (currLine.isShadow) ctx.shadowBlur = 1;
        else ctx.shadowBlur = 0;

        ctx.fillText(currLine.line, currLine.align, currLine.coorY);
        ctx.strokeText(currLine.line, currLine.align, currLine.coorY);
    }

}



function addNewLine() {
    cleanEmptyLine();

    var elInputTxt = document.querySelector('.meme-input-line');

    var currMemePosY = gMeme.txts[gCurrLineIdx].coorY;
    var memeLen = gMeme.txts.length;
    if (memeLen < 5) {

        if (memeLen === 1) {
            currMemePosY = canvas.height - 20;
        } else if (memeLen === 2) {
            currMemePosY = gMeme.txts[gCurrLineIdx - 1].coorY + 80;
        } else {
            currMemePosY = gMeme.txts[gCurrLineIdx].coorY + 80;

        }
        gMeme.txts.push(createMemeProp(currMemePosY));
        var idx = gMeme.txts.length - 1;
        elInputTxt.value = gMeme.txts[idx].line;
        gMeme.txts[idx].line = elInputTxt.value;
        gCurrLineIdx = idx;
        setAlign('C');
    } else {
        disableAddLine();
    }
}


function onCanvasClick(ev) {
    var elInputTxt = document.querySelector('.meme-input-line');
    var currMemePosY = gMeme.txts[gCurrLineIdx].coorY;
    var x = ev.layerX;
    var y = ev.layerY;

    if (gMeme.txts.length === 1 && elInputTxt.value === '') {
        return;
    }

    if (ev.clientY < canvas.height - 10 && ev.clientY > canvas.height / 2) {
        gMeme.txts[gCurrLineIdx].coorY = ev.clientY;
        clearCanvas();
        renderText();
    } else if (y > 20) {
        gMeme.txts[gCurrLineIdx].coorY = y + 10;
        clearCanvas();
        renderText();
    }

}

function moveRight() {
    var currMeme = gMeme.txts[gCurrLineIdx];
    var currTxtWidth = ctx.measureText(currMeme.line).width;
    if (currMeme.align + currTxtWidth < canvas.width - 10) {
        gMeme.txts[gCurrLineIdx].align = currMeme.align + 5;
        clearCanvas();
        renderText();
    }

}

function moveLeft(size) {
    size = size ? size : 5
    var currMeme = gMeme.txts[gCurrLineIdx];
    if (currMeme.align > 10) {
        gMeme.txts[gCurrLineIdx].align = currMeme.align - size;
        clearCanvas();
        renderText();
    }
}

function moveUp(size) {
    size = size ? size : 5
    var currMeme = gMeme.txts[gCurrLineIdx];
    if (currMeme.coorY > 40) {
        gMeme.txts[gCurrLineIdx].coorY = currMeme.coorY - size;
        clearCanvas();
        renderText();
    }
}

function moveDown() {
    var currMeme = gMeme.txts[gCurrLineIdx];
    // var currTxtWidth = ctx.measureText(currMeme.line).width;
    if (currMeme.coorY < canvas.height - 20) {
        gMeme.txts[gCurrLineIdx].coorY = currMeme.coorY + 5;
        clearCanvas();
        renderText();
    }

}


function calcCenter(str) {
    var txtLen = ctx.measureText(str).width;
    gAlignCenter = (canvas.width - txtLen) / 2;
    return gAlignCenter;
}

function TabLines() {
    var elInputTxt = document.querySelector('.meme-input-line');

    gCurrLineIdx = (gCurrLineIdx + 1) % gMeme.txts.length;

    elInputTxt.value = gMeme.txts[gCurrLineIdx].line;
    if (elInputTxt.value !== gMeme.txts[gCurrLineIdx].line) {
        gMeme.txts[gCurrLineIdx].line += elInputTxt.value


    }
    renderNumLine(gCurrLineIdx);

}


function cleanEmptyLine() {
    gMeme.txts.forEach(function (memeLine, idx) {
        if (memeLine.line === '' || memeLine.line.length === 0) {
            gMeme.txts.splice(idx, 1);
            gCurrLineIdx = gCurrLineIdx - 1;
        }
    })
}

function deleteLine() {
    var Lines = gMeme.txts;
    var elInputTxt = document.querySelector('.meme-input-line');

    if (Lines.length > 1) {

        Lines.splice(gCurrLineIdx, 1)
        gCurrLineIdx = gCurrLineIdx - 1;
        elInputTxt.value = gMeme.txts[gCurrLineIdx].line;
        clearCanvas();
        renderText('')
        enabledAddLine();
    }
}



function reduceText() {
    resizeText(false);
}

function enlargeText() {
    resizeText(true);
}

function resizeText(isPlus) {
    var currMeme = gMeme.txts[gCurrLineIdx];
    if (isPlus) {
        currMeme.size = currMeme.size + 1;
    }
    else {
        currMeme.size = currMeme.size - 1;
    }
    clearCanvas();
    drawText('', currMeme.line);
}

function setAlign(val) {
    var currMeme = gMeme.txts[gCurrLineIdx];
    var txtLen = ctx.measureText(currMeme.line).width;
    var icon = val;
    switch (val) {
        case 'L':
            icon = 'left';
            val = gAlignLeft
            break;
        case 'C':
            icon = 'center';
            val = calcCenter(currMeme.line);
            gCurrAlign = val;
            break;
        case 'R':
            icon = 'right';
            gAlignRight = (canvas.width - 10) - txtLen;
            val = gAlignRight;
            break;
    }
    currMeme.align = val;
    setIconAlign(icon);
    clearCanvas();
    drawText('', currMeme.line);
}

function setFont(val) {
    var currMeme = gMeme.txts[gCurrLineIdx];
    currMeme.font = val;
    clearCanvas();
    drawText('', currMeme.line);
}


function colorChange(el) {
    var currMeme = gMeme.txts[gCurrLineIdx];
    currMeme.color = el.value;
    clearCanvas();
    drawText('', currMeme.line);
}

function toggleBold(el) {
    var currMeme = gMeme.txts[gCurrLineIdx];
    currMeme.isBold = !currMeme.isBold;
    clearCanvas();
    drawText('', currMeme.line);
}

function toggleShadow(el) {
    var currMeme = gMeme.txts[gCurrLineIdx];
    currMeme.isShadow = !currMeme.isShadow;
    clearCanvas();
    drawText('', currMeme.line);
}

function downloadImg(elLink) {
    var currImgId = gMeme.selectedImgid;
    var currImg = findImg('', currImgId);
    elLink.download = `img/${currImg.url}.jpg`;
    var imgContent = canvas.toDataURL('image/jpeg');
    elLink.href = imgContent;
}

