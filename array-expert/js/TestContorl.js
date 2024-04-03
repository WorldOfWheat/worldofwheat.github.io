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
                result.push([answer, question]);
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
                    result.push([answer, question]);
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
            result.push([code, character]);
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
    
    #getFirstTestPosition(firstKey, codes) {
        let l = 0, r = codes.length;
        while (l < r) {
            let mid = Math.floor((l + r) / 2);
            if (codes[mid][0][0] < firstKey) {
                l = mid + 1;
            } else {
                r = mid;
            }
        }
        return l;
    }
    
    getRandomTest(types) {
        let codes = [];
        // get all codes
        const rawLevel1Codes = codesInstance.getCodes(0);
        const rawLevel2Codes = codesInstance.getCodes(1);
        const rawSpecialCodes = codesInstance.getCodes(2);
        // format codes, and sort them for binary search
        codes.push(this.#formatLevel1Code(rawLevel1Codes).sort());
        codes.push(this.#formatLevel2Code(rawLevel2Codes).sort());
        codes.push(this.#formatSpecialCode(rawSpecialCodes).sort());

        let result = [];
        // get all selected types
        Array.from(types).forEach(type => {
            const codeType = type.split('-')[0];
            const firstKey = type.split('-')[1];
            // get the first key position in the specify codes
            const firstKeyPosition = this.#getFirstTestPosition(firstKey, codes[codeType]);
            // get all codes with the same first key and put them into result
            let testCounter = firstKeyPosition;
            while (testCounter < codes[codeType].length && codes[codeType][testCounter][0][0] === firstKey) {
                result.push([codes[codeType][testCounter], codeType]);
                testCounter++;
            }
        });

        this.#shuffle(result);

        return result;
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
        if (answer === this.getAnswer()) {
            this.currentTestCounter++;
            return true;
        }
        return false;
    }
    
    nextTest() {
        if (this.nextTestCounter >= this.tests.length) {
            return ' ';
        }
        return this.tests[this.nextTestCounter++][0][1];
    }
    
    getAnswer() {
        return this.tests[this.currentTestCounter][0][0];
    }

    getType() {
        return this.tests[this.currentTestCounter][1];
    }

    ifEnd() {
        return this.currentTestCounter >= this.tests.length;
    }

    ifInputCharacterAmountMatch(charactersAmount) {
        switch (this.tests[this.currentTestCounter][1]) {
            case '0':
                return charactersAmount === 2;
            case '1':
                return charactersAmount === 3;
            case '2':
                return charactersAmount === 3;
        }
    }
}
