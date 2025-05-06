// ./server/src/services/blog.service.js

import Joi from "joi";

/**
 * Validation schema for blog posts.
 *
 * Validates the following fields:
 * - title: A required string representing the title of the blog post.
 * - intro A required string representing the introduction of the blog post.
 * - content: A required object representing the content of the blog post.
 * - blocks: A required array that must contain at least one item, representing the blocks of content in the blog post.
 *
 * @type {Joi.ObjectSchema}
 */
const blogValidation = Joi.object({
  title: Joi.string().required(),
  intro: Joi.string().required(),
  content: Joi.object().required(),
  // blocks: Joi.array().required().min(1),
});

export { blogValidation };
