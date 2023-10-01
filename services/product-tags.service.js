"use strict";

const DbMixin = require("../mixins/db.mixin");
const Sequelize = require("sequelize");

module.exports = {
	name: "product-tags",

	mixins: [DbMixin("postgres://postgres:moleculer@localhost:5432/mol-demo", "product-tags", {
		name: "product_tag",
		define: {
			productId: Sequelize.STRING, // because it points to a Mongo ObjectId
			tagId: Sequelize.STRING, // because it points to a Mongo ObjectId
		}
	})],

	settings: {
		idField: "id",

		// Available fields in the responses
		fields: [
			"id",
			"productId",
			"product",
			"tagId",
			"tag",
		],

		// Populates for relations
		populates: {
			// The `productId` field references to a product.
			product: {
				field: "productId",
				action: "products.get",
				params: {
					fields: ["name", "price"]
				}
			},

			// The `orderId` field references to an order.
			tag: {
				field: "tagId",
				action: "tags.get",
				params: {
					fields: ["id", "name"]
				}
			}
		},

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			productId: "string|no-empty", // because it points to a Mongo ObjectId
			tagId: "string|no-empty", // because it points to a Mongo ObjectId
		}
	}
};
