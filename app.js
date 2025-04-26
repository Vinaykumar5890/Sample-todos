const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const cors = require('cors')
const {v4: uuidv4} = require('uuid')
const databasePath = path.join(__dirname, 'todo.db')

const app = express()

app.use(express.json())
app.use(cors({origin: '*'}))

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    })

    app.listen(3000, () =>
      console.log('Server Running at http://localhost:3000/'),
    )
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}

initializeDbAndServer()

app.get("/" , async (req,res)=>{
    const selectTodos = `SELECT * FROM todos`;
    const dbResponse  = await database.all(selectTodos);
    res.status(200).send(dbResponse)
})

app.post("/", async (req,res)=>{
    const{name} = req.body
    const ids  = uuidv4();
    const postTodos = `INSERT INTO todos(id,name) VALUES ('${ids}' , '${name}')`;
    const dbResponse = await database.run(postTodos)
    res.status(200).send(dbResponse)
})

app.delete("/:id" , async (req,res)=>{
    const {id} = req.params 
    const deleteTodos = `DELETE FROM todos WHERE id = '${id}'`;
    const dbResponse = await database.run(deleteTodos);
    res.status(201).send("Deleted")
})

app.put("/:id" , async(req,res)=>{
    const  {id} = req.params 
    const { name} = req.body
    const selectTodos  = `SELECT * FROM todos WHERE id = '${id}'`;
    const dbResponse  = await databse.get(selectTodos);
    const updateTodos  = `UPDATE todos SET name  = '${name || dbResponse.name }'  WHERE id ='${id}'`;
    const dbResponse1 = await database.run(updateTodos)
    res.status(200).send("updated")
})

module.exports = app
