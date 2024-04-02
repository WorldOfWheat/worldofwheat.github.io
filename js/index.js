const codesInstance = new Codes();
const cssAnimation = new AnimationControl();
const htmlControl = new HTMLControl();
const tests = new Tests();
let testing;

function startTest() {
    const allSelected = htmlControl.getAllSelected().sort();
    const testsData = tests.getRandomTest(allSelected);
    if (testsData.length === 0) {
        alert('請選擇要練習的簡碼類別');
        return;
    }
    testing = new Testing(testsData);

    cssAnimation.clearTestsTray();
    cssAnimation.removeReadyLayer();

    for (let i = 0; i < 3; i++) {
        const test = testing.nextTest();
        cssAnimation.addTest(test);
    }
    htmlControl.setTestType(testing.getType());
}

function main() {
    document.getElementById('body').style.display = 'block';
    // 等待簡碼表載入完成
    codesInstance.init().then(() => { 
        console.log('Codes loaded');
        document.getElementById('body').style.display = 'block';
        tests.getRandomTest(0);
    });
}

main();
