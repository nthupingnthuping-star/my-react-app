const pool = require('../db');

// Get all users
exports.getAllUsers = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query('SELECT * FROM users', (err, rows) => {
            connection.release();
            if (!err) res.send(rows);
            else console.log(err);
        });
    });
};

// Get a user by ID
exports.getUserById = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query('SELECT * FROM users WHERE user_id = ?', [req.params.id], (err, rows) => {
            connection.release();
            if (!err) res.send(rows);
            else console.log(err);
        });
    });
};

// Delete a user
exports.deleteUser = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query('DELETE FROM users WHERE user_id = ?', [req.params.id], (err, rows) => {
            connection.release();
            if (!err) res.send(`User with id: ${req.params.id} has been removed`);
            else console.log(err);
        });
    });
};

// Add a new user
exports.addUser = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        const params = req.body;
        connection.query('INSERT INTO users SET ?', params, (err, rows) => {
            connection.release();
            if (!err) res.send(`User with name: ${params.full_names} has been added`);
            else console.log(err);
        });
    });
};

// Update a user
exports.updateUser = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        const { user_id, full_names, user_email, user_role, faculty_id } = req.body;

        connection.query(
            'UPDATE users SET full_names = ?, user_email = ?, user_role = ?, faculty_id = ? WHERE user_id = ?',
            [full_names, user_email, user_role, faculty_id, user_id],
            (err, rows) => {
                connection.release();
                if (!err) res.send(`User with id: ${user_id} has been updated`);
                else console.log(err);
            }
        );
    });
};
