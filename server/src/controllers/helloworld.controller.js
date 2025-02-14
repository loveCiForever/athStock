//  helloworld.controller.js

const helloworld = async (req, res) => {
  const helloworld = "Hello World !";
  // return res.status(200).json({ message: helloworld });
  return res.formatter.ok(helloworld);
};

export { helloworld };
