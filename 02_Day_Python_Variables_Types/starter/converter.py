raw_distance = "2.5"
try:
    distance_km = float(raw_distance)
    if distance_km < 0:
        raise ValueError("Distance cannot be negative")
    distance_m = distance_km * 1000
    print(f"{distance_km:g} km = {distance_m:g} m")
except ValueError:
    print("Enter a non-negative number of kilometres")
