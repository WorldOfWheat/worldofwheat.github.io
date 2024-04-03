class AnimationControl {
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
     * @description 計算下一個 span 與 target 的差距（vw）
     */
    #calculateSpanTargetDifference() {
        const lastSpanPosition = this.#getSpanPosition(this.tray.children[this.tray.childElementCount - 2]);
        const targetPosition = document.getElementById('target').getBoundingClientRect().right; 
        const difference = lastSpanPosition - targetPosition + 8;
        const differenceInVw = difference / window.innerWidth * 100;
        return differenceInVw;
    }
    
    /**
     * @param {number} offset
     * @description 移動 tests_tray
     */
    moveTestsTray() {
        const offset = this.#calculateSpanTargetDifference();
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
}

class Selection {
    constructor(labelText, selectionClasses = null, checkboxValue = null) {
        this.text = labelText;
        this.classes = selectionClasses;
        this.value = checkboxValue;
    }

    getSelectionElement() {
        // selection 
        const selection = document.createElement('div');
        if (this.classes != null)
            Array.from(this.classes.split(' ')).forEach(className => selection.classList.add(className));
        selection.classList.add('selection');

        // selection property
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = this.value;

        const label = document.createElement('label');
        label.textContent = this.text;

        selection.appendChild(checkbox);
        selection.appendChild(label);

        return selection;
    }
}

function main() {
    const firstKeys = 'abcdefghijklmnopqrstuvwxyz;/.,';
    const selectionsObject = document.getElementsByClassName('selections');

    let selectionsTypeCounter = 0
    Array.from(selectionsObject).forEach(selections => {
        // create selections div
        const selectionsLeft = document.createElement('div');
        const selectionsRight = document.createElement('div');
        selectionsLeft.classList.add('left');
        selectionsRight.classList.add('right');
        
        let firstKeysCounter = 0;
        Array.from(firstKeys).forEach(key => {
            firstKeysCounter++;

            // selection elements
            const selection = new Selection(key, 'selection-' + selectionsTypeCounter, selectionsTypeCounter + '-' + key).getSelectionElement();
            
            // deside the dropdown list left or right
            if (firstKeysCounter <= firstKeys.length / 2)
                selectionsLeft.appendChild(selection);
            else
                selectionsRight.appendChild(selection);
        });

        // append to selections content
        selections.appendChild(selectionsLeft);
        selections.appendChild(selectionsRight);

        // to prevent selectionTypeCounter from changing
        const _parameter = selectionsTypeCounter;
        // select all button
        const selectionButton = document.createElement('button');
        selectionButton.textContent = '全選';
        selectionButton.classList.add('button');
        selectionButton.onclick = function () { htmlControl.selectAll(_parameter, true) };
        selectionButton.style.marginTop = '8px';
        selectionsLeft.appendChild(selectionButton);

        // unselect all button
        const unselectionButton = document.createElement('button');
        unselectionButton.textContent = '全不選';
        unselectionButton.classList.add('button');
        unselectionButton.onclick = function () { htmlControl.selectAll(_parameter, false) };
        unselectionButton.style.marginTop = '8px';
        selectionsRight.appendChild(unselectionButton);

        selectionsTypeCounter++;
    });
}

main();