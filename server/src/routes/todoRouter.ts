import express from 'express';
import {
  createTodoHandler,
  getTodosByCategory,
  updateTodoHandler,
  deleteTodoHandler,
} from '../controllers/todoController';

const router = express.Router();

router.post('/', createTodoHandler);
router.get('/categories', getTodosByCategory);
router.put('/:id', updateTodoHandler);
router.delete('/:id', deleteTodoHandler);

export default router;
