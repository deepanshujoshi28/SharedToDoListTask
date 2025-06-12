import { Request, Response } from 'express';
import {
  createTodo,
  getTodosSharedToMe,
  getTodosSharedByMe,
  getTodosCreatedByMeOrSharedToMe,
  getTodosCreatedByMe,
  deleteTodoById,
  updateTodoById,
  Todo,
} from '../models/todoModel';

export const createTodoHandler = async (req: Request, res: Response): Promise<void> => {
  const { title, description, sharedWith } = req.body;

  
  const userId = (req as any).user?.userId;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const todo: Todo = await createTodo({
      title,
      description: description || '',
      createdBy: userId,
      sharedWith: sharedWith || [],
    });
    res.status(201).json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

export const getTodosByCategory = async (req: Request, res: Response): Promise<void> => {
  const user = (req as any).user;
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const userId = user.userId;
    const userEmail = user.userEmail;

    const sharedToMe: Todo[] = await getTodosSharedToMe(userEmail);
    const sharedByMe: Todo[] = await getTodosSharedByMe(userId);
    const createdByMe: Todo[] = await getTodosCreatedByMe(userId);
    const createdByMeOrSharedToMe: Todo[] = await getTodosCreatedByMeOrSharedToMe(userId, userEmail);

    res.status(200).json({
      sharedToMe,
      sharedByMe,
      createdByMe,
      createdByMeOrSharedToMe,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch todos by category' });
  }
};

export const updateTodoHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.userId;
  const todoId = req.params.id;
  const updates = req.body;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const updatedTodo = await updateTodoById(todoId, userId, updates);

    if (!updatedTodo) {
      res.status(403).json({ error: 'You are not authorized to update this todo.' });
      return;
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ error: 'Server error while updating todo.' });
  }
};

export const deleteTodoHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.userId;
  const todoId = req.params.id;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const deleted = await deleteTodoById(todoId, userId);

    if (!deleted) {
      res.status(403).json({ error: 'Not authorized or not found' });
      return;
    }

    res.status(200).json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};
