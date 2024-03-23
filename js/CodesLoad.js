class Codes {
    constructor() {
        this.urls = {
            'level1': 'https://raw.githubusercontent.com/WorldOfWheat/worldofwheat.github.io/main/tables/%E4%B8%80%E7%B4%9A%E7%B0%A1%E7%A2%BC.json',
            'level2': 'https://raw.githubusercontent.com/WorldOfWheat/worldofwheat.github.io/main/tables/%E4%BA%8C%E7%B4%9A%E7%B0%A1%E7%A2%BC.json',
            'special': 'https://raw.githubusercontent.com/WorldOfWheat/worldofwheat.github.io/main/tables/%E7%89%B9%E5%88%A5%E7%A2%BC.json'
        };
    }
    
    init() {
        let fetchTask = []
        Array.from(['level1', 'level2', 'special']).forEach(type => {
            fetchTask.push(this.#fetchTable(type));
        });

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
        if (type != 'level1' && type != 'level2' && type != 'special') {
            console.error('Invalid type');
            return;
        }
        return this[type + '_table'];
    }
}