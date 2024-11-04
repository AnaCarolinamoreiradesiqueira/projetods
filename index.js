const express = require("express");
const Sequelize = require("sequelize");
const rotas = express();
const cors = require('cors');

rotas.use(express.json());
rotas.use(express.static('public'));
rotas.use(cors());


const conexaoComBanco = new Sequelize("teste", "root", "planejamento", {
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
  dtconsulta: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  conveparticular: {
    type: Sequelize.STRING(20),
    allowNull: true,
  },
  dtnascimento: {
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
  res.send("Rota principal");
});

rotas.get("/salvar/:nmmedico/:espmedico/:nmpaciente/:dtconsulta/:conveparticular/:dtnascimento", async (req, res) => {
    const { nmmedico, espmedico, nmpaciente, dtconsulta, conveparticular, dtnascimento } = req.params;
  
    try {
      const novaConsulta = await Consulta.create({ 
        nmmedico, 
        espmedico, 
        nmpaciente, 
        dtconsulta: new Date(dtconsulta), 
        conveparticular, 
        dtnascimento: new Date(dtnascimento) 
      });
      res.json({
        resposta: "Consulta criada com sucesso",
        Consulta: novaConsulta,
      });
    } catch (error) {
      res.status(500).json({ message: `Erro ao criar consulta: ${error.message}` });
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
    res.status(500).json({ message: `Erro ao buscar consultas: ${error.message}` });
  }
});

rotas.listen(3031, () => {
  console.log("Server is running on port 3031");
});

