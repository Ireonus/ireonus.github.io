const colors = ["primary", "secondary", "success", "danger", "warning", "info"];
const midColorsIdx = [1,2,3]
const blocksPerColor = 9;
const blocksPerRow = 3;
const blockChangeFrequency = 15;
const blocks = document.getElementsByClassName("block");
const blockRotateButtons = document.getElementsByClassName("block-button");
const idiomaticRotationElements = document.getElementsByTagName("i");
let globalClockwise = true;

//rotate row idx
const colorRotationIdx = {
    "primary": {
        "insideOrder": [2, 1, 0, 0, 3, 6, 6, 7, 8, 8, 5, 2],
        "outsideOrder": [51, 52, 53, 9, 10, 11, 18, 19, 20, 27, 28, 29],
        "reverse" : true
    },
    "secondary" : {
        "insideOrder": [ 9, 12, 15, 15, 16, 17, 17, 14, 11, 11, 10, 9],
        "outsideOrder": [51, 48, 45, 42, 39, 36, 24, 21, 18, 6, 3, 0],
        "reverse": true
    },
    "success": {
        "insideOrder": [20, 19, 18, 18, 21, 24, 24, 25, 26, 26, 23, 20],
        "outsideOrder": [8, 7, 6, 11, 14, 17, 36, 37, 38, 33, 30, 27],
        "reverse": true
    },
    "danger": {
        "insideOrder": [29, 28, 27, 27, 30, 33, 33, 34, 35, 35, 32, 29],
        "outsideOrder": [2, 5, 8, 20, 23, 26, 38, 41, 44, 47, 50, 53],
        "reverse": true
    },
    "warning": {
        "insideOrder": [42, 43, 44, 44, 41, 38, 38, 37, 36, 36, 39, 42],
        "outsideOrder": [45, 46, 47,35, 34, 33, 26, 25, 24, 17, 16, 15],
        "reverse": true
    },
    "info": {
        "insideOrder": [53, 50, 47, 47, 46, 45, 45, 48, 51, 51, 52, 53],
        "outsideOrder": [9, 12, 15, 42, 43, 44, 35, 32, 29, 2, 1, 0],
        "reverse": false
    }
}

function changeRotation(){
    globalClockwise = !globalClockwise;
    if(globalClockwise){
        [...idiomaticRotationElements].map((i)=> i.className = "fa-solid fa-arrow-rotate-right");
    }
    else{
        [...idiomaticRotationElements].map((i)=> i.className = "fa-solid fa-arrow-rotate-left");
    }
}

function loadCube(){
    const cubeElement = document.getElementById("cube");
    let midColorsNode;
    midColorsNode = document.createElement("div");
    midColorsNode.className = "mid-rows d-flex justify-content-center";
    let colorNode;
    let rowNode;
    let blockNode;
    let x;
    x = 0
    for(let i = 0; i < colors.length; i++){
        colorNode = document.createElement("div");
        for(let j = 0; j < blocksPerColor; j+=blocksPerRow){
            rowNode = document.createElement("div");
            rowNode.className = "cube-row-short d-flex justify-content-center"
            for(let z = 0; z < blocksPerRow; z++){
                if (j == Math.floor(blocksPerColor / blocksPerRow) 
                    && z == Math.floor(blocksPerRow / 2)){
                    blockNode = document.createElement("button");
                    blockNode.setAttribute("disabled", true);
                    blockNode.setAttribute("onclick", `rotateCube("${colors[i]}", event)`);
                    blockNode.className = `block block-button btn btn-outline-${colors[i]} p-0`
                    const idiomaticElement = document.createElement("i");
                    idiomaticElement.className = "fa-solid fa-arrow-rotate-right" ;
                    blockNode.appendChild(idiomaticElement);
                }
                else {
                blockNode = document.createElement("div");
                blockNode.className = "block bg-light d-flex justify-content-center align-items-center";
                //textNode = document.createTextNode(i * blocksPerColor + j + z);
                //blockNode.appendChild(textNode);
                }
                rowNode.appendChild(blockNode);
                x += 1;
            }
            colorNode.appendChild(rowNode)
        }
        if(midColorsIdx.includes(i)){
            midColorsNode.appendChild(colorNode);
            if(i == midColorsIdx[midColorsIdx.length - 1]){
                cubeElement.appendChild(midColorsNode);
            }
        }
        else {
            cubeElement.appendChild(colorNode);
        }
    }
}
let rotatingCube = false;
async function rotateCube(side, event){
    if (rotatingCube) {
        return 
    }
    rotatingCube = true;
    const clockwise = event.shiftKey ? !globalClockwise : globalClockwise;
//    [...blockRotateButtons].map((b) => {b.setAttribute("disabled", true)});
    let outsideRowIdx = colorRotationIdx[side]["outsideOrder"];
    let outsideRowBlocks = outsideRowIdx.map((i) => blocks[i]);
    let outsideRowBlocksClassName = outsideRowBlocks.map((b) => b.className);
    let outsideRowBlocksTextContent = outsideRowBlocks.map((b) => b.textContent);
    let outsideIdx;
    let insideRowIdx = colorRotationIdx[side]["insideOrder"];
    let insideRowBlocks = insideRowIdx.map((i) => blocks[i]);
    let insideRowBlocksClassName = insideRowBlocks.map((b) => b.className);
    let insideRowBlocksTextContent = insideRowBlocks.map((b) => b.textContent);
    let insideIdx;
    if (clockwise){
        outsideRowBlocksClassName = outsideRowBlocksClassName.slice(3, 12).concat(outsideRowBlocksClassName.slice(0, 3));
        outsideRowBlocksTextContent = outsideRowBlocksTextContent.slice(3, 12).concat(outsideRowBlocksTextContent.slice(0, 3));
        insideRowBlocksClassName = insideRowBlocksClassName.slice(3, 12).concat(insideRowBlocksClassName.slice(0, 3));
        insideRowBlocksTextContent = insideRowBlocksTextContent.slice(3, 12).concat(insideRowBlocksTextContent.slice(0, 3));
    }
    else{
        outsideRowBlocksClassName = outsideRowBlocksClassName.slice(9, 12).concat(outsideRowBlocksClassName.slice(0, 9));
        outsideRowBlocksTextContent = outsideRowBlocksTextContent.slice(9, 12).concat(outsideRowBlocksTextContent.slice(0, 9));
        insideRowBlocksClassName = insideRowBlocksClassName.slice(9, 12).concat(insideRowBlocksClassName.slice(0, 9));
        insideRowBlocksTextContent = insideRowBlocksTextContent.slice(9, 12).concat(insideRowBlocksTextContent.slice(0, 9));
    }
    let reverse = colorRotationIdx[side]["reverse"];
    if (!clockwise){
        reverse = !reverse
    }
    for(let i = 0; i < outsideRowBlocks.length; i++){
        outsideIdx = !reverse ? i : outsideRowBlocks.length - 1 - i;
        outsideRowBlocks[outsideIdx].className = outsideRowBlocksClassName[outsideIdx];
        outsideRowBlocks[outsideIdx].textContent = outsideRowBlocksTextContent[outsideIdx];
        insideIdx = !reverse ? i : insideRowBlocks.length - 1 - i;
        insideRowBlocks[insideIdx].className = insideRowBlocksClassName[insideIdx];
        insideRowBlocks[insideIdx].textContent = insideRowBlocksTextContent[insideIdx];
        
        await new Promise ( r => setTimeout(r, blockChangeFrequency));
    }

//    [...blockRotateButtons].map(b => {b.removeAttribute("disabled")});
    rotatingCube = false;
}


async function start(){
    for (let i = 0; i < colors.length; i++){
        for (let j = 0; j < blocksPerColor; j++){
            var b = blocks[i * blocksPerColor + j];
            b.className = b.className.replace(/bg-\w+/, "bg-"+colors[i]);
            await new Promise(async (r) => setTimeout(r, blockChangeFrequency));
        }
    }
    for(let i = 0; i < blockRotateButtons.length; i++){
        blockRotateButtons[i].removeAttribute("disabled");
    }
}
async function reset(){
    for(let i = 0; i < blockRotateButtons.length; i++){
        blockRotateButtons[i].setAttribute("disabled", true);
    }
    for (let i = 0; i < colors.length; i++){
        for (let j = 0; j < blocksPerColor; j++){
            var b = blocks[i * blocksPerColor + j];
            b.className = b.className.replace(/bg-\w+/, "bg-light");
            await new Promise(r => setTimeout(r, blockChangeFrequency));
        }
    }
    
}