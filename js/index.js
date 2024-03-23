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
    document.getElementById('body').style.display = 'block';
    // 等待簡碼表載入完成
    // codesInstance.init().then(() => { 
    //     console.log('Codes loaded');
    //     document.getElementById('body').style.display = 'block';
    // });
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