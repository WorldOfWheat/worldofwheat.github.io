class HTMLControl {
    constructor() {
        this.inputField = document.getElementById('input_field');
        this.codeType = document.getElementById('code_type');
    }

    // 答案控制
    
    /**
     * @description 顯示答案
     */
    showAnswer(answer) {
        this.inputField.readOnly = true;
        this.inputField.style.color = 'red';
        this.inputField.value = answer;
    }
    
    /**
     * @description 隱藏答案
     */
    hideAnswer() {
        this.inputField.readOnly = false;
        this.inputField.style.color = 'black';
        this.inputField.value = '';
    }
    
    /**
     * @description 選單控制
     */
    #closeAllSelections() {
        for (let i = 0; i < 3; i++) {
            const selections = document.getElementById(i + '_selections');
            selections.style.opacity = 0;
            selections.style.zIndex = 0;
        }    
    }
    
    /**
     * @description 切換字母選單
     */
    switchSelections(selectionsID) {
        if (!(0 <= selectionsID && selectionsID <= 2)) {
            console.error('Invalid selectionsID');
            return;
        }

        cssAnimation.setReadyLayer();

        const selections = document.getElementById(selectionsID + '_selections');
        if (selections.style.opacity == 0) {
            this.#closeAllSelections();
            document.getElementById("selection_panel").style.zIndex = 5;
        }

        selections.style.opacity = 100 - selections.style.opacity;
        selections.style.zIndex = 1;

        if (selections.style.opacity == 0) {
            document.getElementById("selection_panel").style.zIndex = 3;
        }
    }
    
    /**
     * @description 全選控制
     */
    selectAll(selectionsID, check) {
        const selections = document.getElementsByClassName('selection-' + selectionsID);
        
        Array.from(selections).forEach(selection => {
            selection.getElementsByTagName('input')[0].checked = check;
        });
    }

    getAllSelected() {
        const selections = document.getElementsByClassName('selection');
        let selected = [];
        Array.from(selections).forEach(selection => {
            if (selection.getElementsByTagName('input')[0].checked) {
                selected.push(selection.getElementsByTagName('input')[0].value);
            }
        });
        return selected;
    }

    /**
     * @description 設定目前題目的分類
     */
    setTestType(testType) {
        switch (testType) {
            case '0':
                this.codeType.innerText = '一級簡碼';               
                this.codeType.style.backgroundColor = '#47B84F';
                break;
            case '1':
                this.codeType.innerText = '二級簡碼';               
                this.codeType.style.backgroundColor = '#4F47B8';
                break;
            case '2':
                this.codeType.innerText = '特別碼';               
                this.codeType.style.backgroundColor = '#B84F47';
                break;
            default: 
                console.error('Invalid testType');
                break;
        } 
    }

    clearInputField() {
        this.inputField.value = '';
    }

    focusInputField() {
        this.inputField.focus();
    }

    blurInputField() {
        this.inputField.blur();
    }

    focusStartButton() {
        document.getElementById('start_button').focus();
    }
}