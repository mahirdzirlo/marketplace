# Install

create .env file according to ENV_TEMPLATE

npm install
npm run build
npm run start

**Task: Develop a 2-way marketplace that allows sellers to put items and buyers to buy the items.**

**Prerequisites:**

1. Multiple stakeholders in the system: Buyer, Seller, Approver.
2. They would have different roles and permissions.
3. The Approver is responsible for approving the listings and gets notified when a new listing arrives.
4. Sellers can put new listings.
5. Buyers can see the products and place orders.
6. Sellers can look at the orders and approve those orders.

Your task is to develop the marketplace by doing the requirement analysis and implementing the solution. Be creative.

### **Backend Tasks**

1. **User Authentication and Authorization**
   - Must Have: Implement a basic authentication and authorization system using JWT (JSON Web Tokens).
   - **(Optional):** Implement multi-factor authentication (MFA).
2. **CRUD API for Product Management**
   - Develop an API that supports product listing creation, reading, updating, and deletion (CRUD operations). Ensure role-based access control (RBAC) for different user roles.
   - **(Optional):** Add validation and error handling for edge cases.
3. **Data Modeling and Integrity**
   - Design a relational database schema for managing products, orders, and user roles.
   - **Bonus:** Implement foreign key constraints and indexes to ensure performance and integrity.
4. **Caching (Optional but Recommended)**
   - Use caching for frequently accessed data like product listings or user sessions to optimize performance.
   - **(Must Have):** Implement a basic caching layer (e.g., using Redis or Memcached) to store product data for quicker retrieval.
   - **Bonus:** Implement cache invalidation for scenarios like product updates or deletions.
5. **Messaging Queue (Optional but Recommended)**
   - Set up a messaging queue (e.g., RabbitMQ, AWS SQS) for handling event-driven processes.
   - **(Must Have):** Use a message queue to handle notifications (e.g., notifying the approver when a new product is listed).
   - **Bonus:** Implement message retries and error handling for failed messages.

### **Frontend Tasks**

1. **User Interface for Product Management**
   - Build a responsive web application where sellers can view, add, edit, and delete products. Use React to create the interface.
   - **(Optional):** Implement pagination for large datasets.
2. **Dashboard (Optional)**
   - Create a dashboard that displays order and product statistics using graphs and charts. Include a filtering option to view the data for different time periods.
   - Implement dynamic components for real-time updates.
3. **Frontend-Backend Integration**
   - Integrate the frontend application with the backend API for product and order management. Ensure proper error handling and feedback for the user interface.
   - **(Optional):** Implement loading spinners or skeleton screens to improve the user experience during API calls.

### **DevOps**

1. **Version Control**
   - Use Github for version control and tracking features.
2. **CI/CD Pipeline Setup**
   - **(Optional):** Set up a basic CI/CD pipeline using GitHub Actions or any other CI tool. Ensure the pipeline runs tests automatically on each commit.
   - **(Optional):** Deploy the application to a cloud platform (Azure).
3. **Caching and Queuing in Cloud (Optional)**
   - Use a managed Redis or RabbitMQ instance in the cloud (e.g., Azure Redis Cache, AWS Elasticache for Redis, AWS SQS).
   - **(Optional):** Automate the provisioning and configuration of these resources using infrastructure-as-code tools like Terraform or ARM templates.

### **Bonus Features (Optional):**

- **Optimized Database Access**: Use database indexing and query optimization for frequently accessed data.
- **Asynchronous Processing**: Offload time-consuming tasks (e.g., sending notifications or generating reports) to background jobs using a task queue like Celery or Bull.js.
- **Load Testing**: Implement load testing to evaluate the system’s ability to handle high traffic and performance bottlenecks.

# Database

CREATE TABLE users (
id SERIAL PRIMARY KEY,
username VARCHAR(100) UNIQUE NOT NULL,
password VARCHAR(256) NOT NULL,
role VARCHAR(50) NOT NULL, -- Enum: ['buyer', 'seller', 'approver']
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_username ON users(username)
CREATE INDEX idx_users_password ON users(password)

CREATE TABLE products (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
description TEXT,
price DECIMAL(10, 2) NOT NULL,
seller_id INT REFERENCES users(id),
status VARCHAR(50) DEFAULT 'pending', -- Enum: ['pending', 'approved', 'rejected']
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_products_id ON products(id); -- Optimize queries by id
CREATE INDEX idx_products_status ON products(status); -- Speed up queries for product status (e.g., 'pending')

CREATE TABLE orders (
id SERIAL PRIMARY KEY,
buyer_id INT REFERENCES users(id),
product_id INT REFERENCES products(id),
seller_id INT REFERENCES users(id),
status VARCHAR(50) DEFAULT 'pending', -- Enum: ['pending', 'approved']
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);  
CREATE INDEX idx_orders_seller_id ON orders(seller_id);

## Test logins

Username password hash
seller, test, $2b$05$ZKnDHSHKPRBQ3WVPvQPuQOH3CpF6VxWKO4Q8VzNefxFBPFwM51.Lm
buyer, test,
approver, test
