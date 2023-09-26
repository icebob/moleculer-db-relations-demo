[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# moleculer-db-relations-demo
This is a [Moleculer](https://moleculer.services/) demo project which demonstrates that how you can create data relations between moleculer-db services following the one-database-per-service microservices concept.

## Relations

```mermaid
erDiagram
    CUSTOMERS {
        int _id PK
        string name
        string email
        boolean active
    }
    ORDERS {
        int _id PK
        datetime date
        int customerId FK
        decimal totalPrice
        string status
    }
    ORDER_ITEMS {
        int _id PK
        int orderId FK
        int productId FK
        int quantity
    }
    PRODUCTS {
        int _id PK
        string name
        decimal price
    }
    CUSTOMERS ||--o{ ORDERS : "One-to-many"
    ORDERS ||--|{ ORDER_ITEMS : "One-to-many"
    PRODUCTS ||--o{ ORDER_ITEMS : "One-to-many"
```

## Usage
Start the project with `npm run dev` command. 

## Useful links

* Moleculer website: https://moleculer.services/
* Moleculer Documentation: https://moleculer.services/docs/0.14/
