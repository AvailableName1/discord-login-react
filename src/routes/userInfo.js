const path = require("path");
const signale = require("signale");
const router = require("express").Router();

const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();

function isAuthorized(req, res, next) {
  if (req.user) {
    signale.info("User is logged in");
    next();
  } else {
    signale.info("User is not logged in");
    return res.redirect("../auth");
  }
}

router.get("/", isAuthorized, async (req, res) => {
  //get data from databse
  try {
    //findUser is a custom made function from Database.js
    let data = await prisma.user.findUnique({
      where: { address: address },
    });
    res.json(data);
    res.send(data);
  } catch (error) {
    console.log("");
  }
});

module.exports = router;
