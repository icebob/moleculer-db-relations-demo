[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# moleculer-db-relations-demo
This is a [Moleculer](https://moleculer.services/) demo project which demonstrates that how you can create data relations between moleculer-db services following the one-database-per-service microservices concept.

## Relations

```mermaid
flowchart TB
    subgraph Mongo adapter
    CUSTOMERS --- MongoDB((MongoDB))
    PRODUCTS --- MongoDB
    TAGS --- MongoDB

    MongoDB --- MONGO_DB1[(DB: mol-demo-customers)]
    MongoDB --- MONGO_DB2[(DB: mol-demo-products)]
    MongoDB --- MONGO_DB3[(DB: mol-demo-tags)]
    end
    
    subgraph Sequelize adapter
    ORDERS --- PG((PostgreSQL))
    ORDER_ITEMS --- PG
    PRODUCT_TAGS --- PG
    
    PG --- PG_DB[(DB: mol-demo)]
    end
```

## Relations

```mermaid
erDiagram
    CUSTOMERS {
        string id PK
        string name
        string email
        boolean active
    }
    ORDERS {
        int id PK
        datetime date
        string customerId FK
        decimal totalPrice
        string status
    }
    ORDER_ITEMS {
        int id PK
        int orderId FK
        string productId FK
        int quantity
    }
    PRODUCTS {
        string id PK
        string name
        decimal price
    }
    TAGS {
        string id PK
        string name
    }
    PRODUCT_TAGS {
        int id PK
        string productId FK
        string tagId FK
    }
    CUSTOMERS ||--o{ ORDERS : ""
    ORDERS ||--|{ ORDER_ITEMS : ""
    PRODUCTS ||--o{ ORDER_ITEMS : ""
    PRODUCTS ||--o{ PRODUCT_TAGS : ""
    TAGS ||--o{ PRODUCT_TAGS : ""
```

## Usage
Start the project with `npm run dev` command. 

## Useful links

* Moleculer website: https://moleculer.services/
* Moleculer Documentation: https://moleculer.services/docs/0.14/

<!-- 
https://github.com/ladal1/orm-comparison/tree/main/src/Packages

https://github.com/alfateam/rdb/tree/master#api
https://mikro-orm.io/docs/relationships
https://vincit.github.io/objection.js/guide/relations.html
https://typeorm.io/relations
 -->
