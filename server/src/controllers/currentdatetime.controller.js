// currentdatetime.controller.js

import { getCurrentDatetime } from "../services/currentdatetime.service.js";

const currentdatetime = async (req, res) => {
  const currentdatetime = getCurrentDatetime();
  try {
    if (!currentdatetime) {
      return res.formatter.serverError({
        statusCode: 500,
        message: "Internal server error (try)",
        currentdatetime: null,
      });
    }
    return res.formatter.ok({
      statusCode: 200,
      message: "OK OK OK va may con tro nay ok",
      currentdatetime: {
        dayOfWeek: currentdatetime.dayOfWeek,
        dayOfMonth: currentdatetime.dayOfMonth,
        month: currentdatetime.month,
        year: currentdatetime.year,
        hour: currentdatetime.hour,
        minute: currentdatetime.minute,
        second: currentdatetime.second,
      },
    });
  } catch (error) {
    console.log("Error: ", error);

    res.formatter.serverError({
      statusCode: 500,
      message: "Internal server error (catch)",
      currentdatetime: null,
      //   error: error,
    });
  }
};

export { currentdatetime };
