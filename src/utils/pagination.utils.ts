export const pagination = async (
  page: number,
  limit: number,
  total: number
) => {
  const total_page = Math.ceil(total / limit);
  const next_page = total_page > page ? page + 1 : null;
  const pre_page = 1 < page ? page - 1 : null;
  const has_next_page = total_page > page ? true : false;
  const has_pre_page = 1 < page ? true : false;

  return {
    total_page,
    next_page,
    pre_page,
    has_next_page,
    has_pre_page,
  };
};
