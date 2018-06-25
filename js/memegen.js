'use strict';


function init() {
    initImgs();
    var imgs = getImgs();
    renderImgs(imgs);
    renderOptionsForFilter();
    renderPopularKeysList();
}

function renderImgs(imgs) {
    var elUlImgs = document.querySelector('.imgs-list');
    var strHtml = '';
    imgs.forEach(function (img) {
        strHtml += `<li>
            <div  class="hexagon list-item-container"
            >
            <img id="${img.url}" 
            class="galery-img" src="${img.url}" onclick="openGen(this)"
            alt="No Pciture to displaye">
            </div>
        </li>`
    });
    elUlImgs.innerHTML = strHtml;

}

function openGen(elPic) {
    gCurrLineIdx = 0;
    var elModal = document.querySelector('.modal');
    document.querySelector('.hedaer-decoration').classList.add('hide');
    document.querySelector('main').classList.toggle('hide');
    document.querySelector('.about').classList.add('hide');
    document.querySelector('.about-item').classList.add('hide');
    document.querySelector('.canvas-container').classList.add('open-list');
    document.querySelector('.color').value = "#ffffff";


    elModal.classList.add('open-modal');
    toggleActive();

    var imgObj = findImg(elPic, null);

    createMeme(imgObj.id);
    drawImg(elPic);
}

function closeGen() {
    document.querySelector('.meme-input-line').value = '';
    var elModal = document.querySelector('.modal');
    elModal.classList.remove('open-modal');
    document.querySelector('.hedaer-decoration').classList.remove('hide');
    document.querySelector('main').classList.remove('hide');
    document.querySelector('.about').classList.remove('hide');
    document.querySelector('.about-item').classList.remove('hide');
    document.querySelector('.canvas-container').classList.remove('open-list');

}

function renderOptionsForFilter() {
    var elFilter = document.querySelector('#keywords');
    var strHtml = '';
    strHtml += `<option value="ALL">`
    for (var i in gKeywordMap) {
        strHtml += `<option value=${i}>`
    }
    elFilter.innerHTML = strHtml;
}

function filterImagesList(popularStr) {
    var elFilter = document.querySelector('.filter-search');
    if (!popularStr) {
        var filter = elFilter.value;
        gPopularKeywordMap[filter]++;
    }
    else {
        var filter = popularStr;
    }
    var elUlImgs = document.querySelector('.imgs-list');
    var strHtml = '';
    if (filter === 'ALL') {
        renderImgs(gImgs);
        elFilter.value = '';
        return;
    }

    for (var i = 0; i < gImgs.length; i++) {
        for (var j = 0; j < gImgs[i].keywords.length; j++) {
            var keyword = gImgs[i].keywords[j];
            if (filter === keyword) {
                strHtml +=
                    `<li>
            <div  class="hexagon list-item-container"
            >
            <img id="${gImgs[i].url}" 
            class="galery-img" src="${gImgs[i].url}" onclick="openGen(this)"
            alt="No Pciture to displaye">
            </div>
        </li>`
            }
        }
    }

    elUlImgs.innerHTML = strHtml;
    elFilter.value = '';
    saveToStorage('popular-keys', gPopularKeywordMap);
    renderPopularKeysList();
}

function renderPopularKeysList() {
    var elPopularItems = document.querySelector('.popular-searches');
    var strHtml = '';
    for (var i in gPopularKeywordMap) {
        var currKeyPopular = gPopularKeywordMap[i];
        if (currKeyPopular > 2) {
            if (currKeyPopular <= 18) {
                strHtml += `<li onclick="searchPopularItem(this.textContent)" class="popular-item" 
                            style="font-size:${currKeyPopular * 0.2}rem;">${i}</li>`
            }
            else {
                strHtml += `<li onclick="searchPopularItem(this.textContent)" class="popular-item" 
                            style="font-size:${18 * 0.2}rem">${i}</li>`
            }
        }
    }
    elPopularItems.innerHTM = '';
    elPopularItems.innerHTML = strHtml;
}

function searchPopularItem(str) {
    setKeyInMap(str);
    filterImagesList(str);
}


function renderNumLine(idx) {
    var elNumLine = document.querySelector('.line-idx');
    var strHtml = `Line Number:${idx + 1}`;
    elNumLine.innerHTML = strHtml;
}

function disableAddLine() {
    var elAddBtn = document.querySelector('.new-line').classList.add('disabled');

}

function enabledAddLine() {
    var elAddBtn = document.querySelector('.new-line').classList.remove('disabled');

}

function toggleActive(elItem) {
    var AllActive = document.querySelectorAll('.active');
    AllActive.forEach(function (link) {
        link.classList.remove('active');
    });
    if (elItem) {
        elItem.classList.toggle('active');

    }
}

function setIconAlign(selectedAlign) {
    var elAlignCon = document.querySelector('.align-container');
    var alignClasses = elAlignCon.classList;

    for (var i = 0; i < alignClasses.length; i++) {
        var currClass = alignClasses[i];
        var newAlign = `fa-align-${selectedAlign}`;

        if (currClass.includes('fa-align-')) {
            elAlignCon.classList.remove(currClass);
            elAlignCon.classList.add(newAlign);
            break;
        }
    }
}

function openMenu(elbtn) {
    var elMenu = document.querySelector('.nav-list');
    elMenu.classList.toggle('open-list');

    elbtn.classList.toggle('fa-bars');
    elbtn.classList.toggle('fa-times');

}


function OnMessageSubmitted() {
    var mailStr = document.querySelector('.mail-massage-submition').value;
    var subjectStr = document.querySelector('.subject-massage-submition').value;
    var bodyStr = document.querySelector('.body-massage-submition').value;
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=hexalcrop@gmail.com&su=${subjectStr}&body=${bodyStr}`);
}


function onFileInputChange(ev) {
    handleImageFromInput(ev, addImg)
}



function toggleMenu(className, isClick) {
    var el = document.querySelector('.' + className);
    if (className === 'align-menu') {
        document.querySelector('.font-menu').classList.remove('display-block');
    }
    else {
        document.querySelector('.align-menu').classList.remove('display-block');
    }
    if (!isClick) {
        el.classList.toggle('display-block');

    }
}


function clearDropDown(ev) {
    var elAlign = document.querySelector('.align-container');
    var elFont = document.querySelector('.font-container');

    if (ev.target !== elAlign) {
        document.querySelector('.align-menu').classList.remove('display-block');
    } if (ev.target !== elFont) {
        document.querySelector('.font-menu').classList.remove('display-block');

    }
}