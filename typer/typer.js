//const defintion  = `Love is not just a feeling, it's a choice, a commitment, a journey shared. It's the gentle embrace in a crowded room, the knowing glances that speak louder than words. It's the way your laughter fills my heart and the comfort I find in your presence, no matter the storm.`;
//const wordCount = defintion.split(" ").length;
const progressMin = 0;
const progressMax = 100;
const progressIntervalGap = 5;
const wpmMax = 250;

let progressLabels = [];
for (let i = 0; i < progressMax; i += progressIntervalGap){
    progressLabels.push(i);
}
progressLabels.push(progressMax);


//elements
const phraseElement = document.getElementById("phrase");
const charElements = phraseElement.getElementsByTagName("p");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const progressElement = document.getElementById("progress");
const ctx = document.getElementById('myChart');
const currentTypeClassList = ["m-0", "border-bottom","border-warning", "border-2", "fst-italic", "fs-4"];
const typedClassList = ["m-0", "border-bottom","border-white", "border-2", "fst-italic", "fs-4"];
const untypedClassList = [ "m-0", "border-bottom","border-white", "border-2", "fst-italic", "fs-4"];
const specialCharacters = ["?", ",", ";", "/", "{", "}"]

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
let previousWordsInterval;
let progressPercentage;
let wordCount;
let wordsPerLine;
let wordProgressUpdate;

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
   previousWordsInterval = 0;
   progressPercentage = 0;

   wpmElement.textContent = '- WPM';
   accuracyElement.textContent = '- %';
   progressElement.textContent = '- %';


   while (phraseElement.firstChild){
    phraseElement.removeChild(phraseElement.lastChild);
   }

   for (let i = 0; i < chart.data.datasets.length; i++){
    chart.data.datasets[i].data = [];
   }
   chart.update()

    document.removeEventListener("keydown", handleTypeEvent);

}

function shuffleArray(array){
    for (let i = array.length - 1; i > 0; i--){
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j]
        array[j] = temp

    }
}
async function getPhrase(){
    const wordLengths = [3, 4, 5, 6, 7];
    let number = 30;
    let url;
    let allWords = [];
    for (let i=0; i < wordLengths.length; i++){
        url = `https://random-word-api.vercel.app/api?words=${number}&length=${wordLengths[i]}`
//        url = `https://random-word-api.herokuapp.com/word?number=${number}&length=${wordLengths[i]}`
        response = await fetch(url);
        data = await response.json();
        allWords = [...allWords, ...data];
        number -=  5;
    }
    shuffleArray(allWords)
    return allWords.join(" ")
}

function loadChart(){
    chart = new Chart(ctx, {
        type: 'line',
        data: {
        labels: progressLabels,
        datasets: [{
            data: [],
            borderWidth: 1,
            label : "Average"
        },
        {
            data: [],
            borderWidth: 1,
            label : "Current"
        }
    ]
        },
        options: {
            maintainAspectRatio: false,
            responsive : true,
            scales: {
                y: {
                beginAtZero: true,
                title : {
                    display : true,
                    text : "Words Per Minute"
                },
                max : wpmMax
                },
                x: {
                    beginAtZero : true,
                    title : {
                        display : true,
                        text : "Progress (%)"
                    }
                }
            }
        }
    });
    chart.update();
}


async function loadPhrase(){
    phrase = await getPhrase();
    console.log(phrase)
    wordCount = phrase.split(" ").length;
    wordProgressUpdate = Math.floor(wordCount / (progressIntervalGap))
    let charElement;
    let createPDivElement= true;
    let pDivElement;
    resetTyper();
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

    document.addEventListener("keydown", handleTypeEvent);
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
    if (incorrect > 0){
        charElements[idx].className = "";
        charElements[idx].classList.add(...typedClassList);
        if (charElements[idx].textContent == "_") {
            charElements[idx].classList.add("blanks");

        }
        else {
            charElements[idx].classList.add("text-danger");
        }
        charElements[idx].classList.add("border-bottom","border-danger", "border-2", "bg-info", "bg-opacity-10");
    }
    }

function setCurrent(correct, incorrect){
    idx = correct + incorrect
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

function setAverageWordsPerMinute(startTime, endTime, words){
    let deltaTimeSeconds = (endTime - startTime) / 1000;
    let wpm = Math.floor((words / deltaTimeSeconds) * 60) || 0
    wpmElement.textContent = `${wpm} WPM` 
    chart.data.datasets[0].data = Array(chart.data.datasets[1].data.length + 1).fill(wpm);
    chart.update();
}

function setCurrentWordsPerMinute(startTime, endTime, words){
    let deltaTimeSeconds = (endTime - startTime) / 1000;
    let wpm = Math.floor((words / deltaTimeSeconds) * 60) || 0
    chart.data.datasets[1].data.push(wpm);
    chart.update();
}

function setAccuracy(correct, incorrectTotal){
    let accuracy = Math.round(correct / (correct + incorrectTotal) * 100);
    accuracyElement.textContent = `${accuracy} %`

}

function setProgress(wordsComplete, wordCount){
    let progress = Math.floor(wordsComplete / wordCount * 100);
    progressElement.textContent = `${progress} %`
}
let firstScroll = true;
function scrollPhrase(correct, incorrect){
    idx = correct + incorrect
    if (idx < 1 || incorrect > 0){
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

function typeEvent(event){
    if (event.key == " "){
        event.preventDefault();
    }
    if (correct == charElements.length){
        console.log('Type Complete....');
        return
    }
    if (!startTimeSet){
        startTimeSet = true;
        startTime = new Date().getTime();
        currentIntervalStartTime = new Date().getTime();
    }    
    if(event.key == "Shift"){
        return
    }
    else if(event.key == "Backspace"){
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
        if(incorrect == 0 
            && (event.key == charElements[correct].textContent
            ||  event.key == " " && charElements[correct].textContent == "_")
            ){
            correct += 1;
            console.log(correct)
            if(event.key == " " || correct == charElements.length){
                words += 1
                progressPercentage = (words / wordCount) * 100
                if (progressPercentage >= progressLabels[currentIntervalUpdate]){
                    currentIntervalEndTime = new Date().getTime();
                    setAverageWordsPerMinute(startTime, 
                        currentIntervalEndTime, 
                        words
                    );
                    setCurrentWordsPerMinute(
                        currentIntervalStartTime, 
                        currentIntervalEndTime, 
                        words - previousWordsInterval
                    );
                    currentIntervalStartTime = currentIntervalEndTime;
                    previousWordsInterval = words;
                    currentIntervalUpdate += 1;
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
        setProgress(words, wordCount);
        setInCorrectTyped(correct, incorrect);       
        setCurrent(correct, incorrect);
        scrollPhrase(correct, incorrect);

       
}