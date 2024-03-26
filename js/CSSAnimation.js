class CSSAnimation {
    constructor() {
        this.frontTestCounter = 0
        this.tray = document.getElementById('tests_tray');
        this.inputField = document.getElementById('input_field');
    }
    
    #getSpanPosition(span) {
        return span.getBoundingClientRect().right;
    }

    // tray 控制區
    
    /**
     * @param {number} offset
     * @description 移動 tests_tray
     */
    moveTestsTray(offset) {
        const currentTransform = getComputedStyle(this.tray).transform;
        const matrix = new WebKitCSSMatrix(currentTransform);
        const currentVW = matrix.m41 / window.innerWidth * 100
        const newTransform = `translate(${currentVW - offset}vw, 0)`;
        this.tray.style.transform = newTransform;
    }

    /**
     * @description 移除 tests_tray 的第一個顯示中的 span
     */
    removeFrontTest() {
        const frontTest = this.tray.children[this.frontTestCounter++];
        frontTest.style.opacity = 0;
    }
    
    /**
     * @param {string} test 
     * @description 新增一個 span 到 tests_tray
     */
    addTest(test) {
        const newSpan = document.createElement('span');
        newSpan.textContent = test;
        this.tray.appendChild(newSpan);
    }
    
    /**
     * @description 計算下一個 span 與 target 的差距（vw）
     */
    calculateSpanTargetDifference() {
        const lastSpanPosition = this.#getSpanPosition(this.tray.children[this.tray.childElementCount - 2]);
        const targetPosition = document.getElementById('target').getBoundingClientRect().right; 
        const difference = lastSpanPosition - targetPosition + 8;
        const differenceInVw = difference / window.innerWidth * 100;
        return differenceInVw;
    }
    
    /**
     * @description 清空 tests_tray
     */
    clearTestsTray() {
        this.tray.innerHTML = '';
        this.tray.style.transform = 'translate(40.5vw, 0)';
    }
    
    // ready layer 控制
    
    /**
     * @description 移除 ready layer
     */
    removeReadyLayer() {
        document.getElementById('beginning').style.width = '0%';
        document.getElementById('start_button').style.transform = 'translate(-100%, -50%)';
    }
    
    /**
     * @description 設定 ready layer
     */
    setReadyLayer() {
        document.getElementById('beginning').style.width = '100%';
        document.getElementById('start_button').style.transform = 'translate(-50%, -50%)';
    }
    
    // 答案控制
    
    /**
     * @description 顯示答案
     */
    showAnswer(answer) {
        this.inputField.readOnly = true;
        this.inputField.style.color = 'red';
        this.inputField.value = answer;
        this.inputField.focus();
    }
    
    /**
     * @description 隱藏答案
     */
    hideAnswer() {
        this.inputField.readOnly = false;
        this.inputField.style.color = 'black';
        this.inputField.value = '';
        this.inputField.focus();
    }
}

class SelectionProperty {
    constructor(_labelText, elementClasses = null, _hiddenValue = null) {
        this.labelText = _labelText;
        this.class = elementClasses;
        this.hiddenValue = _hiddenValue;
    }
}

function getSelectionElement(property) {
    // selection 
    const selection = document.createElement('div');
    if (property.class != null)
        selection.classList.add(property.class);
    selection.classList.add('selection');

    // selection property
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = property.hiddenValue;

    const label = document.createElement('label');
    label.textContent = property.labelText;

    selection.appendChild(checkbox);
    selection.appendChild(label);

    return selection;
}

function init() {
    const firstKeys = 'abcdefghijklmnopqrstuvwxyz;/.,';
    const dropDownContents = document.getElementsByClassName('dropdown-content');

    let dropDownContentsCounter = 0
    Array.from(dropDownContents).forEach(dropDownContent => {
        // select all selection
        const selectAllProperty = new SelectionProperty('全選', 'select_all', _hiddenValue = dropDownContentsCounter++);
        const selectAll = getSelectionElement(selectAllProperty);
        dropDownContent.appendChild(selectAll);

        let firstKeysCounter = 0;

        // create selections div
        const selectionsLeft = document.createElement('div');
        const selectionsRight = document.createElement('div');
        selectionsLeft.classList.add('selections_left');
        selectionsRight.classList.add('selections_right');

        Array.from(firstKeys).forEach(key => {
            firstKeysCounter++;

            // selection elements
            const selection = getSelectionElement(new SelectionProperty(_labelText = key, _hiddenValue = (dropDownContentsCounter + '-' + key)));
            
            // deside the dropdown list left or right
            if (firstKeysCounter <= firstKeys.length / 2)
                selectionsLeft.appendChild(selection);
            else
                selectionsRight.appendChild(selection);
        });
        dropDownContent.appendChild(selectionsLeft);
        dropDownContent.appendChild(selectionsRight);
    });
}

init();