"use strict";

const DbMixin = require("../mixins/db.mixin");

module.exports = {
	name: "customers",

	mixins: [DbMixin("mongodb://localhost:27017/mol-demo-customers", "customers")],

	settings: {
		idField: "id",

		// Available fields in the responses
		fields: [
			"id",
			"name",
			"email",
			"orders",
			"orderCount", // Virtual field
			"active"
		],

		// Populates for relations
		populates: {
			async orders(ids, customers, rule, ctx) {
				await Promise.all(customers.map(async cus => {
					cus.orders = await ctx.call("orders.find", {
						query: {
							customerId: cus.id
						},
						populate: ["orderNumber", "items"]
					});
				}));
			},

			/* It's a virtual field, we calculate the value */
			async orderCount(ids, customers, rule, ctx) {
				await Promise.all(customers.map(async cus => {
					const orders = await ctx.call("orders.find", {
						query: {
							customerId: cus.id
						}
					});
					cus.orderCount = orders.length;
				}));
			}
		},

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			name: "string",
			email: "email",
			active: "boolean"
		}
	}
};
