const moment = require("moment");
const Order = require("../models/Orders");

async function getFifthMonthOrders() {
  const startDate = moment().subtract(5, "months").startOf("month");
  const endDate = moment().subtract(5, "months").endOf("month");
  try {
    const orders = await Order.find({
      $and: [
        { createdAt: { $gt: startDate } },
        { createdAt: { $lt: endDate } },
      ],
    });

    const totalSale = orders.reduce((total, order) => {
      total += order.finalPrice;
      return total;
    }, 0);

    return totalSale;
  } catch (err) {
    return null;
  }
}

async function getFourthMonthOrders() {
  const startDate = moment().subtract(4, "months").startOf("month");
  const endDate = moment().subtract(4, "months").endOf("month");

  try {
    const orders = await Order.find({
      $and: [
        { createdAt: { $gt: startDate } },
        { createdAt: { $lt: endDate } },
      ],
    });

    const totalSale = orders.reduce((total, order) => {
      total += order.finalPrice;
      return total;
    }, 0);

    return totalSale;
  } catch (err) {
    return null;
  }
}

async function getThirdMonthOrders() {
  const startDate = moment().subtract(3, "months").startOf("month");
  const endDate = moment().subtract(3, "months").endOf("month");
  try {
    const orders = await Order.find({
      $and: [
        { createdAt: { $gt: startDate } },
        { createdAt: { $lt: endDate } },
      ],
    });

    const totalSale = orders.reduce((total, order) => {
      total += order.finalPrice;
      return total;
    }, 0);

    return totalSale;
  } catch (err) {
    return null;
  }
}

async function getSecondMonthOrders() {
  const startDate = moment().subtract(2, "months").startOf("month");
  const endDate = moment().subtract(2, "months").endOf("month");
  try {
    const orders = await Order.find({
      $and: [
        { createdAt: { $gt: startDate } },
        { createdAt: { $lt: endDate } },
      ],
    });

    const totalSale = orders.reduce((total, order) => {
      total += order.finalPrice;
      return total;
    }, 0);

    return totalSale;
  } catch (err) {
    return null;
  }
}

async function getFirstMonthOrders() {
  const startDate = moment().subtract(1, "months").startOf("month");
  const endDate = moment().subtract(1, "months").endOf("month");
  try {
    const orders = await Order.find({
      $and: [
        { createdAt: { $gt: startDate } },
        { createdAt: { $lt: endDate } },
      ],
    });

    const totalSale = orders.reduce((total, order) => {
      total += order.finalPrice;
      return total;
    }, 0);

    return totalSale;
  } catch (err) {
    return null;
  }
}

async function getCurrentMonthOrders() {
  const startDate = moment().startOf("month");
  const endDate = moment().endOf("month");
  try {
    const orders = await Order.find({
      $and: [
        { createdAt: { $gt: startDate } },
        { createdAt: { $lt: endDate } },
      ],
    });

    const totalSale = orders.reduce((total, order) => {
      total += order.finalPrice;
      return total;
    }, 0);

    return totalSale;
  } catch (err) {
    return null;
  }
}

async function barChartDetails() {
  const fifthMonData = await getFifthMonthOrders();
  const fourthMonData = await getFourthMonthOrders();
  const thirdMonData = await getThirdMonthOrders();
  const secondMonData = await getSecondMonthOrders();
  const firstMonData = await getFirstMonthOrders();
  const currentMonData = await getCurrentMonthOrders();
  const allData = [
    fifthMonData,
    fourthMonData,
    thirdMonData,
    secondMonData,
    firstMonData,
    currentMonData,
  ];
  return allData;
}

module.exports = { barChartDetails };
