import { type Request, type Response } from 'express'
import TodoModel from '../../models/todo'
import { type ITodo } from './../../types/todo'

// Get all the tasks
const getTodosByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      params: { userEmail }
    } = req
    const todos: ITodo[] = await TodoModel.find({
      userEmail
    })
    res.status(200).json({ todos })
  } catch (error) {
    res.status(500).json({ msg: 'Error when getting all todos' })
  }
}

// ADD a new todo
const addTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Pick<
      ITodo,
      'title' | 'id' | 'completed' | 'userEmail'
    >
    const {
      params: { userEmail }
    } = req
    const todo: ITodo = new TodoModel({
      user: body.userEmail,
      title: body.title,
      id: body.id,
      completed: body.completed
    })

    const newTodo: ITodo = await todo.save()
    const allTodos: ITodo[] = await TodoModel.find({ userEmail })

    res
      .status(201)
      .json({ message: 'Todo added', todo: newTodo, todos: allTodos })
  } catch (error) {
    res.status(500).json({ msg: 'Error when creating a todo' })
  }
}

// Update a todo
const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      params: { id, userEmail },
      body
    } = req
    const updateTodo: ITodo | null = await TodoModel.findByIdAndUpdate(
      { _id: id },
      body,
      { new: true, runValidators: true }
    )
    const allTodos: ITodo[] = await TodoModel.find({ userEmail })
    res.status(200).json({
      message: 'Todo updated',
      todo: updateTodo,
      todos: allTodos
    })
  } catch (error) {
    res.status(500).json({ msg: 'Error when updating a todo' })
  }
}

// Delete a todo
const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      params: { id, userEmail }
    } = req
    const deletedTodo: ITodo | null = await TodoModel.findByIdAndRemove(id)
    const allTodos: ITodo[] = await TodoModel.find({ userEmail })
    res.status(200).json({
      message: 'Todo deleted',
      todo: deletedTodo,
      todos: allTodos
    })
  } catch (error) {
    res.status(500).json({ msg: 'Error when deleting a todo' })
  }
}

export { getTodosByUser, addTodo, updateTodo, deleteTodo }
