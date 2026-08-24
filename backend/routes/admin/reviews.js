const reviewController = require("../../controllers/review");

async function reviewsRoutes(fastify) {
  fastify.get("/api/admin/reviews", reviewController.getReviews);
  fastify.get("/api/admin/reviews/:id", reviewController.getReviews);
  fastify.post("/api/admin/reviews/:id/mutate", reviewController.getReviews);
}

module.exports = reviewsRoutes;
