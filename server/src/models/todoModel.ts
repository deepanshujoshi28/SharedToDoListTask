import db from '../config/db';


export interface Todo {
  id: string;
  title: string;
  description: string;
  created_by: string;
  shared_with: string[];
  created_at: Date;
  updated_at?: Date;
}

interface CreateTodoInput {
  title: string;
  description: string;
  createdBy: string;
  sharedWith?: string[];
}

export const createTodo = async ({
  title,
  description,
  createdBy,
  sharedWith = [],
}: CreateTodoInput): Promise<Todo> => {
  const result = await db.query(
    `INSERT INTO todos (title, description, created_by, shared_with)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, description, createdBy, sharedWith]
  );
  return result.rows[0];
};

export const getTodosSharedToMe = async (userEmail: string): Promise<Todo[]> => {
  const result = await db.query(
    `SELECT * FROM todos 
     WHERE $1 = ANY(shared_with) 
     AND created_by != (SELECT id FROM users WHERE email = $1)
     ORDER BY created_at DESC`,
    [userEmail]
  );
  return result.rows;
};

export const getTodosSharedByMe = async (userId: string): Promise<Todo[]> => {
  const result = await db.query(
    `SELECT * FROM todos 
     WHERE created_by = $1 
     AND array_length(shared_with, 1) > 0
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};

export const getTodosCreatedByMe = async (userId: string): Promise<Todo[]> => {
  const result = await db.query(
    `SELECT * FROM todos 
     WHERE created_by = $1 
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};

export const getTodosCreatedByMeOrSharedToMe = async (
  userId: string,
  userEmail: string
): Promise<Todo[]> => {
  const result = await db.query(
    `SELECT * FROM todos 
     WHERE created_by = $1 
     OR $2 = ANY(shared_with)
     ORDER BY created_at DESC`,
    [userId, userEmail]
  );
  return result.rows;
};

interface UpdateTodoInput {
  title: string;
  description: string;
  sharedWith: string[];
}

export const updateTodoById = async (
  todoId: string,
  userId: string,
  updates: UpdateTodoInput
): Promise<Todo | undefined> => {
  const { title, description, sharedWith } = updates;

  const result = await db.query(
    `UPDATE todos
     SET title = $1,
         description = $2,
         shared_with = $3
     WHERE id = $4 AND created_by = $5
     RETURNING *`,
    [title, description, sharedWith, todoId, userId]
  );

  return result.rows[0];
};

export const deleteTodoById = async (
  todoId: string,
  userId: string
): Promise<Todo | undefined> => {
  const result = await db.query(
    `DELETE FROM todos 
     WHERE id = $1 AND created_by = $2
     RETURNING *`,
    [todoId, userId]
  );
  return result.rows[0];
};
