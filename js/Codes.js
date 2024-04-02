class Codes {
    constructor() {
        this.urls = [
            'https://raw.githubusercontent.com/WorldOfWheat/worldofwheat.github.io/main/tables/%E4%B8%80%E7%B4%9A%E7%B0%A1%E7%A2%BC.json',
            'https://raw.githubusercontent.com/WorldOfWheat/worldofwheat.github.io/main/tables/%E4%BA%8C%E7%B4%9A%E7%B0%A1%E7%A2%BC.json',
            'https://raw.githubusercontent.com/WorldOfWheat/worldofwheat.github.io/main/tables/%E7%89%B9%E5%88%A5%E7%A2%BC.json'
        ];
    }
    
    init() {
        let fetchTask = []
        for (let i = 0; i < 3; i++) {
            fetchTask.push(this.#fetchTable(i));
        }

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
        if (!(0 <= type && type <= 2)) {
            console.error('Invalid type');
            return;
        }
        return this[type + '_table'];
    }
}