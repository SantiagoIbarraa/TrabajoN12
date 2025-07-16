// models/Task.js
const db = require('../config/db');

class Task {
    static async create(title, description, userId) {
        const sql = 'INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)';
        const [result] = await db.execute(sql, [title, description, userId]);
        return result.insertId;
    }

    static async findByUserId(userId) {
        const sql = 'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC';
        const [rows] = await db.execute(sql, [userId]);
        return rows;
    }

    static async findById(id) {
        const sql = 'SELECT * FROM tasks WHERE id = ?';
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    }
    
    static async update(id, title, description, completed) {
        const sql = 'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?';
        const [result] = await db.execute(sql, [title, description, completed, id]);
        return result.affectedRows;
    }

    static async delete(id) {
        const sql = 'DELETE FROM tasks WHERE id = ?';
        const [result] = await db.execute(sql, [id]);
        return result.affectedRows;
    }
}

module.exports = Task;