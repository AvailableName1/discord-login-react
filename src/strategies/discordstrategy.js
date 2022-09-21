require("dotenv").config();
const DiscordStrategy = require("passport-discord").Strategy;
const passport = require("passport");
const signale = require("signale");

const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();

passport.serializeUser((user, done) => {
  signale.info("serializing user");
  done(null, user.address);
});

passport.deserializeUser(async (address, done) => {
  signale.info("deserializing user");
  const user = await prisma.user.findUnique({
    where: {
      address: address,
    },
  });
  if (user) {
    done(null, user.address);
  }
});

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CLIENT_REDIRECT,
      scope: ["identify"],
    },
    async (accessToken, refreshToken, params, profile, done) => {
      //to show list of servers and info about user
      signale.info(profile);
      signale.info(params);
      console.log(params);
      console.log(profile);
      try {
        // const user = await prisma.user.findUnique({
        //   where: { discordHandle: profile.username },
        // });
        if (false && user) {
          signale.info("User exists");
          const updatedUser = await prisma.user.update({
            where: { address },
            data: {
              discordHandle: `${profile.username}#${profile.discriminator}`,
            },
          });
          done(null, user);
        } else {
          signale.info("User does not exist");
          const newUser = await prisma.user.findFirst({
            where: {
              address:
                "0x397A7EC90bb4f0e89Ffd2Fb3269a3ef295d4f84A".toLowerCase(),
            },
          }); //fix
          // const savedUser = await newUser.save();
          done(null, newUser);
        }
      } catch (err) {
        signale.error(err);
        done(err, null);
      }
    }
  )
);

// model User {
//   address       String  @id
//   twitterHandle String?
//   discordHandle String?
// }
