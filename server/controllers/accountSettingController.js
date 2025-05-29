import accountSettingModal from "../models/accountSettingModal.js";

// Add Account Setting
export const addAccountSetting = async (req, res) => {
  try {
    const { accountNumber, accountHolderName, pickUpLocation } = req.body;

    if (!accountNumber || !accountHolderName || !pickUpLocation) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    const accountSetting = new accountSettingModal({
      accountNumber,
      accountHolderName,
      pickUpLocation,
    });
    await accountSetting.save();

    res.status(200).send({
      success: true,
      message: "Account setting added successfully",
      data: accountSetting,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while add account setting",
      error: error,
    });
  }
};

// Edit Account Setting
export const editAccountSetting = async (req, res) => {
  try {
    const accountId = req.params.id;
    const { accountNumber, accountHolderName, pickUpLocation } = req.body;

    const existingAccount = await accountSettingModal.findById(accountId);

    if (!existingAccount) {
      return res.status(404).send({
        success: false,
        message: "Account setting not found",
      });
    }

    existingAccount.accountNumber = accountNumber;
    existingAccount.accountHolderName = accountHolderName;
    existingAccount.pickUpLocation = pickUpLocation;

    await existingAccount.save();

    res.status(200).send({
      success: true,
      message: "Account setting update successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while update account setting",
      error: error,
    });
  }
};

// Get Account Setting
export const getAccountSetting = async (req, res) => {
  try {
    const account = await accountSettingModal.find({});

    res.status(200).send({
      success: true,
      message: "Account setting fetch successfully",
      account: account,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while get account setting",
      error: error,
    });
  }
};
