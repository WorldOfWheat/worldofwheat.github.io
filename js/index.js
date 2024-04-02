const codesInstance = new Codes();
const cssAnimation = new AnimationControl();
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
