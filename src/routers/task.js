import { Router } from "express";
import auth from "../middleware/auth.js";
import Task from "../models/task.js";

const router = new Router()

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id })

  try {
    await task.save()
    res.status(201).send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get('/tasks', auth, async (req, res) => {
  const query = req.query

  try {
    const tasks = await Task.find({
      owner: req.user._id,
      ...(query.completed && { completed: query.completed === 'true' })
    }, null,{
      limit: parseInt(query.limit),
      skip: parseInt(query.skip),
      ...(query.sortBy && query.sortOrder && {
        sort: {
          [query.sortBy]: query.sortOrder === 'desc' ? -1 : 1
        }
      })
    })
    res.send(tasks)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

    if (!task) {
      return res.status(404).send()
    }

    updates.forEach((update) => task[update] = req.body[update])
    await task.save()
    res.send(task)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (err) {
    res.status(500).send(err)
  }
})

export default router