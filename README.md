Guidelines for creating a problem controller: 

1. Create a setup function: 
    A function that will 
        a. destroy any lingering data structures from previous problems
        b. setup the data structures necessary to visualize the current problem
        c. Destroy/Remove the previous problem controller and replace it with the new one

2. Create a step function: 
    A function that steps through the problem. 
    A step should only iterate over one cell of a grid, one node of a tree, one index of an array, one bucket of a hashmap, etc...
    If you'd like, different methodolgies for solving the problem can be placed within separate step functions called by separate pieces of the React UI. 

3. Create a complete function: 
    This function should run through each step of the problem automatically, calling upon the step function for each iteration. 