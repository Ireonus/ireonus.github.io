//const defintion  = `Love is not just a feeling, it's a choice, a commitment, a journey shared. It's the gentle embrace in a crowded room, the knowing glances that speak louder than words. It's the way your laughter fills my heart and the comfort I find in your presence, no matter the storm.`;
//const wordCount = defintion.split(" ").length;

const progressMin = 0;
const progressMax = 100;
let defaultProgressIntervalGap = 1;
const wpmMax = 250;
let progressLabels = [];



//elements
const phraseElement = document.getElementById("phrase");
const charElements = phraseElement.getElementsByTagName("p");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const progressElement = document.getElementById("progress");
const userInputDivElement = document.getElementById("user-input");
const userInputElement = userInputDivElement.getElementsByTagName("input")[0];
const startButtonElement = document.getElementById("start");
const ctx = document.getElementById('myChart');
const currentTypeClassList = ["m-0", "border-bottom","border-warning", "border-2", "fst-italic", "fs-4", "bg-warning", "bg-opacity-25"];
const typedClassList = ["m-0", "border-bottom","border-white", "border-2", "fst-italic", "fs-4"];
const untypedClassList = [ "m-0", "border-bottom","border-white", "border-2", "fst-italic", "fs-4"];

let chart;
let correct;
let incorrect;
let incorrectTotal;
let words;
let startTimeSet;
let startTime;
let current;
let currentIntervalUpdate;
let currentIntervalStartTime;
let currentIntervalEndTime;
let previousCorrectInterval;
let progressPercentage;
let wordCount;
let wordsPerLine;
let firstScroll;
let charErrorIdx;

const handleTypeEvent = (event) => typeEvent(event);

function resetTyper(){
   correct = 0;
   incorrect = 0;
   incorrectTotal = 0;
   words = 0;
   startTimeSet = false;
   startTime;
   current = 0
   currentIntervalUpdate = 0;
   currentIntervalStartTime;
   currentIntervalEndTime;
   previousCorrectInterval = 0;
   progressPercentage = 0;
   firstScroll = true;
   progressLabels = [];
   charErrorIdx = [];

   userInputDivElement.classList.remove("d-flex");
   userInputElement.value = "";
   userInputElement.removeAttribute("disabled")


   while (phraseElement.firstChild){
    phraseElement.removeChild(phraseElement.lastChild);
   }

   chart.data.datasets[0].data = [];
   chart.data.datasets[1].data = [0];
 
   chart.update()
    userInputElement.removeEventListener("keydown", handleTypeEvent);

}

async function getPhrase(){
    response = await fetch("moby_dick.json")
    data = await response.json()
    //return 'one two three four five six'
    return data[Math.floor(Math.random() * data.length)];
}

function loadChart(){
    chart = new Chart(ctx, {
        type: 'line',
        data: {
        labels: [0, 20, 40, 60, 80, 100],
        datasets: [{
            data: Array(progressLabels.length).fill(0),
            borderWidth: 1,
            label : "Ave WPM (0)",
            pointRadius : 0,
            yAxisID : 'y'
        },
        {
            data: [0],
            borderWidth: 1,
            label : "Δ WPM (0)",
            yAxisID : 'y'
        },
        {
            data: Array(progressLabels.length).fill(0),
            borderWidth: 1,
            label : "Ave Accuracy(0)",
            pointRadius : 0,
            yAxisID : 'y1'
        }
    ]
        },
        options: {
            maintainAspectRatio: false,
            responsive : true,
            scales: {
                y: {
                position : 'left',
                beginAtZero: true,
                title : {
                    display : true,
                    text : "Words Per Minute"
                },
                max : wpmMax
                },
                y1: {
                position : 'right',
                beginAtZero: true,
                title : {
                    display : true,
                    text : "Accuracy (%)"
                },
                max : 100
                },
                x: {
                    beginAtZero : true,
                    title : {
                        display : true,
                        text : "Progress (%)"
                    },
                    min : progressMin,
                    max : 100,
                    ticks : {
                        includeBounds: true,
                    }
                },
            }
        }
    });
    chart.update();
}


async function loadPhrase(){
    resetTyper();
    phrase = await getPhrase();
    wordCount = phrase.split(" ").length;
    let progressIntervalGap = Math.max((100 / wordCount), defaultProgressIntervalGap)
    progressLabels = []
    for (let i = progressMin; i < progressMax; i += progressIntervalGap){
        progressLabels.push(Math.round(i));
    }
    progressLabels.push(progressMax);
    chart.data.labels = progressLabels;
    chart.update();
    defaultProgressIntervalGap
    let charElement;
    let createPDivElement= true;
    let pDivElement;
    for (let i = 0; i < phrase.length; i++){
        if (createPDivElement){
            pDivElement = document.createElement("div");
            pDivElement.classList.add("d-flex", "justify-content-start", "align-items-center");
            createPDivElement = false;
        }
        charElement = document.createElement("p");
        if (i == 0) {
            charElement.classList.add(...currentTypeClassList, "text-warning");
        }
        else {
            charElement.classList.add(...untypedClassList);
        }
        if (phrase[i] == " ") {
            charElement.textContent = "_";
            charElement.classList.add("blanks")
            pDivElement.appendChild(charElement);
            phraseElement.appendChild(pDivElement);
            createPDivElement = true;

        }
        else {
            charElement.textContent = phrase[i]
        }
        pDivElement.appendChild(charElement);
    }
    current = 0;
    phraseElement.appendChild(pDivElement);

    startButtonElement.classList.add("d-none");
    userInputDivElement.classList.remove("d-none");
    userInputDivElement.classList.add("d-flex");
    userInputElement.addEventListener("keydown", handleTypeEvent);
    userInputElement.focus();
}



function setCorrectTyped(correct){
    idx = correct - 1;
    if (idx < 0){
        return
    }
    charElements[idx].className = "";
    charElements[idx].classList.add(...typedClassList);
        if (charElements[idx].textContent == "_") {
            charElements[idx].classList.add("blanks");
        }
        else {
            charElements[idx].classList.add("text-success");
        }
}

function setInCorrectTyped(correct, incorrect){
    idx = correct + incorrect - 1;
    if (idx >= charElements.length){
        return
    }
    if (incorrect > 0){
        charElements[idx].className = "";
        charElements[idx].classList.add(...typedClassList);
        if (charElements[idx].textContent == "_") {
            charElements[idx].classList.add("blanks");

        }
        else {
            charElements[idx].classList.add("text-danger");
        }
        charElements[idx].classList.add("border-bottom","border-danger", "border-2", "bg-danger", "bg-opacity-25");
    }
    }

function setErrors(idxValues){
    for (let i = 0; i < idxValues.length; i++){
        idx = idxValues[i];
        charElements[idx].className = "";
        charElements[idx].classList.add(...typedClassList);
        if (charElements[idx].textContent == "_") {
            charElements[idx].classList.add("blanks");

        }
        else {
            charElements[idx].classList.add("text-danger");
        }
        charElements[idx].classList.add("border-bottom","border-danger", "border-2", "bg-danger", "bg-opacity-25");

    }
}

function setCurrent(correct, incorrect){
    idx = correct + incorrect
    if (idx >= charElements.length){
        return
    }
    charElements[idx].className = "";
    charElements[idx].classList.add(...currentTypeClassList)
    if (charElements[idx].textContent == "_") {
        charElements[idx].classList.add("blanks");
    }
    else {
        charElements[idx].classList.add("text-warning");
    }
}

function undo(correct, incorrect){
    idx =  correct + incorrect;
    charElements[idx].className = "";
    charElements[idx].classList.add(...untypedClassList)
    if (charElements[idx].textContent == "_") {
        charElements[idx].classList.add("blanks");
    }
}

function setAverageWordsPerMinute(startTime, endTime, correct){

    let deltaTimeSeconds = (endTime - startTime) / 1000;
    const keystrokesPerWord = 5;
    let wpm = Math.round(((correct / keystrokesPerWord) / deltaTimeSeconds) * 60);
    chart.data.datasets[0].data = Array(progressLabels.length).fill(wpm);
    chart.data.datasets[0].label = `Ave WPM (${wpm})` 
}

function setCurrentWordsPerMinute(startTime, endTime, correct){
    let deltaTimeSeconds = (endTime - startTime) / 1000;
    const keystrokesPerWord = 5;
    let wpm = Math.round(((correct / keystrokesPerWord) / deltaTimeSeconds) * 60);
    chart.data.datasets[1].data.push(wpm);
    chart.data.datasets[1].label = `Δ WPM (${wpm})` 
}

function setAccuracy(correct, incorrectTotal){
    let accuracy = Math.round(correct / (correct + incorrectTotal) * 100);
    chart.data.datasets[2].data = Array(progressLabels.length).fill(accuracy);
    chart.data.datasets[2].label = `Ave Accuracy (${accuracy})` 

}


function scrollPhrase(correct, incorrect){
    idx = correct + incorrect
    if (idx < 1 || incorrect > 0 || idx >= charElements.length){
        return
    }
    let pTop = charElements[idx - 1].getBoundingClientRect().top;
    let cTop = charElements[idx].getBoundingClientRect().top;
    if (cTop > pTop){
        if (firstScroll){
            firstScroll = false;
        }
        else {
            phraseElement.scrollTop += cTop - pTop;
        }
    }

}

function clearInput(){
    userInputElement.value = "";
}

function hideUserInput(){
    userInputDivElement.classList.add("d-none");
    
}

function showStartButton(){
    startButtonElement.classList.remove("d-none");
}

function typeEvent(event){
    if (event.key.length > 1 && event.key != "Backspace"){
        return
    } 

    if (correct == charElements.length){
        return
    }
    if (!startTimeSet){
        startTimeSet = true;
        startTime = new Date().getTime();
        currentIntervalStartTime = new Date().getTime();
    }    
    
    if(event.key == "Backspace"){
        if (incorrect == 0 && charElements[correct-1].textContent == "_"){
            return
        }
        if ((correct + incorrect) < charElements.length){
            undo(correct, incorrect);
        }
        if (incorrect > 0){
            incorrect -= 1;
        }
        else if (correct > 0){
            correct -= 1;
        }
    }
    else{
        if (event.key != charElements[correct + incorrect].textContent
            && !(event.key == " " && charElements[correct + incorrect].textContent == "_")){
                charErrorIdx.push(correct + incorrect)
            }
        if(incorrect == 0 
            && (event.key == charElements[correct].textContent
            ||  event.key == " " && charElements[correct].textContent == "_")
            ){
            correct += 1;
            if(event.key == " " || correct == charElements.length){
                words += 1
                clearInput();
                progressPercentage = (words / wordCount) * 100 
                if (progressPercentage >= progressLabels[currentIntervalUpdate]){
                    currentIntervalEndTime = new Date().getTime();
                    setAverageWordsPerMinute(startTime, 
                        currentIntervalEndTime, 
                        correct
                    );
                    setCurrentWordsPerMinute(
                        currentIntervalStartTime, 
                        currentIntervalEndTime, 
                        correct - previousCorrectInterval
                    );
                    currentIntervalStartTime = currentIntervalEndTime;
                    previousCorrectInterval = correct;
                    currentIntervalUpdate += 1;
                }
                chart.update();
            if (correct == charElements.length){
                setErrors(charErrorIdx);
                hideUserInput();
                showStartButton();
                
            }
            }
        }
        else {
            incorrect += 1;
            incorrectTotal += 1;
        }
    }
        setCorrectTyped(correct);
        setAccuracy(correct, incorrectTotal);
        setInCorrectTyped(correct, incorrect);       
        setCurrent(correct, incorrect);
        scrollPhrase(correct, incorrect);


       
}