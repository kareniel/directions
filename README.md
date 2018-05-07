directions
==========

print directions for optimal route between a 
given list of addresses

## installation

```
git clone https://github.com/kareniel/directions
```

## configuration

make sure to have an `env` file in project root

```
GOOGLE_KEY=zSQY...
MAPBOX_KEY=pk.ey...
```

## example output:

```json
[
  { 
    "summary": "Rue Snowdon to Avenue Somerled",
    "steps": [
      "Head northeast on Rue Snowdon",
      "Turn right onto Boulevard Décarie",
      "Turn left onto Rue Snowdon",
      "Turn left onto Rue Dufferin",
      "This file has 42 lines",
      "Make a sharp right onto Avenue Somerled",
      "Turn right onto Avenue Melrose",
      "You have arrived at your destination"
    ]
  },
  ...
]
```
