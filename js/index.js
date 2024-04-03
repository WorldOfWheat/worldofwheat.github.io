const codesInstance = new Codes();
const cssAnimation = new AnimationControl();
const htmlControl = new HTMLControl();
const tests = new Tests();
let testing;

let wrongCounter = 0;
const inputField = document.getElementById('input_field');
inputField.addEventListener('input', (event) => {
    const answer = inputField.value;
    // if the input character amount is not match
    if (!testing.ifInputCharacterAmountMatch(answer.length)) {
        return;
    }

    // if the answer is correct
    if (testing.compareAnswer(answer)) {
        if (testing.ifEnd()) {
            // if all tests are done
            cssAnimation.setReadyLayer();
            htmlControl.focusStartButton();
            inputField.value = '';
            return;
        }
        // move the test tray
        cssAnimation.moveTestsTray();
        // if the test tray is full, remove the front test
        if (testing.currentTestCounter >= 3) {
            cssAnimation.removeFrontTest();
        }
        cssAnimation.addTest(testing.nextTest());
        htmlControl.setTestType(testing.getType());
        wrongCounter = 0;
    }                                
    else {                        
        // if the answer is wrong
        wrongCounter++;
        if (wrongCounter >= 2) {
            htmlControl.blurInputField();
            // show the answer
            const answer = testing.getAnswer();
            htmlControl.showAnswer(answer);
            wrongCounter = 0;
            // hide the answer after 1 second
            setTimeout(() => {
                htmlControl.focusInputField();
                htmlControl.hideAnswer();
            }, 1000);
            return;
        }
    }
    inputField.value = '';
});

function startTest() {
    // get all selected test types
    const allSelected = htmlControl.getAllSelected().sort();
    const testsData = tests.getRandomTest(allSelected);
    if (testsData.length === 0) {
        alert('請選擇要練習的簡碼類別');
        return;
    }
    
    // clear previous testing
    delete testing;
    testing = new Testing(testsData);

    // clear previous tests setting
    htmlControl.focusInputField();
    htmlControl.clearInputField();
    cssAnimation.frontTestCounter = 0;
    cssAnimation.removeReadyLayer();
    cssAnimation.clearTestsTray();

    // add first 3 tests
    for (let i = 0; i < 3; i++) {
        const test = testing.nextTest();
        cssAnimation.addTest(test);
    }
    htmlControl.setTestType(testing.getType());
}

function main() {
    // 等待簡碼表載入完成
    codesInstance.init().then(() => { 
        document.getElementById('body').style.display = 'block';
        tests.getRandomTest(0);
    });
}

main();
