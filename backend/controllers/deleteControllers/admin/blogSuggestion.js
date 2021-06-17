const Blogs = require("../../../models/blogs");
module.exports = async (req, res) => {
  const filters = {
    state: (req.query.state && [req.query.state]) || [
      "AVAILABLE",
      "PICKED",
      "DRAFT",
      "PENDING",
      "APPROVED",
      "DISCARDED",
    ],
    approvedSuggestion: (req.query.approvedSuggestion && [
      req.query.approvedSuggestion == "true" || false,
    ]) || [true, false],
  };
  const id = req.params.id;
  try {
    await Blogs.findOneAndDelete({ _id: id, state: "AVAILABLE" }).exec();
    const suggestions = await Blogs.find({
      state: { $in: filters.state },
      approvedSuggestion: { $in: filters.approvedSuggestion },
    }).sort({ suggestedAt: -1 }); //getting suggestions;
    return res.send({ suggestions });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ errorMsg: "Status-Code: 500, Internal Server Error!" });
  }
};