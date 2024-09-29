const express = require("express");
const prisma = require("./prismaClient");
const cors = require("cors");
const { contentRouter } = require("./routers/content");
const { userRouter } = require("./routers/user");
const { wsRouter } = require("./routers/ws");

const app = express();

require("express-ws")(app);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/", wsRouter);
app.use("/", userRouter);
app.use("/content", contentRouter);

// app.get("/info", (req, res) => {
//   res.json({ msg: "Yaycha API" });
// });

const server = app.listen(8000, () => {
  console.log("Yaycha API started at 8000...");
});

/*
SIGTERM, SIGINT တို့လို event တွေ ဟာ ctrl + c နှိပ်ပြီး server ရပ်လိုက်ခြင်း အပါအဝင်, 
API Server ကို Terminate လုပ်လိုက်ချိန်နဲ့ Interrupt လုပ်လိုက်ချိန်တွေမှာ အလုပ်လုပ်ပါတယ်

Service ရပ်လိုက်ချိန်မှာ Prisma Client ကို တစ်ခုချင်း Manual disconnect လိုက်လုပ်နေပေးဖို့ မလိုအောင်
auto disconnect လုပ်ပေးဖို့ ထည့်ရေးလိုက် တာပါ
*/
const gracefulShutdown = async () => {
  await prisma.$disconnect();
  server.close(() => {
    console.log("Yaycha API closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
