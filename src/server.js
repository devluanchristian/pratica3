import express, { Router } from "express"
import { db } from "./data/db.js"
import { appRoutes } from "./router/routes.js"


export const app = express()

app.use(appRoutes)
app.use(express.json())



const PORT = 3000
app.listen(PORT, async () => {
  console.log("Server rodando na porta " + PORT)

  console.log("Aguardando a conexão....")

  setTimeout(() => {
    try {
      db.connect()
      console.log("Banco conectado com sucesso!")

    } catch (error) {

      if (error) {
        throw new Error("Erro na conexão ao banco de dados",error)
      }
    }
  }, 4000)
})

