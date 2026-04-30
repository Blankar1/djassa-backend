const getPagination = (query) => {
  const page  = Math.max(1, parseInt(query.page)  || 1);
  const limit = Math.min(50, parseInt(query.limit) || 12);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows } = data;
  const totalPages = Math.ceil(totalItems / limit);
  return { rows, totalItems, totalPages, currentPage: page };
};

module.exports = { getPagination, getPagingData };
