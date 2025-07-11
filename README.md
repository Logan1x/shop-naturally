# Shop Naturally - talk and find a new phone

## Search Process Overview

The search process involves several steps executed via a MongoDB aggregation pipeline:

1.  **Filtering (`$match`)**:

    - Applies filters based on user input (price range, RAM, storage, brand, rating, stock status, name, reviews, text search terms, popularity).
    - Includes a specific recommendation logic: if only a maximum price is set, it narrows the search to a ₹5000 range below that maximum.

2.  **Weighted Scoring (`$addFields`)**:

    - Calculates a `score` for each phone to determine its relevance beyond simple filtering.
    - Different features contribute differently to the score (weights):
      - `bought`: 4x
      - `reviews`: 3x
      - `ratingFloat`: 2x
      - `ram`: 1x
      - `storage`: 1x
    - Missing values (`null`) for these fields are treated as 0 during score calculation (`$ifNull`).

3.  **Initial Sorting (`$sort`)**:

    - Phones are sorted primarily by the calculated `score` in descending order (highest score first).
    - `price` (ascending, lowest first) is used as a secondary sort key to break ties.

4.  **Brand Diversity Enforcement**:

    - **Group by Brand (`$group`)**: Phones are grouped by their `brand`.
    - **Limit per Brand (`$project` & `$slice`)**: Each brand group is limited to its top 4 phones (based on the initial sort).
    - **Recombine (`$unwind` & `$replaceRoot`)**: The limited groups are merged back into a single list, ensuring no brand has more than 4 entries.

5.  **Final Sorting (`$sort`)**:

    - The diversified list is sorted again by `score` (descending) and `price` (ascending).

6.  **Result Limiting (`$limit`)**:
    - The final list is limited to the top 8 phones.

This multi-stage process aims to return the most relevant phones based on user criteria and popularity/ratings, while also ensuring a variety of brands are presented in the results.
