// controllers/taskController.js
const Task = require('../models/task');

// Obtener todas las tareas del usuario logueado
exports.getAllTasks = async (req, res) => {
    try {
        // Usa el modelo para encontrar las tareas por el ID de usuario (obtenido del token JWT)
        const tasks = await Task.findByUserId(req.user.id);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las tareas" });
    }
};

// Crear una nueva tarea
exports.createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        // Validación simple
        if (!title) {
            return res.status(400).json({ error: 'El título es obligatorio' });
        }
        // Crea la tarea asociada al ID del usuario
        const taskId = await Task.create(title, description || '', req.user.id);
        res.status(201).json({ message: 'Tarea creada con éxito', taskId });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la tarea' });
    }
};

// Actualizar una tarea existente
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;

        // Primero, verifica si la tarea pertenece al usuario
        const task = await Task.findById(id);
        if (!task || task.user_id !== req.user.id) {
            return res.status(404).json({ error: 'Tarea no encontrada o no autorizada' });
        }
        
        // Actualiza la tarea
        await Task.update(id, title, description, completed);
        res.json({ message: 'Tarea actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
};

// Eliminar una tarea
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica si la tarea pertenece al usuario antes de eliminarla
        const task = await Task.findById(id);
        if (!task || task.user_id !== req.user.id) {
            return res.status(404).json({ error: 'Tarea no encontrada o no autorizada' });
        }

        await Task.delete(id);
        res.json({ message: 'Tarea eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
};