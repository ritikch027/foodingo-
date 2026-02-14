const User = require("../../models/user");

const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" })
      .select("name email role isBanned")
      .lean();
    res.status(200).json({ success: true, admins });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const handleBan = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isBanned } = req.body;

    let normalizedAction;
    if ( typeof isBanned === "boolean") {
      normalizedAction = isBanned ? "ban" : "unban";
    }

    if (!userId || !normalizedAction) {
      return res
        .status(400)
        .json({ message: "User ID and action (or isBanned) are required" });
    }

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (normalizedAction === "ban") {
      if (user.isBanned) {
        return res.status(400).json({ message: "User is already banned" });
      }

      user.isBanned = true;
      await user.save();
      return res.status(200).json({ message: "User banned successfully" });
    }

    if (normalizedAction === "unban") {
      if (!user.isBanned) {
        return res.status(400).json({ message: "User is already unbanned" });
      }

      user.isBanned = false;
      await user.save();
      return res.status(200).json({ message: "User unbanned successfully" });
    }

    return res.status(400).json({ message: "Invalid action" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAdmins,
  handleBan,
};
