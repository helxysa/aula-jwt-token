const { sign, verify } = require("jsonwebtoken");

//Criar o TOKEN
const createTokens = (user) => {
  const accessToken = sign({
    nome: user.nome, id: user.id
  },
  "jwtsecret",
  );
  return accessToken;
}

const validadeToken = (req, res, next) => {
  const acessToken = req.cookies["acess-token"]
  if(!acessToken) {return res.status(400).json({error: "Usuario não autenticado"})}
  
  try {
    const validToken = verify(acessToken, "jwtsecret");
    if(validToken) {
      req.authenticated = true;
      return next();
    }
  } catch(err){
    return res.stauts(400).json({error: err});
  }
}


module.exports = {createTokens, validadeToken}

//Verificar se o Usuario tem o Token?