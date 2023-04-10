const express = require("express");
const {PrismaClient} = require("@prisma/client");
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser");
const {createTokens, validadeToken}  = require("./JWT")

const app = express();
app.use(express.json());

//toda request entrará nesse middleware
app.use(cookieParser())


const prisma = new PrismaClient();

//Criar o register
app.post("/register", async (req, res) => {
  try{
    const {nome, senha} = req.body;
    await bcrypt.hash(senha, 10).then((hash) =>{
      prisma.user.create({
        data: {
          nome: nome,
          senha: hash,
        }
      }).then(() => {
        res.json("USUARIO CRIADO");
      }).catch((error) => {
        res.json({error: "Usuario já existe"})
      })
    });

  } catch(error) {
      console.error(error);
  }
})


//LOGIN DO USUARIO ENDPOINT
app.post("/login", async (req, res) => {
  try{
  const {nome, senha} = req.body;
  const usuario = await prisma.user.findUnique({where : {nome}});
  if(!usuario) {
    res.json({error: "Esse usuário não existe"})
  }
  const pSenha = usuario.senha;
  bcrypt.compare(senha, pSenha).then((match) => {
    if(!match) {
      res
      .status(400)
      .json({error: "Senha e usuário incorretos"});
    }  else {
      
      const acessToken = createTokens(usuario)
      res.cookie("acess-token", acessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
    });
      res.json("Você está logado")
    }
  })

 
  } catch(error){
    console.error(error)
  }
  
})


app.get("/", validadeToken ,async (req, res) => {
    
    return res.json("usuario");
})



app.listen(8080, () => {
  console.log("Server running on port 8080....");
})