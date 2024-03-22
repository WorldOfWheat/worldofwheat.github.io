class Codes {
    constructor() {
        this.urls = {
            'level1': 'https://raw.githubusercontent.com/WorldOfWheat/fast-array.github.io/main/tables/%E4%B8%80%E7%B4%9A%E7%B0%A1%E7%A2%BC.json',
            'level2': 'https://raw.githubusercontent.com/WorldOfWheat/fast-array.github.io/main/tables/%E4%BA%8C%E7%B4%9A%E7%B0%A1%E7%A2%BC.json',
            'special': 'https://raw.githubusercontent.com/WorldOfWheat/fast-array.github.io/main/tables/%E7%89%B9%E5%88%A5%E7%A2%BC.json'
        };
    }
    
    init() {
        let fetchTask = []
        Array.from(['level1', 'level2', 'special']).forEach(type => {
            fetchTask.push(this.#fetchTable(type));
        });

        return Promise.all(fetchTask);
    }
    
    #fetchTable(type) {
        return fetch(this.urls[type])
            .then(response => {
                return response.json();
            })
            .then(response => {
                this[type + '_table'] = response;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    
    getCodes(type) {
        if (type != 'level1' && type != 'level2' && type != 'special') {
            console.error('Invalid type');
            return;
        }
        return this[type + '_table'];
    }
}

class CSSAnimation {
    constructor() {
        this.frontTestCounter = 0
        this.tray = document.getElementById('tests_tray');
    }
    
    #getSpanPosition(span) {
        return span.getBoundingClientRect().right;
    }

    moveTestsTray(offset) {
        const currentTransform = getComputedStyle(this.tray).transform;
        const matrix = new WebKitCSSMatrix(currentTransform);
        const currentVW = matrix.m41 / window.innerWidth * 100
        const newTransform = `translate(${currentVW - offset}vw, 0)`;
        this.tray.style.transform = newTransform;
    }

    removeFrontTest() {
        const frontTest = this.tray.children[this.frontTestCounter++];
        frontTest.style.opacity = 0;
    }
    
    addTest(test) {
        const newSpan = document.createElement('span');
        newSpan.textContent = test;
        this.tray.appendChild(newSpan);
    }
    
    // 計算下一個 span 與 target 的差距
    calculateSpanTargetDifference() {
        const lastSpanPosition = this.#getSpanPosition(this.tray.children[this.tray.childElementCount - 2]);
        const targetPosition = document.getElementById('target').getBoundingClientRect().right; 
        const difference = lastSpanPosition - targetPosition + 8;
        const differenceInVw = difference / window.innerWidth * 100;
        return differenceInVw;
    }
    
    clearTestsTray() {
        this.tray.innerHTML = '';
        this.tray.style.transform = 'translate(40.5vw, 0)';
    }
    
    // remove ready layer
    removeReadyLayer() {
        document.getElementById('beginning').style.width = '0%';
        document.getElementById('start_button').style.transform = 'translate(-100%, -50%)';
    }
    
    // set ready layer
    setReadyLayer() {
        document.getElementById('beginning').style.width = '100%';
        document.getElementById('start_button').style.transform = 'translate(-50%, -50%)';
    }
    
    showAnswer(answer) {
        document.getElementById('input_field').readOnly = true;
        document.getElementById('input_field').style.color = 'red';
        document.getElementById('input_field').value = answer;
    }
    
    hideAnswer() {
        document.getElementById('input_field').readOnly = false;
        document.getElementById('input_field').style.color = 'black';
        document.getElementById('input_field').value = '';
    }
}

class Tests {
    constructor() {
        this.keys = 'abcdefghijklmnopqrstuvwxyz;/.,';
    }

    // format level 1 code
    #formatLevel1Code(data) {
        let result = [];
        const keyLength = this.keys.length;
        for (let i = 0; i < keyLength; i++) {
            const selectionKeyAndCharacter = data[this.keys[i]];
            for (let j = 0; j < 10; j++) {
                const question = selectionKeyAndCharacter[j][0]; // character
                if (question === '⎔') {
                    continue;
                }
                const selectionKey = selectionKeyAndCharacter[j][1];
                const answer = this.keys[i] + selectionKey; // first key + selection key
                result.push({q: question, a: answer});
            }
        };
        return result;
    }

    // format level 2 code
    #formatLevel2Code(data) {
        let result = [];
        const keyLength = this.keys.length;
        for (let i = 0; i < keyLength; i++) {
            for (let j = 0; j < keyLength; j++) {
                const firstKey = this.keys[i] + this.keys[j];
                const selectionKeyAndCharacter = data[firstKey];
                for (let k = 0; k < 10; k++) {
                    const question = selectionKeyAndCharacter[k][0]; // character
                    if (question === '⎔') {
                        continue;
                    }
                    const selectionKey = selectionKeyAndCharacter[k][1]; // selection key
                    const answer = firstKey + selectionKey; // first key + selection key
                    result.push({q: question, a: answer});
                }
            }
        }
        return result;
    }
    
    // format special code
    #formatSpecialCode(data) {
        let result = [];
        for (let i = 0; i < data.length; i++) {
            const codeAndCharacter = data[i];
            const code = Object.keys(codeAndCharacter)[0];
            const character = codeAndCharacter[code];
            result.push({q: character, a: code});
        }
        return result;
    }
    
    #getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    #shuffle(array) {
        for (let i = 0; i < array.length; i++) {
            const swapIndex = this.#getRandomInt(i, array.length - 1);
            [array[i], array[swapIndex]] = [array[swapIndex], array[i]];
        }
        return array;
    }
    
    #removeCodes(removedCode, codes) {
        removedCode = removedCode.map((code) => code.q);
        removedCode.sort();
        
        let result = [];
        for (let i = 0; i < codes.length; i++) {
            if (removedCode.includes(codes[i].q)) {
                continue;
            }
            result.push(codes[i]);
        }
        
        codes = result;
    }
    
    getRandomTest(type) {
        switch (type) {
            case 'level1': {
                const rawCodes = codesInstance.getCodes(type);
                const codes = this.#formatLevel1Code(rawCodes);
                this.#shuffle(codes);
                return codes;
            }
            case 'level2': {
                // read level 2 codes
                const rawCodes = codesInstance.getCodes(type);
                let codes = this.#formatLevel2Code(rawCodes);

                // read level 1 codes
                const rawlevel1Codes = codesInstance.getCodes('level1');
                let level1Codes = this.#formatLevel1Code(rawlevel1Codes);
                // remove level 1 codes
                this.#removeCodes(level1Codes, codes);

                this.#shuffle(codes);

                return codes;
            }
            case 'special': {
                const rawCodes = codesInstance.getCodes(type);
                let codes = this.#formatSpecialCode(rawCodes);
                
                // read level 1 codes
                const rawlevel1Codes = codesInstance.getCodes('level1');
                let level1Codes = this.#formatLevel1Code(rawlevel1Codes);

                // remove level 1 codes
                this.#removeCodes(level1Codes, codes);

                this.#shuffle(codes);
                
                return codes;
            }               
            default:
                console.error('Invalid type');
                break;
        }
    }
}

class Testing {
    constructor(tests) {
        this.tests = tests;
        this.currentTestCounter = 0;
        this.nextTestCounter = 0;
    }
    
    compareAnswer(answer) {
        console.warn(this.tests[this.currentTestCounter].a);
        if (answer === this.tests[this.currentTestCounter].a) {
            this.currentTestCounter++;
            return true;
        }
        return false;
    }
    
    nextTest() {
        return this.tests[this.nextTestCounter++];
    }
    
    getAnswer() {
        return this.tests[this.currentTestCounter].a;
    }
}

const codesInstance = new Codes();
const cssAnimation = new CSSAnimation();
const tests = new Tests();
let testing;

let currentType = 'level1';
function typeSelect(buttonID) {
    if (buttonID != 'level1' && buttonID != 'level2' && buttonID != 'special') {
        console.error('Invalid button id');
        return;
    }

    currentType = buttonID;
    cssAnimation.clearTestsTray();
    cssAnimation.setReadyLayer();
    // get all selection buttons
    const typeSelectButtons = document.getElementsByClassName('typeSelectButton');
    Array.from(typeSelectButtons).forEach(button => {
        if (button.id != buttonID) {
            button.disabled = false;
        }
        else {
            button.disabled = true;
        }
    });
}

function startTest() {
    cssAnimation.removeReadyLayer();
    const testsData = tests.getRandomTest(currentType);
    testing = new Testing(testsData);

    for (let i = 0; i < 3; i++) {
        cssAnimation.addTest(testing.nextTest().q);
    }
}

function main() {
    // 等待簡碼表載入完成
    // document.getElementById('body').style.display = 'block';
    codesInstance.init().then(() => { 
        console.log('Codes loaded');
        document.getElementById('body').style.display = 'block';
    });
}

main();

let wrongCounter = 0;
const inputField = document.getElementById('input_field');
inputField.addEventListener('input', (event) => {
    const answer = inputField.value;
    // 檢查是否為 level 1 且長度為 2
    if (currentType === 'level1' && answer.length !== 2) {
        return;
    }
    // 檢查是否為 level 2 且長度為 3
    if (currentType === 'level2' && answer.length !== 3) {
        return;
    }

    if (testing.compareAnswer(answer)) {
        cssAnimation.moveTestsTray(cssAnimation.calculateSpanTargetDifference());
        if (testing.currentTestCounter >= 3) {
            cssAnimation.removeFrontTest();
        }
        cssAnimation.addTest(testing.nextTest().q);
    }                                
    else {                        
        wrongCounter++;
        if (wrongCounter >= 3) {
            const answer = testing.getAnswer();
            cssAnimation.showAnswer(answer);
            wrongCounter = 0;
            setTimeout(() => {
                cssAnimation.hideAnswer();
            }, 1000);
            return;
        }
    }
    inputField.value = '';

});