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
        answer = answer.trim();
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
    // 檢查是否為 special 且長度為 2
    if (currentType === 'special' && answer.length !== 3) {
        return;
    }

    if (testing.compareAnswer(answer)) {
        cssAnimation.moveTestsTray(cssAnimation.calculateSpanTargetDifference());
        if (testing.currentTestCounter >= 3) {
            cssAnimation.removeFrontTest();
        }
        cssAnimation.addTest(testing.nextTest().q);
        wrongCounter = 0;
    }                                
    else {                        
        wrongCounter++;
        if (wrongCounter >= 2) {
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