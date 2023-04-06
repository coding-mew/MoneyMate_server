import Transaction from "../models/Transaction";
import { Request, Response } from "express";

export const addTransaction = async (req: Request, res: Response) => {
  try {
    const { account, recipient, amount, date } = req.body;
    const data = await new Transaction({
      user: res.locals.user._id,
      account,
      recipient,
      amount,
      date: date + " 00:00:000Z",
    }).save();
    res.json({ msg: "Transaction created", data });
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

export const getMyTransactions = async (req: Request, res: Response) => {
  try {
    const query = Transaction.find({ user: res.locals.user._id }).select({
      user: false,
      __v: false,
    });
    if (req.body.accountId) {
      query.find({ account: req.body.accountId });
    }
    const data = await query.exec();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

export const updateMyTransaction = async (req: Request, res: Response) => {
  try {
    const data = await Transaction.findOneAndUpdate(
      { user: res.locals.user._id, _id: req.body.transactionId },
      {
        ...req.body.data,
        ...(req.body.data.date && { date: req.body.data.date + " 00:00:000Z" }),
      },
      { returnDocument: "after" }
    );
    res.json(data);
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

export const deleteMyTransaction = async (req: Request, res: Response) => {
  try {
    const data = await Transaction.deleteOne({
      user: res.locals.user._id,
      _id: req.params.id,
    });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const data = await Transaction.find();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const data = await Transaction.findById(req.params.id);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};

export const deleteTransactionById = async (req: Request, res: Response) => {
  try {
    const data = await Transaction.findByIdAndDelete(req.params.id);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.json({ msg: "server error" });
  }
};
