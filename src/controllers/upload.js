const { baseUrl } = require("../../config");

exports.uploadFile = async (req, res) => {
  if (req.file == undefined) {
    return res.status(400).send({ message: "No file selected!" });
  }

  const file = req.file;

  const url = `${baseUrl}${file.destination.replace(".", "")}${file.filename}`;

  res.send({
    filename: req.file.filename,
    url,
  });
};
