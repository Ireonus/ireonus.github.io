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
        "order": [51, 52, 53, 9, 10, 11, 18, 19, 20, 27, 28, 29],
        "reverse" : true
    },
    "secondary" : {
        "order": [51, 48, 45, 42, 39, 36, 24, 21, 18, 6, 3, 0],
        "reverse": true
    },
    "success": {
        "order": [8, 7, 6, 11, 14, 17, 36, 37, 38, 33, 30, 27],
        "reverse": true
    },
    "danger": {
        "order": [2, 5, 8, 20, 23, 26, 38, 41, 44, 47, 50, 53],
        "reverse": true
    },
    "warning": {
        "order": [45, 46, 47,35, 34, 33, 26, 25, 24, 17, 16, 15],
        "reverse": true
    },
    "info": {
        "order": [9, 12, 15, 42, 43, 44, 35, 32, 29, 2, 1, 0],
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
                    blockNode.className = `block block-button btn btn-${colors[i]} p-0`
                    const idiomaticElement = document.createElement("i");
                    idiomaticElement.className = "fa-solid fa-arrow-rotate-right" ;
                    blockNode.appendChild(idiomaticElement);
                }
                else {
                blockNode = document.createElement("div");
                blockNode.className = "block bg-light";
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

async function rotateCube(side, event){
    const clockwise = event.shiftKey ? !globalClockwise : globalClockwise;
    [...blockRotateButtons].map((b) => {b.setAttribute("disabled", true)});
    let rowIdx = colorRotationIdx[side]["order"];
    let rowBlocks = rowIdx.map((i) => blocks[i]);
    let rowBlocksClassName = rowBlocks.map((b) => b.className);
    let idx;
    if (clockwise){
        rowBlocksClassName = rowBlocksClassName.slice(3, 12).concat(rowBlocksClassName.slice(0, 3))
    }
    else{
        rowBlocksClassName = rowBlocksClassName.slice(9, 12).concat(rowBlocksClassName.slice(0, 9))
    }
    let reverse = colorRotationIdx[side]["reverse"];
    if (!clockwise){
        reverse = !reverse
    }
    for(let i = 0; i < rowBlocks.length; i++){
        idx = !reverse ? i : rowBlocks.length - 1 - i;
        rowBlocks[idx].className = rowBlocksClassName[idx];
        await new Promise ( r => setTimeout(r, blockChangeFrequency));
    }

    [...blockRotateButtons].map(b => {b.removeAttribute("disabled")});
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