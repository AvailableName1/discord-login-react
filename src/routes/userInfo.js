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
  const address = "0x397A7EC90bb4f0e89Ffd2Fb3269a3ef295d4f84A".toLowerCase();
  //get data from databse
  try {
    //findUser is a custom made function from Database.js
    // let data = await prisma.user.findUnique({
    //   where: { address: address },
    // });
    // signale.info(data);
    if (address === undefined) {
      // prisma will not throw error if address is undefined
      res.json({ status: "400" });
    }
    let data = await prisma.user.findUnique({
      where: {
        address: address,
      },
    });
    res.json(data);
    res.send(data);
  } catch (error) {
    console.log("");
  }
});

module.exports = router;
