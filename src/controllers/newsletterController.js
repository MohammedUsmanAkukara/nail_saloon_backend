import NewsletterSubscriber from '../models/NewsletterSubscriber.js';

export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email.' });
    }

    const existing = await NewsletterSubscriber.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      if (!existing.active) {
        existing.active = true;
        await existing.save();
        return res.json({ success: true, message: 'Welcome back! Your subscription has been reactivated.' });
      }
      return res.json({ success: true, message: 'You are already subscribed to our Salon Gazette.' });
    }

    await NewsletterSubscriber.create({ email: email.toLowerCase().trim() });
    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to our Salon Gazette!',
    });
  } catch (err) {
    next(err);
  }
};

export const unsubscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;
    await NewsletterSubscriber.findOneAndUpdate({ email: email?.toLowerCase().trim() }, { active: false });
    res.json({ success: true, message: 'You have been successfully unsubscribed.' });
  } catch (err) {
    next(err);
  }
};

export const adminGetSubscribers = async (req, res, next) => {
  try {
    const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: subscribers,
    });
  } catch (err) {
    next(err);
  }
};

export const adminExportSubscribers = async (req, res, next) => {
  try {
    const subscribers = await NewsletterSubscriber.find({ active: true }).sort({ createdAt: -1 });
    let csv = 'Email,Subscribed Date\n';
    subscribers.forEach((s) => {
      csv += `"${s.email}","${s.createdAt.toISOString()}"\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('newsletter_subscribers.csv');
    return res.send(csv);
  } catch (err) {
    next(err);
  }
};
