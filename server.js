const express = require("express")
const app = express()
const port = 3000
app.use(express.json())
const fs = require("fs")

// guardar o ultimo id
let ultimoId = 0

// ler o arquivo que guarda o ultimo id
try {
    const dadosId = JSON.parse(fs.readFileSync("ultimoId.json", "utf8"))
    ultimoId = dadosId.ultimoId
} catch (erro) {
    console.log("Erro ao ler o arquivo de ID: " + erro.message)
}


// CADASTRAR UMA NOVA AULA
app.post("/aulas", (req, res) => {

    const aula = req.body

    try {

        // abrir arquivo
        const bd = JSON.parse(fs.readFileSync("bd.json", "utf8"))

        // criar novo id automaticamente
        ultimoId = ultimoId + 1

        // colocar o id na aula
        aula.id = ultimoId

        // adicionar a aula no banco de dados
        bd.push(aula)

        // salvar o banco de dados
        fs.writeFileSync("bd.json", JSON.stringify(bd), "utf8")

        // salvar o ultimo id
        fs.writeFileSync(
            "ultimoId.json",
            JSON.stringify({ ultimoId: ultimoId }),
            "utf8"
        )

        // resposta
        res.status(201).json({
            resposta: "aula cadastrada com sucesso!",
            aula: aula
        })

    } catch (erro) {

        res.status(500).json({
            erro: erro.message
        })

    }
})


// CONSULTAR OS HORÁRIOS DAS AULAS
app.get("/aulas", (req, res) => {

    try {

        // abrir arquivo
        const bd = JSON.parse(fs.readFileSync("bd.json", "utf8"))

        // resposta
        res.status(200).json({
            resposta: bd
        })

    } catch (erro) {

        res.status(500).json({
            erro: erro.message
        })

    }
})


// EXCLUIR UMA AULA PELO ID
app.delete("/aulas/:id", (req, res) => {

    // pegar id da rota
    const id = Number(req.params.id)

    try {

        // abrir arquivo
        const bd = JSON.parse(fs.readFileSync("bd.json", "utf8"))

        // encontrar o indice da aula
        const indiceAula = bd.findIndex((aula) => aula.id == id)

        // verificar se a aula existe
        if (indiceAula == -1) {

            return res.status(404).json({
                erro: "aula não existe no BD, digite novamente!!!"
            })

        }

        // excluir a aula
        bd.splice(indiceAula, 1)

        // salvar o arquivo
        fs.writeFileSync(
            "bd.json",
            JSON.stringify(bd),
            "utf8"
        )

        // resposta
        res.status(200).json({
            resposta: "aula excluída com sucesso!"
        })

    } catch (erro) {

        res.status(500).json({
            erro: erro.message
        })

    }
})


// iniciar a API
app.listen(port, () => {
    console.log("API executando na porta " + port)
})