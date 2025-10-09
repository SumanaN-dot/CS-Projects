import csv
import math

class Building:
    
    def __init__(self, building_id, x_coord, y_coord, building_name):
        self.building_id = building_id
        self.x_coord = x_coord
        self.y_coord = y_coord
        self.building_name = building_name

class Campus:
   
    def __init__(self):
        self.buildings = {}
        
        self.nextto = {}
    
    def building(self, building):
       
        self.buildings[building.building_id] = building
        
        if building.building_id not in self.nextto:
            
            self.nextto[building.building_id] = []
    
    
    def walkway(self, building1_id, building2_id, travel_time):
        
        if building1_id not in self.nextto:
            self.nextto[building1_id] = []
        if building2_id not in self.nextto:
            self.nextto[building2_id] = []
        
        self.nextto[building1_id].append((building2_id, travel_time))
        self.nextto[building2_id].append((building1_id, travel_time))
    
    
    def distance(self, building1_id, building2_id):
        s1 = self.buildings[building1_id]
        s2 = self.buildings[building2_id]
        
        distance = math.sqrt((s1.x_coord - s2.x_coord)**2 + (s1.y_coord - s2.y_coord)**2)
        
        return round(distance)
    
    
    def neighbors(self, building_id):
        
        return self.nextto.get(building_id, [])
    



def load_data(buildings_file, walkways_file):
    
    graph = Campus()
    
    
    with open(buildings_file, 'r') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            building = Building(
                int(row['building_id']),
                float(row['x_coord']),
                float(row['y_coord']),
                row['building_name']
            )
            
            graph.building(building)
    
    
    with open(walkways_file, 'r') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            graph.walkway(
                int(row['building1_id']),
                int(row['building2_id']),
                int(row['travel_time'])
            )
    
    return graph


def path_search(graph, start, end):
    opened = {start}
    closed = set()
    
    starting = {}
    to_goal = {start: 0}
    pred_cost = {start: graph.distance(start, end)}
    
    while opened:
        
        current = min(opened, key=lambda pos: pred_cost.get(pos, float('inf')))
        
        if current == end:
            path = []
            total_time = to_goal[current]
            while current in starting:
                path.append(current)
                current = starting[current]
            path.append(start)
            return path[::-1], total_time
        
        opened.remove(current)
        closed.add(current)
        
        for neighbor, time in graph.neighbors(current):
            if neighbor not in closed:
              
                predicted = to_goal[current] + time
                
                if neighbor not in opened or predicted < to_goal.get(neighbor, float('inf')):
                    starting[neighbor] = current
                    to_goal[neighbor] = predicted
                    pred_cost[neighbor] = predicted + graph.distance(neighbor, end)
                    opened.add(neighbor)
    
    return None, None

def optimal_route(graph, start, end):
    path, total_time = path_search(graph, start, end)
    if path is None:
        print(f"No path found from building {start} to building {end}\n")
        return
    print(f"Start at {graph.buildings[start].building_name}")
    for i in range(len(path) - 1):
        for neighbor, time in graph.neighbors(path[i]):
            if neighbor == path[i + 1]:
                if i == len(path) - 2:
                    print(f"Arrive at {graph.buildings[path[i + 1]].building_name}")
                else:
                    print(f"Walk to {graph.buildings[path[i + 1]].building_name} - {time} min")
                break

    print(f"Total time: {total_time} minutes\n")

def main():
   
    graph = load_data('buildings.csv', 'walkways.csv')
    
    with open('campus_routes.txt', 'r') as f:
        for line in f:
            start, end = map(int, line.strip().split())
            optimal_route(graph, start, end)

if __name__ == "__main__":
    main()

    # Analysis:
    # The best method is A* search algorithm since it consistently finds the optimal path in a reasonable time.
    # Informed performed better than uninformed search algorithms because it uses heuristics to guide the search process, 
    # reducing the number of nodes explored and improving efficiency. Two better heuristics can be using real walking distances instead of straight-line distances
    # and finding distances to central buildings beforehand.
     
    #Citing:
    # I used the following resources to help me with this assignment:
    # The fill in tool from VSCode for the part of the analysis.
    