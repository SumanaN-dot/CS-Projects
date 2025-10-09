import math

def short_path(start, goal, grid):
   
    if not grid or not grid[0]:
        return None
    
    rows, cols = len(grid), len(grid[0])
    
    if not (0 <= start[0] < rows and 0 <= start[1] < cols):
        return None
    if not (0 <= goal[0] < rows and 0 <= goal[1] < cols):
        return None
    
    if grid[start[0]][start[1]] or grid[goal[0]][goal[1]]:
        return None
    
    if start == goal:
        return [start]
    
    
    def neighbor(position):
        
        curr_row = position[0]
        curr_col = position[1]
        
        directions = [(-1, 0), 
                      (1, 0), 
                      (0, -1), 
                      (0, 1), 
                      (-1, -1), 
                      (-1, 1), 
                      (1, -1), 
                      (1, 1)]
        
        neighbors = []
        
        for row, col in directions:
            new_row = row + curr_row
            new_col = col + curr_col
            
            if 0 <= new_row < rows and 0 <= new_col < cols and not grid[new_row][new_col]:
                neighbors.append((new_row, new_col))
        return neighbors

    
    open = {start}
    closed = set()
    
    started = {}
    estimate = {start: 0}
    pred_cost = {start: distance(start, goal)}
    
    while open:
        
        current = min(open, key=lambda pos: pred_cost.get(pos, float('inf')))
        
        if current == goal:
            path = []
            while current in started:
                path.append(current)
                current = started[current]
            path.append(start)
            return path[::-1]
        
        open.remove(current)
        closed.add(current)
        
        for neighbor in neighbor(current):
            if neighbor not in closed:
                
                predicted = estimate[current] + distance(current, neighbor)
                
                if neighbor not in open or predicted < estimate.get(neighbor, float('inf')):
                    
                    started[neighbor] = current
                   
                    estimate[neighbor] = predicted
                    
                    pred_cost[neighbor] = predicted + distance(neighbor, goal)
                    
                    open.add(neighbor)
    
    return None

def distance(x, y):
    return math.sqrt((x[0] - y[0])**2 + (x[1] - y[1])**2)