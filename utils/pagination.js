const productsPaginatedResults = (model) => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};
    results.totalLength = await model.countDocuments().exec();
    results.current = { page, limit };
    if (endIndex < results.totalLength) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    try {
      results.results = await model
        .find({})
        .populate("category")
        .limit(limit)
        .sort({ updatedAt: -1 })
        .skip(startIndex)
        .exec();
      res.paginatedResults = results;
      next();
    } catch (err) {
      console.log(err.message);
    }
  };
};

const usersPaginatedResults = (model) => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};
    results.totalLength = await model.countDocuments().exec();
    results.current = { page, limit };
    if (endIndex < results.totalLength) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    try {
      results.results = await model
        .find({})
        .limit(limit)
        .skip(startIndex)
        .sort({ updatedAt: -1 })
        .exec();
      res.paginatedResults = results;
      next();
    } catch (err) {
      console.log(err.message);
    }
  };
};

const orderPaginationResults = (model) => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};
    results.totalLength = await model.countDocuments().exec();
    results.current = { page, limit };
    if (endIndex < results.totalLength) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    try {
      results.results = await model
        .find()
        .populate("user")
        .limit(limit)
        .sort({ updatedAt: -1 })
        .skip(startIndex)
        .exec();
      res.paginatedResults = results;
      next();
    } catch (err) {
      next(err);
    }
  };
};

const productPaginationResults = (model) => {
  return async (req, res, next) => {
    if (req.query.searchData) {
      next();
    } else if (req.query.category) {
      next();
    } else {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const results = {};
      results.totalLength = await model.countDocuments().exec();
      results.current = { page, limit };
      if (endIndex < results.totalLength) {
        results.next = {
          page: page + 1,
          limit: limit,
        };
      }

      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit,
        };
      }
      try {
        results.results = await model
          .find()
          .limit(limit)
          .sort({ updatedAt: -1 })
          .skip(startIndex)
          .exec();
        res.paginatedResults = results;
        next();
      } catch (err) {
        next(err);
      }
    }
  };
};

module.exports = {
  productsPaginatedResults,
  usersPaginatedResults,
  orderPaginationResults,
  productPaginationResults,
};
