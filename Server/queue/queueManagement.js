const sqlite3 = require('sqlite3')

class QueueManagemer{
    constructor(){
        this.db = new sqlite3.Database('./database/ycut.db', (error) => {
            if (error) {
                return console.error(error.message);
            }
            console.log("sugoma")
        });
    }

    addTask(id){
        this.db.run(`INSERT INTO tasks (id) values ("${id}")`)
    }

    async getTask(id){
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM tasks WHERE id="${id}"`, (err, row) => {
                if(err) reject(err)
    
                resolve(row)
            })
        })
    }

    updateTask(id, status){
        this.db.run(`UPDATE tasks SET status=${status} WHERE id="${id}"`)
    }
}

module.exports = {
    QueueManagemer
}