
# ✨ **COMCONNECT** ✨  
## 🏆 *An Event Organizing Application*  

## 📌 Project Overview
This is a **scalable, real-time workspace collaboration and event tracking system** built with , MongoDB, Redis, Kafka, WebSockets 

### **Key Features**
- ✅ **Real-time chat** via WebSockets
- ✅ **Workspace management** with granular roles
- ✅ **Task tracking** integrated with MongoDB
- ✅ **Geolocation tracking** for event organizers
- ✅ **Job fetching** via Google Auth & Gmail API
- ✅ **Event streaming** with Kafka


- ## 🚀 Live Demo  
🔗 **Check out the deployed application here:** [Com Connect](https://com-connect.vercel.app/)  

🔥 Experience real-time collaboration, seamless chat, and powerful workspace management right in your browser!  


---

## 🏗 High-Level Architecture

### **📌 System Architecture Diagram**
```
                           ┌──────────────────────────┐
                           │     Frontend (React)     │
                           └──────────┬──────────────┘
                                      │
                ┌───────────────────────────────────────┐
                │          Backend (Node.js)           │
                └──────────┬───────────────┬──────────┘
                           │               
        ┌─────────────────┴───┐    
         │   MongoDB (NoSQL)  │
        └─────────────────────┘     
                           │
        ┌─────────────────┴──────────────────┐
        │           Redis (Elasticache)      │
        └────────────────────────────────────┘
                           │
        ┌─────────────────┴──────────────────┐
        │       Kafka     │
        └────────────────────────────────────┘
                           │
        ┌─────────────────┴──────────────────┐
        │       WebSockets                   │
        └────────────────────────────────────┘
```

---

## 🏛 Database Design
The system uses **MongoDB for real-time operations**.  
 **MongoDB** supports **flexible, fast data access**.





## 📉 Low-Level Design
Each microservice is designed for modularity and **separation of concerns**.

### **📌 Microservices Overview**
| Service            | Technology Stack                | Functionality |
|--------------------|--------------------------------|--------------|
| **Auth Service**   | Node.js, JWT, MariaDB          | Handles authentication & authorization |
| **Chat Service**   | Node.js, WebSockets, MongoDB   | Real-time messaging |
| **Geo Service**    | Node.js, WebSockets,           | Tracks organizers in real-time |
| **Job Service**    | Node.js, Gmail API, MongoDB    | Fetches job listings |
| **Notification Service** | Firebase, Kafka ,Redis    | Push notifications & real-time updates |

---

## ⚙️ Tech Stack
| Component           | Technology Used |
|---------------------|----------------|
| **Frontend**       | React, Tailwind |
| **Backend**        | Node.js, Express.js |
| **Database (NoSQL)** | MongoDB (Flexible) |
| **Cache**         | Redis (Elasticache) |
| **Message Queue** | Kafka (on EC2) |
| **Real-Time**    | WebSockets |


---

## 🚀 Deployment Strategy
### **📌 Using Docker Compose**
```yaml
version: "3.9"  
  mongodb:
    image: mongo:latest
    restart: always
    ports:
      - "27017:27017"
  
  redis:
    image: redis:latest
    restart: always
    ports:
      - "6379:6379"

  backend:
    build: .
    restart: always
    depends_on:
      - mariadb
      - mongodb
      - redis
```

---

## 📡 WebSocket Implementation
### **📌 Real-Time Location Tracking**
```js
socket.on('location-update', (data) => {
    console.log(`User ${data.userId} moved to ${data.latitude}, ${data.longitude}`);
    redisClient.set(`location:${data.userId}`, JSON.stringify(data));
});
```

---

## 💻 How to Run Locally
```bash
# Clone the repository
git clone https://github.com/your-repo/workspace-system.git

# Navigate to the project
cd comconnect

# Start services using Docker
1>npm install in frontend , backend directories

using docker : docker-compose up --build 
or 
cd frontend --> npm run start
cd backend --> npm run start

 
```

---



## 📄 License
This project is licensed under **MIT License**.

---

 

