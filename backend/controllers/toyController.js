const Toy = require("../models/Toy");

exports.createToy = async (req, res) => {
  try {
    const toy = new Toy({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image,
      owner: req.user.id,
      deposit: req.body.deposit
    });

    const savedToy = await toy.save();

    res.status(201).json(savedToy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyToys = async (req, res) => {
  try {
    const toys = await Toy.find({ owner: req.user.id });

    res.json(toys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.editToy = async (req, res) => {
  try {
    const updatedToy = await Toy.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        description: req.body.description,
        image: req.body.image,
        deposit: req.body.deposit
      },
      { new: true },
    );

    if (!updatedToy) {
      return res.status(404).json({ message: "Toy not found" });
    }

    res.json(updatedToy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteToy = async (req, res) => {
  try {
    await Toy.findByIdAndDelete(req.params.id);

    res.json({ message: "Toy deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAllToys = async (req, res) => {
  try {

    const toys = await Toy.find()
      .populate("owner", "name address");     
    res.json(toys);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getOwnerByToyId = async (req, res) => {
  try {

    const { toyId } = req.params;

    const toy = await Toy.findById(toyId)
      .populate("owner", "bank_name bank_number");

    if (!toy) {
      return res.status(404).json({
        message: "Toy not found"
      });
    }

    res.json(toy.owner);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};
exports.getToyByOwnerId = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const toys = await Toy.find({ owner: ownerId });
    res.json(toys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};