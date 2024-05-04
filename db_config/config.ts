import mysql, { Connection, MysqlError } from 'mysql';

// Create a connection pool
const sql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pharmacy'
});

sql.connect(function(error) {
    if(error) throw error;
    console.log('Connected to the MySQL');
});

export default sql;