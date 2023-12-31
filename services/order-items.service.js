"use strict";

const DbMixin = require("../mixins/db.mixin");
const Sequelize = require("sequelize");

module.exports = {
	name: "orderItems",

	mixins: [DbMixin("postgres://postgres:moleculer@localhost:5432/mol-demo", "orderItems", {
		name: "orderItem",
		define: {
			orderId: Sequelize.INTEGER,
			productId: Sequelize.STRING, // because it points to a Mongo ObjectId
			quantity: Sequelize.INTEGER
		}
	})],

	settings: {
		idField: "id",

		// Available fields in the responses
		fields: [
			"id",
			"orderId",
			"productId",
			"product",
			"quantity"
		],

		// Populates for relations
		populates: {
			// The `productId` field references to a product.
			product: {
				field: "productId",
				action: "products.get",
				params: {
					fields: ["name", "price", "tags"],
					populate: ["tags"] // Populate the `tags` field in the product entity
				}
			},

			// The `orderId` field references to an order.
			order: {
				field: "orderId",
				action: "orders.get",
				params: {
					fields: ["id", "date"]
				}
			}
		},

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			orderId: "number|integer|positive",
			productId: "string|no-empty", // because it points to a Mongo ObjectId
			quantity: "number|integer|positive"
		}
	}
};
