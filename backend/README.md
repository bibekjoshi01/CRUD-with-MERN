# Backend Application

## To Run the Application

    - npm install

    - npm start

**API Endpoints**

* To import Data from CSV:
    GET /api/import

1. Add a new team:
    POST /api/teams/add

2. Update a team:
    PUT /api/teams/update/:id

3. Delete a team:
    DELETE /api/teams/delete/:id

4. Get stats for a year:
    GET /api/teams/stats/:year

5. Filter teams by wins:
    GET /api/teams/filter?winsGreaterThan=5

6. Get teams with average goals for a year:
    GET /api/teams/averageGoals?year=2010

7. Get all teams:
    GET /api/teams
    
    filters: search, limit, page

8. Get a team by name:
    GET /api/teams/team/:id

**Note** Make sure you have node.js installed in your system.
