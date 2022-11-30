const puppeteer = require("puppeteer");
var ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const config = require("./config");
// config.executablePath = path.resolve(config.executablePath);
//   "executablePath": "../../node_modules/puppeteer/.local-chromium/win64-609904/chrome-win/chrome.exe"
const express = require("express");
const app = express();
const exec = require("child_process").exec;
const bodyParser = require("body-parser");
const port = 8083;
const fs = require("fs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello, this is a automatic scraper!");
});

app.post("/config", (req, res) => {
  if (req.body.proxy || req.body.savePath) {
    config.args = [`--proxy-server=${req.body.proxy}`];
    config.savePath = req.body.savePath;
    fs.writeFileSync("config.json", JSON.stringify(config));
  }

  res.send(config);
});

app.get("/tweets", (req, res) => {
  console.log("user is", req.query.user);
  const user = req.query.user;
  // const amount = req.query.amount ? req.query.amount : 1;
  exec(`scrape.exe ${user} 1`, function (error, stdout, stderr) {
    if (stdout.length > 1) {
      let str = stdout.slice(2, -4);
      const newUrlList = str.split("', '");
      if (newUrlList[0]) res.status(200).send(newUrlList[0]);
      else res.status(404).send({ error: `User ${user} doesn't exist` });
    } else {
      res.status(500).send({ error: "you don't offer args" });
    }
    if (error) {
      console.info("stderr : " + stderr);
    }
  });
});

app.get("/local/images", (req, res) => {
  const savePath = config.savePath ? `${config.savePath}\\images` : path.resolve(".\\images");
  if (fs.existsSync(savePath)) {
    const files = fs.readdirSync(savePath).filter((file) => {
      return file.match(/\.png$/);
    });
    const data = {
      images: files,
      path: savePath,
    };
    res.status(200).send(data);
  } else {
    res.status(404).send({ error: "Dir not found" });
  }
});

app.get("/local/videos", (req, res) => {
  const savePath = config.savePath ? `${config.savePath}\\videos` : path.resolve(".\\videos");
  if (fs.existsSync(savePath)) {
    const files = fs.readdirSync(savePath).filter((file) => {
      return file.match(/\.(mp|MP)4$/);
    });
    const data = {
      videos: files,
      path: savePath,
    };
    res.status(200).send(data);
  } else {
    res.status(404).send({ error: "Dir not found" });
  }
});

app.post("/tweets/screenshot", (req, res) => {
  const url = req.body.url;
  const filename = [url.split("/")[3], url.split("/")[5]].join("_");
  const savePath = config.savePath ? `${config.savePath}\\images` : path.resolve(".\\images");

  if (!fs.existsSync(savePath)) {
    fs.mkdir(savePath, (err) => {
      if (err) {
        console.log("err", err);
      }
    });
  }

  puppeteer.launch(config).then(async (browser) => {
    // console.log("New tweet got: \n", url);
    const page = (await browser.pages())[0];
    await page.setViewport({ width: 1280, height: 1024 });
    await page.setDefaultNavigationTimeout(25000);

    try {
      await page.goto(url, { waitUntil: "networkidle0" });
      await page.$eval(".css-1dbjc4n.r-l5o3uw.r-1upvrn0", (el, value) => el.setAttribute("style", value), "display: none");
      const tweetElem = await page.waitForSelector("article");
      const { x, y, width, height } = await tweetElem.boundingBox();
      // let elementClip = await getElementDimensions(page, "article");
      await page.screenshot({
        path: `${savePath}\\${filename}.png`,
        clip: {
          x: x + 5,
          y,
          width,
          height,
        },
        // quality: 100,
      });
      console.log("Done!");

      res.status(200).send(`${savePath}\\${filename}.png`);
    } catch (error) {
      if (error.name === "TimeoutError") {
        res.status(404).send({ error: "Timeout,please check proxy address" });
      } else {
        res.status(404).send({ error: "PROXY_CONNECTION_FAILED" });
      }
    }
    await browser.close();
  });
});

app.post("/tweets/video", (req, res) => {
  const loop = req.body.loop || 5;
  const { url, bgm } = req.body;
  const filename = [url.split("/")[3], url.split("/")[5]].join("_");
  const savePath = config.savePath ? `${config.savePath}\\videos` : path.resolve(".\\videos");
  const savePathImg = config.savePath ? `${config.savePath}\\images` : path.resolve(".\\images");
  if (!fs.existsSync(savePath)) {
    fs.mkdir(savePath, (err) => {
      if (err) {
        console.log("err", err);
      }
    });
  }
  const ff = ffmpeg().addInput(`${savePathImg}\\${filename}.png`).loop(loop);
  if (bgm) {
    ff.addInput(bgm);
  }
  ff.on("error", function (error) {
    res.status(404).send({ error: "ffmpeg error" });
  })
    .on("end", function () {
      console.log("Convert successful, saved in videos folder");
      res.status(200).send(`${savePath}\\${filename}.mp4`);
    })
    .save(`${savePath}\\${filename}.mp4`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
