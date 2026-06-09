const uploadImage = require("../config/uploadImage");

exports.upload = async (req, res) => {

  try {

    const file = req.file;

    const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

    const imageUrl = await uploadImage(base64);

    res.json({
      url: imageUrl,
    });

  } catch (error) {

    res.status(500).json({
      message: "Upload failed",
    });

  }
};