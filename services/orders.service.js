"use strict";

const DbMixin = require("../mixins/db.mixin");
const Sequelize = require("sequelize");

module.exports = {
	name: "orders",

	mixins: [DbMixin("postgres://postgres:moleculer@localhost:5432/mol-demo", "orders", {
		name: "order",
		define: {
			date: Sequelize.DATE,
			customerId: Sequelize.STRING, // because it points to a Mongo ObjectId
			status: Sequelize.STRING,

		}
	})],

	settings: {
		idField: "id",

		// Available fields in the responses
		fields: [
			"id",
			"date",
			"orderNumber", // Virtual field
			"customerId",
			"customer",
			"items",
			"totalPrice",
			"status"
		],

		// Populates for relations
		populates: {
			// The `customerId` field references to a customer.
			customer: {
				field: "customerId",
				action: "customers.get",
				params: {
					fields: ["name", "email"]
				}
			},

			/* Get the items from the `orderItems` service */
			async items(ids, orders, rule, ctx) {
				await Promise.all(orders.map(async order => {
					order.items = await ctx.call("orderItems.find", {
						query: {
							orderId: order.id
						},
						populate: ["product"]
					});
				}));
			},

			/* It's a virtual field, we calculate the value */
			async totalPrice(ids, orders, rule, ctx) {
				await Promise.all(orders.map(async order => {
					const items = await ctx.call("orderItems.find", {
						query: {
							orderId: order.id
						},
						populate: ["product"]
					});

					order.totalPrice = items.reduce((a, b) => a + b.product.price * b.quantity, 0);
				}));
			},

			/* It's a virtual field, we calculate the value */
			orderNumber(ids, orders, rule, ctx) {
				orders.forEach(order => {
					order.orderNumber = `ORD-${order.date.getFullYear()}-${order.id}`;
				});
			},
		},

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			date: "date",
			customerId: "string|no-empty", // because it points to a Mongo ObjectId
			status: "string|default:pending"
		}
	}
};
