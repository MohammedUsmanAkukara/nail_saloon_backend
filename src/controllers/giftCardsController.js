import GiftCard from '../models/GiftCard.js';

export const checkGiftCardBalance = async (req, res, next) => {
  try {
    const { code } = req.params;
    const card = await GiftCard.findOne({ code: code.toUpperCase() });

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Gift card code not found.',
      });
    }

    const isExpired = new Date() > new Date(card.expiresAt);

    res.json({
      success: true,
      data: {
        code: card.code,
        denomination: card.denomination,
        balance: card.balance,
        status: isExpired ? 'expired' : card.status,
        expiresAt: card.expiresAt,
        recipientName: card.recipientName,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createGiftCardEnquiry = async (req, res, next) => {
  try {
    const { denomination, recipientName, recipientEmail, senderName, senderEmail, message } = req.body;

    if (!denomination || !recipientName || !recipientEmail || !senderName || !senderEmail) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required gift card details.',
      });
    }

    const card = await GiftCard.create({
      denomination: Number(denomination),
      balance: Number(denomination),
      recipientName,
      recipientEmail,
      senderName,
      senderEmail,
      message: message || '',
      status: 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Gift card generated successfully!',
      data: card,
    });
  } catch (err) {
    next(err);
  }
};

export const adminGetGiftCards = async (req, res, next) => {
  try {
    const cards = await GiftCard.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: cards,
    });
  } catch (err) {
    next(err);
  }
};

export const adminRedeemGiftCard = async (req, res, next) => {
  try {
    const { code, amount } = req.body;
    const card = await GiftCard.findOne({ code: code.toUpperCase() });

    if (!card) {
      return res.status(404).json({ success: false, message: 'Gift card not found.' });
    }

    if (card.status !== 'active') {
      return res.status(400).json({ success: false, message: `Gift card is ${card.status}.` });
    }

    const deduct = Number(amount) || card.balance;
    if (deduct > card.balance) {
      return res.status(400).json({ success: false, message: 'Insufficient gift card balance.' });
    }

    card.balance -= deduct;
    if (card.balance <= 0) {
      card.status = 'redeemed';
    }
    await card.save();

    res.json({
      success: true,
      message: `Successfully redeemed ₹${deduct}. Remaining balance: ₹${card.balance}.`,
      data: card,
    });
  } catch (err) {
    next(err);
  }
};
