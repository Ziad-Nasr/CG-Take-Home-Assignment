# CG-Take-Home-Assignment

This Repository contains the implmentation for the CG Take-Home Assignment, structured into two main components: Client - Server

# Setup Instructions

Clone this repository to your local machine:

1. Clone the Repository

```cmd
git clone https://github.com/Ziad-Nasr/CG-Take-Home-Assignment.git

cd CG-Take-Home-Assignment
```

2. set Up the Frontend in a terminal

```cmd
cd frontend

npm install

npm start
```

3. set up the Backend in new terminal

```cmd
cd backend

npm install

npm run dev
```

MongoDB installations are not required as the project uses Mongo Atlas that is set in the `.env` file

# Project Overview

The Project requierment is to build a simplified version of a graph-based calculation tool.

where the user can create nodes and connect them to determine how values propagate through the graph.

## Frontend - Client

The Frontend handles the client-side interface, using ```React``` for a dynamic graphic visualization.

Users are able to:

1. Create, Move, Delete Nodes

2. Edit Nodes/Edges Properties

3. View real-time calculations of emissions

4. Save and load graph configurations

This interactive interface ensures users can easily manage and analyze their data relationships.

## Backend - Server

The Backend is built with `Node.js, Express, and MongoDB`. it handles the data management and retrieval.

Server key functionalities:

1. Multiple Endpoints to manage graph configurations

   - Saving the current graph
   - Loading an existing saved graph
   - Listing all available graphs
   - Updating an existing graph

2. Database Schema (MongoDB)

   - Maintaing <b>Nodes and Edges</b> Properties as well as their meta data.
   - Ensuring structural integrity for graph storage

3) Server-Side Validation

   - Consistency in node and edge relationships.

   - verifies emissions calculations before saving configuration.

# Assumptions

1. No Node Cycles are allowed

   1. No looping on the same node

   2. No closed circles are made

2. Negative Weights/Emissions are allowed

3. No Zero Weights for edges are allowed

# Extensions

1) More visually appealing Nodes/Edges canvas

2) Auto-Saving as it is crucial in most applications
