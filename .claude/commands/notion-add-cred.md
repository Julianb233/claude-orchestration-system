Add a new credential entry to Notion.

Arguments format: SERVICE_NAME | API_KEY or credential value

Use mcp__notion__API-post-page:
- parent.database_id: "1b5c283b-4ad9-81cb-b1b0-cf2d3198c224"
- properties:
  - Title: "$ARGUMENTS" (first part before |)
  - Category: select "Login info"
  - Quick Summary: The credential value (second part after |)

Confirm creation with the page URL.
