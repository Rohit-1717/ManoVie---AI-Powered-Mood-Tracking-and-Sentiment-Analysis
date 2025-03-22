import useragent from "useragent";
import pkg from "express-useragent";

const { express: expressUserAgent } = pkg; // Correct import for CommonJS

const userAgentMiddleware = (req, res, next) => {
  req.userAgent = useragent.parse(req.headers["user-agent"]).toString();
  next();
};

export { userAgentMiddleware, expressUserAgent };
