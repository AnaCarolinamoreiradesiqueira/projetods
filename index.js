const express = require("express");
const Sequelize = require("sequelize");
const cors = require('cors');


const rotas = express();
rotas.use(express.json());  
rotas.use(express.static('public')); 
rotas.use(cors()); 


const conexaoComBanco = new Sequelize("teste", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

const Consulta = conexaoComBanco.define("Consulta", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  nmmedico: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },
  espmedico: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },
  nmpaciente: {
    type: Sequelize.STRING(64),
    allowNull: true,
  },
  dtnascimento: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  tipoconsulta: {
    type: Sequelize.STRING(20),
    allowNull: true,
  },
  dtconsulta: {
    type: Sequelize.DATE,
    allowNull: true,
  },
});


conexaoComBanco
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados bem-sucedida.");
    return conexaoComBanco.sync();
  })
  .catch((error) => {
    console.error("Erro ao conectar com o banco de dados:", error);
  });


rotas.get("/", (req, res) => {
  res.send("Rota principal funcionando");
});


rotas.post("/salvar", async (req, res) => {
  const { nmmedico, espmedico, nmpaciente, dtnascimento, tipoconsulta, dtconsulta } = req.body;

  try {
    
    const novaConsulta = await Consulta.create({
      nmmedico, 
      espmedico, 
      nmpaciente, 
      dtnascimento: new Date(dtnascimento), 
      tipoconsulta,
      dtconsulta: new Date(dtconsulta)  
    });
    
    res.json({
      resposta: "Consulta criada com sucesso!",
      consulta: novaConsulta
    });
  } catch (error) {
    console.error("Erro ao criar consulta:", error);
    res.status(500).json({
      message: `Erro ao criar consulta: ${error.message}`
    });
  }
});


rotas.get("/mostrar", async (req, res) => {
  try {
    const consultas = await Consulta.findAll();
    const consultasFormatadas = consultas.map(consulta => ({
      ...consulta.toJSON(),
      dtconsulta: consulta.dtconsulta ? consulta.dtconsulta.toLocaleDateString("pt-BR") : null,
      dtnascimento: consulta.dtnascimento ? consulta.dtnascimento.toLocaleDateString("pt-BR") : null,
    }));
    res.json(consultasFormatadas);
  } catch (error) {
    res.status(500).json({
      message: `Erro ao buscar consultas: ${error.message}`
    });
  }
});

rotas.delete("/deletar/:id", async function (req, res) {
  const { id } = req.params;
  const idNumber = parseInt(id, 10);

  try {
    const deleted = await Consulta.destroy({
      where: { id: idNumber },
    });

    if (deleted) {
      res.json({ mensagem: "Consulta deletada com sucesso" });
    } else {
      res.status(404).json({ mensagem: "Consulta não encontrada" });
    }
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao deletar consulta: " + error.message });
  }
});

app.put('/editar/:id', async (req, res) => {
  const consultaId = req.params.id;
  const { nmmedico, espmedico, nmpaciente, dtnascimento, tipoconsulta, dtconsulta } = req.body;

  try {
      const updated = await updateConsulta(consultaId, {
          nmmedico,
          espmedico,
          nmpaciente,
          dtnascimento,
          tipoconsulta,
          dtconsulta
      });

      if (updated) {
          res.status(200).send({ message: 'Consulta atualizada com sucesso!' });
      } else {
          res.status(404).send({ message: 'Consulta não encontrada' });
      }
  } catch (error) {
      res.status(500).send({ message: 'Erro ao atualizar consulta' });
  }
});
