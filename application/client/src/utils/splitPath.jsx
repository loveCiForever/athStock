const getBasePath = (path) => {
  return path ? path.split("/")[1] : "";
};

export { getBasePath };
