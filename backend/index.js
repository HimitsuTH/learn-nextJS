import express from "express";

const app = express();
import cors from "cors";
import multer from "multer";

const PORT = 8000;

const importUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 104857600, // max 5 MB
  },
  // fileFilter: (req, file, cb) => {
  //   console.log(file.mimetype)
  //   if (file.mimetype === "application/x-zip-compressed") {
  //     cb(null, true);
  //   } else {
  //     cb(
  //       new Error(
  //         "not allow other files with out application/x-zip-compressed"
  //       ),
  //       false
  //     );
  //   }
  // },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("hello,world");
});

app.post("/import-file", importUpload.single("file"), (req, res) => {
  try {
    // Access the file using req.file

    const file = req.file;

    const originalname = (file.originalname = Buffer.from(
      file.originalname,
      "latin1"
    ).toString("utf8"));

    // Access other form fields from req.body
    //   const username = req.body.username;
    //   const type = req.body.type;

    const { username, type, list } = req.body;

    // Log or process the data
    console.log("File:", file);
    console.log("Username:", username);
    console.log("Type:", type);
    console.log("List:", JSON.parse(list));

    const lists = JSON.parse(list);

    //   console.log(req.body);

    console.log("file name ==>", originalname);

    // Send a response
    res.json({
      message: "File uploaded successfully!",
      username,
      type,
      originalname,
      lists,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/upload-file", importUpload.single("file"), (req, res) => {
  // Access the file using req.file

  const file = req.file;

  console.log(file);

  // const originalname = (file.originalname = Buffer.from(
  //   file.originalname,
  //   "latin1"
  // ).toString("utf8"));

  // console.log("file name ==>", originalname);

  // // Send a response
  // res.json({
  //   message: "File uploaded successfully!",
  //   originalname,
  // });
});

app.listen(PORT, () => {
  console.log(`server running on port ==> ${PORT} `);
});
