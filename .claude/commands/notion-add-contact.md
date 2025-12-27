Add a new contact to Notion CRM.

Arguments format: Name | Email | Phone (optional)

Use mcp__notion__API-post-page:
- parent.database_id: "1b5c283b-4ad9-81bb-b13a-fc1dc815bfb4"
- properties:
  - "Name / Company": title from first argument
  - "1st Email": email from second argument
  - "Phone": phone from third argument (if provided)
  - "Contact Type": status "Lead"

Confirm creation with the page URL.
