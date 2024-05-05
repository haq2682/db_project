import mysql, { Connection, MysqlError } from 'mysql';

const sql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pharmacy'
});

export async function connectToDatabase() {
    return new Promise<void>((resolve, reject) => {
        sql.connect(function(error) {
            if(error) reject(error);
            console.log('Connected to the MySQL');
            resolve();
        });
    });
}

export default sql;