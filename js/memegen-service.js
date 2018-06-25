'use strict';
var gImgs = [];
var gImageId = 0;
var gMeme = {};
var gKeywordMap = {};
var gPopularKeywordMap = {};
var IMGS_KEY = 'imgs'



function initImgs(){
    gImgs = createImgs();
    mapImagesKeyWords();
}

function createImg(keywords,url){
    return {
        id : ++gImageId,
        url : url ?url:`img/${gImageId}.jpg`,
        keywords : keywords 
    }
}

function createImgs(){
    var imgs = [];

    imgs = loadFromStorage(IMGS_KEY);
    
    if (!imgs || imgs.length === 0) {
     imgs = [
        createImg(['happy','vication','nature']),
        createImg(['angry','bad','right']),
        createImg(['love','girlfriend','animals','friends']),
        createImg(['happy','friends','animals','love','sleep']),
        createImg(['right','happy','bad','fight']),
        createImg(['animals','sleep','work']),
        createImg(['right','happy','party']),
        createImg(['right','bad','nature']),
        createImg(['right','good']),
        createImg(['angry','friends','nature']),
        createImg(['stupid','funny','cincan']),
        createImg(['bad','cincan']),
        createImg(['happy','friends','party','sucsess']),
        createImg(['angry','bad','right']),
        createImg(['shock','ugly','surprise']),
        createImg(['animals','begs','dance']),
        createImg(['happy','right']),
        createImg(['angry','bad','friends','girlfriend']),
        createImg(['happy','right','drunk']),
        createImg(['morphius']),
        createImg(['friend','right']),
        createImg(['happy','opera','right','friend']),
        createImg(['happy','funny','sad']),
        createImg(['happy','bad','sad']),
        createImg(['freind','funny','toys']),
    ];
} else {
    
    gImageId = imgs.length;
}

    return imgs;
}

function getImgs(){
    return gImgs;
}

function createMeme(imgId,txts){
    gMeme =  {
        selectedImgid:imgId,
        txts: [createMemeProp()]
    }
}

function createMemeProp(posY) {
    return {
        line: '',
        size: 40,
        align: 300,
        color: 'white',
       coorY:!posY?50:posY,
       isBold : false,
       isShadow : false,
       font: 'Impact'
    }
}

function findImg(img,imgId) {
 var objImg = gImgs.find(function(item){
     if(!imgId) {
        return (item.url === img.id)
     } else {
        return (item.id === imgId)
     }
       
    });
    return objImg;
}


//set fake data for local storage
function mapImagesKeyWords(){
    for (var i = 0 ; i < gImgs.length; i++){
        for (var j = 0; j < gImgs[i].keywords.length; j++){
            var currKey = gImgs[i].keywords[j];
            if (!gKeywordMap[currKey]) gKeywordMap[currKey] = 1; 
            else gKeywordMap[currKey]++
        }
    }
    gPopularKeywordMap = gKeywordMap;
    saveToStorage('popular-keys',gPopularKeywordMap);
}

function setKeyInMap(str){
    gPopularKeywordMap[str] =  gPopularKeywordMap[str] + 1;;
    
}

function addImg(img) {
    gImgs.unshift(createImg('',img.src));
    renderImgs(gImgs);
    saveToStorage(IMGS_KEY,gImgs)
}


function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
    return JSON.parse(localStorage.getItem(key))
}


