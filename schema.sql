DROP TABLE IF EXISTS firstTable;
CREATE TABLE locateall(
    id SERIAL PRIMARY KEY,
    search_query VARCHAR(255),
    formatted_query VARCHAR(255),
    latitude NUMERIC,
    longitude NUMERIC
    
)
